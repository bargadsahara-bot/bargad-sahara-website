/**
 * 🌳 BARGAD SAHARA — BILINGUAL AI CHATBOT, VOICE ASSISTANT & TRANSLATOR API (/api/chat)
 * Supports:
 * 1. Open-Source / Google Gemini LLM (`GEMINI_API_KEY`) when configured in environment
 * 2. Instant Curated Bilingual (Hindi + English) Knowledge Engine & Voice Translator fallback
 *    covering all aspects of Bargad Sahara, Village Babiyar, 100 Elders (6,000 Years Wisdom),
 *    Financial & Health Secrets, Sunehri Diary, Vlogs, and Trust initiatives.
 */

const BARGAD_KNOWLEDGE_BASE = [
  {
    keywords: ["mission", "what is", "about", "bargad", "sahara", "अभियान", "क्या है", "मिशन", "बरगद", "सहारा", "परिचय"],
    hi: "🌳 **बरगद सहारा (बुढ़ापे का सहारा)** जन्मभूमि ग्राम बबियाड़ (Babiyar) और चोरगलिया (नैनीताल) की जड़ों से प्रेरित तीन पीढ़ियों (87 वर्षीय सेवानिवृत्त शिक्षक दादाजी 'मास्साब', 80 वर्षीय ईजा, 44 वर्षीय पिता और 10 वर्षीय पोते) का एक आत्मीय वैश्विक मिशन है। हमारा लक्ष्य 100 बुजुर्गों के **6,000 साल के जीवंत जीवन-अनुभव**, कम आमदनी में बचत के सूत्र और 'सुनहरी डायरी' के हस्तलिखित संदेशों को आने वाली पीढ़ियों के लिए सहेजना है।",
    en: "🌳 **Bargad Sahara (Support for Old Age)** is an intergenerational mission inspired by our ancestral village Babiyar and Chorgaliya (Nainital, Uttarakhand), led by three generations: an 87-year-old retired teacher grandfather ('Massab'), 80-year-old mother ('Eja'), 44-year-old father (IT General Manager), and 10-year-old grandson with 20-year-old Sony cameras. Our mission is to document **6,000 years of lived wisdom from 100 elders** in the 'Sunehri Diary' (Golden Diary)."
  },
  {
    keywords: ["diary", "sunehri", "6000", "6,000", "100", "elder", "wisdom", "डायरी", "सुनहरी", "बुजुर्ग", "तजुर्बा", "अनुभव"],
    hi: "📖 **'सुनहरी डायरी' (6,000 साल का अनुभव कोष):** यदि हम 100 वरिष्ठ नागरिकों के पास बैठकर उनके 60 से 85+ वर्षों के जीवन का निचोड़ सुनें, तो 6,000 वर्षों का तजुर्बा एकत्रित होता है। इसके पहले पन्ने (#001/100) पर 87 वर्षीय पूज्य पिताजी (श्री सुयाल जी — 'मास्साब') और दूसरे पन्ने (#002/100) पर 80 वर्षीय पूज्य ईजा के अनमोल जीवन-सूत्र दर्ज हैं।",
    en: "📖 **'Sunehri Diary' (6,000 Years of Wisdom Archive):** By sitting down with 100 senior citizens and documenting their 60 to 85+ years of life lessons, we preserve 6,000 years of practical human wisdom. Entry #001 features our 87-year-old retired teacher father ('Massab'), and Entry #002 features our 80-year-old mother ('Eja')."
  },
  {
    keywords: ["saving", "financial", "money", "income", "debt", "loan", "बचत", "आर्थिक", "पैसा", "कर्ज", "आमदनी", "चादर"],
    hi: "💰 **बुजुर्गों का आर्थिक और बचत सूत्र:** 87 वर्षीय सेवानिवृत्त शिक्षक पिताजी का नियम है— *“कम आमदनी कभी इंसान को गरीब नहीं बनाती, बल्कि बिना सोचे-समझे किया गया दिखावा इंसान को कर्जदार बनाता है। जो अपनी चादर से दो इंच भीतर पैर रखता है और महीने की पहली तारीख को भविष्य के लिए बचत अलग रख देता है, उसका बुढ़ापा हमेशा स्वाभिमान से जीता है।”*",
    en: "💰 **Elders' Financial Discipline Rule:** As our 87-year-old retired teacher father says: *'Modest income never makes a person poor; unplanned show-off creates debt. Whoever lives two inches within their blanket and sets aside savings on the 1st of every month for education and emergencies lives with complete dignity in old age.'*"
  },
  {
    keywords: ["health", "medicine", "diet", "food", "exercise", "सेहत", "स्वास्थ्य", "दवाई", "भोजन", "व्यायाम", "ईजा"],
    hi: "🌿 **बुजुर्गों की सेहत और दीर्घायु का राज:** 80 वर्षीय पूज्य ईजा और पिताजी के अनुसार— बबियाड़ के पहाड़ों जैसी पैदल दिनचर्या, सुबह जल्दी उठकर संध्या-पूजा, घर का सादा भोजन, और परिवार के साथ बैठकर दो मीठे बोल व हंसी-खुशी ही 80 की उम्र के बाद सबसे बड़ी दवाई है।",
    en: "🌿 **Secret to Longevity & Health After 80:** According to our 80-year-old Eja and 87-year-old father: daily walking routines inspired by the hills of Babiyar, early morning prayers, simple home-cooked meals, and warm, joyful conversations with grandchildren are the greatest medicine in old age."
  },
  {
    keywords: ["babiyar", "nainital", "chorgaliya", "village", "roots", "trust", "बबियाड़", "नैनीताल", "चोरगलिया", "जन्मभूमि", "ट्रस्ट", "गाँव"],
    hi: "🏔️ **जन्मभूमि ग्राम बबियाड़ (Babiyar) एवं बरगद सहारा ट्रस्ट:** नैनीताल (उत्तराखंड) की शांत वादियों में बसा हमारा पैतृक गाँव 'बबियाड़' और चोरगलिया हमारे संस्कारों की नींव है। 'बरगद सहारा फाउंडेशन एंड ट्रस्ट' के 3 प्रकल्प हैं: (1) Bargad Sahara Media, (2) 'सुनहरी डायरी' प्रकाशन, और (3) ग्रामीण व शहरी बुजुर्गों के लिए स्वास्थ्य व सम्मान शिविर।",
    en: "🏔️ **Birthplace Village Babiyar & Bargad Sahara Trust:** Located in the serene hills of Nainital (Uttarakhand), Village Babiyar and Chorgaliya are the roots of our values. Bargad Sahara Group & Trust operates across 3 wings: (1) Bargad Sahara Media, (2) Sunehri Diary Publications, and (3) Senior Citizen Care & Health Camps."
  },
  {
    keywords: ["vlog", "video", "youtube", "episode", "camera", "sony", "व्लॉग", "वीडियो", "यूट्यूब", "एपिसोड", "कैमरा", "सोनी"],
    hi: "🎬 **व्लॉग्स और यूट्यूब चैनल (@BargadSahara):** हमारे पहले एपिसोड में पिताजी का गाज़ियाबाद स्टेशन पर पोता-पोती से भावुक मिलन, नन्हे खरगोश से स्वागत, 'सोने की थाली' में भोजन और रात्रि में 'कृष्णाय वासुदेवाय' श्लोक दिखाया गया है। दूसरे एपिसोड में सुबह की बारिश, पिताजी की संध्या-पूजा और 10 वर्षीय पोते द्वारा 20 साल पुराने Sony कैमरे से शूटिंग शामिल है!",
    en: "🎬 **YouTube Vlogs (@BargadSahara):** Episode #01 captures our 87-year-old father's emotional arrival at Ghaziabad station, grandchildren's welcome with a baby rabbit, dinner in the traditional brass 'Sone Ki Thali', and bedtime Sanskrit prayers. Episode #02 features morning rain blessings, morning prayers, and our 10-year-old son filming with 20-year-old vintage Sony cameras!"
  },
  {
    keywords: ["contact", "join", "connect", "share", "email", "संपर्क", "जुड़ें", "ईमेल", "कहानी"],
    hi: "🤝 **हमसे कैसे जुड़ें:** आप हमारे आधिकारिक यूट्यूब चैनल **@BargadSahara**, Facebook Page/Group और X (@BargadSahara) पर जुड़ सकते हैं, या `bargadsahara@gmail.com` पर अपने घर के बुजुर्गों के अनुभव साझा कर सकते हैं।",
    en: "🤝 **How to Connect With Us:** Subscribe to our official YouTube channel **@BargadSahara**, follow our Facebook Page/Group and X (@BargadSahara), or email us at `bargadsahara@gmail.com` to feature the wisdom of elders from your family."
  }
];

