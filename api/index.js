import express from "express";

const app = express();
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3000;

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Facebook UID Extractor API",
    method: "POST",
    endpoint: "/api",
    body: {
      content: "HTML content of the Facebook profile page"
    }
  });
});

// API endpoint
app.post("/api", (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ status: "error", error: "Missing or invalid 'content' field." });
  }

  const patterns = [
    /"entity_id":"(\d+)"/,
    /"userID":"(\d+)"/,
    /fb:\/\/profile\/(\d+)/,
    /profile\.php\?id=(\d+)/
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return res.json({ status: "success", uid: match[1] });
    }
  }

  return res.status(404).json({ status: "error", error: "UID not found – content may be stripped, private, or malformed." });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
