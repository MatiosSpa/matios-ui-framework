/* ==========================================================================
   Matios UI Framework — Base JS
   Utilidades compartidas y mixins para componentes MTS.
   Cargado antes de los componentes que lo requieran.
   ========================================================================== */

(function (global) {
    'use strict';

    global.MTS = global.MTS || {};

    /* -----------------------------------------------------------------------
       MTS._defineEvents(instance, eventNames, opts)
       -----------------------------------------------------------------------
       Mixin de gestión de eventos para componentes MTS.

       Genera en `instance`:
         · instance.onXxxx(handler) → devuelve dispose()
         · instance._emit(name, payload)
         · instance._disposeAllListeners()

       Uso en el constructor de un componente:
         MTS._defineEvents(this, ['load', 'cardMove', 'cardDelete'], options);

       Eso genera:
         · this.onLoad(fn)        → devuelve dispose()
         · this.onCardMove(fn)    → devuelve dispose()
         · this.onCardDelete(fn)  → devuelve dispose()

       Si `opts.onLoad`, `opts.onCardMove`, etc. existen como funciones,
       se registran automáticamente como primer subscriber.

       Multiple subscribers:
         const disposeA = comp.onLoad(handlerA);
         const disposeB = comp.onLoad(handlerB);
         disposeA(); // solo desregistra A

       Once pattern:
         const off = comp.onLoad(function(e) { handle(e); off(); });

       En destroy() del componente: this._disposeAllListeners();
    ----------------------------------------------------------------------- */

    MTS._defineEvents = function (instance, eventNames, opts) {
        instance._listeners = instance._listeners || {};

        eventNames.forEach(function (name) {
            instance._listeners[name] = [];

            var method = 'on' + name.charAt(0).toUpperCase() + name.slice(1);

            instance[method] = function (handler) {
                if (typeof handler !== 'function') {
                    return function () {};
                }
                instance._listeners[name].push(handler);
                return function () {
                    var idx = instance._listeners[name].indexOf(handler);
                    if (idx !== -1) {
                        instance._listeners[name].splice(idx, 1);
                    }
                };
            };

            if (opts && typeof opts[method] === 'function') {
                instance[method](opts[method]);
            }
        });

        instance._emit = function (name, payload) {
            var list = instance._listeners[name];
            if (!list || !list.length) { return; }
            list.slice().forEach(function (fn) {
                fn(payload);
            });
        };

        instance._disposeAllListeners = function () {
            Object.keys(instance._listeners).forEach(function (k) {
                instance._listeners[k] = [];
            });
        };
    };

}(typeof window !== 'undefined' ? window : this));
