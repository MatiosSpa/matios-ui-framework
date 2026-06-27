/* ============================================================
   MATIOS UI — matios-ui-formlayout-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.FormLayout
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.FormLayout': {
      demo: {
        subtitle:        'Sistema de layout de formularios — CSS puro. Stack, grid, horizontal, inline, secciones y card.',
        s1Title:         '1 — Stack (por defecto)',
        s2Title:         '2 — Grid — 2 columnas',
        s3Title:         '3 — Grid — 3 columnas',
        s4Title:         '4 — Horizontal',
        s5Title:         '5 — Inline',
        s6Title:         '6 — Secciones',
        s7Title:         '7 — Form Card',

        labelFullName:   'Nombre completo',
        labelEmail:      'Correo electrónico',
        labelFirstName:  'Nombre',
        labelLastName:   'Apellido',
        labelAddress:    'Dirección',
        labelStreet:     'Calle',
        labelCity:       'Ciudad',
        labelZip:        'Código postal',
        labelProduct:    'Producto',
        labelSku:        'SKU',
        labelPrice:      'Precio',
        labelDescription:'Descripción',
        labelPassword:   'Contraseña',
        labelRole:       'Rol',
        labelSearch:     'Buscar',
        labelStatus:     'Estado',
        labelUsername:   'Nombre de usuario',

        phName:          'Juan Pérez',
        phEmailCompany:  'juan@empresa.com',
        phFirst:         'Juan',
        phLast:          'Pérez',
        phStreet:        'Calle Principal 123',
        phCity:          'Santiago',
        phZip:           '12345',
        phProduct:       'Nombre del producto',
        phSku:           'ABC-001',
        phPrice:         '$0.00',
        phDescription:   'Descripción del producto...',
        phEmailUser:     'usuario@ejemplo.com',
        phPassword:      'Mínimo 8 caracteres',
        phRole:          'Admin',
        phSearch:        'Nombre o correo...',
        phStatusAll:     'Todos',
        phUsername:      'juanperez',

        hintConfirm:     'Enviaremos las confirmaciones aquí.',
        hintPassword:    'Mínimo 8 caracteres.',

        btnCancel:       'Cancelar',
        btnSave:         'Guardar',
        btnAddProduct:   'Agregar producto',
        btnSearch:       'Buscar',
        btnClear:        'Limpiar',
        btnCreate:       'Crear cuenta',

        sectPersonal:    'Datos personales',
        sectPersonalDesc:'Información básica del usuario.',
        sectAddress:     'Dirección',

        cardTitle:       'Nuevo usuario',
        cardSubtitle:    'Completa los datos para crear la cuenta.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.FormLayout': {
      demo: {
        subtitle:        'Form layout system — pure CSS. Stack, grid, horizontal, inline, sections and card.',
        s1Title:         '1 — Stack (default)',
        s2Title:         '2 — Grid — 2 columns',
        s3Title:         '3 — Grid — 3 columns',
        s4Title:         '4 — Horizontal',
        s5Title:         '5 — Inline',
        s6Title:         '6 — Sections',
        s7Title:         '7 — Form Card',

        labelFullName:   'Full name',
        labelEmail:      'Email',
        labelFirstName:  'First name',
        labelLastName:   'Last name',
        labelAddress:    'Address',
        labelStreet:     'Street',
        labelCity:       'City',
        labelZip:        'Zip code',
        labelProduct:    'Product',
        labelSku:        'SKU',
        labelPrice:      'Price',
        labelDescription:'Description',
        labelPassword:   'Password',
        labelRole:       'Role',
        labelSearch:     'Search',
        labelStatus:     'Status',
        labelUsername:   'Username',

        phName:          'John Doe',
        phEmailCompany:  'john@company.com',
        phFirst:         'John',
        phLast:          'Doe',
        phStreet:        'Main St. 123',
        phCity:          'Santiago',
        phZip:           '12345',
        phProduct:       'Product name',
        phSku:           'ABC-001',
        phPrice:         '$0.00',
        phDescription:   'Product description...',
        phEmailUser:     'user@example.com',
        phPassword:      'Min 8 characters',
        phRole:          'Admin',
        phSearch:        'Name or email...',
        phStatusAll:     'All',
        phUsername:      'johndoe',

        hintConfirm:     'We\'ll send confirmations here.',
        hintPassword:    'Minimum 8 characters.',

        btnCancel:       'Cancel',
        btnSave:         'Save',
        btnAddProduct:   'Add product',
        btnSearch:       'Search',
        btnClear:        'Clear',
        btnCreate:       'Create account',

        sectPersonal:    'Personal data',
        sectPersonalDesc:'Basic user information.',
        sectAddress:     'Address',

        cardTitle:       'New user',
        cardSubtitle:    'Fill in the details to create the account.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.FormLayout': {
      demo: {
        subtitle:        'Sistema de layout de formulários — CSS puro. Stack, grid, horizontal, inline, seções e card.',
        s1Title:         '1 — Stack (padrão)',
        s2Title:         '2 — Grid — 2 colunas',
        s3Title:         '3 — Grid — 3 colunas',
        s4Title:         '4 — Horizontal',
        s5Title:         '5 — Inline',
        s6Title:         '6 — Seções',
        s7Title:         '7 — Form Card',

        labelFullName:   'Nome completo',
        labelEmail:      'E-mail',
        labelFirstName:  'Nome',
        labelLastName:   'Sobrenome',
        labelAddress:    'Endereço',
        labelStreet:     'Rua',
        labelCity:       'Cidade',
        labelZip:        'CEP',
        labelProduct:    'Produto',
        labelSku:        'SKU',
        labelPrice:      'Preço',
        labelDescription:'Descrição',
        labelPassword:   'Senha',
        labelRole:       'Função',
        labelSearch:     'Buscar',
        labelStatus:     'Status',
        labelUsername:   'Nome de usuário',

        phName:          'João Silva',
        phEmailCompany:  'joao@empresa.com',
        phFirst:         'João',
        phLast:          'Silva',
        phStreet:        'Rua Principal 123',
        phCity:          'Santiago',
        phZip:           '12345',
        phProduct:       'Nome do produto',
        phSku:           'ABC-001',
        phPrice:         'R$ 0,00',
        phDescription:   'Descrição do produto...',
        phEmailUser:     'usuario@exemplo.com',
        phPassword:      'Mínimo 8 caracteres',
        phRole:          'Admin',
        phSearch:        'Nome ou e-mail...',
        phStatusAll:     'Todos',
        phUsername:      'joaosilva',

        hintConfirm:     'Enviaremos as confirmações aqui.',
        hintPassword:    'Mínimo de 8 caracteres.',

        btnCancel:       'Cancelar',
        btnSave:         'Salvar',
        btnAddProduct:   'Adicionar produto',
        btnSearch:       'Buscar',
        btnClear:        'Limpar',
        btnCreate:       'Criar conta',

        sectPersonal:    'Dados pessoais',
        sectPersonalDesc:'Informações básicas do usuário.',
        sectAddress:     'Endereço',

        cardTitle:       'Novo usuário',
        cardSubtitle:    'Preencha os dados para criar a conta.'
      }
    }
  });

})(window);
