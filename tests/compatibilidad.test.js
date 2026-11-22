// CP-03: pruebas unitarias del cálculo de compatibilidad (RN-07) con valores límite.
// Ejecutar con: node tests/compatibilidad.test.js
const assert = require('assert');
const { calcularCompatibilidad, nivel } = require('../js/compatibilidad.js');

const oferta = { habilidades: ['JavaScript', 'HTML/CSS', 'Git', 'SQL', 'React'], horario: 'Mañana', modalidad: 'Híbrida' };
const casos = [
  ['(1) 0 de 5, sin disponibilidad ni modalidad', { habilidades: [], disponibilidad: 'Tarde', modalidad: 'Remota' }, 0],
  ['(2) 5 de 5, disponibilidad y modalidad coinciden', { habilidades: ['JavaScript', 'HTML/CSS', 'Git', 'SQL', 'React'], disponibilidad: 'Mañana', modalidad: 'Híbrida' }, 100],
  ['(3) 4 de 5, disponibilidad y modalidad coinciden', { habilidades: ['JavaScript', 'HTML/CSS', 'SQL', 'Git'], disponibilidad: 'Mañana', modalidad: 'Híbrida' }, 92],
  ['(4) 1 de 5, sin disponibilidad, modalidad coincide', { habilidades: ['React'], disponibilidad: 'Tarde', modalidad: 'Híbrida' }, 33],
  ['(5) 5 de 5, sin disponibilidad ni modalidad', { habilidades: ['JavaScript', 'HTML/CSS', 'Git', 'SQL', 'React'], disponibilidad: 'Tarde', modalidad: 'Remota' }, 40],
];
let ok = 0;
for (const [nombre, perfil, esperado] of casos) {
  const r = calcularCompatibilidad(perfil, oferta).porcentaje;
  assert.strictEqual(r, esperado, `${nombre}: esperado ${esperado}, obtenido ${r}`);
  assert.ok(r >= 0 && r <= 100);
  console.log(`✓ ${nombre} → ${r} %`); ok++;
}
for (const [p, n] of [[49, 'baja'], [50, 'media'], [69, 'media'], [70, 'alta']]) {
  assert.strictEqual(nivel(p), n); console.log(`✓ nivel(${p}) → ${n}`); ok++;
}
console.log(`\n${ok} de 9 comprobaciones aprobadas (CP-03).`);
