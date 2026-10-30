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

  const LOCAL_ITEMS_KEY = "bargad_local_items_v2";

  function readStorageItemsMap() {
    const map = new Map();
    try {
      const arr = JSON.parse(localStorage.getItem(LOCAL_ITEMS_KEY) || "[]");
      if (Array.isArray(arr)) {
        for (const x of arr) {
          if (x && x.id) map.set(x.id, x);
        }
      }
    } catch (e) {}
    return map;
  }

  function writeStorageItemsMap(map) {
    try {
      localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(Array.from(map.values())));
    } catch (e) {}
  }

  async function getLocalItems() {
    const map = readStorageItemsMap();
    const db = await openLocalDB();
    if (db) {
      const idbItems = await new Promise((resolve) => {
        try {
          const tx = db.transaction(["items"], "readonly");
          const req = tx.objectStore("items").getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
      for (const x of idbItems) {
        if (x && x.id) map.set(x.id, x);
      }
    }
    return Array.from(map.values());
  }

  async function putLocalItem(item) {
    if (item && item.id) {
      const map = readStorageItemsMap();
      map.set(item.id, item);
      writeStorageItemsMap(map);
    }
    const db = await openLocalDB();
    if (!db) return true;
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
    if (id) {
      const map = readStorageItemsMap();
      map.delete(id);
      writeStorageItemsMap(map);
    }
    const db = await openLocalDB();
    if (!db) return true;
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

  const USERS_STORAGE_KEY = "bargad_admin_users_v2";

  function simpleHash(str) {
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  function getDefaultUsersList() {
    return [
      {
        email: "bargadsahara@gmail.com",
        name: "बरगद सहारा मुख्य संस्थापक (Super Admin)",
        role: "SUPER_ADMIN",
        status: "active",
        is_founder: true,
        pass_sig: simpleHash("w6NLFwRhv2Oi6mo1"),
        alt_sig: simpleHash("Bargad@2026#Admin"),
        created_at: "2026-10-26T08:00:00Z",
      },
    ];
  }

  function getLocalUsersMap() {
    const map = new Map();
    for (const u of getDefaultUsersList()) {
      map.set(u.email.toLowerCase(), { ...u });
    }
    try {
      const saved = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        for (const u of saved) {
          if (u && u.email) {
            const key = u.email.toLowerCase();
            const prev = map.get(key) || {};
            map.set(key, {
              ...prev,
              ...u,
              email: key,
              is_founder: ALLOWED_ADMIN_EMAILS.includes(key),
            });
          }
        }
      }
    } catch (e) {}
    return map;
  }

  function saveLocalUsersMap(map) {
    const arr = Array.from(map.values());
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(arr));
    if (syncChannel) syncChannel.postMessage({ type: "RELOAD" });
  }

  function getAdminSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !session.email) return null;
      const cleanEmail = session.email.toLowerCase();
      const usersMap = getLocalUsersMap();
      const userRec = usersMap.get(cleanEmail);
      if (userRec && userRec.status === "blocked") {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      if (!userRec && !ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      if (userRec && userRec.role) {
        session.role = userRec.role;
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
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (ctrl) setTimeout(() => ctrl.abort(), 4500);
      const apiRes = await fetch("/api/content", {
        signal: ctrl ? ctrl.signal : undefined,
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
    const rawPass = String(password || "");

    if (!cleanEmail || !rawPass) {
      return {
        ok: false,
        error: "कृपया ईमेल आईडी और पासवर्ड दोनों दर्ज करें।",
      };
    }

    try {
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (ctrl) setTimeout(() => ctrl.abort(), 4500);
      const res = await fetch("/api/auth", {
        signal: ctrl ? ctrl.signal : undefined,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: cleanEmail, password: rawPass, googleCredential }),
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
      } else if (res.status === 401 || res.status === 403 || res.status === 400) {
        // Also check local users map in case user was added locally before cloud sync
        const localMap = getLocalUsersMap();
        if (!localMap.has(cleanEmail)) {
          const errData = await res.json().catch(() => ({}));
          if (errData && errData.error) {
            return { ok: false, error: errData.error };
          }
        }
      }
    } catch (e) {
      // Local fallback mode
    }

    const usersMap = getLocalUsersMap();
    const userRec = usersMap.get(cleanEmail);
    const isFounder = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);

    if (!userRec && !isFounder) {
      return {
        ok: false,
        error: "यह ईमेल आईडी एडमिन पोर्टल में पंजीकृत नहीं है।",
      };
    }

    if (userRec && userRec.status === "blocked") {
      return {
        ok: false,
        error: "यह यूज़र अकाउंट मुख्य एडमिन द्वारा ब्लॉक (निलंबित) किया गया है।",
      };
    }

    const inputSig = simpleHash(rawPass);
    let passOk = false;

    if (userRec && userRec.pass_sig === inputSig) {
      passOk = true;
    } else if (userRec && !userRec.custom_pass && userRec.alt_sig === inputSig) {
      passOk = true;
    } else if (
      isFounder &&
      (!userRec || !userRec.custom_pass) &&
      (inputSig === simpleHash("w6NLFwRhv2Oi6mo1") || inputSig === simpleHash("Bargad@2026#Admin"))
    ) {
      passOk = true;
    }

    if (!passOk) {
      return {
        ok: false,
        error: "गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें।",
      };
    }

    const role = isFounder ? "SUPER_ADMIN" : (userRec && userRec.role) || "EDITOR";
    const name =
      (userRec && userRec.name) ||
      (isFounder ? "बरगद सहारा मुख्य संस्थापक (Super Admin)" : cleanEmail.split("@")[0]);

    const session = {
      email: cleanEmail,
      name,
      role,
      token: "local-admin-token-" + Date.now(),
      loginAt: new Date().toISOString(),
    };
    setAdminSession(session);
    return { ok: true, session };
  }

  async function getUsers() {
    const map = getLocalUsersMap();
    const session = getAdminSession();
    const mongoCfg = getMongoSettings();
    if (session && session.token) {
      try {
        const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
        if (ctrl) setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch("/api/auth?action=users", {
          signal: ctrl ? ctrl.signal : undefined,
          headers: {
            Authorization: `Bearer ${session.token}`,
            "x-mongo-user": mongoCfg.dbUser,
            "x-mongo-pass": mongoCfg.dbPass,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users)) {
            for (const u of data.users) {
              if (u && u.email) {
                const k = u.email.toLowerCase();
                const prev = map.get(k) || {};
                map.set(k, { ...prev, ...u, email: k });
              }
            }
          }
        }
      } catch (e) {}
    }
    return Array.from(map.values()).map((u) => ({
      email: u.email,
      name: u.name || u.email,
      role: u.role || "EDITOR",
      status: u.status || "active",
      is_founder: ALLOWED_ADMIN_EMAILS.includes(u.email.toLowerCase()),
      created_at: u.created_at || "2026-10-26T08:00:00Z",
    }));
  }

  async function addUser({ name, email, password, role }) {
    const session = getAdminSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw new Error("केवल मुख्य एडमिन (SUPER_ADMIN) ही नए यूज़र जोड़ सकते हैं।");
    }
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim();
    const rawPass = String(password || "");
    const cleanRole = ["SUPER_ADMIN", "EDITOR", "VIEWER"].includes(role) ? role : "EDITOR";

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      throw new Error("कृपया वैध ईमेल / जीमेल आईडी दर्ज करें।");
    }
    if (!rawPass || rawPass.length < 6) {
      throw new Error("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
    }

    const map = getLocalUsersMap();
    const newUser = {
      email: cleanEmail,
      name: cleanName || cleanEmail.split("@")[0],
      role: ALLOWED_ADMIN_EMAILS.includes(cleanEmail) ? "SUPER_ADMIN" : cleanRole,
      status: "active",
      is_founder: ALLOWED_ADMIN_EMAILS.includes(cleanEmail),
      pass_sig: simpleHash(rawPass),
      custom_pass: true,
      created_by: session.email,
      created_at: new Date().toISOString(),
    };
    map.set(cleanEmail, newUser);
    saveLocalUsersMap(map);

    const mongoCfg = getMongoSettings();
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
        body: JSON.stringify({
          action: "add_user",
          email: cleanEmail,
          name: newUser.name,
          password: rawPass,
          role: newUser.role,
        }),
      });
    } catch (e) {}

    return {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status,
      is_founder: newUser.is_founder,
      created_at: newUser.created_at,
    };
  }

  async function removeUser(targetEmail) {
    const session = getAdminSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw new Error("केवल मुख्य एडमिन (SUPER_ADMIN) ही यूज़र हटा सकते हैं।");
    }
    const cleanEmail = String(targetEmail || "").trim().toLowerCase();
    if (ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      throw new Error("मुख्य संस्थापक एडमिन (bargadsahara@gmail.com) को हटाया नहीं जा सकता।");
    }
    const map = getLocalUsersMap();
    if (!map.has(cleanEmail)) {
      throw new Error("यूज़र नहीं मिला।");
    }
    map.delete(cleanEmail);
    saveLocalUsersMap(map);

    const mongoCfg = getMongoSettings();
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
        body: JSON.stringify({ action: "remove_user", email: cleanEmail }),
      });
    } catch (e) {}

    return true;
  }

  async function toggleUserStatus(targetEmail, newStatus) {
    const session = getAdminSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      throw new Error("केवल मुख्य एडमिन (SUPER_ADMIN) ही यूज़र स्टेटस बदल सकते हैं।");
    }
    const cleanEmail = String(targetEmail || "").trim().toLowerCase();
    if (ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      throw new Error("मुख्य संस्थापक एडमिन को ब्लॉक नहीं किया जा सकता।");
    }
    const map = getLocalUsersMap();
    const u = map.get(cleanEmail);
    if (!u) throw new Error("यूज़र नहीं मिला।");
    u.status = newStatus === "blocked" ? "blocked" : "active";
    map.set(cleanEmail, u);
    saveLocalUsersMap(map);

    const mongoCfg = getMongoSettings();
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
        body: JSON.stringify({ action: "toggle_status", email: cleanEmail, status: u.status }),
      });
    } catch (e) {}

    return u.status;
  }

  async function changePassword(targetEmail, newPassword) {
    const session = getAdminSession();
    if (!session) {
      throw new Error("पासवर्ड बदलने के लिए लॉगिन आवश्यक है।");
    }
    const cleanEmail = String(targetEmail || session.email).trim().toLowerCase();
    if (cleanEmail !== session.email.toLowerCase() && session.role !== "SUPER_ADMIN") {
      throw new Error("आप केवल अपना पासवर्ड बदल सकते हैं।");
    }
    const rawPass = String(newPassword || "");
    if (!rawPass || rawPass.length < 6) {
      throw new Error("नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
    }

    const map = getLocalUsersMap();
    const u = map.get(cleanEmail) || {
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
      role: ALLOWED_ADMIN_EMAILS.includes(cleanEmail) ? "SUPER_ADMIN" : "EDITOR",
      status: "active",
    };
    u.pass_sig = simpleHash(rawPass);
    u.custom_pass = true;
    map.set(cleanEmail, u);
    saveLocalUsersMap(map);

    const mongoCfg = getMongoSettings();
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
        body: JSON.stringify({ action: "change_password", email: cleanEmail, newPassword: rawPass }),
      });
    } catch (e) {}

    return true;
  }

  async function adminSaveItem(rawItem) {
    const session = getAdminSession();
    if (!session) {
      throw new Error(
        "केवल लॉगिन किए हुए एडमिन ही कंटेंट जोड़ या बदल सकते हैं।"
      );
    }
    if (session.role === "VIEWER") {
      throw new Error(
        "अनुमति अस्वीकृत (VIEWER Role): आपके पास केवल देखने का अधिकार है, कंटेंट जोड़ने या बदलने का नहीं।"
      );
    }
    if (!rawItem || !String(rawItem.title || "").trim()) {
      throw new Error("शीर्षक (Title) अनिवार्य है।");
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
    if (session.role === "VIEWER") {
      throw new Error(
        "अनुमति अस्वीकृत (VIEWER Role): आपके पास कंटेंट हटाने का अधिकार नहीं है।"
      );
    }
    if (!id) {
      throw new Error("हटाने के लिए ID आवश्यक है।");
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

  const LANG_PREF_KEY = "bargad_lang_pref";
  const VISITOR_HITS_KEY = "bargad_visitor_hits_v2";

  const INITIAL_ANALYTICS_SEEDS = [
    {
      id: "HIT-SEED-1",
      city: "Noida",
      region: "Uttar Pradesh",
      country: "India (IN)",
      device: "Desktop",
      browser: "Google Chrome",
      lang: "hi",
      page: "मुख्य पृष्ठ (Home)",
      timestamp: "2026-10-30T14:10:00Z",
    },
    {
      id: "HIT-SEED-2",
      city: "Nainital / Haldwani",
      region: "Uttarakhand",
      country: "India (IN)",
      device: "Mobile",
      browser: "Chrome Mobile",
      lang: "hi",
      page: "6,000 साल का अनुभव",
      timestamp: "2026-10-30T14:25:00Z",
    },
    {
      id: "HIT-SEED-3",
      city: "New Delhi",
      region: "Delhi",
      country: "India (IN)",
      device: "Mobile",
      browser: "Safari iOS",
      lang: "en",
      page: "Home (English)",
      timestamp: "2026-10-30T14:40:00Z",
    },
    {
      id: "HIT-SEED-4",
      city: "Dehradun",
      region: "Uttarakhand",
      country: "India (IN)",
      device: "Desktop",
      browser: "Microsoft Edge",
      lang: "hi",
      page: "बबियाड़ की जड़ें व ट्रस्ट",
      timestamp: "2026-10-30T15:05:00Z",
    },
  ];

  const BARGAD_AI_KB = [
    {
      keywords: ["mission", "what is", "about", "bargad", "sahara", "अभियान", "क्या है", "मिशन", "बरगद", "सहारा", "परिचय"],
      hi: "🌳 बरगद सहारा (बुढ़ापे का सहारा) जन्मभूमि ग्राम बबियाड़ (Babiyar) और चोरगलिया (नैनीताल) की जड़ों से प्रेरित तीन पीढ़ियों (87 वर्षीय सेवानिवृत्त शिक्षक दादाजी 'मास्साब', 80 वर्षीय ईजा, 44 वर्षीय पिता और 10 वर्षीय पोते) का एक आत्मीय वैश्विक मिशन है। हमारा लक्ष्य 100 बुजुर्गों के 6,000 साल के जीवंत जीवन-अनुभव और 'सुनहरी डायरी' के हस्तलिखित संदेशों को सहेजना है।",
      en: "🌳 Bargad Sahara (Support for Old Age) is an intergenerational mission rooted in Village Babiyar and Chorgaliya (Nainital, Uttarakhand), led by 3 generations: an 87-year-old retired teacher grandfather ('Massab'), 80-year-old mother ('Eja'), 44-year-old father (IT General Manager), and 10-year-old grandson filming with 20-year-old Sony cameras to preserve 6,000 years of wisdom from 100 elders."
    },
    {
      keywords: ["diary", "sunehri", "6000", "6,000", "100", "elder", "wisdom", "डायरी", "सुनहरी", "बुजुर्ग", "तजुर्बा", "अनुभव"],
      hi: "📖 'सुनहरी डायरी' (6,000 साल का अनुभव कोष): यदि हम 100 वरिष्ठ नागरिकों के पास बैठकर उनके 60 से 85+ वर्षों के जीवन का निचोड़ सुनें, तो 6,000 वर्षों का तजुर्बा एकत्रित होता है। इसके पहले पन्ने (#001/100) पर 87 वर्षीय पूज्य पिताजी ('मास्साब') और दूसरे पन्ने (#002/100) पर 80 वर्षीय पूज्य ईजा के जीवन-सूत्र दर्ज हैं।",
      en: "📖 'Sunehri Diary' (6,000 Years of Wisdom Archive): By documenting the 60 to 85+ years of lived lessons from 100 senior citizens, we preserve 6,000 years of human wisdom. Entry #001 features our 87-year-old retired teacher father ('Massab') and Entry #002 features our 80-year-old mother ('Eja')."
    },
    {
      keywords: ["saving", "financial", "money", "income", "debt", "loan", "बचत", "आर्थिक", "पैसा", "कर्ज", "आमदनी", "चादर"],
      hi: "💰 बुजुर्गों का आर्थिक और बचत सूत्र: 87 वर्षीय सेवानिवृत्त शिक्षक पिताजी का नियम है— “कम आमदनी कभी इंसान को गरीब नहीं बनाती, बल्कि बिना सोचे-समझे किया गया दिखावा इंसान को कर्जदार बनाता है। जो अपनी चादर से दो इंच भीतर पैर रखता है, उसका बुढ़ापा किसी के आगे हाथ नहीं फैलाता।”",
      en: "💰 Elders' Financial Discipline Rule: As our 87-year-old retired teacher father teaches: 'Modest income never makes one poor; unplanned show-off creates debt. Living two inches within your blanket and saving on the 1st of every month guarantees dignity in old age.'"
    },
    {
      keywords: ["health", "medicine", "diet", "food", "exercise", "सेहत", "स्वास्थ्य", "दवाई", "भोजन", "व्यायाम", "ईजा"],
      hi: "🌿 बुजुर्गों की सेहत का राज: 80 वर्षीय पूज्य ईजा और पिताजी के अनुसार— बबियाड़ के पहाड़ों जैसी पैदल दिनचर्या, सुबह की धूप, घर का सादा भोजन और परिवार के साथ बैठकर दो मीठे बोल ही 80 की उम्र के बाद सबसे बड़ी दवाई है।",
      en: "🌿 Longevity & Health Secret After 80: According to our 80-year-old Eja and 87-year-old father: daily walking routines inspired by the hills of Babiyar, morning sunlight, simple home-cooked meals, and joyful time with grandchildren are the greatest medicine."
    },
    {
      keywords: ["babiyar", "nainital", "chorgaliya", "village", "roots", "trust", "बबियाड़", "नैनीताल", "चोरगलिया", "जन्मभूमि", "ट्रस्ट", "गाँव"],
      hi: "🏔️ जन्मभूमि ग्राम बबियाड़ (Babiyar) एवं ट्रस्ट: नैनीताल (उत्तराखंड) का पैतृक गाँव 'बबियाड़' और चोरगलिया हमारे संस्कारों की नींव है। 'बरगद सहारा फाउंडेशन एंड ट्रस्ट' मीडिया, सुनहरी डायरी प्रकाशन और बुजुर्ग सेवा शिविरों के माध्यम से कार्य करता है।",
      en: "🏔️ Birthplace Village Babiyar & Trust: Village Babiyar and Chorgaliya in Nainital (Uttarakhand) are the foundation of our values. Bargad Sahara Group & Trust operates across Media, Sunehri Diary Publications, and Senior Citizen Care Camps."
    },
    {
      keywords: ["vlog", "video", "youtube", "episode", "camera", "sony", "व्लॉग", "वीडियो", "यूट्यूब", "एपिसोड", "कैमरा", "सोनी"],
      hi: "🎬 यूट्यूब व्लॉग्स (@BargadSahara): एपिसोड #01 में गाज़ियाबाद स्टेशन पर पिताजी का आगमन, नन्हे खरगोश से स्वागत, 'सोने की थाली' और रात्रि श्लोक ('कृष्णाय वासुदेवाय') है। एपिसोड #02 में सुबह की बारिश, पिताजी की संध्या-पूजा और 20 साल पुराने Sony कैमरों से शूटिंग शामिल है।",
      en: "🎬 YouTube Vlogs (@BargadSahara): Episode #01 captures our 87-year-old father's arrival at Ghaziabad station, welcome with a baby rabbit, dinner in the brass 'Sone Ki Thali', and bedtime prayers. Episode #02 features morning rain blessings, prayers, and filming with 20-year-old vintage Sony cameras."
    }
  ];

  function getLanguage() {
    try {
      const l = localStorage.getItem(LANG_PREF_KEY);
      return l === "en" ? "en" : "hi";
    } catch (e) {
      return "hi";
    }
  }

  function setLanguage(lang) {
    const clean = lang === "en" ? "en" : "hi";
    try {
      localStorage.setItem(LANG_PREF_KEY, clean);
    } catch (e) {}
    if (syncChannel) syncChannel.postMessage({ type: "LANG_CHANGED", lang: clean });
    return clean;
  }

  function detectClientEnv() {
    const ua = (global.navigator && global.navigator.userAgent) || "";
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
    let browser = "Web Browser";
    if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
    else if (/Chrome\//i.test(ua)) browser = isMobile ? "Chrome Mobile" : "Google Chrome";
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = isMobile ? "Safari iOS" : "Apple Safari";
    else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";

    let tz = "Asia/Kolkata";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
    } catch (e) {}

    let city = "Noida / Delhi NCR";
    let region = "India";
    let country = "India (IN)";
    if (tz && !tz.includes("Kolkata") && !tz.includes("Calcutta")) {
      const parts = tz.split("/");
      city = (parts[1] || parts[0] || "Global").replace(/_/g, " ");
      region = parts[0] || "International";
      country = parts[0] || "Global";
    }
    return { device: isMobile ? "Mobile" : "Desktop", browser, timezone: tz, city, region, country, userAgent: ua };
  }

  function getLocalHitsList() {
    const map = new Map();
    for (const s of INITIAL_ANALYTICS_SEEDS) {
      map.set(s.id, { ...s });
    }
    try {
      const saved = JSON.parse(localStorage.getItem(VISITOR_HITS_KEY) || "[]");
      if (Array.isArray(saved)) {
        for (const h of saved) {
          if (h && h.id) map.set(h.id, h);
        }
      }
    } catch (e) {}
    return Array.from(map.values()).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }

  function summarizeHitsList(hits) {
    const locMap = new Map();
    let mobileCount = 0;
    let desktopCount = 0;
    let hiCount = 0;
    let enCount = 0;

    for (const h of hits) {
      if (h.device === "Mobile") mobileCount++;
      else desktopCount++;

      if (h.lang === "en") enCount++;
      else hiCount++;

      const locKey = `${h.city || "Noida"}, ${h.region || "India"} (${h.country || "IN"})`;
      const prev = locMap.get(locKey) || {
        location: locKey,
        city: h.city || "Noida",
        region: h.region || "India",
        country: h.country || "India (IN)",
        count: 0,
        lastVisit: h.timestamp,
      };
      prev.count++;
      if (new Date(h.timestamp || 0) > new Date(prev.lastVisit || 0)) {
        prev.lastVisit = h.timestamp;
      }
      locMap.set(locKey, prev);
    }

    const locations = Array.from(locMap.values()).sort((a, b) => b.count - a.count);
    return {
      totalHits: hits.length,
      uniqueLocations: locations.length,
      mobileCount,
      desktopCount,
      hiCount,
      enCount,
      locations,
      recentHits: hits.slice(0, 50),
    };
  }

  async function recordVisitorHit(pageName) {
    const env = detectClientEnv();
    const lang = getLanguage();
    const hit = {
      id: `HIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      city: env.city,
      region: env.region,
      country: env.country,
      device: env.device,
      browser: env.browser,
      timezone: env.timezone,
      lang,
      page: pageName || "मुख्य पृष्ठ (Home)",
      timestamp: new Date().toISOString(),
    };

    try {
      const current = getLocalHitsList();
      current.unshift(hit);
      localStorage.setItem(VISITOR_HITS_KEY, JSON.stringify(current.slice(0, 300)));
    } catch (e) {}

    const mongoCfg = getMongoSettings();
    try {
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (ctrl) setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch("/api/analytics", {
        signal: ctrl ? ctrl.signal : undefined,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
        body: JSON.stringify(hit),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.recorded && data.recorded.city) {
          hit.city = data.recorded.city;
          hit.region = data.recorded.region;
          hit.country = data.recorded.country;
        }
      }
    } catch (e) {}

    return hit;
  }

  async function getAnalyticsSummary() {
    const localHits = getLocalHitsList();
    const mongoCfg = getMongoSettings();
    try {
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (ctrl) setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch("/api/analytics", {
        signal: ctrl ? ctrl.signal : undefined,
        headers: {
          "x-mongo-user": mongoCfg.dbUser,
          "x-mongo-pass": mongoCfg.dbPass,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.recentHits)) {
          const map = new Map();
          for (const h of [...data.recentHits, ...localHits]) {
            if (h && h.id) map.set(h.id, h);
          }
          return summarizeHitsList(Array.from(map.values()));
        }
      }
    } catch (e) {}
    return summarizeHitsList(localHits);
  }

  async function askBargadAI({ message, lang, translateMode = false }) {
    const activeLang = lang || getLanguage();
    const q = String(message || "").trim();

    try {
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (ctrl) setTimeout(() => ctrl.abort(), 4500);
      const res = await fetch("/api/chat", {
        signal: ctrl ? ctrl.signal : undefined,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, lang: activeLang, translateMode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          return { ok: true, reply: data.reply, engine: data.engine || "bargad-ai", lang: activeLang };
        }
      }
    } catch (e) {}

    const lower = q.toLowerCase();
    for (const entry of BARGAD_AI_KB) {
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        const reply = translateMode
          ? `${entry.hi}\n\n🌐 English Translation:\n${entry.en}`
          : activeLang === "en"
          ? entry.en
          : entry.hi;
        return { ok: true, reply, engine: "bargad-local-kb", lang: activeLang };
      }
    }

    const fallbackHi = `🌳 नमस्कार! आपके प्रश्न ("${q}") के लिए धन्यवाद। बरगद सहारा (bargadsahara.com) ग्राम बबियाड़ (नैनीताल) की जड़ों से प्रेरित होकर 100 बुजुर्गों के 6,000 साल के अनुभव को 'सुनहरी डायरी' में सहेज रहा है। आप बचत के सूत्र, सेहत के राज या नवीनतम व्लॉग्स के बारे में पूछ सकते हैं!`;
    const fallbackEn = `🌳 Namaskar! Thank you for asking ("${q}"). Bargad Sahara (bargadsahara.com) preserves 6,000 years of wisdom from 100 elders in the 'Sunehri Diary', rooted in Village Babiyar (Nainital). Feel free to ask about our Elders' Savings Rules, Longevity Secrets, or YouTube Vlogs!`;

    return {
      ok: true,
      reply: translateMode ? `${fallbackHi}\n\n🌐 English Translation:\n${fallbackEn}` : activeLang === "en" ? fallbackEn : fallbackHi,
      engine: "bargad-local-kb",
      lang: activeLang,
    };
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
    getUsers,
    addUser,
    removeUser,
    toggleUserStatus,
    changePassword,
    adminSaveItem,
    adminDeleteItem,
    getMongoSettings,
    saveMongoSettings,
    getLanguage,
    setLanguage,
    recordVisitorHit,
    getAnalyticsSummary,
    askBargadAI,
    compressImageFile,
    onSync: (callback) => {
      if (syncChannel) {
        syncChannel.onmessage = () => callback();
      }
      global.addEventListener("storage", () => callback());
    },
  };
})(window);
