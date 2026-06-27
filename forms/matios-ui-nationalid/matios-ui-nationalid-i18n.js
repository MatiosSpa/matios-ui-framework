/* ============================================================
   MATIOS UI — matios-ui-nationalid-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.NationalId
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.NationalId': {
      invalid: '{doc} inválido',
      required: 'Requerido',
      demo: {
        subtitleHtml: 'Formatea y valida IDs legales por país (RUN·RUT, CPF·CNPJ, CUIT, DNI·NIE…) mientras se tipea. Núcleo puro validable + componente <code>.Input</code>.',
        s1Title:   '1 — Por país (formatea + valida al tipear)',
        s2Title:   '2 — Países disponibles',
        valid:     'Válido',
        invalid:   'Inválido',
        empty:     '— ingresa un ID —',
        lblCL:     'Chile · RUT',
        lblBR:     'Brasil · CPF / CNPJ (auto)',
        lblAR:     'Argentina · CUIT',
        lblES:     'España · DNI / NIE',
        errCL:     'RUT inválido',
        countriesNote: 'Registry extensible: agrega más con <code>MTS.NationalId.registerCountry(code, def)</code>.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.NationalId': {
      invalid: 'Invalid {doc}',
      required: 'Required',
      demo: {
        subtitleHtml: 'Formats and validates legal IDs per country (RUN·RUT, CPF·CNPJ, CUIT, DNI·NIE…) as you type. Pure validatable core + <code>.Input</code> component.',
        s1Title:   '1 — By country (formats + validates as you type)',
        s2Title:   '2 — Available countries',
        valid:     'Valid',
        invalid:   'Invalid',
        empty:     '— enter an ID —',
        lblCL:     'Chile · RUT',
        lblBR:     'Brazil · CPF / CNPJ (auto)',
        lblAR:     'Argentina · CUIT',
        lblES:     'Spain · DNI / NIE',
        errCL:     'Invalid RUT',
        countriesNote: 'Extensible registry: add more with <code>MTS.NationalId.registerCountry(code, def)</code>.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.NationalId': {
      invalid: '{doc} inválido',
      required: 'Obrigatório',
      demo: {
        subtitleHtml: 'Formata e valida IDs legais por país (RUN·RUT, CPF·CNPJ, CUIT, DNI·NIE…) enquanto se digita. Núcleo puro validável + componente <code>.Input</code>.',
        s1Title:   '1 — Por país (formata + valida ao digitar)',
        s2Title:   '2 — Países disponíveis',
        valid:     'Válido',
        invalid:   'Inválido',
        empty:     '— digite um ID —',
        lblCL:     'Chile · RUT',
        lblBR:     'Brasil · CPF / CNPJ (auto)',
        lblAR:     'Argentina · CUIT',
        lblES:     'Espanha · DNI / NIE',
        errCL:     'RUT inválido',
        countriesNote: 'Registry extensível: adicione mais com <code>MTS.NationalId.registerCountry(code, def)</code>.'
      }
    }
  });

})(window);
