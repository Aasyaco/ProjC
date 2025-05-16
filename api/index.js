import express from "express";
import fetch from "node-fetch";
import { default as vexpress } from "vercel-serverless-express";

// Initialize Express app
const app = express();
app.use(express.json());

// UID API route
app.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url || !(url.startsWith("https://facebook.com") || url.startsWith("https://www.facebook.com"))) {
    return res.status(400).json({ status: "error", error: "Missing or invalid Facebook URL" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const patterns = [
      /"entity_id":"(\d+)"/,
      /"userID":"(\d+)"/,
      /fb:\/\/profile\/(\d+)/,
      /profile\.php\?id=(\d+)/
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return res.status(200).json({ status: "success", uid: match[1] });
      }
    }

    return res.status(404).json({ status: "error", error: "UID not found – profile may be private or protected." });

  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
});

// Export the Express app using vercel-serverless-express
export default vexpress({ app });
