Here is a full `README.md` for your **Facebook UID API**, ideal for GitHub or Vercel documentation:

---

## 📘 Facebook UID API

Extract the numeric Facebook UID from any public Facebook profile URL — **without requiring an access token**.

> ⚡️ Built for speed. Works with both usernames (e.g., `zuck`) and direct links.

---

### 🔗 API Endpoint

```
GET /api/uid?url=https://facebook.com/zuck
```

---

### 📥 Query Parameters

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `url`     | string | ✅ Yes    | A valid Facebook profile URL |

---

### ✅ Success Response

```json
{
  "status": "success",
  "uid": "4"
}
```

---

### ❌ Error Response

```json
{
  "status": "error",
  "error": "Invalid Facebook profile URL"
}
```

---

### ⚡ Example cURL Request

```bash
curl "https://your-vercel-url.vercel.app/api/uid?url=https://facebook.com/zuck"
```

---

### 🧪 Supported Formats

This API supports:

* `https://facebook.com/zuck`
* `https://www.facebook.com/profile.php?id=4`
* `https://m.facebook.com/zuck`
* `https://fb.com/zuck`

✅ All of these resolve to the same UID.

---

### 🚀 Deployment (Optional)

If you want to deploy it yourself via [Vercel](https://vercel.com/):

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/fb-uid-api
   cd fb-uid-api
   ```

2. Link Vercel:

   ```bash
   vercel
   ```

3. Done! Your API will be live at:

   ```
   https://your-vercel-url.vercel.app/api/uid
   ```

---

### 🛡️ Notes

* No rate limits by default — add protection (like IP throttling) if making public.
* UID will not resolve if the account is private and not indexed by Facebook’s HTML page.
* Works by parsing public HTML, no scraping through login or tokens.

---

### 📄 License

MIT License

---

### 👨‍💻 Author

Made with 💙 by [AHMADxGEORGE](https://github.com/Aasyaco)

---

Would you like:

* A badge layout?
* GitHub deploy button?
* Postman collection export?

Let me know — I can generate those too.
