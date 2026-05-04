/* ============================================================
   MATIOS UI — MTS.Browser  v1.0.0
   Utilidad universal de APIs del navegador.

   Unifica en una interfaz consistente todas las capacidades
   nativas del browser: protección, ubicación, notificaciones,
   portapapeles, pantalla, red, batería, dispositivo, etc.

   ⚠ Nota sobre protección:
   Las funciones de guard (contextMenu, textSelect, etc.) generan
   FRICCIÓN, no seguridad real. F12 y Ctrl+U no son bloqueables.
   Un usuario determinado siempre puede saltarlas.

   Uso:
     MTS.Browser.guard.contextMenu(true)
     const pos = await MTS.Browser.location.get()
     await MTS.Browser.notifications.request()
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Browser = (() => {

  /* ----------------------------------------------------------
     HELPERS INTERNOS
  ---------------------------------------------------------- */
  const _supported = (api) => api in navigator

  const _geoErrorMsg = (err) => {
    switch (err.code) {
      case 1: return 'Permiso de ubicación denegado'
      case 2: return 'Ubicación no disponible'
      case 3: return 'Tiempo de espera agotado'
      default: return err.message
    }
  }

  /* ----------------------------------------------------------
     🛡️  GUARD — protección de página
  ---------------------------------------------------------- */
  const guard = (() => {
    // _handlers[key] = { event, target, handler }
    const _handlers = {}

    const _on = (key, event, target, handler) => {
      if (_handlers[key]) return
      _handlers[key] = { event, target, handler }
      target.addEventListener(event, handler)
    }

    const _off = (key) => {
      if (!_handlers[key]) return
      const { event, target, handler } = _handlers[key]
      target.removeEventListener(event, handler)
      delete _handlers[key]
    }

    return {
      /* Bloquea el menú contextual del navegador */
      contextMenu(enable = true) {
        enable
          ? _on('contextmenu', 'contextmenu', document, e => e.preventDefault())
          : _off('contextmenu')
        return this
      },

      /* Bloquea la selección de texto */
      textSelect(enable = true) {
        document.body.style.userSelect       = enable ? 'none' : ''
        document.body.style.webkitUserSelect = enable ? 'none' : ''
        return this
      },

      /* Bloquea arrastrar imágenes y enlaces */
      dragImages(enable = true) {
        enable
          ? _on('dragImages', 'dragstart', document, e => e.preventDefault())
          : _off('dragImages')
        return this
      },

      /* Bloquea Ctrl+C / Cmd+C */
      copy(enable = true) {
        enable
          ? _on('copy', 'copy', document, e => e.preventDefault())
          : _off('copy')
        return this
      },

      /* Bloquea Ctrl+P / Cmd+P */
      print(enable = true) {
        enable
          ? _on('print', 'keydown', document, e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'p') e.preventDefault()
            })
          : _off('print')
        return this
      },

      /* Bloquea Ctrl+S / Cmd+S */
      save(enable = true) {
        enable
          ? _on('save', 'keydown', document, e => {
              if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault()
            })
          : _off('save')
        return this
      },

      /* Estado actual de cada guard */
      status() {
        return {
          contextMenu: 'contextmenu' in _handlers,
          textSelect:  document.body.style.userSelect === 'none',
          dragImages:  'dragImages' in _handlers,
          copy:        'copy' in _handlers,
          print:       'print' in _handlers,
          save:        'save' in _handlers,
        }
      },
    }
  })()

  /* ----------------------------------------------------------
     📍  LOCATION — geolocalización
  ---------------------------------------------------------- */
  const location = {
    isSupported() { return 'geolocation' in navigator },

    /* Obtiene la posición actual */
    get(options = {}) {
      if (!this.isSupported()) return Promise.reject(new Error('Geolocalización no soportada'))
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve({
            lat:       pos.coords.latitude,
            lng:       pos.coords.longitude,
            accuracy:  pos.coords.accuracy,
            altitude:  pos.coords.altitude,
            speed:     pos.coords.speed,
            heading:   pos.coords.heading,
            timestamp: pos.timestamp,
          }),
          err => reject(new Error(_geoErrorMsg(err))),
          {
            timeout:            options.timeout         ?? 10000,
            enableHighAccuracy: options.highAccuracy    ?? false,
            maximumAge:         options.maximumAge      ?? 0,
          }
        )
      })
    },

    /* Observa la posición en tiempo real. Retorna el watchId. */
    watch(callback, options = {}) {
      if (!this.isSupported()) throw new Error('Geolocalización no soportada')
      return navigator.geolocation.watchPosition(
        pos => callback(null, {
          lat:      pos.coords.latitude,
          lng:      pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
        err => callback(new Error(_geoErrorMsg(err))),
        {
          timeout:            options.timeout      ?? 10000,
          enableHighAccuracy: options.highAccuracy ?? false,
        }
      )
    },

    /* Detiene el watch */
    clearWatch(id) {
      navigator.geolocation.clearWatch(id)
    },
  }

  /* ----------------------------------------------------------
     🔔  NOTIFICATIONS — notificaciones del sistema
  ---------------------------------------------------------- */
  const notifications = {
    isSupported() { return 'Notification' in window },

    /* 'granted' | 'denied' | 'default' */
    getPermission() {
      return this.isSupported() ? Notification.permission : 'unsupported'
    },

    /* Pide permiso al usuario */
    async requestPermission() {
      if (!this.isSupported()) throw new Error('Notificaciones no soportadas')
      return Notification.requestPermission()
    },

    /* Envía una notificación. Pide permiso si aún no se otorgó. */
    async send(title, options = {}) {
      if (!this.isSupported()) throw new Error('Notificaciones no soportadas')
      if (Notification.permission !== 'granted') {
        const perm = await this.requestPermission()
        if (perm !== 'granted') throw new Error('Permiso de notificaciones denegado')
      }
      return new Notification(title, options)
    },
  }

  /* ----------------------------------------------------------
     📋  CLIPBOARD — portapapeles
  ---------------------------------------------------------- */
  const clipboard = {
    isSupported() { return 'clipboard' in navigator },

    /* Escribe texto en el portapapeles */
    async write(text) {
      if (!this.isSupported()) throw new Error('Clipboard API no soportada')
      await navigator.clipboard.writeText(text)
    },

    /* Lee texto del portapapeles */
    async read() {
      if (!this.isSupported()) throw new Error('Clipboard API no soportada')
      return navigator.clipboard.readText()
    },
  }

  /* ----------------------------------------------------------
     🖥️  FULLSCREEN — pantalla completa
  ---------------------------------------------------------- */
  const fullscreen = {
    isSupported() {
      return !!(
        document.fullscreenEnabled          ||
        document.webkitFullscreenEnabled    ||
        document.mozFullScreenEnabled       ||
        document.msFullscreenEnabled
      )
    },

    /* Activa pantalla completa en un elemento (default: documentElement) */
    async enter(element = document.documentElement) {
      if (!this.isSupported()) throw new Error('Fullscreen no soportado')
      const fn = element.requestFullscreen        ||
                 element.webkitRequestFullscreen  ||
                 element.mozRequestFullScreen     ||
                 element.msRequestFullscreen
      return fn?.call(element)
    },

    /* Sale de pantalla completa */
    async exit() {
      const fn = document.exitFullscreen        ||
                 document.webkitExitFullscreen  ||
                 document.mozCancelFullScreen   ||
                 document.msExitFullscreen
      return fn?.call(document)
    },

    /* Alterna entre pantalla completa y normal */
    async toggle(element) {
      return this.isActive() ? this.exit() : this.enter(element)
    },

    /* true si está en pantalla completa */
    isActive() {
      return !!(
        document.fullscreenElement         ||
        document.webkitFullscreenElement   ||
        document.mozFullScreenElement      ||
        document.msFullscreenElement
      )
    },

    /* Escucha cambios de estado */
    onChange(callback) {
      ;['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(ev => {
        document.addEventListener(ev, () => callback(this.isActive()))
      })
    },
  }

  /* ----------------------------------------------------------
     💡  WAKE LOCK — evitar que la pantalla se apague
  ---------------------------------------------------------- */
  const wakeLock = (() => {
    let _lock = null

    return {
      isSupported() { return 'wakeLock' in navigator },

      /* Activa el wake lock */
      async enable() {
        if (!this.isSupported()) throw new Error('Wake Lock no soportado')
        if (_lock) return
        _lock = await navigator.wakeLock.request('screen')
        _lock.addEventListener('release', () => { _lock = null })
      },

      /* Libera el wake lock */
      async disable() {
        await _lock?.release()
        _lock = null
      },

      /* true si está activo */
      isActive() { return _lock !== null && !_lock.released },
    }
  })()

  /* ----------------------------------------------------------
     🌐  NETWORK — estado de la red
  ---------------------------------------------------------- */
  const network = {
    /* true si el navegador detecta conexión */
    isOnline() { return navigator.onLine },

    /* Información de la conexión (No en todos los navegadores) */
    getConnection() {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (!conn) return null
      return {
        type:         conn.type         ?? null,   // 'wifi' | '4g' | '3g' | etc.
        effectiveType:conn.effectiveType ?? null,   // 'slow-2g' | '2g' | '3g' | '4g'
        downlink:     conn.downlink     ?? null,   // Mbps estimados
        rtt:          conn.rtt          ?? null,   // ms de latencia estimada
        saveData:     conn.saveData     ?? false,  // modo ahorro de datos
      }
    },

    /* Escucha cambios online/offline */
    onChange(callback) {
      window.addEventListener('online',  () => callback(true))
      window.addEventListener('offline', () => callback(false))
    },
  }

  /* ----------------------------------------------------------
     🔋  BATTERY — estado de la batería
  ---------------------------------------------------------- */
  const battery = {
    isSupported() { return 'getBattery' in navigator },

    /* Retorna info de batería */
    async get() {
      if (!this.isSupported()) throw new Error('Battery API no soportada')
      const b = await navigator.getBattery()
      return {
        level:          Math.round(b.level * 100),   // 0–100 %
        charging:       b.charging,
        chargingTime:   b.chargingTime,               // segundos (Infinity si no aplica)
        dischargingTime:b.dischargingTime,            // segundos hasta vacío
      }
    },

    /* Escucha cambios de batería */
    async onChange(callback) {
      if (!this.isSupported()) throw new Error('Battery API no soportada')
      const b = await navigator.getBattery()
      ;['chargingchange', 'levelchange', 'chargingtimechange', 'dischargingtimechange'].forEach(ev => {
        b.addEventListener(ev, async () => callback(await this.get()))
      })
    },
  }

  /* ----------------------------------------------------------
     📳  VIBRATION — vibración del dispositivo
  ---------------------------------------------------------- */
  const vibration = {
    isSupported() { return 'vibrate' in navigator },

    /* Vibra con el patrón dado. Ej: 200 ms o [200, 100, 200] */
    vibrate(pattern = 200) {
      if (!this.isSupported()) throw new Error('Vibración no soportada')
      return navigator.vibrate(pattern)
    },

    /* Detiene la vibración */
    stop() { navigator.vibrate?.(0) },
  }

  /* ----------------------------------------------------------
     📤  SHARE — compartir nativo del sistema operativo
  ---------------------------------------------------------- */
  const share = {
    isSupported() { return 'share' in navigator },

    /* Abre el diálogo nativo de compartir */
    async share(data = {}) {
      if (!this.isSupported()) throw new Error('Web Share API no soportada')
      // data: { title, text, url, files }
      return navigator.share(data)
    },

    /* Verifica si el tipo de datos es compartible */
    canShare(data) {
      return this.isSupported() && navigator.canShare?.(data) !== false
    },
  }

  /* ----------------------------------------------------------
     👁️  VISIBILITY — visibilidad de la pestaña
  ---------------------------------------------------------- */
  const visibility = {
    /* true si la pestaña está visible y activa */
    isVisible() { return document.visibilityState === 'visible' },

    /* Escucha cambios de visibilidad */
    onChange(callback) {
      document.addEventListener('visibilitychange', () => {
        callback(this.isVisible())
      })
    },
  }

  /* ----------------------------------------------------------
     📷  MEDIA — cámara, micrófono y pantalla
  ---------------------------------------------------------- */
  const media = {
    isSupported() { return !!navigator.mediaDevices?.getUserMedia },

    /* Solicita acceso a la cámara */
    async requestCamera(options = {}) {
      if (!this.isSupported()) throw new Error('Media Devices no soportado')
      return navigator.mediaDevices.getUserMedia({
        video: options.video ?? true,
        audio: false,
      })
    },

    /* Solicita acceso al micrófono */
    async requestMicrophone() {
      if (!this.isSupported()) throw new Error('Media Devices no soportado')
      return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    },

    /* Solicita compartir pantalla */
    async requestScreen() {
      if (!navigator.mediaDevices?.getDisplayMedia) throw new Error('Screen Capture no soportado')
      return navigator.mediaDevices.getDisplayMedia({ video: true })
    },

    /* Detiene todos los tracks de un stream */
    stop(stream) {
      stream?.getTracks().forEach(t => t.stop())
    },

    /* Lista los dispositivos disponibles */
    async getDevices() {
      if (!this.isSupported()) throw new Error('Media Devices no soportado')
      const devices = await navigator.mediaDevices.enumerateDevices()
      return {
        cameras:      devices.filter(d => d.kind === 'videoinput'),
        microphones:  devices.filter(d => d.kind === 'audioinput'),
        speakers:     devices.filter(d => d.kind === 'audiooutput'),
      }
    },
  }

  /* ----------------------------------------------------------
     🧭  ORIENTATION — orientación del dispositivo
  ---------------------------------------------------------- */
  const orientation = {
    isSupported() { return 'DeviceOrientationEvent' in window },

    /* Escucha cambios de orientación (alpha, beta, gamma) */
    watch(callback) {
      if (!this.isSupported()) throw new Error('Device Orientation no soportado')
      const handler = (e) => callback({
        alpha: Math.round(e.alpha ?? 0),   // rotación Z — 0–360°
        beta:  Math.round(e.beta  ?? 0),   // inclinación frontal — -180 a 180°
        gamma: Math.round(e.gamma ?? 0),   // inclinación lateral — -90 a 90°
      })
      window.addEventListener('deviceorientation', handler)
      return () => window.removeEventListener('deviceorientation', handler)
    },
  }

  /* ----------------------------------------------------------
     💾  STORAGE — localStorage / sessionStorage simplificado
  ---------------------------------------------------------- */
  const _makeStorage = (store) => ({
    get(key, fallback = null) {
      try { const v = store.getItem(key); return v !== null ? JSON.parse(v) : fallback }
      catch { return fallback }
    },
    set(key, value) {
      try { store.setItem(key, JSON.stringify(value)); return true }
      catch { return false }
    },
    remove(key)  { store.removeItem(key) },
    clear()      { store.clear() },
    keys()       { return Object.keys(store) },
    getAll()     { return Object.fromEntries(Object.keys(store).map(k => [k, this.get(k)])) },
    size()       { return store.length },
  })

  const storage = {
    local:   _makeStorage(localStorage),
    session: _makeStorage(sessionStorage),

    /* Cuota de almacenamiento estimada */
    async quota() {
      if (!navigator.storage?.estimate) return null
      const { usage, quota } = await navigator.storage.estimate()
      return {
        used:      usage,
        total:     quota,
        usedMB:    +(usage  / 1024 / 1024).toFixed(2),
        totalMB:   +(quota  / 1024 / 1024).toFixed(2),
        usedPct:   +(usage / quota * 100).toFixed(1),
      }
    },
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */
  return {
    guard,
    location,
    notifications,
    clipboard,
    fullscreen,
    wakeLock,
    network,
    battery,
    vibration,
    share,
    visibility,
    media,
    orientation,
    storage,
  }

})()