function findBestAnswer(message, lang = "hi", translateMode = false) {
  const q = String(message || "").trim().toLowerCase();

  if (!q) {
    return lang === "en"
      ? "Namaskar! 🙏 Welcome to Bargad Sahara. How can I help you today? You can ask me about our 100 Elders (6,000 Years Wisdom) mission, Sunehri Diary, financial & health secrets, or our roots in Village Babiyar."
      : "नमस्कार! 🙏 बरगद सहारा में आपका स्वागत है। आज मैं आपकी क्या सहायता कर सकता हूँ? आप मुझसे 100 बुजुर्गों के 6,000 साल के अनुभव, सुनहरी डायरी, बचत के सूत्र या ग्राम बबियाड़ के बारे में पूछ सकते हैं।";
  }

  for (const entry of BARGAD_KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      if (translateMode) {
        return `🌐 **हिंदी अनुवाद (Hindi):**\n${entry.hi}\n\n🌐 **English Translation:**\n${entry.en}`;
      }
      return lang === "en" ? entry.en : entry.hi;
    }
  }

  // Default helpful bilingual response + translation
  if (translateMode) {
    return `🗣️ **आपका संदेश (Input):** "${message}"\n🌐 **हिंदी अनुवाद (Hindi):**\n🌳 नमस्कार! 'बरगद सहारा' 100 बुजुर्गों के 6,000 साल के अनुभवों को सहेजने का मंच है।\n🌐 **English Translation:**\n🌳 Welcome to Bargad Sahara — an intergenerational mission preserving 6,000 years of wisdom from 100 elders, rooted in Village Babiyar (Nainital). Ask about *Sunehri Diary*, *Savings Rules*, *Health Secrets*, or *Vlogs*!`;
  }

  return lang === "en"
    ? `🌳 Thank you for your message! At **Bargad Sahara (bargadsahara.com)**, we celebrate **100 Elders & 6,000 Years of Wisdom**, rooted in Village Babiyar (Nainital). You can ask me about:\n• 📖 **Sunehri Diary & 6,000 Years Wisdom**\n• 💰 **Elders' Financial & Savings Rules**\n• 🌿 **Longevity & Health Secrets after 80**\n• 🎬 **Latest YouTube Vlogs (@BargadSahara)**`
    : `🌳 आपके संदेश के लिए धन्यवाद! **बरगद सहारा (bargadsahara.com)** में हम ग्राम बबियाड़ (नैनीताल) की जड़ों से प्रेरित होकर **100 बुजुर्गों के 6,000 साल के तजुर्बे** को सहेज रहे हैं। आप मुझसे इन विषयों पर पूछ सकते हैं:\n• 📖 **सुनहरी डायरी और 6,000 साल का अनुभव**\n• 💰 **बुजुर्गों के बचत और आर्थिक सूत्र**\n• 🌿 **80 की उम्र के बाद सेहत का राज**\n• 🎬 **नवीनतम यूट्यूब व्लॉग्स (@BargadSahara)**`;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body =
    typeof req.body === "string" && req.body
      ? JSON.parse(req.body)
      : req.body || {};

  const message = String(body.message || "").trim();
  const lang = body.lang === "en" ? "en" : "hi";
  const translateMode = Boolean(body.translateMode);

  // 1. Optional Google Gemini Open/Free Tier API call if GEMINI_API_KEY is configured in Vercel
  const geminiKey = process.env.GEMINI_API_KEY || "";
  if (geminiKey && message) {
    try {
      const sysPrompt =
        "You are the official warm, respectful AI assistant and voice translator for 'Bargad Sahara | बुढ़ापे का सहारा' (bargadsahara.com), founded by a family rooted in Village Babiyar & Chorgaliya (Nainital, Uttarakhand) and Noida. The mission documents 6,000 years of wisdom from 100 elders in the 'Sunehri Diary', led by 3 generations: an 87-year-old retired teacher father ('Massab'), 80-year-old mother ('Eja'), 44-year-old father (IT General Manager), and 10-year-old grandson filming with 20-year-old Sony cameras. Reply concisely in " +
        (translateMode ? "BOTH Hindi and English (acting as a live translator and assistant)" : lang === "en" ? "English" : "Hindi");

      const gRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          geminiKey
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${sysPrompt}\n\nUser: ${message}` }] }],
          }),
        }
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        const text =
          gData &&
          gData.candidates &&
          gData.candidates[0] &&
          gData.candidates[0].content &&
          gData.candidates[0].content.parts &&
          gData.candidates[0].content.parts[0] &&
          gData.candidates[0].content.parts[0].text;
        if (text) {
          return res.status(200).json({
            ok: true,
            engine: "gemini-2.5-flash",
            reply: text,
            lang,
          });
        }
      }
    } catch (e) {}
  }

  // 2. Built-in Instant Curated Bilingual Knowledge & Voice Translation Engine
  const reply = findBestAnswer(message, lang, translateMode);
  return res.status(200).json({
    ok: true,
    engine: "bargad-bilingual-ai-v2",
    reply,
    lang,
  });
};
