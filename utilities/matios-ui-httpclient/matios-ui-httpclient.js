/* ============================================================
   MATIOS UI — matios-ui-httpclient.js  v1.0.0

   HTTP client con contrato de respuesta consistente.
   Nunca rechaza — siempre resuelve con { success, status, message, data }.

   Uso mínimo:
     const http = new MTS.HttpClient({ baseUrl: 'https://api.miapp.com' });
     const res  = await http.get('/users');
     if (res.success) console.log(res.data);

   ============================================================ */

window.MTS = window.MTS || {};

MTS.HttpClient = class MtsHttpClient {

  /* ──────────────────────────────────────────
     CONSTRUCTOR
  ────────────────────────────────────────── */
  constructor(options = {}) {

    /* Base config */
    this._baseUrl  = (options.baseUrl  || '').replace(/\/$/, '');
    this._timeout  = options.timeout  ?? 15000;
    this._retry    = options.retry    ?? 0;
    this._debug    = options.debug    ?? false;

    /* Headers base — nunca se modifican directamente */
    this._baseHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    /* Callbacks del constructor */
    this._onSuccess = options.onSuccess || null;
    this._onError   = options.onError   || null;
    this._onTimeout = options.onTimeout || null;
    this._onRetry   = options.onRetry   || null;

    /* Interceptores */
    this._interceptorsBefore = [];
    this._interceptorsAfter  = [];

    /* Listeners estilo .on() */
    this._listeners = {};

    /* Aplicar interceptores del constructor si vienen */
    if (typeof options.before === 'function') this.before(options.before);
    if (typeof options.after  === 'function') this.after(options.after);
  }

  /* ──────────────────────────────────────────
     i18n — mensajes por defecto del contrato de respuesta
  ────────────────────────────────────────── */
  _t(key, fallback) {
    try {
      const ns = (window.MTS && MTS.getString) ? MTS.getString()['MTS.HttpClient'] : null;
      const m = ns && ns.messages;
      if (m && m[key] != null) return m[key];
    } catch (e) {}
    return fallback;
  }

  /* ──────────────────────────────────────────
     SHORTCUTS PÚBLICOS
  ────────────────────────────────────────── */
  get(endpoint, options = {})           { return this._request('GET',    endpoint, null,   options); }
  post(endpoint, data, options = {})    { return this._request('POST',   endpoint, data,   options); }
  put(endpoint, data, options = {})     { return this._request('PUT',    endpoint, data,   options); }
  patch(endpoint, data, options = {})   { return this._request('PATCH',  endpoint, data,   options); }
  delete(endpoint, options = {})        { return this._request('DELETE', endpoint, null,   options); }

  /* ──────────────────────────────────────────
     INTERCEPTORES
  ────────────────────────────────────────── */

  /**
   * Agrega un interceptor pre-request.
   * Recibe el objeto de configuración del request y debe retornarlo (modificado o no).
   *
   * @example
   * http.before((req) => {
   *   req.headers['Authorization'] = 'Bearer ' + getToken();
   *   return req;
   * });
   */
  before(fn) {
    if (typeof fn === 'function') this._interceptorsBefore.push(fn);
    return this;
  }

  /**
   * Agrega un interceptor post-response.
   * Recibe el objeto de respuesta { success, status, message, data } y debe retornarlo.
   *
   * @example
   * http.after((res) => {
   *   if (res.status === 401) logout();
   *   return res;
   * });
   */
  after(fn) {
    if (typeof fn === 'function') this._interceptorsAfter.push(fn);
    return this;
  }

  /* ──────────────────────────────────────────
     EVENTOS ESTILO .on()
  ────────────────────────────────────────── */
  on(event, cb)  {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    return this;
  }
  off(event, cb) {
    this._listeners[event] = (this._listeners[event] || []).filter(f => f !== cb);
    return this;
  }

  /* ──────────────────────────────────────────
     UPLOAD CON PROGRESO
  ────────────────────────────────────────── */

  /**
   * Sube un archivo con progreso real via XMLHttpRequest.
   *
   * @param {string}   endpoint
   * @param {File}     file
   * @param {object}   options
   * @param {string}   options.fieldName   - Nombre del campo en el form. Default: 'file'
   * @param {object}   options.data        - Campos adicionales al FormData
   * @param {object}   options.headers     - Headers extra para esta request
   * @param {function} options.onProgress  - (percent: number) => void
   * @param {function} options.onSuccess   - (res) => void
   * @param {function} options.onError     - (res) => void
   *
   * @returns {Promise<{ success, status, message, data }>}
   *
   * @example
   * const res = await http.upload('/files', file, {
   *   onProgress: (pct) => console.log(pct + '%'),
   * });
   */
  upload(endpoint, file, options = {}) {
    return new Promise((resolve) => {
      const url       = this._buildUrl(endpoint);
      const fieldName = options.fieldName || 'file';
      const formData  = new FormData();
      formData.append(fieldName, file);

      /* Campos adicionales */
      if (options.data && typeof options.data === 'object') {
        Object.entries(options.data).forEach(([k, v]) => formData.append(k, v));
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      /* Headers — no incluir Content-Type, el browser lo setea con el boundary */
      const headers = { ...this._baseHeaders, ...(options.headers || {}) };
      delete headers['Content-Type'];
      Object.entries(headers).forEach(([k, v]) => {
        if (k !== 'Content-Type') xhr.setRequestHeader(k, v);
      });

      /* Progreso de upload */
      if (typeof options.onProgress === 'function') {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            options.onProgress(pct);
          }
        });
      }

      xhr.addEventListener('load', () => {
        let parsed;
        try   { parsed = JSON.parse(xhr.responseText); }
        catch { parsed = { Message: xhr.responseText || `Error: ${xhr.status}` }; }

        const ok = xhr.status >= 200 && xhr.status < 300;
        const res = ok
          ? { success: true,  status: xhr.status, message: null, data: parsed }
          : { success: false, status: xhr.status, message: parsed.Message || parsed.message || this._t('unknownError', 'Unknown error'), data: null };

        this._log(ok ? 'success' : 'error', 'POST (upload)', url, res);
        this._fireCallbacks(ok ? 'success' : 'error', res, options);
        resolve(res);
      });

      xhr.addEventListener('error', () => {
        const res = { success: false, status: 0, message: this._t('networkError', 'Network error'), data: null };
        this._fireCallbacks('error', res, options);
        resolve(res);
      });

      xhr.send(formData);
    });
  }

  /**
   * Descarga un archivo como Blob y retorna su URL temporal.
   * Útil para PDFs, imágenes, Excel, etc.
   *
   * @param {string} endpoint
   * @param {string} filename  - Nombre sugerido para guardar
   * @param {object} options
   *
   * @returns {Promise<{ success, status, message, data: { url, blob, filename } }>}
   *
   * @example
   * const res = await http.download('/reports/export', 'reporte.pdf');
   * if (res.success) {
   *   const a = document.createElement('a');
   *   a.href = res.data.url; a.download = res.data.filename; a.click();
   * }
   */
  async download(endpoint, filename = 'archivo', options = {}) {
    const url = this._buildUrl(endpoint);
    let reqConfig = { method: 'GET', headers: { ...this._baseHeaders, ...(options.headers || {}) } };
    reqConfig = await this._runBeforeInterceptors(reqConfig);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeout ?? this._timeout);
      const response = await fetch(url, { ...reqConfig, signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        const res = { success: false, status: response.status, message: this._t('requestFailed', 'Request failed') + ': ' + response.status, data: null };
        this._fireCallbacks('error', res, options);
        return res;
      }

      const blob    = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const res     = { success: true, status: response.status, message: null, data: { url: blobUrl, blob, filename } };
      this._fireCallbacks('success', res, options);
      return res;

    } catch (err) {
      const isTimeout = err.name === 'AbortError';
      const res = { success: false, status: isTimeout ? 408 : 0, message: isTimeout ? this._t('timeout', 'Request timed out') : (err.message || this._t('networkError', 'Network error')), data: null };
      this._fireCallbacks(isTimeout ? 'timeout' : 'error', res, options);
      return res;
    }
  }

  /* ──────────────────────────────────────────
     REQUEST INTERNO
  ────────────────────────────────────────── */
  async _request(method, endpoint, data = null, options = {}, attempt = 1) {
    const url = this._buildUrl(endpoint, options.params);

    /* Construir config del request */
    let reqConfig = {
      method,
      headers: { ...this._baseHeaders, ...(options.headers || {}) },
    };

    /* Body — POST, PUT, PATCH */
    if (data !== null && ['POST', 'PUT', 'PATCH'].includes(method)) {
      reqConfig.body = JSON.stringify(data);
    }

    /* Correr interceptores before */
    reqConfig = await this._runBeforeInterceptors(reqConfig);

    this._log('request', method, url, { attempt });

    try {
      /* Timeout via AbortController */
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeout ?? this._timeout);

      const response = await fetch(url, { ...reqConfig, signal: controller.signal });
      clearTimeout(timer);

      /* Respuesta no exitosa */
      if (!response.ok) {
        const text = await response.text();
        let json;
        try   { json = JSON.parse(text); }
        catch { json = { Message: text || `Error: ${response.status} ${response.statusText}` }; }

        const res = {
          success: false,
          status:  response.status,
          message: json.Message || json.message || json.error || this._t('unknownError', 'Unknown error'),
          data:    null,
        };

        /* Retry en errores de servidor (5xx) */
        const maxRetry = options.retry ?? this._retry;
        if (attempt <= maxRetry && response.status >= 500) {
          this._log('retry', method, url, { attempt, maxRetry });
          this._fireCallbacks('retry', { ...res, attempt }, options);
          await this._wait(attempt * 500);
          return this._request(method, endpoint, data, options, attempt + 1);
        }

        const finalRes = await this._runAfterInterceptors(res);
        this._log('error', method, url, finalRes);
        this._fireCallbacks('error', finalRes, options);
        return finalRes;
      }

      /* Respuesta exitosa — parsear JSON si hay contenido */
      let resData = null;
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        resData = await response.json();
      } else if (response.status !== 204) {
        resData = await response.text();
      }

      const res = {
        success: true,
        status:  response.status,
        message: null,
        data:    resData,
      };

      const finalRes = await this._runAfterInterceptors(res);
      this._log('success', method, url, finalRes);
      this._fireCallbacks('success', finalRes, options);
      return finalRes;

    } catch (err) {
      /* Timeout */
      if (err.name === 'AbortError') {
        const res = { success: false, status: 408, message: this._t('timeout', 'Request timed out'), data: null };
        const finalRes = await this._runAfterInterceptors(res);
        this._log('timeout', method, url, finalRes);
        this._fireCallbacks('timeout', finalRes, options);
        return finalRes;
      }

      /* Error de red u otro */
      const res = { success: false, status: 0, message: err.message || this._t('networkError', 'Network error'), data: null };
      const finalRes = await this._runAfterInterceptors(res);
      this._log('error', method, url, finalRes);
      this._fireCallbacks('error', finalRes, options);
      return finalRes;
    }
  }

  /* ──────────────────────────────────────────
     INTERNOS
  ────────────────────────────────────────── */

  _buildUrl(endpoint, params = null) {
    /* Sanitizar endpoint */
    const clean = '/' + (endpoint || '').replace(/^\/+/, '');
    let url = this._baseUrl + clean;

    if (params && typeof params === 'object') {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
      ).toString();
      if (qs) url += '?' + qs;
    }
    return url;
  }

  async _runBeforeInterceptors(reqConfig) {
    let cfg = { ...reqConfig };
    for (const fn of this._interceptorsBefore) {
      try { cfg = (await fn(cfg)) || cfg; } catch(e) { this._log('interceptor-error', 'before', '', e); }
    }
    return cfg;
  }

  async _runAfterInterceptors(res) {
    let r = { ...res };
    for (const fn of this._interceptorsAfter) {
      try { r = (await fn(r)) || r; } catch(e) { this._log('interceptor-error', 'after', '', e); }
    }
    return r;
  }

  _fireCallbacks(event, res, options = {}) {
    /* 1. Callback del constructor */
    const cbMap = {
      success: this._onSuccess,
      error:   this._onError,
      timeout: this._onTimeout,
      retry:   this._onRetry,
    };
    if (cbMap[event]) try { cbMap[event](res); } catch(e) {}

    /* 2. Callback del constructor de options (por request) */
    const optCbMap = {
      success: options.onSuccess,
      error:   options.onError,
      timeout: options.onTimeout,
      retry:   options.onRetry,
    };
    if (optCbMap[event]) try { optCbMap[event](res); } catch(e) {}

    /* 3. Listeners .on() */
    (this._listeners[event] || []).forEach(fn => { try { fn(res); } catch(e) {} });
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  _log(type, method, url, data) {
    if (!this._debug) return;
    const styles = {
      request: 'color:#6366f1;font-weight:700',
      success: 'color:#22c55e;font-weight:700',
      error:   'color:#ef4444;font-weight:700',
      timeout: 'color:#f59e0b;font-weight:700',
      retry:   'color:#f97316;font-weight:700',
    };
    console.groupCollapsed(`%c[MTS.HttpClient] ${type.toUpperCase()} ${method} ${url}`, styles[type] || '');
    console.log(data);
    console.groupEnd();
  }

  /* ──────────────────────────────────────────
     HELPER ESTÁTICO — instancia global
  ────────────────────────────────────────── */

  /**
   * Crea o retorna una instancia global reutilizable.
   *
   * @example
   * MTS.HttpClient.create({ baseUrl: 'https://api.miapp.com', debug: true });
   * const res = await MTS.HttpClient.instance.get('/users');
   */
  static create(options = {}) {
    MTS.HttpClient.instance = new MTS.HttpClient(options);
    return MTS.HttpClient.instance;
  }
};
