const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.includes("facebook.com")) {
    return res.status(400).json({
      status: "error",
      error: "Invalid Facebook profile URL",
    });
  }

  try {
    // First attempt: direct scraping
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await response.text();

    const match = html.match(/entity_id":"(\d{4,})"/) || html.match(/"userID":"(\d+)"/);
    if (match) {
      return res.status(200).json({
        status: "success",
        uid: match[1],
      });
    }

    // Second attempt: fallback to fbsearch.me
    const fbsearch = await fetch(`https://fbsearch.me/fb/${encodeURIComponent(url)}`);
    const fbtext = await fbsearch.text();
    const fallbackMatch = fbtext.match(/UID: <b>(\d+)<\/b>/);

    if (fallbackMatch) {
      return res.status(200).json({
        status: "success",
        uid: fallbackMatch[1],
      });
    }

    return res.status(404).json({
      status: "error",
      error: "UID not found in both primary and fallback",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};
