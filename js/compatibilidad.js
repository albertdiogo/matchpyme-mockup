/*
 * RN-07: cálculo del porcentaje de compatibilidad entre un estudiante y una oferta.
 *   40 % × (habilidades coincidentes / habilidades requeridas)
 * + 35 % si la disponibilidad del estudiante coincide con el horario de la oferta
 * + 25 % si la modalidad preferida coincide con la modalidad de la oferta
 * Resultado entero entre 0 y 100. Nivel: alta (>= 70), media (50 a 69), baja (< 50).
 */
(function (global) {
  function normalizar(s) {
    return String(s).trim().toLowerCase();
  }

  function calcularCompatibilidad(perfil, oferta) {
    var requeridas = oferta.habilidades || [];
    var propias = (perfil.habilidades || []).map(normalizar);
    var coincidentes = requeridas.filter(function (h) { return propias.indexOf(normalizar(h)) >= 0; });
    var parteHab = requeridas.length ? 40 * coincidentes.length / requeridas.length : 0;
    var parteDisp = perfil.disponibilidad === oferta.horario ? 35 : 0;
    var parteMod = perfil.modalidad === oferta.modalidad ? 25 : 0;
    var total = Math.round(parteHab + parteDisp + parteMod);
    return {
      porcentaje: Math.max(0, Math.min(100, total)),
      coincidentes: coincidentes,
      requeridas: requeridas.length,
      partes: { habilidades: Math.round(parteHab), disponibilidad: parteDisp, modalidad: parteMod }
    };
  }

  function nivel(porcentaje) {
    if (porcentaje >= 70) return 'alta';
    if (porcentaje >= 50) return 'media';
    return 'baja';
  }

  var api = { calcularCompatibilidad: calcularCompatibilidad, nivel: nivel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Compat = api;
})(this);
