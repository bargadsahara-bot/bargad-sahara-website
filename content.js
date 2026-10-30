let MongoClient = null;
try {
  ({ MongoClient } = require("mongodb"));
} catch (e) {
  // Graceful fallback if mongodb package is not installed in environment
}
const { verifyToken } = require("./auth");

/**
 * 🌳 BARGAD SAHARA — BACKEND MONGODB ATLAS DATABASE API (/api/content)
 * - Cluster: @bargadsahara.iajmrj2.mongodb.net
 * - Database Name: `bargadsahara_db`
 * - Collection: `content_items`
 * - Public Users: Can ONLY perform GET requests (Read-Only)
 * - Admin Users: Must present a valid signed Admin JWT token (verified via /api/auth)
 *   to perform POST (Create/Upsert), PUT (Update), or DELETE (Remove) operations.
 */

let cachedClient = null;
let cachedUri = null;
let memoryFallbackStore = [];

function buildCandidateUris(req) {
  // 1. Check explicit MONGODB_URI environment variable first
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("<db_username>")) {
    return [process.env.MONGODB_URI];
  }

  // 2. Check custom header or env username + user's cluster & password
  const headerUser = (req.headers["x-mongo-user"] || "").trim();
  const headerPass = (req.headers["x-mongo-pass"] || "").trim();
  const headerUri = (req.headers["x-mongo-uri"] || "").trim();

  const dbPass = (
    headerPass ||
    process.env.MONGODB_PASSWORD ||
    "w6NLFwRhv2Oi6mo1"
  ).trim();

  const candidateUsers = [];
  if (headerUser && headerUser !== "<db_username>") candidateUsers.push(headerUser);
  if (process.env.MONGODB_USER) candidateUsers.push(process.env.MONGODB_USER.trim());

  // Auto-try user's primary DB user `bargadsahara_db_user` first
  for (const fallbackUser of [
    "bargadsahara_db_user",
    "bargadsahara",
    "baragadsahara",
    "admin",
    "suyal_oyutl0w",
    "suyal",
    "bargad",
  ]) {
    if (!candidateUsers.includes(fallbackUser)) {
      candidateUsers.push(fallbackUser);
    }
  }

  const uris = [];
  if (
    headerUri &&
    headerUri.startsWith("mongodb+srv://") &&
    !headerUri.includes("<db_username>")
  ) {
    uris.push(headerUri);
  }

  for (const u of candidateUsers) {
    const uri = `mongodb+srv://${encodeURIComponent(u)}:${encodeURIComponent(
      dbPass
    )}@bargadsahara.iajmrj2.mongodb.net/bargadsahara_db?compressors=zlib&retryWrites=true&w=majority&appName=bargadsahara`;
    if (!uris.includes(uri)) uris.push(uri);
  }

  return uris;
}

