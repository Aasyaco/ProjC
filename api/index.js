const fetch = require('node-fetch');

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
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();
    const match = html.match(/entity_id":"(\d{4,})"/);
    const uid = match ? match[1] : null;

    if (!uid) {
      throw new Error("UID not found");
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
