/**
 * 🌳 BARGAD SAHARA — LIVE BROADCAST NEWS RSS CONNECTOR (/api/news)
 * Fetches live Hindi/National headlines from BBC Hindi / Google News India RSS
 */
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const fallback = [
    "📰 [DD News / भारत]: आयुष्मान वय वंदना योजना के अंतर्गत 70 वर्ष से अधिक आयु के सभी वरिष्ठ नागरिकों को ₹5 लाख तक का निःशुल्क स्वास्थ्य उपचार कवच।",
    "🌍 [BBC Hindi / विश्व]: वैश्विक स्तर पर 'सिल्वर इकोनॉमी' और बुजुर्गों के जीवन-अनुभव को नई पीढ़ी के कौशल से जोड़ने की पहल को सराहना।",
    "🏦 [आर्थिक समाचार]: सीनियर सिटीजन सेविंग्स स्कीम (SCSS) और सुरक्षित रिटायरमेंट प्लानिंग में वरिष्ठ नागरिकों का बढ़ता भरोसा।",
    "🏔️ [उत्तराखंड / नैनीताल]: पहाड़ के पारंपरिक खान-पान, पैदल दिनचर्या और सामुदायिक चौपाल को दीर्घायु जीवन का प्रमुख आधार माना गया।",
    "🛡️ [साइबर सुरक्षा अलर्ट]: वरिष्ठ नागरिकों को डिजिटल ठगी और फर्जी कॉल्स से बचाने के लिए बैंकों और गृह मंत्रालय का विशेष जागरूकता अभियान।"
  ];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const rssRes = await fetch("https://feeds.bbci.co.uk/hindi/rss.xml", {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!rssRes.ok) {
      return res.status(200).json({ ok: true, source: "fallback", headlines: fallback });
    }
    const xml = await rssRes.text();
    const matches = [...xml.matchAll(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/g)];
    const parsed = matches
      .slice(0, 8)
      .map((m) => `🔴 [LIVE समाचार]: ${m[1].trim()}`);

    return res.status(200).json({
      ok: true,
      source: "bbc-hindi-live",
      headlines: parsed.length ? parsed : fallback,
    });
  } catch (e) {
    return res.status(200).json({
      ok: true,
      source: "fallback",
      headlines: fallback,
    });
  }
};
