// node tests/status.test.js
const assert = require("node:assert");
require("../js/status.js");
const { status, fornadasHoje, duracao } = globalThis.PadocaStatus;

const todos = Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, ["07:00", "19:30"]]));
// 27/09/2026 é domingo; São Paulo = UTC-3
const sp = (dia, h, m) => new Date(Date.UTC(2026, 8, 27 + dia, h + 3, m));

for (let d = 0; d < 7; d++) {
  assert.deepStrictEqual(status(sp(d, 6, 59), todos), { aberto: false, texto: "Fechado · abre às 7h" });
  assert.strictEqual(status(sp(d, 7, 0), todos).texto, "Aberto agora · fecha às 19h30");
  assert.strictEqual(status(sp(d, 12, 0), todos).aberto, true);
  assert.strictEqual(status(sp(d, 19, 29), todos).aberto, true);
  assert.strictEqual(status(sp(d, 19, 30), todos).texto, "Fechado · abre amanhã às 7h");
  assert.strictEqual(status(sp(d, 23, 59), todos).texto, "Fechado · abre amanhã às 7h");
}

// dia sem expediente (domingo fechado)
const semDomingo = { ...todos };
delete semDomingo[0];
assert.strictEqual(status(sp(6, 20, 0), semDomingo).texto, "Fechado · abre segunda às 7h");
assert.strictEqual(status(sp(0, 12, 0), semDomingo).texto, "Fechado · abre amanhã às 7h");

const fornadas = [{ hora: "07:00" }, { hora: "11:00" }, { hora: "16:00" }];
const estados = (h, m) => fornadasHoje(sp(2, h, m), fornadas).map((f) => f.estado).join(" ");
assert.strictEqual(estados(6, 0), "proxima depois depois");
assert.deepStrictEqual(fornadasHoje(sp(2, 6, 0), fornadas)[0], { estado: "proxima", falta: 60 });
assert.strictEqual(estados(7, 0), "agora depois depois");
assert.strictEqual(estados(7, 29), "agora depois depois");
assert.strictEqual(estados(7, 30), "saiu proxima depois");
assert.strictEqual(estados(10, 0), "saiu proxima depois");
assert.strictEqual(estados(16, 10), "saiu saiu agora");
assert.strictEqual(estados(17, 0), "amanha saiu saiu");

assert.strictEqual(duracao(80), "1h20");
assert.strictEqual(duracao(120), "2h");
assert.strictEqual(duracao(45), "45 min");
assert.strictEqual(duracao(65), "1h05");

console.log("status ok");
