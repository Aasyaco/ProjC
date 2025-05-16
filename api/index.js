const express = require('express');
const serverless = require('@vendia/serverless-express');
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 });
const app = express();

app.get('/api/uid', async (req, res) => {
  const fbUrl = req.query.url;
  if (!fbUrl || !/^https:\/\/(www\.)?facebook\.com\/[^\/]+$/.test(fbUrl)) {
    return res.status(400).json({ status: 'error', error: 'Invalid Facebook profile URL' });
  }

  if (cache.has(fbUrl)) {
    return res.json({ status: 'success', uid: cache.get(fbUrl) });
  }

  try {
    const { data } = await axios.get(fbUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const match = data.match(/"userID":"(\d+)"/);
    if (!match) {
      return res.status(404).json({ status: 'error', error: 'UID not found' });
    }

    const uid = match[1];
    cache.set(fbUrl, uid);
    res.json({ status: 'success', uid });
  } catch (err) {
    res.status(500).json({ status: 'error', error: 'Failed to fetch Facebook data' });
  }
});

module.exports = serverless({ app });
