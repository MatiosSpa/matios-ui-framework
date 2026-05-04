# MTS.HttpClient

🇬🇧 HTTP client with consistent response contract. Always resolves — never rejects. Supports timeout, retry, interceptors, file upload with progress and file download.
🇪🇸 Cliente HTTP con contrato de respuesta consistente. Siempre resuelve — nunca rechaza. Soporta timeout, retry, interceptores, upload con progreso y descarga de archivos.

---

## Installation / Instalación

```html
<script src="utilities/matios-ui-httpclient/matios-ui-httpclient.js"></script>
```

---

## Response contract / Contrato de respuesta

🇬🇧 Every method always returns the same structure — no try/catch needed in the UI.
🇪🇸 Todos los métodos siempre retornan la misma estructura — no se necesita try/catch en la UI.

```js
{
  success: true | false,   // 🇬🇧 whether the request succeeded / 🇪🇸 si la request fue exitosa
  status:  200,            // 🇬🇧 HTTP status code / 🇪🇸 código de estado HTTP
  message: null,           // 🇬🇧 error message or null / 🇪🇸 mensaje de error o null
  data:    { ... },        // 🇬🇧 response data or null / 🇪🇸 datos de la respuesta o null
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

| Option / Opción | Type / Tipo | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|---|
| `baseUrl` | string | `''` | 🇬🇧 Base URL for all requests / 🇪🇸 URL base para todas las requests |
| `headers` | object | `{}` | 🇬🇧 Base headers sent on every request / 🇪🇸 Headers base enviados en cada request |
| `timeout` | number | `15000` | 🇬🇧 Request timeout in ms / 🇪🇸 Timeout de la request en ms |
| `retry` | number | `0` | 🇬🇧 Max retries on 5xx errors / 🇪🇸 Reintentos máximos en errores 5xx |
| `debug` | boolean | `false` | 🇬🇧 Enable console logs / 🇪🇸 Activa logs en consola |
| `onSuccess` | function | `null` | 🇬🇧 Called on every successful response / 🇪🇸 Se llama en cada respuesta exitosa |
| `onError` | function | `null` | 🇬🇧 Called on every error response / 🇪🇸 Se llama en cada respuesta de error |
| `onTimeout` | function | `null` | 🇬🇧 Called on timeout / 🇪🇸 Se llama al agotar el tiempo |
| `onRetry` | function | `null` | 🇬🇧 Called before each retry / 🇪🇸 Se llama antes de cada reintento |
| `before` | function | `null` | 🇬🇧 Interceptor — runs before every request / 🇪🇸 Interceptor — se ejecuta antes de cada request |
| `after` | function | `null` | 🇬🇧 Interceptor — runs after every response / 🇪🇸 Interceptor — se ejecuta después de cada respuesta |

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

🇬🇧 All methods return `Promise<{ success, status, message, data }>`.
🇪🇸 Todos los métodos retornan `Promise<{ success, status, message, data }>`.

### Per-request options / Opciones por request

🇬🇧 Every method accepts an optional `options` object to override global config for that specific call.
🇪🇸 Cada método acepta un objeto `options` opcional para sobreescribir la configuración global solo para esa llamada.

| Option / Opción | Type / Tipo | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `headers` | object | 🇬🇧 Extra headers for this request / 🇪🇸 Headers extra para esta request |
| `params` | object | 🇬🇧 Query string params (GET) / 🇪🇸 Parámetros de query string (GET) |
| `timeout` | number | 🇬🇧 Override global timeout / 🇪🇸 Sobreescribe el timeout global |
| `retry` | number | 🇬🇧 Override global retry / 🇪🇸 Sobreescribe el retry global |
| `onSuccess` | function | 🇬🇧 Called only for this request / 🇪🇸 Se llama solo para esta request |
| `onError` | function | 🇬🇧 Called only for this request / 🇪🇸 Se llama solo para esta request |
| `onTimeout` | function | 🇬🇧 Called only for this request / 🇪🇸 Se llama solo para esta request |

```js
// 🇬🇧 Query params — GET /users?page=1&limit=20
// 🇪🇸 Query params — GET /users?page=1&limit=20
const res = await http.get('/users', {
  params: { page: 1, limit: 20 },
});

// 🇬🇧 Override timeout and add headers for a specific call
// 🇪🇸 Sobreescribir timeout y agregar headers para una llamada específica
const res = await http.post('/critical', data, {
  timeout:   30000,
  headers:   { 'X-Priority': 'high' },
  onSuccess: (res) => MTS.Toast.show({ message: 'Guardado', variant: 'success' }),
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
});
```

---

## Interceptors / Interceptores

🇬🇧 Functions that run automatically before every request or after every response — without repeating code in each call.
🇪🇸 Funciones que se ejecutan automáticamente antes de cada request o después de cada respuesta — sin repetir código en cada llamada.

### before

🇬🇧 Receives the request config and must return it (modified or not). Useful for: auth tokens, dynamic headers, logging.
🇪🇸 Recibe la configuración del request y debe retornarla (modificada o no). Útil para: tokens de auth, headers dinámicos, logging.

```js
http.before((req) => {
  req.headers['Authorization'] = 'Bearer ' + getTokenActual();
  req.headers['X-App-Version'] = '2.0.0';
  return req;
});
```

### after

🇬🇧 Receives the response `{ success, status, message, data }` and must return it. Useful for: global error handling, token refresh, logging.
🇪🇸 Recibe la respuesta `{ success, status, message, data }` y debe retornarla. Útil para: manejo global de errores, refresh de token, logging.

```js
http.after((res) => {
  if (res.status === 401) redirectToLogin();
  if (res.status === 403) MTS.Toast.show({ message: 'Sin permisos', variant: 'warning' });
  return res;
});
```

🇬🇧 Interceptors can be chained — they execute in order of registration.
🇪🇸 Los interceptores se pueden encadenar — se ejecutan en orden de registro.

```js
http.before(addAuthToken);
http.before(addRequestId);
http.after(handleGlobalErrors);
http.after(logResponse);
```

---

## Retry

🇬🇧 Automatically retries on 5xx server errors with progressive backoff (500ms, 1000ms, 1500ms...).
🇪🇸 Reintenta automáticamente en errores 5xx con backoff progresivo (500ms, 1000ms, 1500ms...).

```js
const http = new MTS.HttpClient({
  baseUrl: 'https://api.miapp.com',
  retry:   3,
  onRetry: (res) => console.log(`Reintentando... intento ${res.attempt}`),
});
```

---

## Global instance / Instancia global

🇬🇧 Create one instance at app startup and reuse it everywhere.
🇪🇸 Crea una instancia al inicio de la app y reutilízala en cualquier parte.

```js
// 🇬🇧 App startup — configure once
// 🇪🇸 Al iniciar la app — configura una sola vez
MTS.HttpClient.create({
  baseUrl:   'https://api.miapp.com',
  timeout:   10000,
  retry:     2,
  debug:     false,
  headers:   { 'X-App': 'MiApp' },
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
  onTimeout: (res) => MTS.Toast.show({ message: 'Tiempo de espera agotado', variant: 'warning' }),
});

