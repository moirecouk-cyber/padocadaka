// node tests/encomendas.test.js
const assert = require('node:assert');
globalThis.window = globalThis;
require('../js/config.js');
require('../js/cardapio-data.js');
require('../js/status.js');
require('../js/encomendas.js');
const E = globalThis.PadocaEncomenda, P = globalThis.PADOCA, G = globalThis.ENCOMENDAS, S = globalThis.PadocaStatus;
const minSP = (d) => S.agora(d).min;
// 26/09/2026 é sábado; São Paulo = UTC-3
const sp = (dia, h, m = 0) => new Date(Date.UTC(2026, 8, dia, h + 3, m));

// preço por linha
const fritos = G.flatMap((g) => g.itens).find((i) => i.id === 'salgados-fritos');
const boloFesta = G.flatMap((g) => g.itens).find((i) => i.id === 'bolo-festa');
assert.strictEqual(E.subtotal(fritos, 100), 95);
assert.strictEqual(E.subtotal(fritos, 50), 47.5);
assert.strictEqual(E.subtotal(boloFesta, 2), 190);

// data mínima: 48h no padrão, 72h com bolo de festa/cesta, pula um dia se passar do fim da retirada (19h)
const so = (itens) => E.linhas({ itens }, G);
const salgados = so({ 'salgados-fritos': { qtd: 100, sabores: ['Coxinha'] } });
const comBolo = so({ 'salgados-fritos': { qtd: 100, sabores: ['Coxinha'] }, 'bolo-festa': { qtd: 2, sabores: ['Prestígio'] } });
assert.strictEqual(E.dataMinima(sp(26, 10), salgados, P, minSP), '2026-09-28');
assert.strictEqual(E.dataMinima(sp(26, 10), comBolo, P, minSP), '2026-09-29');
assert.strictEqual(E.dataMinima(sp(26, 19, 30), salgados, P, minSP), '2026-09-29'); // 48h depois cai às 19h30
assert.strictEqual(E.dataMinima(sp(26, 23, 0), salgados, P, minSP), '2026-09-29'); // vira o dia em SP

// validação
const base = { itens: {}, nome: '', data: '', hora: '', modo: 'retirada', endereco: '', obs: '' };
assert.deepStrictEqual(E.valida(base, so({}), P, sp(26, 10), minSP),
  ['Escolha pelo menos um item.', 'Informe seu nome.', 'Escolha a data.', 'Escolha o horário.']);
const semSabor = so({ 'salgados-fritos': { qtd: 100, sabores: [] } });
assert.ok(E.valida({ ...base, nome: 'Mariana', data: '2026-10-03', hora: '15:00' }, semSabor, P, sp(26, 10), minSP)
  .includes('Escolha os sabores: Salgados fritos sortidos.'));
assert.deepStrictEqual(E.valida({ ...base, nome: 'Mariana', data: '2026-09-27', hora: '15:00' }, salgados, P, sp(26, 10), minSP),
  ['Encomendas a partir de 28/09.']);
// mínimo: retirada R$ 80 (95 ok); entrega R$ 120 (falta 25) e pede endereço
assert.deepStrictEqual(E.valida({ ...base, nome: 'Mariana', data: '2026-10-03', hora: '15:00', modo: 'entrega' }, salgados, P, sp(26, 10), minSP),
  ['Informe o endereço de entrega.', 'Faltam R$ 25,00 para o pedido mínimo de entrega.']);
assert.deepStrictEqual(E.valida({ ...base, nome: 'Mariana', data: '2026-10-03', hora: '15:00' }, salgados, P, sp(26, 10), minSP), []);

// sinal só acima de R$ 150
assert.strictEqual(E.sinal(salgados, P), 0);
assert.strictEqual(E.sinal(comBolo, P), (95 + 190) / 2);

// mensagem no formato do brief
const msg = E.mensagem({ ...base, nome: 'Mariana', data: '2026-10-03', hora: '15:00', obs: 'sem pimenta' },
  so({ 'salgados-fritos': { qtd: 100, sabores: ['Coxinha', 'Risole'] }, 'bolo-festa': { qtd: 2, sabores: ['Prestígio'] } }), P);
assert.strictEqual(msg, [
  'Oi, Padoca da Ka! Encomenda pelo site:',
  '',
  '• 100 Salgados fritos sortidos (coxinha, risole)',
  '• Bolo de festa — 2 kg (prestígio)',
  '',
  'Retirada: sáb 03/10, 15h',
  'Nome: Mariana',
  'Obs.: sem pimenta',
  '',
  'Total estimado: R$ 285,00',
  'Sinal de 50% (R$ 142,50) no Pix',
].join('\n'));
const msgEntrega = E.mensagem({ ...base, nome: 'Ana', data: '2026-10-05', hora: '09:30', modo: 'entrega', endereco: 'R. X, 10' },
  so({ 'cesta-dois': { qtd: 1 } }), P);
assert.ok(msgEntrega.includes('• Cesta de café da manhã para dois\n'));
assert.ok(msgEntrega.includes('Entrega: seg 05/10, 9h30\nEndereço: R. X, 10\nNome: Ana'));

// sugestão complementar ("Combina com o seu pedido")
const sug = (itens, dispensados) => (E.sugestao({ itens, dispensados }, G) || {}).id;
assert.strictEqual(sug({}), undefined); // sacola vazia: nada
assert.strictEqual(sug({ 'kit-festa-p': { qtd: 1 } }), 'refri-2l');
assert.strictEqual(sug({ 'kit-festa-p': { qtd: 1 } }, ['refri-2l']), 'churros-porcao'); // dispensou o refri
assert.strictEqual(sug({ 'kit-festa-p': { qtd: 1 }, 'refri-2l': { qtd: 1 } }), 'churros-porcao'); // refri já está
assert.strictEqual(sug({ 'kit-coffee-p': { qtd: 1 } }), 'cafe-garrafa');
assert.strictEqual(sug({ 'kit-festa-p': { qtd: 1 } }, ['refri-2l', 'churros-porcao', 'descartaveis']), undefined);

console.log('encomendas ok');
