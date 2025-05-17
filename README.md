# Facebook Username to UID API

A lightweight, secure API to convert a Facebook account username into its unique user ID (UID) using the Facebook Graph API.

---

## Features

- Simple REST API endpoint to fetch UID by username.
- Token-based access with secret API key protection.
- Rate limiting to prevent abuse.
- Easy to deploy on Vercel.
- Returns clear, structured JSON responses.
- Minimal dependencies for fast performance.

---

## API Endpoint

```

GET /api?username=<username>\&token=\<fb\_access\_token>\&key=\<api\_key>

````

- **username** (string, required): Facebook account username.
- **token** (string, required): Valid Facebook Graph API access token.
- **key** (string, required): Your API secret key for authorization.

---

## Response Format

### Success

```json
{
  "status": "success",
  "uid": "4"
}
````

### Error

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## HTTP Status Codes

| Code | Description                                 |
| ---- | ------------------------------------------- |
| 200  | Success, UID returned                       |
| 400  | Bad request (missing or invalid parameters) |
| 403  | Unauthorized (invalid API key)              |
| 404  | UID not found                               |
| 405  | Method Not Allowed (only GET supported)     |
| 429  | Too Many Requests (rate limit exceeded)     |
| 500  | Server error                                |

---

## Rate Limiting

To protect the API from abuse, each IP address is limited to **10 requests per minute**.

---

## Installation & Deployment

### Requirements

* Node.js 16+ (if running locally)
* Vercel CLI (optional, for local development and deployment)

### Deploy to Vercel

1. Clone the repository:

   ```bash
   git clone https://github.com/Aasyaco/ProjC.git
   cd ProjC
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your secret API key in `api/index.js` (default is `WAR560Z`).

4. Deploy:

   ```bash
   vercel
   ```

### Run Locally

Start local server with Vercel CLI:

```bash
vercel dev
```

Access API at:

```
http://localhost:3000/api?username=zuck&token=YOUR_FB_TOKEN&key=WAR560Z
```

---

## Usage Example

Request:

```
GET https://your-vercel-domain.vercel.app/api?username=zuck&token=YOUR_FB_ACCESS_TOKEN&key=WAR560Z
```

Response:

```json
{
  "status": "success",
  "uid": "4"
}
```

---

## Security Notes

* Keep your Facebook access token and API secret key secure.
* Do not expose your secret API key publicly.
* Use HTTPS in production to secure data in transit.

---

## License

MIT License © \[Your Name or Company]

---

## Contact

For questions or support, open an issue on GitHub or contact \[[your-email@example.com](mailto:your-email@example.com)].
