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
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await response.text();

    const patterns = [
      /entity_id":"(\d{4,})"/,
      /"userID":"(\d+)"/,
      /fb:\/\/profile\/(\d+)/,
    ];

    let uid = null;
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        uid = match[1];
        break;
      }
    }

    if (!uid) {
      return res.status(404).json({
        status: "error",
        error: "UID not found – profile may be private or Facebook is blocking requests.",
      });
    }

    return res.status(200).json({
      status: "success",
      uid,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};
