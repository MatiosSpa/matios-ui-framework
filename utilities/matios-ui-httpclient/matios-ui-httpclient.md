# MTS.HttpClient

HTTP client with a consistent response contract. It always resolves — it never rejects. Supports timeout, retry on 5xx, request/response interceptors, per-request and global callbacks, file upload with progress and file download.

---

## Installation

```html
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient.js"></script>
```

Optional — for localized default error messages, load the shared i18n base and this component's locale pack before the client:

```html
<script src="base/matios-ui-i18n.js"></script>
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient-i18n.js"></script>
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient.js"></script>
```

---

## Response contract

Every method resolves to the same shape — no `try/catch` needed in the UI. The promise never rejects.

```js
{
  success: true,   // boolean — whether the request succeeded (HTTP 2xx)
  status:  200,    // number — HTTP status code (0 = network error, 408 = timeout)
  message: null,   // string on failure, null on success
  data:    { },    // parsed response on success, null on failure
}
```

`data` on success is the parsed JSON when the response `Content-Type` is `application/json`, the raw text for any other type, and `null` for a `204 No Content`.

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

All return `Promise<{ success, status, message, data }>`. The request body (`data`) is JSON-stringified for `POST`, `PUT` and `PATCH`. Each method accepts an optional per-request `options` object that overrides the global config for that call:

| Option | Type | Description |
|--------|------|-------------|
| `params` | `object` | Query-string params (`null`/`undefined` values skipped) |
| `headers` | `object` | Extra headers merged over the base headers |
| `timeout` | `number` | Timeout in ms for this call |
| `retry` | `number` | Max retries on 5xx for this call |
| `onSuccess` | `function` | `(res)` called on success |
| `onError` | `function` | `(res)` called on failure |
| `onTimeout` | `function` | `(res)` called on timeout |
| `onRetry` | `function` | `(res)` called before each retry (`res.attempt`) |

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
| `baseUrl` | `string` | `''` | Base URL prepended to every endpoint (trailing slash stripped) |
| `headers` | `object` | `{}` | Headers sent on every request (merged over `Content-Type: application/json`) |
| `timeout` | `number` | `15000` | Timeout in ms (aborts via `AbortController`) |
| `retry` | `number` | `0` | Max retries on 5xx errors |
| `debug` | `boolean` | `false` | Log every request/response to the console |
| `onSuccess` | `function` | `null` | Global success callback `(res)` |
| `onError` | `function` | `null` | Global error callback `(res)` |
| `onTimeout` | `function` | `null` | Global timeout callback `(res)` |
| `onRetry` | `function` | `null` | Global retry callback `(res)` |
| `before` | `function` | `null` | Request interceptor registered at construction |
| `after` | `function` | `null` | Response interceptor registered at construction |

The base `Content-Type` defaults to `application/json` and can be overridden through `headers`.

---

## Interceptors

Register interceptors in the constructor (`before` / `after`) or afterwards with the chainable `.before()` / `.after()` methods. Multiple interceptors run in registration order.

`before(req)` receives the request config `{ method, headers, body? }` and must return it (modified or not) — useful for auth tokens, dynamic headers, logging. `after(res)` receives the response contract `{ success, status, message, data }` and must return it — useful for global error handling, token refresh, logging. Both may be `async`. Errors thrown inside an interceptor are swallowed (logged when `debug` is on) and do not break the request.

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

> Note: interceptors run on `get`/`post`/`put`/`patch`/`delete`. `before` interceptors also run on `download()`. `upload()` does not run interceptors.

---

## Retry

Automatically retries on **5xx** errors (never on 4xx) up to `retry` times, with progressive backoff of `attempt * 500` ms (500 ms, 1000 ms, 1500 ms…):

```js
const http = new MTS.HttpClient({
  baseUrl: 'https://api.myapp.com',
  retry:   3,
  onRetry: function (res) { console.log('Retrying... attempt ' + res.attempt); },
});
```

`retry` can also be set per request via the `options` object.

---

## Events

Subscribe with constructor/per-request callbacks (above) or the chainable `.on()` / `.off()` methods. Valid event names: `success`, `error`, `timeout`, `retry`.

```js
function handler(res) { console.error(res); }

http.on('error', handler);
http.off('error', handler);
```

For a given request, callbacks fire in this order: (1) the matching global constructor callback, (2) the matching per-request `options` callback, (3) all `.on()` listeners.

---

## Global instance

Create one instance at app start and reuse it anywhere through `MTS.HttpClient.instance`:

```js
MTS.HttpClient.create({
  baseUrl: 'https://api.myapp.com',
  timeout: 10000,
  retry:   2,
  headers: { 'X-App': 'MyApp' },
  onError: function (res) { MTS.Toast.show({ message: res.message, variant: 'danger' }); },
});

const res = await MTS.HttpClient.instance.get('/users');
```

`create()` returns the new instance and also stores it on `MTS.HttpClient.instance`.

---

## upload()

```js
http.upload(endpoint, file, options?)
```

Uploads a file with real progress via `XMLHttpRequest` (a `POST` with `multipart/form-data`; the browser sets the boundary, so `Content-Type` is not sent). Pair it with `MTS.FileUpload` for file selection. Resolves to the standard contract.

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
| `fieldName` | `string` | `'file'` | FormData field name for the file |
| `data` | `object` | `null` | Extra FormData fields |
| `headers` | `object` | `{}` | Extra headers (`Content-Type` is always stripped) |
| `onProgress` | `function` | `null` | `(percent)` — upload progress 0–100 |
| `onSuccess` | `function` | `null` | `(res)` on success |
| `onError` | `function` | `null` | `(res)` on error |

`upload()` does not apply the `timeout`, `retry` or interceptor pipeline.

---

## download()

```js
http.download(endpoint, filename?, options?)
```

Performs a `GET`, reads the response as a `Blob` and returns a temporary object URL to trigger the browser download. On success `res.data` is `{ url, blob, filename }` (`filename` defaults to `'archivo'`). Honors `timeout` and the `before` interceptors.

```js
const res = await http.download('/reports/export', 'report.pdf');
if (res.success) {
  const a = document.createElement('a');
  a.href = res.data.url;
  a.download = res.data.filename;
  a.click();
  URL.revokeObjectURL(res.data.url); // free memory
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headers` | `object` | `{}` | Extra headers merged over the base headers |
| `timeout` | `number` | global | Timeout in ms for this download |

---

## Error / status codes

| Status | Meaning |
|--------|---------|
| `2xx` | Success — `success: true` |
| `4xx` | Client error — bad request, not found, unauthorized (no retry) |
| `5xx` | Server error — triggers retry when `retry` is configured |
| `408` | Timeout — the request exceeded the configured limit |
| `0` | Network error — no connection, CORS, or aborted |

On failure `message` carries the server's `Message` / `message` / `error` field when present; otherwise a default. Default messages (`Network error`, `Request timed out`, `Unknown error`, `Request failed`) are localizable via the i18n pack below.

---

## i18n

Default error messages come from the shared i18n system under the namespace `MTS.HttpClient` (sub-object `messages`). Set the language once at app start; the active language applies to every instance. There is no per-instance locale option.

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt' — default 'es'
```

Keys (defaults shipped for `es`, `en`, `pt`):

| Key | English default | Used for |
|-----|-----------------|----------|
| `networkError` | `Network error` | Status `0` — connection/CORS failure |
| `timeout` | `Request timed out` | Status `408` |
| `unknownError` | `Unknown error` | Failure with no server message |
| `requestFailed` | `Request failed` | `download()` non-2xx response |

Without the i18n pack, the client falls back to the English defaults shown above.
