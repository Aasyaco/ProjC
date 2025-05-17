import axios from 'axios';

const ALLOWED_API_KEY = process.env.API_KEY || 'WAR560Z';
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;
const ipMap = new Map();

function jsonResponse(res, status, body) {
  res.status(status).json({
    status: body.status || (status === 200 ? 'success' : 'error'),
    ...body
  });
}

function isValidUsername(username) {
  return /^[A-Za-z0-9._]+$/.test(username);
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip) || { count: 0, last: now };

  if (now - entry.last < RATE_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT) {
      return true;
    }
    entry.count += 1;
  } else {
    entry.count = 1;
    entry.last = now;
  }

  ipMap.set(ip, entry);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return jsonResponse(res, 405, { message: 'Method Not Allowed' });
  }

  const { username, token, key } = req.query;
  const clientKey = key || req.headers['x-api-key'];
  const ip = getClientIP(req);

  if (isRateLimited(ip)) {
    return jsonResponse(res, 429, { message: 'Too Many Requests — slow down', hint: 'Limit: 10 requests/min per IP' });
  }

  if (!clientKey || clientKey !== ALLOWED_API_KEY) {
    return jsonResponse(res, 403, { message: 'Unauthorized — invalid API key' });
  }

  if (!username || !token) {
    return jsonResponse(res, 400, { message: 'Missing username or token' });
  }

  if (!isValidUsername(username)) {
    return jsonResponse(res, 400, { message: 'Invalid username format', hint: 'Usernames may only contain letters, numbers, dots, or underscores' });
  }

  const fbUrl = `https://graph.facebook.com/${username}?access_token=${token}`;

  try {
    const response = await axios.get(fbUrl, { timeout: 5000 });

    if (response.data?.id) {
      return jsonResponse(res, 200, { uid: response.data.id });
    } else {
      return jsonResponse(res, 404, { message: 'UID not found' });
    }
  } catch (err) {
    const fbError = err.response?.data?.error?.message || err.message;
    const fbCode = err.response?.status || 500;
    return jsonResponse(res, fbCode, { message: 'Failed to fetch UID', details: fbError });
  }
}
