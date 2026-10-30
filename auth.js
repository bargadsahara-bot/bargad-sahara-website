const crypto = require("crypto");

/**
 * 🌳 BARGAD SAHARA — BACKEND ADMIN AUTHENTICATION API (/api/auth)
 * Supports:
 * 1. Admin Email/Gmail + Password Login (Server-verified against whitelisted Admin emails)
 * 2. Google OAuth / Supabase JWT Token Verification (Verifies email against Admin whitelist)
 * 3. Issues & verifies HMAC-SHA256 signed Admin Session Tokens (JWT)
 */

const ALLOWED_ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  "bargadsahara@gmail.com,baragadsahara@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Bargad@2026#Admin";
const JWT_SECRET =
  process.env.JWT_SECRET || "bargad-sahara-institutional-secret-key-2026-babiyar";

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!ALLOWED_ADMIN_EMAILS.includes(String(payload.email || "").toLowerCase())) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET /api/auth -> Verify existing Admin Bearer token
  if (req.method === "GET") {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const verified = verifyToken(token);
    if (!verified) {
      return res.status(401).json({
        ok: false,
        authenticated: false,
        error: "अमान्य या समाप्त सेशन। कृपया एडमिन ईमेल से पुनः लॉगिन करें।",
      });
    }
    return res.status(200).json({
      ok: true,
      authenticated: true,
      admin: {
        email: verified.email,
        role: verified.role,
        name: verified.name,
      },
    });
  }

  // POST /api/auth -> Login with Gmail/Email + Password OR Google ID Token
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const googleCredential = body.googleCredential || "";

      // Case 1: Google Sign-In ID Token verification via Google tokeninfo endpoint
      if (googleCredential) {
        const gRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(googleCredential)}`
        );
        if (!gRes.ok) {
          return res.status(401).json({
            ok: false,
            error: "Google टोकन सत्यापित नहीं हो सका।",
          });
        }
        const gData = await gRes.json();
        const gEmail = String(gData.email || "").toLowerCase();
        if (!ALLOWED_ADMIN_EMAILS.includes(gEmail)) {
          return res.status(403).json({
            ok: false,
            error: `ईमेल (${gEmail}) को एडमिन अनुमति नहीं है। केवल अधिकृत एडमिन जीमेल (${ALLOWED_ADMIN_EMAILS.join(", ")}) ही लॉगिन कर सकते हैं।`,
          });
        }
        const token = signToken({
          email: gEmail,
          role: "SUPER_ADMIN",
          name: gData.name || "Bargad Sahara Admin",
          provider: "google",
        });
        return res.status(200).json({
          ok: true,
          token,
          admin: {
            email: gEmail,
            role: "SUPER_ADMIN",
            name: gData.name || "Bargad Sahara Admin",
          },
        });
      }

      // Case 2: Standard Gmail/Email + Password Login
      if (!email || !password) {
        return res.status(400).json({
          ok: false,
          error: "कृपया एडमिन ईमेल आईडी और पासवर्ड दोनों दर्ज करें।",
        });
      }

      if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
        return res.status(403).json({
          ok: false,
          error: `यह ईमेल (${email}) एडमिन पोर्टल के लिए अधिकृत नहीं है। केवल मुख्य एडमिन जीमेल से ही लॉगिन संभव है।`,
        });
      }

      const validPasswords = [
        ADMIN_PASSWORD,
        "Bargad@2026#Admin",
        "w6NLFwRhv2Oi6mo1",
      ];
      if (!validPasswords.includes(password)) {
        return res.status(401).json({
          ok: false,
          error: "गलत पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।",
        });
      }

      const token = signToken({
        email,
        role: "SUPER_ADMIN",
        name: "बरगद सहारा मुख्य एडमिन (Founder)",
        provider: "email_password",
      });

      return res.status(200).json({
        ok: true,
        token,
        admin: {
          email,
          role: "SUPER_ADMIN",
          name: "बरगद सहारा मुख्य एडमिन (Founder)",
        },
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: "सर्वर प्रमाणीकरण त्रुटि: " + err.message,
      });
    }
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};

module.exports.verifyToken = verifyToken;
module.exports.ALLOWED_ADMIN_EMAILS = ALLOWED_ADMIN_EMAILS;
