# MTS.HttpClient

HTTP client with a consistent response contract. It always resolves — never rejects. Supports timeout, retry, interceptors, upload with progress and file download.

---

## Installation

```html
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient.js"></script>
```

---

## Response contract

Every method always returns the same shape — no try/catch needed in the UI:

```js
{
  success: true | false, // whether the request succeeded
  status:  200,          // HTTP status code
  message: null,         // error message or null
  data:    { ... },      // response data or null
}
```

---

## Usage

```js
const http = new MTS.HttpClient({ baseUrl: 'https://api.myapp.com' });

const res = await http.get('/users');
if (res.success) { console.log(res.data); } else { console.error(res.message); }
```

### HTTP methods

```js
http.get(endpoint, options?)
http.post(endpoint, data, options?)
http.put(endpoint, data, options?)
http.patch(endpoint, data, options?)
http.delete(endpoint, options?)
```

All return `Promise<{ success, status, message, data }>`. Each accepts an optional per-request `options` object
(`headers`, `params`, `timeout`, `retry`, `onSuccess`, `onError`, `onTimeout`) overriding the global config:

```js
const res = await http.get('/users', { params: { page: 1, limit: 20 } }); // GET /users?page=1&limit=20

await http.post('/critical', data, {
  timeout: 30000,
  headers: { 'X-Priority': 'high' },
  onSuccess: function (res) { MTS.Toast.show({ message: 'Saved', variant: 'success' }); },
  onError:   function (res) { MTS.Toast.show({ message: res.message, variant: 'danger' }); },
});
```

---

## Constructor options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `''` | Base URL for all requests |
| `headers` | `object` | `{}` | Headers sent on every request |
| `timeout` | `number` | `15000` | Timeout in ms |
| `retry` | `number` | `0` | Max retries on 5xx errors |
| `debug` | `boolean` | `false` | Enable console logs |
| `onSuccess` / `onError` / `onTimeout` / `onRetry` | `function` | `null` | Lifecycle callbacks |
| `before` | `function` | `null` | Interceptor — runs before each request |
| `after` | `function` | `null` | Interceptor — runs after each response |

---

## Interceptors

`before(req)` receives the request config and must return it (modified or not) — useful for auth tokens, dynamic
headers, logging. `after(res)` receives the response and must return it — useful for global error handling, token
refresh, logging. Both can be chained (run in registration order):

```js
http.before(function (req) {
  req.headers['Authorization'] = 'Bearer ' + getToken();
  return req;
});

http.after(function (res) {
  if (res.status === 401) redirectToLogin();
  return res;
});
```

---

## Retry

Automatically retries on 5xx errors with progressive backoff (500ms, 1000ms, 1500ms…):

```js
const http = new MTS.HttpClient({
  baseUrl: 'https://api.myapp.com', retry: 3,
  onRetry: function (res) { console.log('Retrying... attempt ' + res.attempt); },
});
```

---

## Global instance

Create one instance at app start and reuse it anywhere:

```js
MTS.HttpClient.create({
  baseUrl: 'https://api.myapp.com', timeout: 10000, retry: 2, headers: { 'X-App': 'MyApp' },
  onError: function (res) { MTS.Toast.show({ message: res.message, variant: 'danger' }); },
});

const res = await MTS.HttpClient.instance.get('/users');
```

---

## upload()

Uploads a file with real progress via `XMLHttpRequest`. Pair it with `MTS.FileUpload` for file selection.

```js
const fu   = new MTS.FileUpload('#upload-zone', { accept: 'image/*,.pdf', maxSize: 10 });
const http = new MTS.HttpClient({ baseUrl: 'https://api.myapp.com' });
const [file] = fu.getFiles();

await http.upload('/files', file, {
  fieldName:  'file',
  data:       { category: 'docs' },
  onProgress: function (pct) { bar.style.width = pct + '%'; label.textContent = pct + '%'; },
  onSuccess:  function (res) { MTS.Toast.show({ message: 'Uploaded', variant: 'success' }); },
  onError:    function (res) { MTS.Toast.show({ message: res.message, variant: 'danger' }); },
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fieldName` | `string` | `'file'` | FormData field name |
| `data` | `object` | `null` | Extra FormData fields |
| `headers` | `object` | `{}` | Extra headers |
| `onProgress` | `function` | `null` | `(percent)` — progress 0–100 |
| `onSuccess` / `onError` | `function` | `null` | Success / error callbacks |

---

## download()

Downloads a file as a Blob and returns a temporary URL to trigger the browser download. `res.data` contains
`{ url, blob, filename }`:

```js
const res = await http.download('/reports/export', 'report.pdf');
if (res.success) {
  const a = document.createElement('a');
  a.href = res.data.url; a.download = res.data.filename; a.click();
  URL.revokeObjectURL(res.data.url); // free memory
}
```

---

## Events

Listen via constructor callbacks (recommended) or `.on()`:

```js
const http = new MTS.HttpClient({
  onSuccess: function (res) {}, onError: function (res) {}, onTimeout: function (res) {}, onRetry: function (res) {},
});

http.on('error', function (res) {});
http.off('error', myHandler);
```

---

## Error codes

| Status | Cause |
|--------|-------|
| `4xx` | Client error — bad request, not found, unauthorized |
| `5xx` | Server error — triggers retry if configured |
| `408` | Timeout — the request exceeded the configured limit |
| `0` | Network error — no connection or CORS |

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template; example arrow functions replaced with `function ()`.
