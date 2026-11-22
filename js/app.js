/*
 * MatchPyME – Mockup interactivo (PTEC105, Grupo 7)
 * Prototipo de frontend con datos simulados. Todas las pantallas comparten el mismo estado,
 * por lo que una postulación o un cambio de estado se ve en las demás pantallas.
 */
(function () {
  'use strict';
  var C = window.Compat;
  var app = document.getElementById('app');

  // ---------- utilidades ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hoy() {
    var d = new Date();
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
  }
  function fechaNum(s) { var p = s.split('/'); return Number(p[2] + p[1] + p[0]); }
  function color(p) { return p >= 70 ? 'var(--azul)' : (p >= 50 ? 'var(--naranjo)' : '#64748B'); }
  function claseEstado(e) { return e === 'Aceptada' ? 'ace' : (e === 'Rechazada' ? 'rec' : 'rev'); }

  // ---------- datos simulados ----------
  var CUENTAS = {
    estudiante: { email: 'camila.rojas@mail.com', pass: 'Practica2026', nombre: 'Camila Rojas', id: 'camila' },
    pyme: { email: 'contacto@andesdigital.cl', pass: 'Pyme2026', nombre: 'Andes Digital SpA' }
  };
  var ESTUDIANTES = {
    camila: { nombre: 'Camila Rojas', ini: 'CR', carrera: 'Ing. Informática · 4.° año', habilidades: ['JavaScript', 'HTML/CSS', 'SQL', 'Git'], disponibilidad: 'Mañana', modalidad: 'Híbrida' },
    diego: { nombre: 'Diego Fuentes', ini: 'DF', carrera: 'Ing. en Computación · 5.° año', habilidades: ['JavaScript', 'HTML/CSS', 'React'], disponibilidad: 'Mañana', modalidad: 'Híbrida' },
    valentina: { nombre: 'Valentina Soto', ini: 'VS', carrera: 'Ing. Informática · 4.° año', habilidades: ['JavaScript', 'HTML/CSS', 'SQL', 'React'], disponibilidad: 'Mañana', modalidad: 'Remota' },
    matias: { nombre: 'Matías Paredes', ini: 'MP', carrera: 'Téc. en Programación · 3.er año', habilidades: ['JavaScript', 'HTML/CSS', 'Git'], disponibilidad: 'Tarde', modalidad: 'Híbrida' }
  };
  var OFERTAS = [
    { id: 'frontend', titulo: 'Desarrollador/a Frontend Jr.', empresa: 'Andes Digital SpA', area: 'Desarrollo de software', modalidad: 'Híbrida', horario: 'Mañana', duracion: '3 meses',
      habilidades: ['JavaScript', 'HTML/CSS', 'Git', 'SQL', 'React'],
      descripcion: 'Apoyarás al equipo en la construcción de pantallas para una plataforma de gestión de pedidos: maquetación, componentes reutilizables y corrección de errores, con un mentor asignado.',
      condiciones: 'Asignación de movilización y colación. Lunes a viernes de 9:00 a 13:00. Dos días presenciales por semana.' },
    { id: 'analista', titulo: 'Analista de Datos en práctica', empresa: 'Sur Analytics Ltda.', area: 'Análisis de datos', modalidad: 'Remota', horario: 'Mañana', duracion: '3 meses',
      habilidades: ['SQL', 'Python', 'Git', 'JavaScript', 'HTML/CSS'],
      descripcion: 'Apoyo en la limpieza de datos y en la construcción de tableros web para clientes del sector retail.',
      condiciones: 'Trabajo remoto con reunión diaria de 15 minutos. Asignación de conectividad.' },
    { id: 'soporte', titulo: 'Practicante de Soporte TI', empresa: 'Cordillera Logística SpA', area: 'Soporte TI', modalidad: 'Presencial', horario: 'Mañana', duracion: '2 meses',
      habilidades: ['Redes', 'Windows', 'SQL', 'Git', 'HTML/CSS'],
      descripcion: 'Atención de incidencias de usuarios internos y mantenimiento del inventario de equipos.',
      condiciones: 'Presencial en bodega central. Colación incluida.' },
    { id: 'backend', titulo: 'Desarrollador/a Backend Jr.', empresa: 'Pacífico Contable SpA', area: 'Desarrollo de software', modalidad: 'Presencial', horario: 'Tarde', duracion: '6 meses',
      habilidades: ['JavaScript', 'SQL', 'Git', 'HTML/CSS', 'Node.js'],
      descripcion: 'Desarrollo de servicios para el sistema de facturación interno.',
      condiciones: 'Lunes a viernes de 14:00 a 18:00.' },
    { id: 'ux', titulo: 'Diseñador/a UX/UI', empresa: 'Andes Digital SpA', area: 'Diseño', modalidad: 'Remota', horario: 'Jornada completa', duracion: '3 meses',
      habilidades: ['Figma', 'Prototipado', 'HTML/CSS', 'JavaScript', 'Investigación de usuarios'],
      descripcion: 'Diseño de flujos y prototipos para la aplicación móvil de la empresa.',
      condiciones: 'Remoto, jornada completa.' },
    { id: 'admin', titulo: 'Asistente de Administración', empresa: 'Valle Verde Agro Ltda.', area: 'Administración', modalidad: 'Presencial', horario: 'Jornada completa', duracion: '2 meses',
      habilidades: ['Excel', 'Contabilidad básica', 'Redacción', 'Atención al cliente', 'SQL'],
      descripcion: 'Apoyo en la gestión administrativa y en la atención de proveedores.',
      condiciones: 'Presencial en oficina central.' }
  ];
  function oferta(id) { return OFERTAS.filter(function (o) { return o.id === id; })[0]; }

  function estadoInicial() {
    return {
      session: null, flash: '', panel: false, ui: {},
      registrados: [CUENTAS.estudiante.email, CUENTAS.pyme.email],
      apps: [
        { id: 'a1', est: 'diego', oferta: 'frontend', estado: 'En revisión', fecha: '20/11/2026' },
        { id: 'a2', est: 'valentina', oferta: 'frontend', estado: 'En revisión', fecha: '19/11/2026' },
        { id: 'a3', est: 'matias', oferta: 'frontend', estado: 'Rechazada', fecha: '18/11/2026' },
        { id: 'a4', est: 'camila', oferta: 'analista', estado: 'En revisión', fecha: '21/11/2026' },
        { id: 'a5', est: 'camila', oferta: 'soporte', estado: 'Rechazada', fecha: '15/11/2026' }
      ],
      notif: {
        pyme: [{ texto: 'Diego Fuentes postuló a Desarrollador/a Frontend Jr. (compatibilidad 84 %).', fecha: '20/11/2026', leida: false }],
        estudiante: [{ texto: 'Cordillera Logística SpA actualizó tu postulación a «Rechazada».', fecha: '18/11/2026', leida: false }]
      }
    };
  }
  var S = estadoInicial();

  // ---------- rutas ----------
  var RUTAS = {
    mk01: { badge: 'MK-01 · Iniciar sesión · CU-02', render: mk01 },
    mk02: { badge: 'MK-02 · Registrar cuenta · CU-01', render: mk02 },
    mk03: { badge: 'MK-03 · Publicar oferta · CU-05', render: mk03, rol: 'pyme' },
    mk04: { badge: 'MK-04 · Explorar ofertas · CU-06 / CU-07 / CU-08', render: mk04, rol: 'estudiante' },
    mk05: { badge: 'MK-05 · Detalle y postular · CU-09', render: mk05, rol: 'estudiante' },
    mk06: { badge: 'MK-06 · Mis postulaciones · CU-10 / CU-14', render: mk06, rol: 'estudiante' },
    mk07: { badge: 'MK-07 · Revisar postulantes · CU-11', render: mk07, rol: 'pyme' },
    mk08: { badge: 'MK-08 · Actualizar estado · CU-12', render: mk08, rol: 'pyme' }
  };
  function ruta() {
    var h = (location.hash || '#mk01').slice(1).split('?');
    var params = {};
    (h[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); params[p[0]] = decodeURIComponent(p[1] || ''); } });
    return { id: RUTAS[h[0]] ? h[0] : 'mk01', params: params };
  }
  function ir(hash) { location.hash = hash; }

  // ---------- piezas comunes ----------
  var LOGO = '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="16" r="9" fill="none" stroke="#1E40AF" stroke-width="3"></circle><circle cx="20" cy="16" r="9" fill="none" stroke="#C2410C" stroke-width="3"></circle></svg>';
  var CAMPANA = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>';

  function encabezado(r) {
    var def = RUTAS[r.id];
    var izq = '<a class="logo" href="#mk01">' + LOGO + '<span>MatchPyME</span></a>';
    var der = '<span class="badge">' + def.badge + '</span>';
    if (def.rol && S.session) {
      var pyme = S.session.rol === 'pyme';
      izq += '<span class="rol ' + (pyme ? 'pyme">PYME' : 'est">ESTUDIANTE') + '</span>';
      var items = pyme
        ? [['Publicar oferta', '#mk03', r.id === 'mk03'], ['Postulantes', '#mk07', r.id === 'mk07' || r.id === 'mk08']]
        : [['Explorar ofertas', '#mk04', r.id === 'mk04' || r.id === 'mk05'], ['Mis postulaciones', '#mk06', r.id === 'mk06']];
      izq += '<nav aria-label="Menú">' + items.map(function (i) {
        return '<a class="nav' + (i[2] ? ' on' : '') + '" href="' + i[1] + '"' + (i[2] ? ' aria-current="page"' : '') + '>' + i[0] + '</a>';
      }).join('') + '</nav>';
      var n = noLeidas();
      der += '<button type="button" class="bell' + (S.panel ? ' on' : '') + '" data-act="campana" aria-label="Notificaciones (' + n + ' sin leer)" aria-expanded="' + S.panel + '">' + CAMPANA +
        (n ? '<span class="count">' + n + '</span>' : '') + '</button>';
      der += '<span class="user">' + esc(S.session.nombre) + '</span><button type="button" class="linkbtn" data-act="salir">Cerrar sesión</button>';
    }
    return '<header class="top"><div class="top-left">' + izq + '</div><div class="top-right">' + der + '</div></header>';
  }
  function misNotif() { return S.session ? S.notif[S.session.rol] : []; }
  function noLeidas() { return misNotif().filter(function (n) { return !n.leida; }).length; }
  function panel() {
    if (!S.panel) return '';
    var l = misNotif().slice().reverse();
    return '<section class="panel" aria-label="Notificaciones"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
      '<strong>Notificaciones (CU-14)</strong><button type="button" class="btn btn-s btn-sm" data-act="leer">Marcar como leídas</button></div>' +
      (l.length ? l.map(function (n) {
        return '<div class="notif' + (n.leida ? ' leida' : '') + '"><span>' + esc(n.texto) + '</span><small>' + esc(n.fecha) + ' · ' + (n.leida ? 'Leída' : 'No leída') + '</small></div>';
      }).join('') : '<p class="sub">No tienes nuevas notificaciones.</p>') + '</section>';
  }
  function msg(tipo, html, rol) { return '<div class="msg ' + tipo + '" role="' + (rol || (tipo === 'error' ? 'alert' : 'status')) + '">' + html + '</div>'; }
  function campo(id, etiqueta, tipo, valor, err, extra) {
    return '<div><label class="lbl" for="' + id + '">' + etiqueta + '</label><input id="' + id + '" type="' + (tipo || 'text') + '" class="inp' + (err ? ' err' : '') +
      '" data-f="' + id + '" value="' + esc(valor) + '"' + (extra || '') + '>' + (err && err !== true ? '<span class="ferr">' + err + '</span>' : '') + '</div>';
  }
  function select(id, etiqueta, opciones, valor, err, errTxt) {
    return '<div><label class="lbl" for="' + id + '">' + etiqueta + '</label><select id="' + id + '" class="inp' + (err ? ' err' : '') + '" data-f="' + id + '">' +
      opciones.map(function (o) { var v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (v === valor ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') +
      '</select>' + (err ? '<span class="ferr">' + errTxt + '</span>' : '') + '</div>';
  }
  function form() { S.ui.form = S.ui.form || {}; return S.ui.form; }

  // ---------- MK-01 Iniciar sesión (CU-02) ----------
  function mk01() {
    var u = S.ui, f = form(), rol = u.rol || 'estudiante';
    var flash = S.flash ? msg('info', S.flash) : '';
    S.flash = '';
    return '<div class="login"><section class="hero"><h1>Prácticas profesionales que calzan contigo</h1>' +
      '<p>MatchPyME conecta a estudiantes con Pymes y calcula un porcentaje de compatibilidad según habilidades, disponibilidad y modalidad.</p>' +
      '<div style="display:flex;gap:24px;flex-wrap:wrap"><div><strong style="color:var(--azul)">Estudiantes</strong><br><span class="sub">Explora y postula</span></div>' +
      '<div><strong style="color:var(--naranjo)">Pymes</strong><br><span class="sub">Publica y selecciona</span></div></div></section>' +
      '<section class="card" style="flex:1 1 380px;max-width:440px"><div class="head"><h2 style="font-size:24px">Iniciar sesión</h2><p class="sub" style="font-size:14px">Selecciona tu tipo de cuenta e ingresa tus credenciales.</p></div>' + flash +
      '<div class="tabs" role="group" aria-label="Tipo de cuenta"><button type="button" class="tab' + (rol === 'estudiante' ? ' on' : '') + '" data-act="rol" data-v="estudiante" aria-pressed="' + (rol === 'estudiante') + '">Estudiante</button>' +
      '<button type="button" class="tab' + (rol === 'pyme' ? ' on' : '') + '" data-act="rol" data-v="pyme" aria-pressed="' + (rol === 'pyme') + '">Pyme</button></div>' +
      campo('email', 'Correo electrónico', 'email', f.email, !!u.error, ' placeholder="nombre@correo.com" autocomplete="username"') +
      campo('pass', 'Contraseña', 'password', f.pass, !!u.error, ' placeholder="••••••••" autocomplete="current-password"') +
      (u.error ? msg('error', esc(u.error)) : '') +
      '<button type="button" class="btn btn-p" data-act="ingresar">Ingresar</button>' +
      '<p class="sub" style="font-size:14px;text-align:center">¿No tienes cuenta? <a href="#mk02" style="font-weight:600">Regístrate</a></p></section></div>';
  }
  function ingresar() {
    var f = form(), rol = S.ui.rol || 'estudiante', c = CUENTAS[rol];
    var e = String(f.email || '').trim().toLowerCase();
    if (!e || !f.pass) { S.ui.error = 'Ingresa tu correo y tu contraseña para continuar.'; return render(); }
    if (e !== c.email || f.pass !== c.pass) { S.ui.error = 'Correo o contraseña incorrectos. Verifica tus datos e inténtalo nuevamente.'; return render(); }
    S.session = { rol: rol, nombre: c.nombre };
    ir(rol === 'pyme' ? '#mk03' : '#mk04');
  }

  // ---------- MK-02 Registrar cuenta (CU-01) ----------
  function mk02() {
    var u = S.ui, f = form(), e = u.errs || {}, est = (u.rol || 'estudiante') === 'estudiante';
    if (u.ok) {
      return '<main style="max-width:600px"><section class="card">' + msg('ok', '<span><strong>Cuenta creada con éxito.</strong> Ya puedes iniciar sesión en MatchPyME.</span><a class="btn btn-p" href="#mk01">Ir a iniciar sesión</a>') + '</section></main>';
    }
    return '<main style="max-width:600px"><section class="card"><div class="head"><h1 style="font-size:26px">Crear cuenta</h1><p class="sub" style="font-size:14px">Los campos marcados con * son obligatorios.</p></div>' +
      '<div class="tabs" role="group" aria-label="Tipo de cuenta"><button type="button" class="tab' + (est ? ' on' : '') + '" data-act="rol" data-v="estudiante">Soy estudiante</button>' +
      '<button type="button" class="tab' + (!est ? ' on' : '') + '" data-act="rol" data-v="pyme">Soy Pyme</button></div>' +
      campo('nombre', (est ? 'Nombre completo' : 'Razón social de la Pyme') + ' *', 'text', f.nombre, e.nombre, ' placeholder="' + (est ? 'Ej.: Camila Rojas' : 'Ej.: Andes Digital SpA') + '"') +
      campo('correo', 'Correo electrónico *', 'email', f.correo, e.correo, ' placeholder="nombre@correo.com"') +
      '<div class="grid2">' + campo('pass', 'Contraseña *', 'password', f.pass, e.pass, ' placeholder="Mínimo 8 caracteres"') +
      campo('pass2', 'Confirmar contraseña *', 'password', f.pass2, e.pass2, ' placeholder="Repite la contraseña"') + '</div>' +
      '<div><label class="check"><input type="checkbox" data-f="acepta"' + (f.acepta ? ' checked' : '') + '><span>Acepto el tratamiento de mis datos personales según la Ley N.° 21.719 (RN-10). *</span></label>' +
      (e.acepta ? '<span class="ferr">' + e.acepta + '</span>' : '') + '</div>' +
      (u.duplicado ? msg('error', '<strong>Este correo ya está registrado (RN-02).</strong><span>Cada cuenta se asocia a un único correo. ¿Ya tienes cuenta?</span>' +
        '<span style="display:flex;gap:16px;flex-wrap:wrap"><a href="#mk01" style="color:inherit;font-weight:600">Iniciar sesión</a>' +
        '<button type="button" class="linkbtn" style="color:inherit" data-act="recuperar">Recuperar contraseña</button></span>' +
        (u.recuperacion ? '<span style="color:var(--ok-texto);background:var(--ok-fondo);border:1px solid var(--ok-borde);border-radius:6px;padding:8px 10px">Te enviamos un enlace para restablecer tu contraseña a ' + esc(f.correo) + ' (simulado).</span>' : '')) : '') +
      '<div style="display:flex;gap:12px;flex-wrap:wrap"><button type="button" class="btn btn-p" style="flex:1 1 200px" data-act="registrar">Crear cuenta</button><a class="btn btn-s" href="#mk01" style="flex:1 1 160px">Cancelar</a></div></section></main>';
  }
  function registrar() {
    var f = form(), r = {}, correo = String(f.correo || '').trim().toLowerCase();
    if (!String(f.nombre || '').trim()) r.nombre = 'Este campo es obligatorio.';
    if (!correo) r.correo = 'Ingresa un correo electrónico.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) r.correo = 'El correo no tiene un formato válido (ej.: nombre@correo.com).';
    if (!f.pass) r.pass = 'Ingresa una contraseña.';
    else if (f.pass.length < 8 || !/[0-9]/.test(f.pass) || !/[A-Za-z]/.test(f.pass)) r.pass = 'Debe tener al menos 8 caracteres, con letras y números.';
    if (!f.pass2) r.pass2 = 'Confirma la contraseña.';
    else if (f.pass2 !== f.pass) r.pass2 = 'Las contraseñas no coinciden.';
    if (!f.acepta) r.acepta = 'Debes aceptar el tratamiento de datos para registrarte.';
    S.ui.errs = r; S.ui.duplicado = false; S.ui.recuperacion = false;
    if (!Object.keys(r).length) {
      if (S.registrados.indexOf(correo) >= 0) { S.ui.errs = { correo: true }; S.ui.duplicado = true; }
      else { S.registrados.push(correo); S.ui.ok = true; }
    }
    render();
  }

  // ---------- MK-03 Publicar oferta (CU-05) ----------
  var REQ = ['titulo', 'area', 'modalidad', 'habilidades', 'horario', 'duracion'];
  function mk03() {
    var u = S.ui, f = form(), e = u.errs || {}, nF = Object.keys(e).length;
    var estado = u.resultado === 'publicada' ? 'Activa' : (u.resultado === 'borrador' ? 'Borrador' : 'Sin publicar');
    function pv(k, d) { return esc(f[k] && String(f[k]).trim() ? f[k] : d); }
    return '<main>' + panel() + '<div class="head"><h1>Publicar oferta de práctica</h1><p class="sub">Completa los requisitos, el horario y las condiciones. Los campos con * son obligatorios (RN-04).</p></div>' +
      (u.resultado === 'faltan' ? msg('error', '<span><strong>No se pudo publicar:</strong> faltan ' + nF + ' campo(s) obligatorio(s). Revisa los campos destacados en rojo.</span>') : '') +
      (u.resultado === 'borrador' ? msg('info', '<span><strong>Borrador guardado.</strong> La oferta quedó con estado «Borrador» y no es visible para los estudiantes.</span>') : '') +
      (u.resultado === 'publicada' ? msg('ok', '<span><strong>¡Oferta publicada!</strong> Quedó con estado «Activa» y ya aparece en Explorar ofertas con su compatibilidad (CU-06, CU-07).</span><a class="btn btn-p btn-sm" href="#mk07">Ver postulantes</a>') : '') +
      '<div class="row"><form class="card grow" onsubmit="return false">' +
      campo('titulo', 'Título de la práctica *', 'text', f.titulo, e.titulo ? 'Ingresa el título de la práctica.' : '', ' placeholder="Ej.: Desarrollador/a Frontend Jr."') +
      '<div class="grid2">' + select('area', 'Área *', [['', 'Selecciona un área'], 'Desarrollo de software', 'Análisis de datos', 'Soporte TI', 'Diseño', 'Administración'], f.area, e.area, 'Selecciona un área.') +
      select('modalidad', 'Modalidad *', [['', 'Selecciona'], 'Presencial', 'Híbrida', 'Remota'], f.modalidad, e.modalidad, 'Selecciona la modalidad.') + '</div>' +
      campo('habilidades', 'Habilidades requeridas *', 'text', f.habilidades, e.habilidades ? 'Indica al menos una habilidad (se usa en el cálculo de compatibilidad, RN-07).' : '', ' placeholder="Separadas por coma: JavaScript, HTML/CSS, Git"') +
      '<div class="grid2">' + select('horario', 'Horario *', [['', 'Selecciona'], ['Mañana', 'Media jornada – mañana'], ['Tarde', 'Media jornada – tarde'], 'Jornada completa'], f.horario, e.horario, 'Selecciona el horario.') +
      select('duracion', 'Duración *', [['', 'Selecciona'], '2 meses', '3 meses', '6 meses'], f.duracion, e.duracion, 'Selecciona la duración.') + '</div>' +
      '<div><label class="lbl" for="condiciones">Condiciones y beneficios</label><textarea id="condiciones" class="inp" data-f="condiciones" placeholder="Ej.: asignación de movilización y colación, mentor asignado.">' + esc(f.condiciones) + '</textarea></div>' +
      '<div class="actions"><button type="button" class="btn btn-s" data-act="borrador">Guardar borrador</button><button type="button" class="btn btn-p" data-act="publicar">Publicar oferta</button></div></form>' +
      '<aside class="card side" style="gap:12px"><span style="font-size:13px;font-weight:700;color:var(--texto-sec);text-transform:uppercase;letter-spacing:.04em">Vista previa para estudiantes</span>' +
      '<strong style="font-size:18px" data-prev="titulo">' + pv('titulo', 'Título de la práctica') + '</strong>' +
      '<span style="font-size:14px">Andes Digital SpA · <span data-prev="area">' + pv('area', 'Área') + '</span></span>' +
      '<div class="chips"><span class="chip" data-prev="modalidad">' + pv('modalidad', 'Modalidad') + '</span><span class="chip" data-prev="horario">' + pv('horario', 'Horario') + '</span><span class="chip" data-prev="duracion">' + pv('duracion', 'Duración') + '</span></div>' +
      '<span class="sub" style="font-size:14px">Habilidades: <span data-prev="habilidades">' + pv('habilidades', '—') + '</span></span>' +
      '<strong style="font-size:13px;color:' + (estado === 'Activa' ? '#166534' : 'var(--texto-sec)') + '">Estado: ' + estado + '</strong></aside></div></main>';
  }
  function publicar(borrador) {
    var f = form(), r = {};
    (borrador ? ['titulo'] : REQ).forEach(function (k) { if (!String(f[k] || '').trim()) r[k] = true; });
    S.ui.errs = r;
    S.ui.resultado = Object.keys(r).length ? 'faltan' : (borrador ? 'borrador' : 'publicada');
    render();
  }

  // ---------- MK-04 Explorar ofertas (CU-06, CU-07, CU-08) ----------
  function mk04() {
    var u = S.ui, f = form(), a = u.aplicado || {};
    var yo = ESTUDIANTES.camila;
    var lista = OFERTAS.filter(function (o) {
      return (!a.farea || o.area === a.farea) && (!a.fmod || o.modalidad === a.fmod) && (!a.fhor || o.horario === a.fhor);
    }).map(function (o) { return { o: o, c: C.calcularCompatibilidad(yo, o).porcentaje }; })
      .sort(function (x, y) { return y.c - x.c; });
    var filtrado = !!(a.farea || a.fmod || a.fhor);
    var cards = lista.map(function (x) {
      return '<article class="oferta"><div style="flex:999 1 420px;min-width:0;display:flex;flex-direction:column;gap:8px">' +
        '<strong style="font-size:18px">' + esc(x.o.titulo) + '</strong><span style="font-size:14px;color:#334155">' + esc(x.o.empresa) + ' · ' + esc(x.o.area) + '</span>' +
        '<div class="chips"><span class="chip">' + x.o.modalidad + '</span><span class="chip">' + x.o.horario + '</span><span class="chip">' + x.o.duracion + '</span></div></div>' +
        '<div style="flex:1 1 180px;display:flex;flex-direction:column;gap:6px"><div><span style="font-size:26px;font-weight:700;color:' + color(x.c) + '">' + x.c + '%</span> <span class="sub" style="font-size:13px">compatibilidad ' + C.nivel(x.c) + '</span></div>' +
        '<div class="bar"><div style="width:' + x.c + '%;background:' + color(x.c) + '"></div></div></div>' +
        '<a class="btn btn-s" href="#mk05?o=' + x.o.id + '">Ver detalle</a></article>';
    }).join('');
    return '<main>' + panel() + '<div class="head"><h1>Explorar ofertas de práctica</h1><p class="sub">Cada oferta muestra tu porcentaje de compatibilidad según tus habilidades, disponibilidad y modalidad (CU-07, RN-07).</p></div>' +
      '<div class="msg perfil"><strong>Perfil completo ✓ (RN-05)</strong><span>' + yo.carrera.split(' ·')[0] + ' · ' + yo.habilidades.join(', ') + ' · Disponibilidad: mañana · Prefiere: híbrida</span></div>' +
      '<section aria-label="Filtros" class="card" style="padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));align-items:end;gap:16px">' +
      select('farea', 'Área', [['', 'Todas'], 'Desarrollo de software', 'Análisis de datos', 'Soporte TI', 'Diseño', 'Administración'], f.farea || '') +
      select('fmod', 'Modalidad', [['', 'Todas'], 'Presencial', 'Híbrida', 'Remota'], f.fmod || '') +
      select('fhor', 'Horario', [['', 'Todos'], 'Mañana', 'Tarde', 'Jornada completa'], f.fhor || '') +
      '<div style="display:flex;gap:8px"><button type="button" class="btn btn-p" style="flex:1" data-act="filtrar">Aplicar filtros</button><button type="button" class="btn btn-s" data-act="limpiar">Limpiar</button></div></section>' +
      '<span class="sub" style="font-size:14px">' + lista.length + (lista.length === 1 ? ' oferta activa' : ' ofertas activas') + (filtrado ? ' con los filtros aplicados (CU-08)' : '') + ' · ordenadas por compatibilidad</span>' +
      (lista.length ? '<div style="display:flex;flex-direction:column;gap:12px">' + cards + '</div>' :
        '<div class="card vacio" role="status"><strong style="font-size:17px">No hay ofertas que coincidan con estos filtros</strong><span class="sub" style="font-size:14px">Prueba con otros criterios o limpia los filtros para ver todas las ofertas activas.</span><button type="button" class="btn btn-s" data-act="limpiar">Limpiar filtros</button></div>') +
      '</main>';
  }

  // ---------- MK-05 Detalle y postular (CU-09) ----------
  function mk05(p) {
    var o = oferta(p.o || 'frontend');
    if (!o) { ir('#mk04'); return ''; }
    var yo = ESTUDIANTES.camila, r = C.calcularCompatibilidad(yo, o), u = S.ui;
    var hab = o.habilidades.map(function (h) { var si = r.coincidentes.indexOf(h) >= 0; return '<span class="chip' + (si ? ' si' : '') + '">' + esc(h) + (si ? ' ✓' : '') + '</span>'; }).join('');
    return '<main><a href="#mk04" style="font-size:14px;font-weight:600;text-decoration:none">← Volver a ofertas</a>' +
      '<div class="row"><section class="card grow" style="gap:20px"><div class="head" style="gap:8px"><h1>' + esc(o.titulo) + '</h1><span style="font-size:15px;color:#334155">' + esc(o.empresa) + ' · ' + esc(o.area) + '</span>' +
      '<div class="chips"><span class="chip">' + o.modalidad + '</span><span class="chip">' + o.horario + '</span><span class="chip">' + o.duracion + '</span><span class="chip">Estado: Activa</span></div></div>' +
      '<div class="head" style="gap:8px"><h2>Descripción</h2><p style="line-height:1.6;color:#334155">' + esc(o.descripcion) + '</p></div>' +
      '<div class="head" style="gap:8px"><h2>Habilidades requeridas</h2><div class="chips">' + hab + '</div><span class="sub" style="font-size:13px">✓ = habilidad presente en tu perfil</span></div>' +
      '<div class="head" style="gap:8px"><h2>Condiciones</h2><p style="line-height:1.6;color:#334155">' + esc(o.condiciones) + '</p></div></section>' +
      '<aside class="card side" style="gap:16px"><span style="font-size:13px;font-weight:700;color:var(--texto-sec);text-transform:uppercase;letter-spacing:.04em">Tu compatibilidad</span>' +
      '<div><span style="font-size:44px;font-weight:700;color:' + color(r.porcentaje) + '">' + r.porcentaje + '%</span> <span class="sub">' + C.nivel(r.porcentaje) + '</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;font-size:14px">' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><span>Habilidades (40 %)</span><strong>' + r.coincidentes.length + ' de ' + r.requeridas + ' → ' + r.partes.habilidades + ' %</strong></div>' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><span>Disponibilidad (35 %)</span><strong>' + (r.partes.disponibilidad ? 'Coincide' : 'No coincide') + ' → ' + r.partes.disponibilidad + ' %</strong></div>' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><span>Modalidad (25 %)</span><strong>' + (r.partes.modalidad ? 'Coincide' : 'No coincide') + ' → ' + r.partes.modalidad + ' %</strong></div></div>' +
      '<span class="sub" style="font-size:13px">Cálculo según RN-07.</span>' +
      (u.ok ? msg('ok', '<span><strong>¡Postulación enviada!</strong> Quedó «En revisión» y ' + esc(o.empresa) + ' fue notificada (CU-13, RN-09).</span><a class="btn btn-p btn-sm" href="#mk06">Ver mis postulaciones</a>') : '') +
      (u.dup ? msg('error', '<span><strong>Ya postulaste a esta oferta.</strong> No es posible postular dos veces a la misma práctica (RN-06).</span>') : '') +
      '<button type="button" class="btn btn-p" data-act="postular" data-v="' + o.id + '">Postular</button></aside></div></main>';
  }
  function postular(id) {
    var o = oferta(id);
    var ya = S.apps.some(function (a) { return a.est === 'camila' && a.oferta === id; });
    if (ya) { S.ui.dup = true; S.ui.ok = false; return render(); }
    S.apps.push({ id: 'a' + (S.apps.length + 1), est: 'camila', oferta: id, estado: 'En revisión', fecha: hoy() });
    if (o.empresa === CUENTAS.pyme.nombre) {
      var c = C.calcularCompatibilidad(ESTUDIANTES.camila, o).porcentaje;
      S.notif.pyme.push({ texto: 'Camila Rojas postuló a ' + o.titulo + ' (compatibilidad ' + c + ' %).', fecha: hoy(), leida: false });
    }
    S.ui.ok = true; S.ui.dup = false;
    render();
  }

  // ---------- MK-06 Mis postulaciones (CU-10, CU-14) ----------
  function mk06() {
    var mias = S.apps.filter(function (a) { return a.est === 'camila'; }).sort(function (x, y) { return fechaNum(y.fecha) - fechaNum(x.fecha); });
    var acept = mias.filter(function (a) { return a.estado === 'Aceptada'; })[0];
    var filas = mias.map(function (a) {
      var o = oferta(a.oferta), c = C.calcularCompatibilidad(ESTUDIANTES.camila, o).porcentaje;
      return '<tr><td style="font-weight:600">' + esc(o.titulo) + '</td><td>' + esc(o.empresa) + '</td><td>' + a.fecha + '</td><td style="font-weight:700">' + c + '%</td><td><span class="estado ' + claseEstado(a.estado) + '">' + a.estado + '</span></td></tr>';
    }).join('');
    return '<main>' + panel() + '<div class="head"><h1>Mis postulaciones</h1><p class="sub">Revisa el estado actualizado de cada práctica a la que postulaste.</p></div>' +
      (acept ? '<div class="msg ok" style="flex-direction:row;flex-wrap:wrap;gap:12px"><strong>¡Buenas noticias!</strong><span>' + esc(oferta(acept.oferta).empresa) + ' aceptó tu postulación a ' + esc(oferta(acept.oferta).titulo) + '.</span></div>' : '') +
      (mias.length ? '<section class="tablebox"><div class="scroll"><table><thead><tr><th>Oferta</th><th>Empresa</th><th>Fecha de postulación</th><th>Compatibilidad</th><th>Estado</th></tr></thead><tbody>' + filas + '</tbody></table></div></section>' +
        '<span class="sub" style="font-size:13px">Estados posibles: En revisión, Aceptada o Rechazada (RN-08).</span>' :
        '<div class="card vacio" role="status"><strong style="font-size:17px">Aún no has postulado a ninguna práctica</strong><a class="btn btn-p" href="#mk04">Explorar ofertas</a></div>') + '</main>';
  }

  // ---------- MK-07 Revisar postulantes (CU-11) ----------
  function mk07() {
    var u = S.ui, idO = u.oferta || 'frontend', o = oferta(idO);
    var lista = S.apps.filter(function (a) { return a.oferta === idO; }).map(function (a) {
      return { a: a, e: ESTUDIANTES[a.est], c: C.calcularCompatibilidad(ESTUDIANTES[a.est], o).porcentaje };
    }).sort(function (x, y) { return y.c - x.c; });
    var enRev = lista.filter(function (x) { return x.a.estado === 'En revisión'; }).length;
    var filas = lista.map(function (x, i) {
      return '<tr><td class="sub">' + (i + 1) + '</td><td><div style="display:flex;flex-direction:column"><strong>' + esc(x.e.nombre) + '</strong><span class="sub" style="font-size:13px">Postuló el ' + x.a.fecha + '</span></div></td>' +
        '<td>' + esc(x.e.carrera.split(' ·')[0]) + '</td><td>' + x.e.disponibilidad + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:10px"><div class="bar" style="width:110px"><div style="width:' + x.c + '%;background:' + color(x.c) + '"></div></div><strong>' + x.c + '%</strong></div></td>' +
        '<td><span class="estado ' + claseEstado(x.a.estado) + '">' + x.a.estado + '</span></td><td style="text-align:right"><a class="btn btn-s btn-sm" href="#mk08?a=' + x.a.id + '">Gestionar</a></td></tr>';
    }).join('');
    return '<main>' + panel() + '<div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px"><div class="head"><h1>Revisar postulantes</h1><p class="sub">Los postulantes se ordenan de mayor a menor compatibilidad (CU-07, RN-07).</p></div>' +
      '<div style="width:100%;max-width:380px">' + select('oferta', 'Oferta', [['frontend', 'Desarrollador/a Frontend Jr. · Activa'], ['ux', 'Diseñador/a UX/UI · Activa']], idO) + '</div></div>' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap"><div class="stat"><span class="sub" style="font-size:13px">Postulaciones recibidas</span><strong style="font-size:26px">' + lista.length + '</strong></div>' +
      '<div class="stat"><span class="sub" style="font-size:13px">En revisión</span><strong style="font-size:26px">' + enRev + '</strong></div>' +
      '<div class="stat"><span class="sub" style="font-size:13px">Habilidades buscadas</span><strong style="font-size:15px">' + esc(o.habilidades.join(', ')) + '</strong></div></div>' +
      '<section class="tablebox">' + (lista.length ? '<div class="scroll"><table><thead><tr><th>#</th><th>Postulante</th><th>Carrera</th><th>Disponibilidad</th><th>Compatibilidad</th><th>Estado</th><th><span class="sr">Acción</span></th></tr></thead><tbody>' + filas + '</tbody></table></div>' :
        '<div class="vacio" role="status"><strong style="font-size:17px">Aún no se reciben postulaciones para esta oferta</strong><span class="sub" style="font-size:14px">Te avisaremos cuando un estudiante postule (CU-13).</span></div>') + '</section></main>';
  }

  // ---------- MK-08 Actualizar estado (CU-12) ----------
  function mk08(p) {
    var a = S.apps.filter(function (x) { return x.id === p.a; })[0];
    if (!a) { ir('#mk07'); return ''; }
    var e = ESTUDIANTES[a.est], o = oferta(a.oferta), r = C.calcularCompatibilidad(e, o), u = S.ui, f = form(), sel = u.sel || '';
    var errSin = !!u.error && !sel;
    function opt(v, d) {
      return '<label class="opt' + (sel === v ? ' on' : (errSin ? ' bad' : '')) + '"><input type="radio" name="estado" data-act="sel" data-v="' + v + '"' + (sel === v ? ' checked' : '') + '>' +
        '<span style="display:flex;flex-direction:column;gap:2px"><strong>' + v + '</strong><span class="sub" style="font-size:13px">' + d + '</span></span></label>';
    }
    var hab = o.habilidades.map(function (h) { return esc(h) + (r.coincidentes.indexOf(h) >= 0 ? ' ✓' : ' (no declarada)'); }).join(', ');
    return '<main>' + panel() + '<a href="#mk07" style="font-size:14px;font-weight:600;text-decoration:none">← Volver a postulantes</a>' +
      '<div class="head"><h1>Actualizar estado de postulación</h1><p class="sub">Oferta: ' + esc(o.titulo) + ' · Postulación recibida el ' + a.fecha + '</p></div>' +
      '<div class="row"><aside class="card side" style="gap:14px"><div style="display:flex;align-items:center;gap:14px"><div style="width:52px;height:52px;border-radius:999px;background:var(--azul-claro);color:var(--azul-osc);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px">' + e.ini + '</div>' +
      '<div style="display:flex;flex-direction:column"><strong style="font-size:18px">' + esc(e.nombre) + '</strong><span class="sub" style="font-size:14px">' + esc(e.carrera) + '</span></div></div>' +
      '<div><span style="font-size:36px;font-weight:700;color:var(--azul)">' + r.porcentaje + '%</span> <span class="sub" style="font-size:14px">de compatibilidad</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;font-size:14px"><span><strong>Habilidades (' + r.coincidentes.length + ' de ' + r.requeridas + '):</strong> ' + hab + '</span>' +
      '<span><strong>Disponibilidad:</strong> ' + e.disponibilidad + (r.partes.disponibilidad ? ' ✓' : ' ✗') + '</span><span><strong>Modalidad preferida:</strong> ' + e.modalidad + (r.partes.modalidad ? ' ✓' : ' ✗') + '</span></div>' +
      '<div style="display:flex;align-items:center;gap:8px;padding-top:12px;border-top:1px solid var(--borde)"><span class="sub" style="font-size:14px">Estado actual:</span><span class="estado ' + claseEstado(a.estado) + '">' + a.estado + '</span></div></aside>' +
      '<section class="card grow"><fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:10px"><legend style="font-size:16px;font-weight:700;margin-bottom:10px">Nuevo estado *</legend>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap">' + opt('Aceptada', 'El estudiante fue seleccionado para la práctica.') + opt('Rechazada', 'La postulación no continúa en el proceso.') + '</div>' +
      '<span class="sub" style="font-size:13px">Solo se permiten «Aceptada» o «Rechazada». Una postulación resuelta no vuelve a cambiar (RN-08).</span></fieldset>' +
      '<div><label class="lbl" for="mensaje">Mensaje para el estudiante (opcional)</label><textarea id="mensaje" class="inp" data-f="mensaje" placeholder="Ej.: ¡Felicitaciones! Te contactaremos para coordinar el inicio.">' + esc(f.mensaje) + '</textarea></div>' +
      (u.error ? msg('error', esc(u.error)) : '') +
      (u.ok ? msg('ok', '<span><strong>Estado actualizado a «' + a.estado + '».</strong></span><span>Se notificó a ' + esc(e.nombre) + ' en la plataforma y por correo electrónico (CU-13, RN-09).</span>' +
        (u.okMsg ? '<span>Mensaje incluido en la notificación: «' + esc(u.okMsg) + '»</span>' : '')) : '') +
      '<div class="actions"><a class="btn btn-s" href="#mk07">Volver</a><button type="button" class="btn btn-p" data-act="guardar" data-v="' + a.id + '">Guardar estado</button></div></section></div></main>';
  }
  function guardar(id) {
    var a = S.apps.filter(function (x) { return x.id === id; })[0], u = S.ui, f = form();
    if (!u.sel) { u.error = 'Selecciona «Aceptada» o «Rechazada»: son los únicos estados permitidos (RN-08).'; u.ok = false; return render(); }
    if (a.estado !== 'En revisión') {
      if (u.sel === a.estado && u.ok) { u.error = ''; return render(); }
      u.error = 'Esta postulación ya fue resuelta como «' + a.estado + '» y no puede cambiarse nuevamente (RN-08).'; u.ok = false; return render();
    }
    a.estado = u.sel;
    var m = String(f.mensaje || '').trim();
    if (a.est === CUENTAS.estudiante.id) {
      S.notif.estudiante.push({ texto: CUENTAS.pyme.nombre + ' actualizó tu postulación a ' + oferta(a.oferta).titulo + ': «' + a.estado + '».' + (m ? ' Mensaje: «' + m + '»' : ''), fecha: hoy(), leida: false });
    }
    u.error = ''; u.ok = true; u.okMsg = m;
    render();
  }

  // ---------- render y eventos ----------
  function render() {
    var r = ruta(), def = RUTAS[r.id];
    if (def.rol && (!S.session || S.session.rol !== def.rol)) {
      S.flash = 'Debes iniciar sesión como ' + (def.rol === 'pyme' ? 'Pyme' : 'estudiante') + ' para acceder a esa pantalla (RNF-03).';
      S.session = null; S.ui = {};
      location.replace('#mk01');
      return;
    }
    document.title = def.badge.split(' · ').slice(0, 2).join(' ') + ' – MatchPyME';
    var cuerpo = def.render(r.params);
    app.innerHTML = encabezado(r) + cuerpo +
      '<footer>Prototipo académico de MatchPyME (PTEC105, Grupo 7) · Datos ficticios · <button type="button" class="linkbtn" data-act="reiniciar">Reiniciar demo</button></footer>';
  }

  window.addEventListener('hashchange', function () { S.ui = {}; S.panel = false; render(); window.scrollTo(0, 0); });

  app.addEventListener('input', function (ev) {
    var el = ev.target, k = el.getAttribute('data-f');
    if (!k) return;
    form()[k] = el.type === 'checkbox' ? el.checked : el.value;
    el.classList.remove('err');
    var prev = app.querySelector('[data-prev="' + k + '"]');
    if (prev) prev.textContent = el.value.trim() || '—';
  });
  app.addEventListener('change', function (ev) {
    var el = ev.target, k = el.getAttribute('data-f');
    if (k) form()[k] = el.type === 'checkbox' ? el.checked : el.value;
    if (k === 'oferta') { S.ui.oferta = el.value; render(); }
    if (el.getAttribute('data-act') === 'sel') { S.ui.sel = el.getAttribute('data-v'); S.ui.error = ''; render(); }
    if (k && el.tagName === 'SELECT') {
      var prev = app.querySelector('[data-prev="' + k + '"]');
      if (prev) prev.textContent = el.value || prev.textContent;
    }
  });
  app.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el || el.getAttribute('data-act') === 'sel') return;
    var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    switch (act) {
      case 'rol': S.ui.rol = v; S.ui.error = ''; S.ui.errs = {}; S.ui.duplicado = false; render(); break;
      case 'ingresar': ingresar(); break;
      case 'registrar': registrar(); break;
      case 'recuperar': S.ui.recuperacion = true; render(); break;
      case 'publicar': publicar(false); break;
      case 'borrador': publicar(true); break;
      case 'filtrar': S.ui.aplicado = { farea: form().farea, fmod: form().fmod, fhor: form().fhor }; render(); break;
      case 'limpiar': S.ui.aplicado = {}; S.ui.form = {}; render(); break;
      case 'postular': postular(v); break;
      case 'guardar': guardar(v); break;
      case 'campana': S.panel = !S.panel; render(); break;
      case 'leer': misNotif().forEach(function (n) { n.leida = true; }); render(); break;
      case 'salir': S.session = null; S.ui = {}; S.panel = false; if (location.hash === '#mk01') render(); else ir('#mk01'); break;
      case 'reiniciar': S = estadoInicial(); if (location.hash === '#mk01') render(); else ir('#mk01'); break;
    }
  });
  app.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' && ev.target.matches('#email, #pass')) ingresar();
  });

  render();
})();