// 🇬🇧 In any module — no need to reconfigure
// 🇪🇸 En cualquier módulo — sin reconfigurar
const res = await MTS.HttpClient.instance.get('/users');
```

---

## upload()

🇬🇧 Uploads a file with real progress via `XMLHttpRequest`. Use with `MTS.FileUpload` to let the user select the file.
🇪🇸 Sube un archivo con progreso real via `XMLHttpRequest`. Usa junto a `MTS.FileUpload` para que el usuario seleccione el archivo.

```js
const fu   = new MTS.FileUpload('#zona-upload', { accept: 'image/*,.pdf', maxSize: 10 });
const http = new MTS.HttpClient({ baseUrl: 'https://api.miapp.com' });

const [file] = fu.getFiles();

const res = await http.upload('/files', file, {
  fieldName:  'archivo',               // 🇬🇧 form field name / 🇪🇸 nombre del campo en el form
  data:       { categoria: 'docs' },   // 🇬🇧 extra FormData fields / 🇪🇸 campos adicionales al FormData
  onProgress: (pct) => {
    barra.style.width  = pct + '%';
    label.textContent  = pct + '%';
  },
  onSuccess: (res) => MTS.Toast.show({ message: 'Subido correctamente', variant: 'success' }),
  onError:   (res) => MTS.Toast.show({ message: res.message, variant: 'danger' }),
});
```

### upload() options

| Option / Opción | Type / Tipo | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|---|
| `fieldName` | string | `'file'` | 🇬🇧 Form field name / 🇪🇸 Nombre del campo en el form |
| `data` | object | `null` | 🇬🇧 Extra fields appended to FormData / 🇪🇸 Campos adicionales al FormData |
| `headers` | object | `{}` | 🇬🇧 Extra headers / 🇪🇸 Headers extra |
| `onProgress` | function | `null` | 🇬🇧 `(percent: number) => void` |
| `onSuccess` | function | `null` | 🇬🇧 Called on success / 🇪🇸 Se llama al éxito |
| `onError` | function | `null` | 🇬🇧 Called on error / 🇪🇸 Se llama en error |

---

## download()

🇬🇧 Downloads a file as a Blob and returns a temporary URL to trigger the browser download.
🇪🇸 Descarga un archivo como Blob y retorna una URL temporal para disparar la descarga en el browser.

```js
const res = await http.download('/reports/export', 'reporte.pdf');

if (res.success) {
  const a = document.createElement('a');
  a.href     = res.data.url;
  a.download = res.data.filename;
  a.click();

  // 🇬🇧 Release memory when no longer needed
  // 🇪🇸 Liberar memoria cuando ya no se necesite
  URL.revokeObjectURL(res.data.url);
}
```

🇬🇧 `res.data` contains `{ url, blob, filename }`.
🇪🇸 `res.data` contiene `{ url, blob, filename }`.

---

## Events / Eventos

🇬🇧 Two ways to listen — constructor callbacks (recommended) or `.on()`.
🇪🇸 Dos formas de escuchar — callbacks del constructor (recomendado) o `.on()`.

```js
// 🇬🇧 Recommended — visible in IDE autocomplete
// 🇪🇸 Recomendado — visible en el autocompletado del IDE
const http = new MTS.HttpClient({
  onSuccess: (res) => {},
  onError:   (res) => {},
  onTimeout: (res) => {},
  onRetry:   (res) => {},
});

// 🇬🇧 Alternative — string event style
// 🇪🇸 Alternativa — estilo string event
http.on('success', (res) => {});
http.on('error',   (res) => {});
http.on('timeout', (res) => {});
http.on('retry',   (res) => {});
http.off('error', myHandler);
```

---

## Error codes / Códigos de error

| status | 🇬🇧 Cause / 🇪🇸 Causa |
|---|---|
| `4xx` | 🇬🇧 Client error — bad request, not found, unauthorized / 🇪🇸 Error del cliente — bad request, not found, sin autorización |
| `5xx` | 🇬🇧 Server error — triggers retry if configured / 🇪🇸 Error del servidor — dispara retry si está configurado |
| `408` | 🇬🇧 Timeout — request exceeded the configured limit / 🇪🇸 Timeout — la request superó el límite configurado |
| `0` | 🇬🇧 Network error — no connection or CORS / 🇪🇸 Error de red — sin conexión o CORS |