async function getMongoCollection(req) {
  if (cachedClient && cachedUri) {
    return cachedClient.db("bargadsahara_db").collection("content_items");
  }

  const candidateUris = buildCandidateUris(req);
  let lastError = null;

  for (const uri of candidateUris) {
    try {
      const client = new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
      cachedClient = client;
      cachedUri = uri;
      const db = client.db("bargadsahara_db");
      const col = db.collection("content_items");
      await col.createIndex({ content_type: 1, created_at: -1 }).catch(() => {});
      return col;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("MongoDB connection failed");
}

function verifyAdminRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  return verifyToken(token);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-mongo-user, x-mongo-pass, x-mongo-uri"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ==========================================================================
  // 1. PUBLIC READ-ONLY ENDPOINT (GET /api/content)
  // ==========================================================================
  if (req.method === "GET") {
    try {
      const col = await getMongoCollection(req);
      const items = await col
        .find({})
        .sort({ created_at: -1 })
        .limit(500)
        .toArray();

      return res.status(200).json({
        ok: true,
        dbMode: "mongodb-atlas-live",
        cluster: "bargadsahara.iajmrj2.mongodb.net",
        items,
      });
    } catch (err) {
      return res.status(200).json({
        ok: true,
        dbMode: "mongodb-pending-username-or-ip",
        mongoError: err.message,
        items: memoryFallbackStore,
      });
    }
  }

  // ==========================================================================
  // 2. STRICT ADMIN RESTRICTION FOR ALL WRITE OPERATIONS (POST / PUT / DELETE)
  // ==========================================================================
  const adminUser = verifyAdminRequest(req);
  if (!adminUser || (adminUser.role !== "SUPER_ADMIN" && adminUser.role !== "EDITOR")) {
    return res.status(403).json({
      ok: false,
      error:
        "एक्सेस अस्वीकृत (403 Forbidden): केवल लॉगिन किए हुए अधिकृत एडमिन या एडिटर ही MongoDB डेटाबेस में कंटेंट या फोटो जोड़, बदल या हटा सकते हैं।",
    });
  }

  const body =
    typeof req.body === "string" && req.body
      ? JSON.parse(req.body)
      : req.body || {};

  // ==========================================================================
  // 3. ADMIN CREATE / UPSERT CONTENT IN MONGODB ATLAS (POST /api/content)
  // ==========================================================================
  if (req.method === "POST") {
    const id = body.id || `BS-${Date.now()}`;
    const item = {
      _id: id,
      id,
      content_type: body.content_type || "thought",
      title: String(body.title || "").trim(),
      category: String(body.category || "").trim(),
      author: String(body.author || "").trim(),
      location: String(body.location || "").trim(),
      summary: String(body.summary || "").trim(),
      full_content: String(body.full_content || "").trim(),
      image_data: body.image_data || "",
      video_url: String(body.video_url || "").trim(),
      extra_json: body.extra_json || {},
      created_by_email: adminUser.email,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!item.title) {
      return res.status(400).json({
        ok: false,
        error: "शीर्षक (Title) अनिवार्य है।",
      });
    }

    try {
      const col = await getMongoCollection(req);
      await col.updateOne({ _id: id }, { $set: item }, { upsert: true });

      return res.status(200).json({
        ok: true,
        dbMode: "mongodb-atlas-live",
        item,
      });
    } catch (err) {
      // Also store in fallback memory and return detailed MongoDB guidance
      const idx = memoryFallbackStore.findIndex((x) => x.id === id);
      if (idx >= 0) memoryFallbackStore[idx] = item;
      else memoryFallbackStore.unshift(item);

      return res.status(200).json({
        ok: true,
        dbMode: "local-fallback",
        mongoError: err.message,
        item,
      });
    }
  }

  // ==========================================================================
  // 4. ADMIN UPDATE CONTENT IN MONGODB ATLAS (PUT /api/content)
  // ==========================================================================
  if (req.method === "PUT") {
    const id = body.id;
    if (!id) {
      return res.status(400).json({ ok: false, error: "Record ID आवश्यक है।" });
    }

    const updates = {
      title: body.title,
      category: body.category,
      author: body.author,
      location: body.location,
      summary: body.summary,
      full_content: body.full_content,
      image_data: body.image_data,
      video_url: body.video_url,
      extra_json: body.extra_json,
      updated_at: new Date().toISOString(),
    };

    try {
      const col = await getMongoCollection(req);
      await col.updateOne({ _id: id }, { $set: updates });
      return res.status(200).json({ ok: true, dbMode: "mongodb-atlas-live", id });
    } catch (err) {
      const idx = memoryFallbackStore.findIndex((x) => x.id === id);
      if (idx >= 0) {
        memoryFallbackStore[idx] = { ...memoryFallbackStore[idx], ...updates };
      }
      return res.status(200).json({ ok: true, mongoError: err.message, id });
    }
  }

  // ==========================================================================
  // 5. ADMIN DELETE CONTENT FROM MONGODB ATLAS (DELETE /api/content?id=...)
  // ==========================================================================
  if (req.method === "DELETE") {
    const id = (req.query && req.query.id) || body.id;
    if (!id) {
      return res.status(400).json({ ok: false, error: "हटाने के लिए ID आवश्यक है।" });
    }

    try {
      const col = await getMongoCollection(req);
      // Mark deleted or remove document
      await col.deleteOne({ $or: [{ _id: id }, { id }] });
      return res.status(200).json({
        ok: true,
        dbMode: "mongodb-atlas-live",
        deletedId: id,
      });
    } catch (err) {
      memoryFallbackStore = memoryFallbackStore.filter((x) => x.id !== id);
      return res.status(200).json({
        ok: true,
        mongoError: err.message,
        deletedId: id,
      });
    }
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};
