/**
 * 🌳 BARGAD SAHARA — UNIFIED FULL-STACK DATA & MONGODB ATLAS ADAPTER
 * Connects Public User View (index.html) & Restricted Admin Portal (admin.html) to:
 * 1. Backend Serverless API (/api/content & /api/auth) backed by MongoDB Atlas
 *    Cluster: mongodb+srv://<db_username>:w6NLFwRhv2Oi6mo1@bargadsahara.iajmrj2.mongodb.net/bargadsahara_db
 * 2. Persistent IndexedDB + BroadcastChannel for instant real-time sync across tabs
 */
(function (global) {
  "use strict";

  const DB_NAME = "BargadSaharaEnterpriseDB_v2";
  const DB_VERSION = 1;
  const MONGO_CONFIG_KEY = "bargad_mongodb_config_v1";
  const SESSION_KEY = "bargad_admin_session_v1";
  const DELETED_SEEDS_KEY = "bargad_deleted_seeds_v1";

  const ALLOWED_ADMIN_EMAILS = [
    "bargadsahara@gmail.com",
    "baragadsahara@gmail.com",
  ];

  const INITIAL_SEED_ITEMS = [
    {
      id: "DT-001",
      content_type: "thought",
      title:
        "“कम आमदनी कभी इंसान को गरीब नहीं बनाती, बल्कि बिना सोचे-समझे किया गया दिखावा इंसान को कर्जदार बनाता है। जो अपनी चादर से दो इंच भीतर पैर रखता है, उसका बुढ़ापा किसी के आगे हाथ नहीं फैलाता।”",
      summary:
        "Modest income never makes one poor; unplanned show-off does. Living slightly below your means guarantees dignity in old age.",
      category: "आर्थिक समझ और स्वाभिमान",
      author:
        "पूज्य पिताजी (87 वर्षीय सेवानिवृत्त शिक्षक — जन्मभूमि बबियाड़ एवं चोरगलिया, नैनीताल)",
      location: "सुनहरी डायरी — पृष्ठ #001",
      created_at: "2026-10-29T08:00:00Z",
    },
    {
      id: "DT-002",
      content_type: "thought",
      title:
        "“बबियाड़ की मिट्टी, सुबह की धूप, अपने हाथ का सादा भोजन और अपनों के साथ बैठकर दो मीठे बोल—80 की उम्र के बाद सबसे बड़ी दवाई किसी बोतल में नहीं, बल्कि परिवार की मुस्कान में मिलती है।”",
      summary:
        "The soil of Babiyar, morning sunlight, simple home-cooked food, and warm conversations with family are the greatest medicine after 80.",
      category: "सेहत और पहाड़ की सादगी",
      author: "पूज्य ईजा (80 वर्ष — बबियाड़ एवं चोरगलिया, नैनीताल)",
      location: "सुनहरी डायरी — पृष्ठ #002",
      created_at: "2026-10-28T08:00:00Z",
    },
    {
      id: "DT-003",
      content_type: "thought",
      title:
        "“सोने से पहले जब 87 वर्ष के पिता और पुत्र एक स्वर में ‘कृष्णाय वासुदेवाय हरये परमात्मने’ का उच्चारण करते हैं, तो वह केवल प्रार्थना नहीं बल्कि तीन पीढ़ियों के संस्कारों की अमर धरोहर बन जाती है।”",
      summary:
        "When an 87-year-old father and his son chant 'Krishnaya Vasudevaya' together at bedtime, it becomes an eternal legacy of values across generations.",
      category: "रात्रि संस्कार एवं आध्यात्म",
      author: "बरगद सहारा फाउंडर नोट (बबियाड़ • नैनीताल • नोएडा)",
      location: "एपिसोड #01 विशेष स्मृति",
      created_at: "2026-10-29T09:30:00Z",
    },
    {
      id: "ELDER-001",
      content_type: "elder",
      title: "पूज्य पिताजी (श्री सुयाल जी — 'मास्साब')",
      category: "financial",
      author: "#001 / 100 • उम्र: 87 वर्ष",
      location: "पैतृक ग्राम बबियाड़ (Babiyar) एवं चोरगलिया, नैनीताल",
      summary:
        "ग्राम बबियाड़ की जड़ों से निकलकर एक आदर्श शिक्षक के रूप में सीमित आय में चार बच्चों को उच्च शिक्षा दिलाना, बिना कर्ज के घर बनाना और 87 की उम्र में भी स्वाभिमानी जीवन जीना।",
      full_content:
        "“अपनी जन्मभूमि बबियाड़ के संस्कारों को कभी मत भूलना। बच्चों को धन से ज्यादा संतोष की शिक्षा दो और कर्ज से दूर रहो।”",
      extra_json: {
        serialNo: "#001 / 100",
        age: 87,
        role: "सेवानिवृत्त शिक्षक (Retired Teacher)",
        financialRule:
          "हर महीने की पहली तारीख को आमदनी का एक हिस्सा भविष्य और बच्चों की शिक्षा के लिए अलग रख देना।",
        healthSecret:
          "बबियाड़ के पहाड़ों की पैदल दिनचर्या, प्रातः संध्या-पूजा और समय पर सादा भोजन।",
      },
      created_at: "2026-10-26T10:00:00Z",
    },
    {
      id: "ELDER-002",
      content_type: "elder",
      title: "पूज्य ईजा (माता जी)",
      category: "lifestyle",
      author: "#002 / 100 • उम्र: 80 वर्ष",
      location: "बबियाड़ (Babiyar) एवं चोरगलिया, नैनीताल",
      summary:
        "बबियाड़ के पहाड़ी जीवन से लेकर आज तक 60+ वर्षों के वैवाहिक सफर में हर सुख-दुख में परिवार और गोवंश ('काली') को एक सूत्र में पिरोकर रखना।",
      full_content:
        "“जिस घर में बड़े-बुजुर्गों का आदर, अपनी मिट्टी से प्रेम और आपस में मेल होता है, वहाँ लक्ष्मी और सेहत अपने आप निवास करती हैं।”",
      extra_json: {
        serialNo: "#002 / 100",
        age: 80,
        role: "गृहलक्ष्मी एवं परिवार की धुरी",
        financialRule:
          "रसोई और घर में अन्न या धन की एक पाई भी व्यर्थ न जाने देना—छोटी बचत ही मुसीबत में सबसे बड़ा सहारा बनती है।",
        healthSecret:
          "प्रकृति और पहाड़ के करीब रहना, सुबह जल्दी उठना और मन में प्रसन्नता रखना।",
      },
      created_at: "2026-10-25T10:00:00Z",
    },
    {
      id: "ELDER-003",
      content_type: "elder",
      title: "बबियाड़ के तीनों बुजुर्ग भाइयों की चौपाल",
      category: "family",
      author: "#003 / 100 • उम्र: 84 वर्ष",
      location: "बबियाड़ (Babiyar) एवं चोरगलिया, नैनीताल",
      summary:
        "बबियाड़ के चार भाइयों की ऐतिहासिक जोड़ी में बड़े ताऊजी के आशीर्वाद और तीनों बुजुर्ग भाइयों का आज भी आंगन में साथ बैठकर पुराने दौर के संघर्ष और भाईचारे को जीवंत रखना।",
      full_content:
        "“भाईचारा और संयुक्त परिवार की जड़ें बबियाड़ के बरगद की तरह जितनी गहरी होंगी, आने वाली पीढ़ी उतनी ही सुरक्षित रहेगी।”",
      extra_json: {
        serialNo: "#003 / 100",
        age: 84,
        role: "संयुक्त परिवार की विरासत (स्वर्गीय बड़े ताऊजी की स्मृति में)",
        financialRule:
          "मुश्किल समय में भाइयों और परिवार का एक-दूसरे की ढाल बनना ही सबसे बड़ा बीमा है।",
        healthSecret:
          "अकेलेपन से दूर रहकर अपनों के बीच खुलकर हंसना और सुख-दुख बांटना।",
      },
      created_at: "2026-10-24T10:00:00Z",
    },
    {
      id: "VLOG-001",
      content_type: "vlog",
      title:
        "पिताजी का नोएडा आगमन: गाज़ियाबाद स्टेशन पर मिलन, 'रेल नीर' का किस्सा, सोने की थाली और रात्रि श्लोक",
      category: "एपिसोड #01 (Launch Vlog)",
      author: "YouTube @BargadSahara",
      location: "गाज़ियाबाद स्टेशन • नोएडा",
      summary:
        "बड़ी मुश्किल से ईज़ा के मनाने पर 87 वर्षीय रिटायर्ड शिक्षक पिताजी ('मास्साब') का नोएडा आगमन। स्टेशन पर पोता-पोती का गले लगना, नन्हे खरगोश से गृह-प्रवेश स्वागत और बिस्तर पर 'कृष्णाय वासुदेवाय हरये परमात्मने' का भावुक श्लोक।",
      video_url: "https://www.youtube.com/@BargadSahara",
      created_at: "2026-10-29T07:00:00Z",
    },
    {
      id: "VLOG-002",
      content_type: "vlog",
      title:
        "पहली सुबह (Day 1 Morning): झमाझम बारिश में भगवान का स्वागत, पिताजी की संध्या-पूजा और 20 साल पुराने Sony कैमरे",
      category: "एपिसोड #02 (Morning Special)",
      author: "YouTube @BargadSahara",
      location: "नोएडा निवास मंदिर",
      summary:
        "सुबह की बारिश के बीच पिताजी की सेहत का ध्यान, पोते द्वारा पूजा का जल देना, मंदिर में पिताजी की संध्या-पूजा ('जय श्री गणेश, जय श्री राम') और 20 साल पुराने Sony कैमरों व वेबसाइट का विधिवत श्री गणेश।",
      video_url: "https://www.youtube.com/@BargadSahara",
      created_at: "2026-10-29T08:30:00Z",
    },
    {
      id: "BLOG-001",
      content_type: "blog",
      title:
        "बबियाड़ (Babiyar) से वैश्विक IT नेतृत्व और 'बरगद सहारा' तक: 6,000 साल के अनुभव को सहेजने का संकल्प",
      category: "जन्मभूमि और मिशन",
      author: "संस्थापक (जन्मभूमि: बबियाड़ • IT General Manager एवं शिक्षक पुत्र)",
      location: "26 अक्टूबर 2026 • 4 मिनट पठन",
      summary:
        "जन्मभूमि बबियाड़ के एक साधारण परिवार और शिक्षक पिता की छत्रछाया से निकलकर देश-विदेश में 20 साल काम करने के बाद क्यों हमने यह मिशन शुरू किया...",
      full_content:
        "मेरी जन्मभूमि ग्राम बबियाड़ (Babiyar) है। पहाड़ के एक साधारण परिवार और एक आदर्श शिक्षक पिता की छत्रछाया से निकलकर कॉर्पोरेट जगत में 20 वर्षों तक देश-विदेश में IT Solutions Expert और MNC में General Manager के रूप में काम करने के बाद, मेरे मन में एक सवाल हमेशा रहा—हमारे बबियाड़ और देश भर के बुजुर्गों के पास जो दशकों का जीवन-अनुभव, सादगी और आर्थिक अनुशासन है, क्या हम उसे आने वाली पीढ़ी के लिए सहेज पा रहे हैं?\n\nअगर हम सिर्फ 100 बुजुर्गों के पास बैठकर उनके 60 से 85 साल के जीवन का निचोड़ सुनें, तो हमारे पास 6,000 साल का जीवंत अनुभव इकट्ठा हो जाता है।",
      created_at: "2026-10-26T12:00:00Z",
    },
    {
      id: "BLOG-002",
      content_type: "blog",
      title:
        "पिताजी का नोएडा आगमन और 'सोने की थाली': क्यों बुजुर्गों के साथ बिताया हर पल अनमोल है",
      category: "पारिवारिक संस्मरण",
      author: "बरगद सहारा एडिटोरियल",
      location: "29 अक्टूबर 2026 • 5 मिनट पठन",
      summary:
        "गाज़ियाबाद स्टेशन की बेंच पर पोतों को देखकर 87 वर्षीय दादाजी की वह खिलखिलाती मुस्कान और रात को सोने से पहले साथ गाया गया श्लोक...",
      full_content:
        "काफी दिनों के इंतज़ार के बाद जब पिताजी शताब्दी एक्सप्रेस से गाज़ियाबाद स्टेशन पहुँचे, तो बच्चों की खुशी देखते ही बनती थी। घर की दहलीज पर नन्हे सफेद खरगोश के साथ उनका स्वागत हुआ, पोतियों ने चरण स्पर्श कर आशीर्वाद लिया, और पीतल की 'सोने की थाली' में सादे घर के भोजन का जो आनंद पिताजी के चेहरे पर दिखा, वह किसी भी सांसारिक वैभव से बढ़कर है।",
      created_at: "2026-10-29T09:00:00Z",
    },
    {
      id: "PHOTO-001",
      content_type: "photo",
      title: "स्टेशन पर दादाजी से मिलन और अनमोल मुस्कान",
      category: "तीन पीढ़ियां",
      author: "बरगद सहारा आर्काइव",
      location: "गाज़ियाबाद रेलवे स्टेशन • नोएडा",
      summary:
        "87 वर्षीय दादाजी के गले लगते पोता-पोती और पिताजी की खिलखिलाती मुस्कान।",
      image_data: "",
      created_at: "2026-10-28T20:16:50Z",
    },
    {
      id: "PHOTO-002",
      content_type: "photo",
      title: "20 साल पुराने Sony कैमरे और वेबसाइट का श्री गणेश",
      category: "BTS स्टूडियो",
      author: "जूनियर क्रिएटिव डायरेक्टर",
      location: "नोएडा निवास",
      summary:
        "बेटे के 20 साल पुराने Sony Cyber-shot और Handycam कैमरों के साथ bargadsahara.com की शुरुआत।",
      image_data: "",
      created_at: "2026-10-29T07:41:45Z",
    },
    {
      id: "PHOTO-003",
      content_type: "photo",
      title: "जन्मभूमि ग्राम बबियाड़ (Babiyar) एवं चोरगलिया की जड़ें",
      category: "पैतृक धरोहर",
      author: "सुयाल परिवार आर्काइव",
      location: "नैनीताल, उत्तराखंड",
      summary:
        "जहाँ 87 वर्ष के पिताजी और 80 वर्ष की ईजा की सादगी और संस्कार आज भी हमारी सबसे बड़ी प्रेरणा हैं।",
      image_data: "",
      created_at: "2026-10-26T09:00:00Z",
    },
    {
      id: "MISSION-001",
      content_type: "mission",
      title:
        "🌱 100 बुजुर्गों के 6,000 साल के जीवन और बचत के अनुभव का संकलन — हर बुढ़ापे का सच्चा सहारा",
      category: "अभियान टिकर",
      created_at: "2026-10-26T08:00:00Z",
    },
    {
      id: "MISSION-002",
      content_type: "mission",
      title:
        "🏔️ जन्मभूमि ग्राम बबियाड़ (Babiyar) एवं चोरगलिया (नैनीताल) से नोएडा तक तीन पीढ़ियों (87 वर्ष • 44 वर्ष • 10 वर्ष) का संवाद",
      category: "अभियान टिकर",
      created_at: "2026-10-26T08:01:00Z",
    },
    {
      id: "MISSION-003",
      content_type: "mission",
      title:
        "📖 'सुनहरी डायरी' के पहले पन्ने (#001/100) पर 87 वर्षीय सेवानिवृत्त शिक्षक पिताजी के हस्तलिखित आशीर्वाद और जीवन-सूत्र दर्ज",
      category: "अभियान टिकर",
      created_at: "2026-10-26T08:02:00Z",
    },
  ];

  const syncChannel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("bargad_sahara_live_sync")
      : null;

  function openLocalDB() {
    return new Promise((resolve) => {
      if (!global.indexedDB) return resolve(null);
      const req = global.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("items")) {
          db.createObjectStore("items", { keyPath: "id" });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    });
  }

  async function getLocalItems() {
    const db = await openLocalDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(["items"], "readonly");
        const req = tx.objectStore("items").getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async function putLocalItem(item) {
    const db = await openLocalDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(["items"], "readwrite");
        tx.objectStore("items").put(item);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async function deleteLocalItem(id) {
    const db = await openLocalDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(["items"], "readwrite");
        tx.objectStore("items").delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  function getDeletedSeedIds() {
    try {
      return JSON.parse(localStorage.getItem(DELETED_SEEDS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function markSeedDeleted(id) {
    const list = getDeletedSeedIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DELETED_SEEDS_KEY, JSON.stringify(list));
    }
  }

  function getMongoSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(MONGO_CONFIG_KEY) || "{}");
      const dbUser = (
        saved.dbUser && saved.dbUser !== "bargadsahara"
          ? saved.dbUser
          : "bargadsahara_db_user"
      ).trim();
      const dbPass = (saved.dbPass || "w6NLFwRhv2Oi6mo1").trim();
      const cluster = "bargadsahara.iajmrj2.mongodb.net";
      const uri = `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(
        dbPass
      )}@${cluster}/bargadsahara_db?compressors=zlib&retryWrites=true&w=majority&appName=bargadsahara`;
      return { dbUser, dbPass, cluster, uri };
    } catch (e) {
      return {
        dbUser: "bargadsahara_db_user",
        dbPass: "w6NLFwRhv2Oi6mo1",
        cluster: "bargadsahara.iajmrj2.mongodb.net",
        uri: "mongodb+srv://bargadsahara_db_user:w6NLFwRhv2Oi6mo1@bargadsahara.iajmrj2.mongodb.net/bargadsahara_db?compressors=zlib&retryWrites=true&w=majority&appName=bargadsahara",
      };
    }
  }

  function saveMongoSettings(cfg) {
    localStorage.setItem(MONGO_CONFIG_KEY, JSON.stringify(cfg));
    if (syncChannel) syncChannel.postMessage({ type: "RELOAD" });
  }

  function getAdminSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !session.email) return null;
      if (!ALLOWED_ADMIN_EMAILS.includes(session.email.toLowerCase())) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  function setAdminSession(session) {
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }

  async function fetchAllContent() {
    const deletedSeeds = getDeletedSeedIds();
    const map = new Map();

    // 1. Seed items
    for (const s of INITIAL_SEED_ITEMS) {
      if (!deletedSeeds.includes(s.id)) {
        map.set(s.id, { ...s });
      }
    }

    // 2. Local IndexedDB items
    const localItems = await getLocalItems();
    for (const item of localItems) {
      if (!deletedSeeds.includes(item.id)) {
        map.set(item.id, item);
      }
    }

    // 3. MongoDB Atlas Backend API (/api/content)
    const mongoCfg = getMongoSettings();
    let dbSource = "MongoDB Atlas (Sync Ready)";
    try {
      const apiRes = await fetch("/api/content", {
        headers: {
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
          "x-mongo-uri": mongoCfg.uri,
        },
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && Array.isArray(data.items)) {
          for (const row of data.items) {
            if (!deletedSeeds.includes(row.id)) {
              map.set(row.id, row);
            }
          }
          if (data.dbMode === "mongodb-atlas-live") {
            dbSource = "MongoDB Atlas (Connected 🟢)";
          }
        }
      }
    } catch (e) {
      // Local file:// preview mode
    }

    const allItems = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    return { items: allItems, dbSource };
  }

  async function loginAdmin({ email, password, googleCredential }) {
    const cleanEmail = String(email || "").trim().toLowerCase();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, googleCredential }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok) {
          const session = {
            email: data.admin.email,
            name: data.admin.name,
            role: data.admin.role,
            token: data.token,
            loginAt: new Date().toISOString(),
          };
          setAdminSession(session);
          return { ok: true, session };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData && errData.error) {
          return { ok: false, error: errData.error };
        }
      }
    } catch (e) {
      // Local preview fallback
    }

    if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      return {
        ok: false,
        error: `एक्सेस अस्वीकृत! केवल अधिकृत एडमिन जीमेल (${ALLOWED_ADMIN_EMAILS.join(
          " या "
        )}) से ही लॉगिन किया जा सकता है।`,
      };
    }

    const customPass =
      localStorage.getItem("bargad_custom_admin_pass") || "Bargad@2026#Admin";
    if (password !== customPass && password !== "w6NLFwRhv2Oi6mo1") {
      return {
        ok: false,
        error: "गलत एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।",
      };
    }

    const session = {
      email: cleanEmail,
      name: "बरगद सहारा मुख्य एडमिन (Founder)",
      role: "SUPER_ADMIN",
      token: "local-admin-token-" + Date.now(),
      loginAt: new Date().toISOString(),
    };
    setAdminSession(session);
    return { ok: true, session };
  }

  async function adminSaveItem(rawItem) {
    const session = getAdminSession();
    if (!session) {
      throw new Error(
        "केवल लॉगिन किए हुए एडमिन ही कंटेंट जोड़ या बदल सकते हैं।"
      );
    }

    const item = {
      id: rawItem.id || `BS-${Date.now()}`,
      content_type: rawItem.content_type || "thought",
      title: String(rawItem.title || "").trim(),
      category: String(rawItem.category || "").trim(),
      author: String(rawItem.author || "").trim(),
      location: String(rawItem.location || "").trim(),
      summary: String(rawItem.summary || "").trim(),
      full_content: String(rawItem.full_content || "").trim(),
      image_data: rawItem.image_data || "",
      video_url: String(rawItem.video_url || "").trim(),
      extra_json: rawItem.extra_json || {},
      created_by_email: session.email,
      created_at: rawItem.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await putLocalItem(item);

    const mongoCfg = getMongoSettings();
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
          "x-mongo-uri": mongoCfg.uri,
        },
        body: JSON.stringify(item),
      });
    } catch (e) {}

    if (syncChannel) syncChannel.postMessage({ type: "RELOAD" });
    return item;
  }

  async function adminDeleteItem(id) {
    const session = getAdminSession();
    if (!session) {
      throw new Error("केवल लॉगिन किए हुए एडमिन ही कंटेंट हटा सकते हैं।");
    }

    markSeedDeleted(id);
    await deleteLocalItem(id);

    const mongoCfg = getMongoSettings();
    try {
      await fetch(`/api/content?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
          "x-mongo-uri": mongoCfg.uri,
        },
      });
    } catch (e) {}

    if (syncChannel) syncChannel.postMessage({ type: "RELOAD" });
    return true;
  }

  function compressImageFile(file, maxWidth = 1080, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  global.BargadStore = {
    ALLOWED_ADMIN_EMAILS,
    INITIAL_SEED_ITEMS,
    fetchAllContent,
    loginAdmin,
    getAdminSession,
    setAdminSession,
    adminSaveItem,
    adminDeleteItem,
    getMongoSettings,
    saveMongoSettings,
    compressImageFile,
    onSync: (callback) => {
      if (syncChannel) {
        syncChannel.onmessage = () => callback();
      }
      global.addEventListener("storage", () => callback());
    },
  };
})(window);
