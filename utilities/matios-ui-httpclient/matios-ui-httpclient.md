# MTS.HttpClient

[EN] HTTP client with consistent response contract. Always resolves — never rejects. Supports timeout, retry, interceptors, file upload with progress and file download.
[ES] Cliente HTTP con contrato de respuesta consistente. Siempre resuelve — nunca rechaza. Soporta timeout, retry, interceptores, upload con progreso y descarga de archivos.

---

## Installation / Instalación

```html
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient.js"></script>
```

---

## Response contract / Contrato de respuesta

[EN] Every method always returns the same structure — no try/catch needed in the UI.
[ES] Todos los métodos siempre retornan la misma estructura — no se necesita try/catch en la UI.

```js
{
  success: true | false,   // [EN] whether the request succeeded / [ES] si la request fue exitosa
  status:  200,            // [EN] HTTP status code / [ES] código de estado HTTP
  message: null,           // [EN] error message or null / [ES] mensaje de error o null
  data:    { ... },        // [EN] response data or null / [ES] datos de la respuesta o null
}
```

---

## Quickstart

```js
const http = new MTS.HttpClient({ baseUrl: 'https://api.miapp.com' });

const res = await http.get('/users');

if (res.success) {
  console.log(res.data);
} else {
  console.error(res.message);
}
```

---

## Constructor options / Opciones del constructor

| Option / Opción | Type / Tipo | Default | [EN] Description / [ES] Descripción |
|---|---|---|---|
| `baseUrl` | string | `''` | [EN] Base URL for all requests / [ES] URL base para todas las requests |
| `headers` | object | `{}` | [EN] Base headers sent on every request / [ES] Headers base enviados en cada request |
| `timeout` | number | `15000` | [EN] Request timeout in ms / [ES] Timeout de la request en ms |
| `retry` | number | `0` | [EN] Max retries on 5xx errors / [ES] Reintentos máximos en errores 5xx |
| `debug` | boolean | `false` | [EN] Enable console logs / [ES] Activa logs en consola |
| `onSuccess` | function | `null` | [EN] Called on every successful response / [ES] Se llama en cada respuesta exitosa |
| `onError` | function | `null` | [EN] Called on every error response / [ES] Se llama en cada respuesta de error |
| `onTimeout` | function | `null` | [EN] Called on timeout / [ES] Se llama al agotar el tiempo |
| `onRetry` | function | `null` | [EN] Called before each retry / [ES] Se llama antes de cada reintento |
| `before` | function | `null` | [EN] Interceptor — runs before every request / [ES] Interceptor — se ejecuta antes de cada request |
| `after` | function | `null` | [EN] Interceptor — runs after every response / [ES] Interceptor — se ejecuta después de cada respuesta |

---

## Methods / Métodos

### HTTP shortcuts

```js
http.get(endpoint, options?)
http.post(endpoint, data, options?)
http.put(endpoint, data, options?)
http.patch(endpoint, data, options?)
http.delete(endpoint, options?)
```

[EN] All methods return `Promise<{ success, status, message, data }>`.
[ES] Todos los métodos retornan `Promise<{ success, status, message, data }>`.

### Per-request options / Opciones por request

[EN] Every method accepts an optional `options` object to override global config for that specific call.
[ES] Cada método acepta un objeto `options` opcional para sobreescribir la configuración global solo para esa llamada.

| Option / Opción | Type / Tipo | [EN] Description / [ES] Descripción |
|---|---|---|
| `headers` | object | [EN] Extra headers for this request / [ES] Headers extra para esta request |
| `params` | object | [EN] Query string params (GET) / [ES] Parámetros de query string (GET) |
| `timeout` | number | [EN] Override global timeout / [ES] Sobreescribe el timeout global |
| `retry` | number | [EN] Override global retry / [ES] Sobreescribe el retry global |
| `onSuccess` | function | [EN] Called only for this request / [ES] Se llama solo para esta request |
| `onError` | function | [EN] Called only for this request / [ES] Se llama solo para esta request |
| `onTimeout` | function | [EN] Called only for this request / [ES] Se llama solo para esta request |

```js
// [EN] Query params — GET /users?page=1&limit=20
// [ES] Query params — GET /users?page=1&limit=20
const res = await http.get('/users', {
  params: { page: 1, limit: 20 },
});

// [EN] Override timeout and add headers for a specific call
// [ES] Sobreescribir timeout y agregar headers para una llamada específica
const res = await http.post('/critical', data, {
  timeout:   30000,
  headers:   { 'X-Priority': 'high' },
  onSuccess: (res) => MTS.Toast.show({ message: 'Guardado', variant: 'success' }),
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
});
```

---

## Interceptors / Interceptores

[EN] Functions that run automatically before every request or after every response — without repeating code in each call.
[ES] Funciones que se ejecutan automáticamente antes de cada request o después de cada respuesta — sin repetir código en cada llamada.

### before

[EN] Receives the request config and must return it (modified or not). Useful for: auth tokens, dynamic headers, logging.
[ES] Recibe la configuración del request y debe retornarla (modificada o no). Útil para: tokens de auth, headers dinámicos, logging.

```js
http.before((req) => {
  req.headers['Authorization'] = 'Bearer ' + getTokenActual();
  req.headers['X-App-Version'] = '2.0.0';
  return req;
});
```

### after

[EN] Receives the response `{ success, status, message, data }` and must return it. Useful for: global error handling, token refresh, logging.
[ES] Recibe la respuesta `{ success, status, message, data }` y debe retornarla. Útil para: manejo global de errores, refresh de token, logging.

