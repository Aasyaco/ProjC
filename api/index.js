import fetch from 'node-fetch';

function extractUID(html) {
  const patterns = [
    /"entity_id":"(\d+)"/,
    /"userID":"(\d+)"/,
    /profile_id=(\d+)/,
    /"fb:\/\/profile\/(\d+)"/,
    /"userID\\":\\"(\d+)\\"/
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default async function handler(req, res) {
  const { url } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!url) {
    return res.status(400).json({ status: 'error', error: 'Missing ?url parameter' });
  }

  const fbUrlRegex = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.\-_]+\/?$/i;
  if (!fbUrlRegex.test(url)) {
    return res.status(400).json({ status: 'error', error: 'Invalid Facebook profile URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
      },
      timeout: 7000
    });

    const html = await response.text();
    const uid = extractUID(html);

    if (!uid) {
      return res.status(404).json({ status: 'error', error: 'UID not found — is the profile public?' });
    }

    return res.status(200).json({ status: 'success', uid });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: 'Internal error', detail: err.message });
  }
}
