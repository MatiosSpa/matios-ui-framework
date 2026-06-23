/* ============================================================
   MATIOS UI — matios-ui-numberinput-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.NumberInput
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.NumberInput': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:            'Input numérico con botones +/−, min/max, step y formatos de moneda y porcentaje.',
        s1Title:             '1 — Básico con min/max/step',
        s2Title:             '2 — Formatos: moneda y porcentaje',
        s3Title:             '3 — Prefix y Suffix',
        s4Title:             '4 — Tamaños',
        s5Title:             '5 — API programática',
        s6Title:             '6 — HTML declarativo + enhancement',

        labelQuantity:       'Cantidad',
        labelStep5:          'Cada 5 unidades',
        labelDecimals:       'Con 2 decimales',
        resBasic:            '— interactúa con los inputs —',
        echoBasic:           'valor: ',
        echoFormatted:       ' | formateado: ',

        labelPriceClp:       'Precio (CLP)',
        labelPriceUsd:       'Precio (USD)',
        labelDiscount:       'Descuento',
        resFormat:           '— cambia los valores —',
        echoPercent:         'Porcentaje → ',

        labelAmount:         'Monto',
        labelWeight:         'Peso',
        labelTemperature:    'Temperatura',

        sizeSm:              'Tamaño SM',
        sizeMd:              'Tamaño MD',
        sizeLg:              'Tamaño LG',

        labelPoints:         'Puntos acumulados',
        hintPoints:          'Mínimo 0, máximo 100',
        resApi:              '— usa los botones para llamar la API —',
        apiErrorMsg:         'Valor inválido',
        apiExternalError:    'Mensaje de error externo',
        echoGetValue:        'getValue() → ',
        echoSetValue:        'setValue(0) aplicado',
        echoSetError:        'setError() aplicado',
        echoClearError:      'clearError() aplicado',
        echoDisable:         'disable() aplicado',
        echoEnable:          'enable() aplicado',
        echoFocus:           'focus() aplicado',

        labelDeclHtml:       'HTML declarativo',
        labelEnhanceHtml:    'HTML declarativo + enhancement',
        labelUnits:          'Unidades',
        hintEnhance:         'Matios UI potencia el HTML base',
        resEnhance:          '— cambia el valor para ver el enhancement —'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.NumberInput': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:            'Number input with +/− buttons, min/max, step and currency and percentage formats.',
        s1Title:             '1 — Basic with min/max/step',
        s2Title:             '2 — Formats: currency and percentage',
        s3Title:             '3 — Prefix and Suffix',
        s4Title:             '4 — Sizes',
        s5Title:             '5 — Programmatic API',
        s6Title:             '6 — Declarative HTML + enhancement',

        labelQuantity:       'Quantity',
        labelStep5:          'Every 5 units',
        labelDecimals:       'With 2 decimals',
        resBasic:            '— interact with the inputs —',
        echoBasic:           'value: ',
        echoFormatted:       ' | formatted: ',

        labelPriceClp:       'Price (CLP)',
        labelPriceUsd:       'Price (USD)',
        labelDiscount:       'Discount',
        resFormat:           '— change the values —',
        echoPercent:         'Percentage → ',

        labelAmount:         'Amount',
        labelWeight:         'Weight',
        labelTemperature:    'Temperature',

        sizeSm:              'Size SM',
        sizeMd:              'Size MD',
        sizeLg:              'Size LG',

        labelPoints:         'Accumulated points',
        hintPoints:          'Minimum 0, maximum 100',
        resApi:              '— use the buttons to call the API —',
        apiErrorMsg:         'Invalid value',
        apiExternalError:    'External error message',
        echoGetValue:        'getValue() → ',
        echoSetValue:        'setValue(0) applied',
        echoSetError:        'setError() applied',
        echoClearError:      'clearError() applied',
        echoDisable:         'disable() applied',
        echoEnable:          'enable() applied',
        echoFocus:           'focus() applied',

        labelDeclHtml:       'Declarative HTML',
        labelEnhanceHtml:    'Declarative HTML + enhancement',
        labelUnits:          'Units',
        hintEnhance:         'Matios UI enhances the base HTML',
        resEnhance:          '— change the value to see the enhancement —'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.NumberInput': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:            'Input numérico com botões +/−, min/max, step e formatos de moeda e porcentagem.',
        s1Title:             '1 — Básico com min/max/step',
        s2Title:             '2 — Formatos: moeda e porcentagem',
        s3Title:             '3 — Prefix e Suffix',
        s4Title:             '4 — Tamanhos',
        s5Title:             '5 — API programática',
        s6Title:             '6 — HTML declarativo + enhancement',

        labelQuantity:       'Quantidade',
        labelStep5:          'A cada 5 unidades',
        labelDecimals:       'Com 2 casas decimais',
        resBasic:            '— interaja com os inputs —',
        echoBasic:           'valor: ',
        echoFormatted:       ' | formatado: ',

        labelPriceClp:       'Preço (CLP)',
        labelPriceUsd:       'Preço (USD)',
        labelDiscount:       'Desconto',
        resFormat:           '— altere os valores —',
        echoPercent:         'Porcentagem → ',

        labelAmount:         'Valor',
        labelWeight:         'Peso',
        labelTemperature:    'Temperatura',

        sizeSm:              'Tamanho SM',
        sizeMd:              'Tamanho MD',
        sizeLg:              'Tamanho LG',

        labelPoints:         'Pontos acumulados',
        hintPoints:          'Mínimo 0, máximo 100',
        resApi:              '— use os botões para chamar a API —',
        apiErrorMsg:         'Valor inválido',
        apiExternalError:    'Mensagem de erro externa',
        echoGetValue:        'getValue() → ',
        echoSetValue:        'setValue(0) aplicado',
        echoSetError:        'setError() aplicado',
        echoClearError:      'clearError() aplicado',
        echoDisable:         'disable() aplicado',
        echoEnable:          'enable() aplicado',
        echoFocus:           'focus() aplicado',

        labelDeclHtml:       'HTML declarativo',
        labelEnhanceHtml:    'HTML declarativo + enhancement',
        labelUnits:          'Unidades',
        hintEnhance:         'Matios UI potencializa o HTML base',
        resEnhance:          '— altere o valor para ver o enhancement —'
      }
    }
  });

})(window);
