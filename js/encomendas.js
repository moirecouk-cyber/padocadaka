// Montador de encomenda → mensagem no WhatsApp.
// A parte de cima é lógica pura (testada em tests/encomendas.test.js); a de baixo mexe na página.
(function (raiz) {
  const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

  // valor de uma linha: item "cento" tem preço por 100 unidades
  const subtotal = (item, qtd) => (item.unidade === 'cento' ? (item.preco * qtd) / 100 : item.preco * qtd);
  const qtdTexto = (item, qtd) => (item.unidade === 'kg' ? `${num(qtd)} kg` : `${qtd} un`);

  // linhas do pedido a partir do estado { itens: { id: { qtd, sabores } } } e do catálogo (window.ENCOMENDAS)
  function linhas(pedido, grupos) {
    const catalogo = grupos.flatMap((g) => g.itens);
    return Object.entries(pedido.itens || {})
      .map(([id, e]) => ({ item: catalogo.find((i) => i.id === id), qtd: e.qtd, sabores: e.sabores || [] }))
      .filter((l) => l.item && l.qtd > 0)
      .map((l) => ({ ...l, valor: subtotal(l.item, l.qtd) }));
  }
  const total = (ls) => ls.reduce((s, l) => s + l.valor, 0);

  // data de hoje em Joinville, "AAAA-MM-DD"
  const dataSP = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const maisUmDia = (iso) => new Date(Date.parse(iso + 'T12:00:00Z') + 864e5).toISOString().slice(0, 10);

  // antecedência: a maior entre os itens (bolo de festa ou cesta → 72h); a data vira o dia seguinte
  // se a hora que sobra já passou do fim da retirada
  function antecedencia(ls, cfg) {
    const h = cfg.encomendas.antecedenciaHoras;
    return ls.reduce((m, l) => Math.max(m, h[l.item.antecedencia] || h.padrao), h.padrao);
  }
  function dataMinima(agora, ls, cfg, minutosSP) {
    const t = new Date(agora.getTime() + antecedencia(ls, cfg) * 36e5);
    const d = dataSP(t);
    const fim = cfg.encomendas.horarioRetirada[1].split(':');
    return minutosSP(t) > fim[0] * 60 + +fim[1] ? maisUmDia(d) : d;
  }
  const ddmm = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
  const diaCurto = (iso) => new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' })
    .format(new Date(iso + 'T12:00:00Z')).replace('.', '') + ' ' + ddmm(iso);
  const horaTexto = (h) => h.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');

  function valida(pedido, ls, cfg, agora, minutosSP) {
    const erros = [];
    if (!ls.length) erros.push('Escolha pelo menos um item.');
    ls.filter((l) => l.item.sabores && !l.sabores.length)
      .forEach((l) => erros.push(`Escolha ${l.item.maxSabores === 1 ? 'o sabor' : 'os sabores'}: ${l.item.nome}.`));
    if (!(pedido.nome || '').trim()) erros.push('Informe seu nome.');
    const min = dataMinima(agora, ls, cfg, minutosSP);
    if (!pedido.data) erros.push('Escolha a data.');
    else if (pedido.data < min) erros.push(`Encomendas a partir de ${ddmm(min)}.`);
    if (!pedido.hora) erros.push('Escolha o horário.');
    if (pedido.modo === 'entrega' && !(pedido.endereco || '').trim()) erros.push('Informe o endereço de entrega.');
    const falta = faltaMinimo(pedido, ls, cfg);
    if (ls.length && falta > 0) erros.push(`Faltam ${brl(falta)} para o pedido mínimo de ${pedido.modo === 'entrega' ? 'entrega' : 'retirada'}.`);
    return erros;
  }
  const faltaMinimo = (pedido, ls, cfg) => {
    const e = cfg.encomendas;
    return Math.max(0, (pedido.modo === 'entrega' ? e.pedidoMinimoEntrega : e.pedidoMinimoRetirada) - total(ls));
  };
  const sinal = (ls, cfg) => {
    const s = cfg.encomendas.sinal, t = total(ls);
    return t > s.aPartirDe ? (t * s.percentual) / 100 : 0;
  };

  const linhaTexto = (l) => {
    const { item, qtd } = l;
    const base = item.unidade === 'cento' ? `${qtd} ${item.nome}`
      : item.unidade === 'kg' ? `${item.nome} — ${num(qtd)} kg`
      : qtd === 1 ? item.nome : `${qtd}× ${item.nome}`;
    return l.sabores.length ? `${base} (${l.sabores.join(', ').toLowerCase()})` : base;
  };

  function mensagem(pedido, ls, cfg) {
    const entrega = pedido.modo === 'entrega';
    const s = sinal(ls, cfg);
    return [
      'Oi, Padoca da Ka! Encomenda pelo site:',
      '',
      ...ls.map((l) => `• ${linhaTexto(l)}`),
      '',
      `${entrega ? 'Entrega' : 'Retirada'}: ${diaCurto(pedido.data)}, ${horaTexto(pedido.hora)}`,
      entrega ? `Endereço: ${pedido.endereco.trim()}` : null,
      `Nome: ${pedido.nome.trim()}`,
      (pedido.obs || '').trim() ? `Obs.: ${pedido.obs.trim()}` : null,
      '',
      `Total estimado: ${brl(total(ls))}`,
      s ? `Sinal de ${cfg.encomendas.sinal.percentual}% (${brl(s)}) no ${cfg.encomendas.sinal.forma}` : null,
    ].filter((x) => x !== null).join('\n');
  }

  // sugestão complementar: percorre os itens na ordem em que entraram na sacola e devolve o
  // primeiro "sugere" do grupo deles que ainda não está no pedido nem foi dispensado
  function sugestao(pedido, grupos) {
    const dentro = new Set(Object.keys(pedido.itens || {}).filter((id) => pedido.itens[id].qtd > 0));
    const fora = new Set(pedido.dispensados || []);
    const catalogo = grupos.flatMap((g) => g.itens);
    for (const id of dentro) {
      const g = grupos.find((gr) => gr.itens.some((i) => i.id === id));
      for (const s of (g && g.sugere) || []) {
        if (!dentro.has(s) && !fora.has(s)) return catalogo.find((i) => i.id === s) || null;
      }
    }
    return null;
  }

  raiz.PadocaEncomenda = { subtotal, qtdTexto, linhas, total, dataMinima, valida, mensagem, faltaMinimo, sinal, sugestao, ddmm, brl };

  if (typeof document === 'undefined') return;

  /* ================= página ================= */
  const P = raiz.PADOCA, G = raiz.ENCOMENDAS, S = raiz.PadocaStatus;
  const minutosSP = (d) => S.agora(d).min;
  const $ = (s, el = document) => el.querySelector(s);
  const montador = $('[data-montador]');
  if (!montador) return;
  const form = $('#pedido');
  const CHAVE = 'padoca-encomenda';

  let pedido = { itens: {}, nome: '', data: '', hora: '', modo: 'retirada', endereco: '', obs: '' };
  try { Object.assign(pedido, JSON.parse(localStorage.getItem(CHAVE)) || {}); } catch (e) { /* sem rascunho */ }
  const salva = () => { try { localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch (e) { /* sem armazenamento */ } };

  const regra = (i) => {
    if (i.unidade === 'kg') return `Mínimo ${num(i.minimo)} kg`;
    const partes = [];
    if (i.minimo > 1) partes.push(`Mínimo ${i.minimo} un`);
    if (i.multiplo > 1) partes.push(`de ${i.multiplo} em ${i.multiplo}`);
    return partes.join(', ');
  };
  const UNIDADE = { un: 'un', kg: 'o kg', cento: 'o cento' };

  // grupos e itens
  $('[data-grupos-nav]').innerHTML = G.map((g) => `<a href="#${g.grupo}">${g.titulo}</a>`).join('');
  montador.innerHTML = G.map((g) => `
    <section class="grupo" id="${g.grupo}" aria-labelledby="g-${g.grupo}">
      <div class="grupo__topo">
        <h2 id="g-${g.grupo}">${g.titulo}</h2>
        ${g.descricao ? `<p>${g.descricao}</p>` : ''}
      </div>
      <ul class="grupo__itens" role="list">
        ${g.itens.map((i) => `
        <li class="item-enc" data-id="${i.id}">
          <div class="item-enc__info">
            <h3>${i.nome}</h3>
            ${i.inclui ? `<p class="item-enc__inclui">${i.inclui}</p>` : ''}
            <p class="item-enc__preco"><strong>${brl(i.preco).replace(',00', '')}</strong> ${UNIDADE[i.unidade]}</p>
            ${regra(i) ? `<p class="item-enc__regra">${regra(i)}</p>` : ''}
          </div>
          <div class="passo">
            <button type="button" data-menos aria-label="Tirar ${i.nome}">−</button>
            <output data-qtd aria-live="polite">0</output>
            <button type="button" data-mais aria-label="Adicionar ${i.nome}">+</button>
          </div>
          ${i.sabores ? `
          <fieldset class="sabores" hidden>
            <legend>${i.maxSabores === 1 ? 'Escolha o sabor' : `Sabores (até ${i.maxSabores})`}</legend>
            ${i.sabores.map((s) => `<label class="chip"><input type="checkbox" value="${s}"><span>${s}</span></label>`).join('')}
          </fieldset>` : ''}
        </li>`).join('')}
      </ul>
    </section>`).join('');

  const pula = (el) => { if (!el) return; el.classList.remove('pulou'); void el.offsetWidth; el.classList.add('pulou'); };

  // Mobile: a sacola abre por cima da página (gaveta) e, ao fechar, o cliente continua onde estava
  const sacola = $('#sacola');
  const barra = $('[data-sacola-barra]');
  const abrirBtn = $('[data-abrir-sacola]');
  const fundo = $('.sacola-fundo');
  const mobile = matchMedia('(max-width: 59.99em)');
  const focaveis = () => [...sacola.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea')].filter((el) => el.offsetParent);
  function abreSacola() {
    if (!mobile.matches) return;
    sacola.classList.add('aberta');
    sacola.setAttribute('role', 'dialog');
    sacola.setAttribute('aria-modal', 'true');
    fundo.hidden = false;
    requestAnimationFrame(() => fundo.classList.add('visivel'));
    abrirBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('sacola-aberta'); // trava a rolagem da página por trás
    $('#t-pedido').focus({ preventScroll: true });
  }
  function fechaSacola() {
    if (!sacola.classList.contains('aberta')) return;
    sacola.classList.remove('aberta');
    sacola.removeAttribute('role');
    sacola.removeAttribute('aria-modal');
    fundo.classList.remove('visivel');
    fundo.hidden = true;
    abrirBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('sacola-aberta');
    abrirBtn.focus({ preventScroll: true });
  }
  abrirBtn.addEventListener('click', abreSacola);
  document.querySelectorAll('[data-fechar-sacola]').forEach((el) => el.addEventListener('click', fechaSacola));
  document.addEventListener('keydown', (ev) => {
    if (!sacola.classList.contains('aberta')) return;
    if (ev.key === 'Escape') fechaSacola();
    if (ev.key === 'Tab') { // foco não escapa da gaveta
      const f = focaveis(), primeiro = f[0], ultimo = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
    }
  });
  mobile.addEventListener('change', () => { if (!mobile.matches) fechaSacola(); });

  const catalogo = G.flatMap((g) => g.itens);
  const achaItem = (id) => catalogo.find((i) => i.id === id);

  function pintaItem(li) {
    const i = achaItem(li.dataset.id), e = pedido.itens[i.id] || { qtd: 0, sabores: [] };
    li.classList.toggle('escolhido', e.qtd > 0);
    $('[data-qtd]', li).textContent = e.qtd ? qtdTexto(i, e.qtd) : '0';
    $('[data-menos]', li).disabled = !e.qtd;
    const fs = $('.sabores', li);
    if (fs) {
      fs.hidden = !e.qtd;
      fs.querySelectorAll('input').forEach((c) => {
        c.checked = e.sabores.includes(c.value);
        c.disabled = !c.checked && e.sabores.length >= i.maxSabores;
      });
    }
  }

  // muda a quantidade de um item (+1 passo, −1 passo ou 0 = remover); usado pelo montador e pela sacola
  function muda(id, passo) {
    const i = achaItem(id);
    const e = pedido.itens[id] || (pedido.itens[id] = { qtd: 0, sabores: [] });
    if (passo > 0) e.qtd = e.qtd ? e.qtd + i.multiplo : i.minimo;
    else if (passo < 0) e.qtd = e.qtd - i.multiplo < i.minimo ? 0 : e.qtd - i.multiplo;
    else e.qtd = 0;
    if (!e.qtd) delete pedido.itens[id];
    const li = montador.querySelector(`[data-id="${id}"]`);
    pintaItem(li);
    return li;
  }

  montador.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-mais], [data-menos]');
    if (!b) return;
    const li = muda(b.closest('.item-enc').dataset.id, b.hasAttribute('data-mais') ? 1 : -1);
    pula(li);
    pula(barra); // no mobile, a barrinha da sacola pisca com o total novo
    atualiza();
  });
  montador.addEventListener('change', (ev) => {
    const c = ev.target.closest('.chip input');
    if (!c) return;
    const li = c.closest('.item-enc'), e = pedido.itens[li.dataset.id];
    const marcados = [...li.querySelectorAll('.chip input:checked')].map((x) => x.value);
    const i = achaItem(li.dataset.id);
    e.sabores = i.maxSabores === 1 ? (c.checked ? [c.value] : []) : marcados;
    pintaItem(li);
    atualiza();
  });

  // formulário
  const campos = ['nome', 'data', 'hora', 'endereco', 'obs'];
  campos.forEach((n) => { if (form.elements[n] && pedido[n]) form.elements[n].value = pedido[n]; });
  form.querySelectorAll('input[name="modo"]').forEach((r) => { r.checked = r.value === pedido.modo; });
  form.addEventListener('input', (ev) => {
    const n = ev.target.name;
    if (n === 'modo') pedido.modo = ev.target.value;
    else if (campos.includes(n)) pedido[n] = ev.target.value;
    atualiza();
  });

  function horarios() {
    const [a, b] = (pedido.modo === 'entrega' ? P.entrega.horario : P.encomendas.horarioRetirada).map(S.minutos);
    const sel = form.elements.hora, atual = pedido.hora;
    const opcoes = [];
    for (let m = a; m <= b; m += 30) opcoes.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    sel.innerHTML = '<option value="">Escolha</option>' + opcoes.map((h) => `<option value="${h}">${horaTexto(h)}</option>`).join('');
    if (opcoes.includes(atual)) sel.value = atual; else pedido.hora = '';
  }

  const erroBox = $('[data-erros]');
  const enviar = $('[data-enviar]');
  const bump = $('[data-bump]');
  let tentou = false;

  // botões dentro da sacola: − / + / Remover
  $('[data-resumo]').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-l]');
    if (!b) return;
    const id = b.closest('[data-linha]').dataset.linha;
    muda(id, +b.dataset.l);
    pula(barra);
    atualiza();
    // o foco não se perde quando a linha some ou é redesenhada
    const volta = $(`[data-linha="${id}"] [data-l="${b.dataset.l}"]`) || $('#t-pedido');
    volta.focus({ preventScroll: true });
  });
  // sugestão: adicionar (na quantidade mínima) ou dispensar
  $('[data-bump-add]').addEventListener('click', () => {
    const id = bump.dataset.id;
    muda(id, 1);
    pula(barra);
    atualiza();
    const linha = $(`[data-linha="${id}"]`);
    pula(linha);
    $('#t-pedido').focus({ preventScroll: true });
  });
  $('[data-bump-nao]').addEventListener('click', () => {
    pedido.dispensados = [...(pedido.dispensados || []), bump.dataset.id];
    atualiza();
  });

  function atualiza() {
    const ls = linhas(pedido, G);
    const t = total(ls);
    const entrega = pedido.modo === 'entrega';

    // data mínima conforme os itens
    const min = dataMinima(new Date(), ls, P, minutosSP);
    form.elements.data.min = min;
    const h72 = ls.some((l) => l.item.antecedencia === 'bolosECestas');
    $('[data-data-dica]').textContent = `A partir de ${ddmm(min)} (${h72 ? 72 : 48}h de antecedência${h72 ? ' por causa do bolo de festa ou da cesta' : ''}).`;
    $('[data-endereco]').hidden = !entrega;
    horarios();

    // resumo: cada linha com − / + e Remover, sem sair da sacola
    $('[data-resumo]').innerHTML = ls.length
      ? ls.map((l) => `<li data-linha="${l.item.id}">
          <span class="resumo__nome">${l.item.unidade === 'cento' || l.item.unidade === 'kg' ? qtdTexto(l.item, l.qtd) : l.qtd + '×'} ${l.item.nome}${l.sabores.length ? `<small>${l.sabores.join(', ')}</small>` : ''}</span>
          <span class="resumo__valor">${brl(l.valor)}</span>
          <span class="resumo__acoes">
            <button type="button" data-l="-1" aria-label="Tirar um pouco: ${l.item.nome}">−</button>
            <button type="button" data-l="1" aria-label="Adicionar mais: ${l.item.nome}">+</button>
            <button type="button" data-l="0" class="resumo__remover">Remover<span class="visually-hidden"> ${l.item.nome}</span></button>
          </span>
        </li>`).join('')
      : '<li class="resumo__vazio">Sua sacola está vazia.</li>';

    // sugestão "Combina com o seu pedido"
    const sug = sugestao(pedido, G);
    bump.hidden = !sug;
    if (sug) {
      bump.dataset.id = sug.id;
      $('[data-bump-nome]').textContent = sug.nome;
      $('[data-bump-chamada]').textContent = sug.chamada || sug.inclui || '';
      $('[data-bump-preco]').textContent = `+ ${brl(subtotal(sug, sug.minimo))}`;
      $('[data-bump-add]').setAttribute('aria-label', `Adicionar ${sug.nome} ao pedido`);
    }
    $('[data-total]').textContent = brl(t);
    document.querySelectorAll('[data-total-curto]').forEach((el) => { el.textContent = brl(t); });
    document.querySelectorAll('[data-contagem]').forEach((el) => { el.textContent = ls.length ? `${ls.length} ${ls.length === 1 ? 'item' : 'itens'}` : 'Sacola vazia'; });
    const s = sinal(ls, P);
    const avisos = [];
    const falta = faltaMinimo(pedido, ls, P);
    if (ls.length && falta > 0) avisos.push(`<p class="aviso aviso--falta">Faltam ${brl(falta)} para o pedido mínimo de ${entrega ? 'entrega' : 'retirada'}.</p>`);
    if (s) avisos.push(`<p class="aviso">Sinal de ${P.encomendas.sinal.percentual}% (${brl(s)}) no ${P.encomendas.sinal.forma} para confirmar.</p>`);
    if (entrega) avisos.push(`<p class="aviso">Taxa a partir de ${brl(P.entrega.faixas[0].taxa).replace(',00', '')}, confirmada no WhatsApp.</p>`);
    $('[data-avisos]').innerHTML = avisos.join('');

    // botão: só libera com o pedido mínimo; os outros erros aparecem ao tentar enviar
    const erros = valida(pedido, ls, P, new Date(), minutosSP);
    enviar.setAttribute('aria-disabled', !ls.length || falta > 0);
    enviar.href = erros.length ? '#pedido' : `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(mensagem(pedido, ls, P))}`;
    if (tentou) mostraErros(erros);
    salva();
  }

  function mostraErros(erros) {
    erroBox.innerHTML = erros.length ? `<ul>${erros.map((e) => `<li>${e}</li>`).join('')}</ul>` : '';
    erroBox.hidden = !erros.length;
  }
  enviar.addEventListener('click', (ev) => {
    const erros = valida(pedido, linhas(pedido, G), P, new Date(), minutosSP);
    if (!erros.length) return; // segue o link para o WhatsApp
    ev.preventDefault();
    tentou = true;
    mostraErros(erros);
    erroBox.focus();
  });

  // ?item=id vem do cardápio/home: já coloca o item na sacola e rola até ele
  const pedidoUrl = new URLSearchParams(location.search).get('item');
  const itemUrl = pedidoUrl && achaItem(pedidoUrl);
  if (itemUrl && !pedido.itens[itemUrl.id]) pedido.itens[itemUrl.id] = { qtd: itemUrl.minimo, sabores: [] };

  montador.querySelectorAll('.item-enc').forEach(pintaItem);
  atualiza();
  if (itemUrl) {
    const li = montador.querySelector(`[data-id="${itemUrl.id}"]`);
    pula(li);
    li.scrollIntoView({ block: 'center', behavior: 'instant' });
  }

  // dúvidas: respostas vêm do config (fonte única)
  const e = P.encomendas, ent = P.entrega;
  const duvidas = [
    ['Antecedência?', `${e.antecedenciaHoras.padrao}h para salgados e docinhos, ${e.antecedenciaHoras.bolosECestas}h para bolos de festa e cestas.`],
    ['Precisa de sinal?', `Acima de ${brl(e.sinal.aPartirDe).replace(',00', '')}, ${e.sinal.percentual}% no ${e.sinal.forma} para confirmar.`],
    ['Vocês entregam?', `Sim, das ${horaTexto(ent.horario[0])} às ${horaTexto(ent.horario[1])}. Taxa a partir de ${brl(ent.faixas[0].taxa).replace(',00', '')}.`],
    ['Formas de pagamento?', 'Pix, cartão e dinheiro.'],
    ['Posso cancelar?', `Sim, até ${e.cancelamentoHoras}h antes, com o sinal devolvido.`],
  ];
  $('[data-duvidas]').innerHTML = duvidas.map(([p, r]) => `<details><summary>${p}</summary><p>${r}</p></details>`).join('');
})(typeof window !== 'undefined' ? window : globalThis);
