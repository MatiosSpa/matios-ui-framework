# MTS.Browser

Static utility that unifies the native browser APIs behind a consistent interface: page protection, geolocation, notifications, clipboard, fullscreen, network, battery, vibration, share, visibility, media, orientation and storage.

---

## Installation

```html
<script src="utilities/matios-ui-browser/matios-ui-browser.js"></script>
```

No CSS required.

---

## guard — page protection

Adds friction for the user, not real security. F12 and Ctrl+U cannot be blocked.

```js
MTS.Browser.guard.contextMenu(true)  // blocks the context menu
MTS.Browser.guard.textSelect(true)   // blocks text selection
MTS.Browser.guard.dragImages(true)   // blocks dragging images and links
MTS.Browser.guard.copy(true)         // blocks Ctrl+C / Cmd+C
MTS.Browser.guard.print(true)        // blocks Ctrl+P / Cmd+P
MTS.Browser.guard.save(true)         // blocks Ctrl+S / Cmd+S

// Passing false disables the guard
MTS.Browser.guard.contextMenu(false)

// Current state
const state = MTS.Browser.guard.status();
// → { contextMenu, textSelect, dragImages, copy, print, save }
```

---

## location — geolocation

```js
MTS.Browser.location.isSupported() // → boolean

// Current position
MTS.Browser.location.get({ timeout: 10000, highAccuracy: false })
  .then(function(pos) {
    console.log(pos.lat, pos.lng, pos.accuracy);
  })
  .catch(function(err) { console.error(err.message); });

// Real-time watch — returns a watchId
const id = MTS.Browser.location.watch(function(err, pos) {
  if (err) { console.error(err.message); return; }
  console.log(pos.lat, pos.lng);
});

MTS.Browser.location.clearWatch(id);
```

---

## notifications — system notifications

```js
MTS.Browser.notifications.isSupported()    // → boolean
MTS.Browser.notifications.getPermission()  // → 'granted' | 'denied' | 'default'

await MTS.Browser.notifications.requestPermission(); // asks for permission

await MTS.Browser.notifications.send('New message', {
  body: 'You have 3 unread notifications',
  icon: '/icons/logo.png',
});
```

---

## clipboard

```js
MTS.Browser.clipboard.isSupported() // → boolean

await MTS.Browser.clipboard.write('Copied text');
const text = await MTS.Browser.clipboard.read();
```

---

## fullscreen

```js
MTS.Browser.fullscreen.isSupported() // → boolean
MTS.Browser.fullscreen.isActive()    // → boolean

await MTS.Browser.fullscreen.enter();          // enters fullscreen (documentElement)
await MTS.Browser.fullscreen.enter(myElement); // fullscreen on a specific element
await MTS.Browser.fullscreen.exit();
await MTS.Browser.fullscreen.toggle();

MTS.Browser.fullscreen.onChange(function(active) {
  console.log('Fullscreen:', active);
});
```

---

## wakeLock — keep the screen awake

```js
MTS.Browser.wakeLock.isSupported() // → boolean
MTS.Browser.wakeLock.isActive()    // → boolean

await MTS.Browser.wakeLock.enable();
await MTS.Browser.wakeLock.disable();
```

---

## network — network state

```js
MTS.Browser.network.isOnline()      // → boolean
MTS.Browser.network.getConnection() // → { type, effectiveType, downlink, rtt, saveData } | null

MTS.Browser.network.onChange(function(online) {
  console.log('Connection:', online ? 'online' : 'offline');
});
```

---

## battery

```js
MTS.Browser.battery.isSupported() // → boolean

const bat = await MTS.Browser.battery.get();
// → { level (0–100), charging, chargingTime, dischargingTime }

await MTS.Browser.battery.onChange(function(bat) {
  console.log(bat.level + '% – charging:', bat.charging);
});
```

---

## vibration — device vibration

```js
MTS.Browser.vibration.isSupported() // → boolean

MTS.Browser.vibration.vibrate(200)             // vibrates 200ms
MTS.Browser.vibration.vibrate([200, 100, 200]) // pattern: vibrate-pause-vibrate
MTS.Browser.vibration.stop()
```

---

## share — native OS share

```js
MTS.Browser.share.isSupported()          // → boolean
MTS.Browser.share.canShare({ url: '/' }) // → boolean

await MTS.Browser.share.share({
  title: 'Matios UI',
  text:  'UI component framework',
  url:   'https://matios.cl',
});
```

---

## visibility — tab visibility

```js
MTS.Browser.visibility.isVisible() // → boolean

MTS.Browser.visibility.onChange(function(visible) {
  if (!visible) pauseVideo();
  else resumeVideo();
});
```

---

## media — camera, microphone and screen

```js
MTS.Browser.media.isSupported() // → boolean

const cameraStream = await MTS.Browser.media.requestCamera();
const micStream    = await MTS.Browser.media.requestMicrophone();
const screenStream = await MTS.Browser.media.requestScreen();

MTS.Browser.media.stop(cameraStream); // stops all tracks

const devices = await MTS.Browser.media.getDevices();
// → { cameras, microphones, speakers }
```

---

## orientation — device orientation

```js
MTS.Browser.orientation.isSupported() // → boolean

const stop = MTS.Browser.orientation.watch(function(ori) {
  console.log(ori.alpha, ori.beta, ori.gamma); // degrees
});

stop(); // stops listening
```

---

## storage — localStorage / sessionStorage

```js
// local → localStorage | session → sessionStorage
MTS.Browser.storage.local.get('key', defaultValue)
MTS.Browser.storage.local.set('key', { data: true })
MTS.Browser.storage.local.remove('key')
MTS.Browser.storage.local.clear()
MTS.Browser.storage.local.keys()
MTS.Browser.storage.local.getAll()
MTS.Browser.storage.local.size()

// Estimated storage quota
const quota = await MTS.Browser.storage.quota();
// → { used, total, usedMB, totalMB, usedPct }
```

`get()` and `set()` serialize/deserialize JSON automatically.

---

## Notes

- Every sub-module exposes `isSupported()` — check it before using in contexts where the API may not be available.
- `guard` adds friction, not real security. A determined user can always bypass it.
- `captureFetch` and `captureConsole` are not part of this module — see `MTS.DiagnosticsPanel`.

---

## Changelog

### Initial
- Documentation created from scratch (standard template).