```js
http.after((res) => {
  if (res.status === 401) redirectToLogin();
  if (res.status === 403) MTS.Toast.show({ message: 'Sin permisos', variant: 'warning' });
  return res;
});
```

[EN] Interceptors can be chained — they execute in order of registration.
[ES] Los interceptores se pueden encadenar — se ejecutan en orden de registro.

```js
http.before(addAuthToken);
http.before(addRequestId);
http.after(handleGlobalErrors);
http.after(logResponse);
```

---

## Retry

[EN] Automatically retries on 5xx server errors with progressive backoff (500ms, 1000ms, 1500ms...).
[ES] Reintenta automáticamente en errores 5xx con backoff progresivo (500ms, 1000ms, 1500ms...).

```js
const http = new MTS.HttpClient({
  baseUrl: 'https://api.miapp.com',
  retry:   3,
  onRetry: (res) => console.log(`Reintentando... intento ${res.attempt}`),
});
```

---

## Global instance / Instancia global

[EN] Create one instance at app startup and reuse it everywhere.
[ES] Crea una instancia al inicio de la app y reutilízala en cualquier parte.

```js
// [EN] App startup — configure once
// [ES] Al iniciar la app — configura una sola vez
MTS.HttpClient.create({
  baseUrl:   'https://api.miapp.com',
  timeout:   10000,
  retry:     2,
  debug:     false,
  headers:   { 'X-App': 'MiApp' },
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
  onTimeout: (res) => MTS.Toast.show({ message: 'Tiempo de espera agotado', variant: 'warning' }),
});

// [EN] In any module — no need to reconfigure
// [ES] En cualquier módulo — sin reconfigurar
const res = await MTS.HttpClient.instance.get('/users');
```

---

## upload()

[EN] Uploads a file with real progress via `XMLHttpRequest`. Use with `MTS.FileUpload` to let the user select the file.
[ES] Sube un archivo con progreso real via `XMLHttpRequest`. Usa junto a `MTS.FileUpload` para que el usuario seleccione el archivo.

```js
const fu   = new MTS.FileUpload('#zona-upload', { accept: 'image/*,.pdf', maxSize: 10 });
const http = new MTS.HttpClient({ baseUrl: 'https://api.miapp.com' });

const [file] = fu.getFiles();

const res = await http.upload('/files', file, {
  fieldName:  'archivo',               // [EN] form field name / [ES] nombre del campo en el form
  data:       { categoria: 'docs' },   // [EN] extra FormData fields / [ES] campos adicionales al FormData
  onProgress: (pct) => {
    barra.style.width  = pct + '%';
    label.textContent  = pct + '%';
  },
  onSuccess: (res) => MTS.Toast.show({ message: 'Subido correctamente', variant: 'success' }),
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
});
```

### upload() options

| Option / Opción | Type / Tipo | Default | [EN] Description / [ES] Descripción |
|---|---|---|---|
| `fieldName` | string | `'file'` | [EN] Form field name / [ES] Nombre del campo en el form |
| `data` | object | `null` | [EN] Extra fields appended to FormData / [ES] Campos adicionales al FormData |
| `headers` | object | `{}` | [EN] Extra headers / [ES] Headers extra |
| `onProgress` | function | `null` | [EN] `(percent: number) => void` |
| `onSuccess` | function | `null` | [EN] Called on success / [ES] Se llama al éxito |
| `onError` | function | `null` | [EN] Called on error / [ES] Se llama en error |

---

## download()

[EN] Downloads a file as a Blob and returns a temporary URL to trigger the browser download.
[ES] Descarga un archivo como Blob y retorna una URL temporal para disparar la descarga en el browser.

```js
const res = await http.download('/reports/export', 'reporte.pdf');

if (res.success) {
  const a = document.createElement('a');
  a.href     = res.data.url;
  a.download = res.data.filename;
  a.click();

  // [EN] Release memory when no longer needed
  // [ES] Liberar memoria cuando ya no se necesite
  URL.revokeObjectURL(res.data.url);
}
```

[EN] `res.data` contains `{ url, blob, filename }`.
[ES] `res.data` contiene `{ url, blob, filename }`.

---

## Events / Eventos

[EN] Two ways to listen — constructor callbacks (recommended) or `.on()`.
[ES] Dos formas de escuchar — callbacks del constructor (recomendado) o `.on()`.

```js
// [EN] Recommended — visible in IDE autocomplete
// [ES] Recomendado — visible en el autocompletado del IDE
const http = new MTS.HttpClient({
  onSuccess: (res) => {},
  onError:   (res) => {},
  onTimeout: (res) => {},
  onRetry:   (res) => {},
});

// [EN] Alternative — string event style
// [ES] Alternativa — estilo string event
http.on('success', (res) => {});
http.on('error',   (res) => {});
http.on('timeout', (res) => {});
http.on('retry',   (res) => {});
http.off('error', myHandler);
```

---

## Error codes / Códigos de error

| status | [EN] Cause / [ES] Causa |
|---|---|
| `4xx` | [EN] Client error — bad request, not found, unauthorized / [ES] Error del cliente — bad request, not found, sin autorización |
| `5xx` | [EN] Server error — triggers retry if configured / [ES] Error del servidor — dispara retry si está configurado |
| `408` | [EN] Timeout — request exceeded the configured limit / [ES] Timeout — la request superó el límite configurado |
| `0` | [EN] Network error — no connection or CORS / [ES] Error de red — sin conexión o CORS |
