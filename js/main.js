// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');

if (menuBtn && menu) {
  const abrir = (aberto) => {
    menu.classList.toggle('aberto', aberto);
    menuBtn.setAttribute('aria-expanded', aberto);
    menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };
  menuBtn.addEventListener('click', () => abrir(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      abrir(false);
      menuBtn.focus();
    }
  });
}

const P = window.PADOCA;
const S = window.PadocaStatus;
const { hora } = S;
const raiz = document.documentElement;
const $ = (s) => document.querySelector(s);
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduz) raiz.classList.add('anima');

const UNIDADE = { un: 'un', kg: 'o kg', fatia: 'a fatia', cento: 'o cento' };
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const precoHTML = (i, aPartir = false) => (P.mostrarPrecos
  ? `${aPartir ? '<span class="etiqueta__de">a partir de</span>' : ''}<strong>${brl(i.preco)}</strong>${i.unidade ? `<span>${UNIDADE[i.unidade]}</span>` : ''}`
  : '<strong>Consulte</strong>');

// Foto com srcset 480/960/1440. `base` sem o sufixo: "assets/img/salgados/coxinha"
const srcset = (base) => `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`;
const foto = (base, alt, classe = '', sizes = '(min-width: 48em) 25vw, 50vw') => `<figure class="foto ${classe}" data-foto="${alt}">
  <img src="${base}-960.webp" srcset="${srcset(base)}" sizes="${sizes}" width="960" height="720" alt="${alt}" loading="lazy">
</figure>`;

// Etiqueta de vitrine (encomendas)
function etiqueta(i, { aPartir = false, href = '' } = {}) {
  return `<li><article class="etiqueta">
    ${i.foto ? foto(i.foto, i.nome, 'etiqueta__foto') : ''}
    ${i.fornada ? `<p class="etiqueta__selo">Sai quentinho às ${hora(i.fornada)}</p>` : ''}
    <h3 class="etiqueta__nome">${href ? `<a class="cobre" href="${href}">${i.nome}</a>` : i.nome}</h3>
    ${i.descricao ? `<p class="etiqueta__desc">${i.descricao}</p>` : ''}
    <p class="etiqueta__preco">${precoHTML(i, aPartir)}</p>
    ${i.encomenda ? `<a class="etiqueta__acao" href="encomendas.html?item=${i.encomenda}">Encomendar<span class="visually-hidden"> ${i.nome}</span></a>` : ''}
  </article></li>`;
}

const grupos = $('[data-encomendas]');
if (grupos) {
  grupos.innerHTML = window.ENCOMENDAS.filter((g) => g.home).map((g) => {
    const barato = g.itens.reduce((a, b) => (b.preco < a.preco ? b : a));
    return etiqueta({ ...barato, nome: g.titulo, descricao: g.descricao, foto: g.foto }, { aPartir: true, href: `encomendas.html#${g.grupo}` });
  }).join('');
}

// ---------- Relógio: hora de Joinville, clima do dia e fornadas ----------
// `?demo` na URL mostra a barrinha "Ver como" para apresentar os três climas
let simulado = null; // minutos do dia simulados (só no modo demo)
const agoraData = () => (simulado == null ? new Date() : new Date(Date.now() + (simulado - S.agora(new Date()).min) * 60000));
const periodo = (min) => (min < 11 * 60 ? 'manha' : min < 17 * 60 ? 'tarde' : 'noite');

const fornadas = $('[data-fornadas]');
const jornada = $('[data-jornada]');
const TAG = { saiu: () => 'Já saiu', agora: () => 'Saindo agora', proxima: (f) => `Em ${S.duracao(f.falta)}`, amanha: () => 'Amanhã', depois: () => '' };

function pintaRelogio() {
  const d = agoraData();
  const { dia, min } = S.agora(d);
  raiz.dataset.periodo = periodo(min);
  if (!fornadas) return;

  const estados = S.fornadasHoje(d, P.fornadas);

  // destaque: a fornada que importa agora
  let i = estados.findIndex((e) => e.estado === 'agora'), modo = 'agora';
  if (i < 0) { i = estados.findIndex((e) => e.estado === 'proxima'); modo = 'proxima'; }
  if (i < 0) { i = 0; modo = 'amanha'; }
  const f = P.fornadas[i], h = hora(f.hora);
  const amanha = P.horarios[(dia + 1) % 7] || Object.values(P.horarios)[0];
  $('[data-rotulo]').textContent = { agora: 'Saindo do forno', proxima: 'Próxima fornada', amanha: 'Amanhã cedo' }[modo];
  $('[data-itens]').textContent = f.itens;
  $('[data-quando]').textContent = modo === 'agora' ? 'quentinho agora.' : `sai às ${h}.`;
  $('[data-falta-rotulo]').textContent = { agora: 'saiu há', proxima: 'faltam', amanha: 'abrimos às' }[modo];
  $('[data-falta]').textContent = modo === 'agora' ? S.duracao(Math.max(1, min - S.minutos(f.hora)))
    : modo === 'proxima' ? S.duracao(estados[i].falta) : hora(amanha[0]);
  const base = f.foto || 'assets/img/fornadas/cesto-paes';
  const img = $('[data-foto-fornada]');
  if (img.dataset.base !== base) {
    img.dataset.base = base;
    img.src = `${base}-960.webp`;
    img.srcset = srcset(base);
    img.alt = f.itens;
  }
  $('[data-legenda]').textContent = `Fornada das ${h}`;

  // cartões de todas as fornadas
  fornadas.innerHTML = P.fornadas.map((fo, n) => {
    const e = estados[n];
    const tag = TAG[e.estado](e);
    return `<li class="fornada ${e.estado}">
      ${fo.foto ? foto(fo.foto, fo.itens, 'fornada__foto', '(min-width: 48em) 25vw, 72vw') : ''}
      <span class="fornada__hora"><time>${hora(fo.hora)}</time></span>
      <span class="fornada__itens">${fo.itens}</span>
      ${tag ? `<span class="fornada__tag">${tag}</span>` : ''}
    </li>`;
  }).join('');

  // barra da jornada, da abertura ao fechamento
  if (!jornada) return;
  const hh = P.horarios[dia] || Object.values(P.horarios)[0]; // dia sem expediente: usa um horário padrão
  const [abre, fecha] = hh.map(S.minutos);
  const pos = (m) => `${(Math.min(Math.max((m - abre) / (fecha - abre), 0), 1) * 100).toFixed(2)}%`;
  const aberto = min >= abre && min < fecha;
  jornada.innerHTML = `
    <div class="jornada__trilho" aria-hidden="true">
      <span class="jornada__feito" style="width:${pos(min)}"></span>
      ${P.fornadas.map((fo, n) => `<span class="jornada__ponto ${estados[n].estado}" style="left:${pos(S.minutos(fo.hora))}"><span class="jornada__hora">${hora(fo.hora)}</span></span>`).join('')}
      ${aberto ? `<span class="jornada__agora" style="left:${pos(min)}">Agora</span>` : ''}
    </div>
    <p class="jornada__pontas"><span>Abre às ${hora(hh[0])}</span><span>Fecha às ${hora(hh[1])}</span></p>`;
}
pintaRelogio();
setInterval(pintaRelogio, 30000);
if (fornadas) {
  // carrossel do mobile já abre na fornada que importa agora (só na carga, pra não brigar com o dedo)
  const alvo = fornadas.querySelector('.agora, .proxima, .amanha');
  if (alvo && fornadas.scrollWidth > fornadas.clientWidth) fornadas.scrollLeft = alvo.offsetLeft - fornadas.offsetLeft - 16;
}

if (new URLSearchParams(location.search).has('demo')) {
  const demo = document.createElement('div');
  demo.className = 'demo';
  demo.setAttribute('role', 'group');
  demo.setAttribute('aria-label', 'Demonstração: ver o site em outro horário');
  demo.innerHTML = 'Ver como' + [['', 'Agora'], ['580', 'Manhã'], ['940', 'Tarde'], ['1190', 'Noite']]
    .map(([m, t]) => `<button type="button" data-simula="${m}" aria-pressed="${m === ''}">${t}</button>`).join('');
  document.body.append(demo);
  demo.addEventListener('click', (e) => {
    const b = e.target.closest('[data-simula]');
    if (!b) return;
    simulado = b.dataset.simula === '' ? null : +b.dataset.simula;
    demo.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    pintaRelogio();
  });
}

// ---------- Vitrine: redomas com plaquinha pendurada ----------
const prateleira = $('[data-prateleira]');
// vitrine da home: só os destaques (fotos reais da Padoca); o resto fica no cardápio
const produtos = window.CARDAPIO.flatMap((c) => c.itens).filter((i) => i.destaque && i.foto);
if (prateleira) {
  prateleira.innerHTML = produtos.map((i) => `<li class="produto">
    <div class="redoma"><img src="${i.foto}-960.webp" srcset="${srcset(i.foto)}" sizes="(min-width: 48em) 24vw, 56vw" width="960" height="1200" alt="${i.nome}" loading="lazy"></div>
    <div class="pendurada"><div class="plaquinha">
      ${i.fornada ? `<span class="plaquinha__sai">Sai às ${hora(i.fornada)}</span>` : ''}
      <span class="plaquinha__nome">${i.nome}</span>
      <span class="plaquinha__preco">${precoHTML(i)}</span>
      ${i.encomenda ? `<a href="encomendas.html?item=${i.encomenda}">Encomendar<span class="visually-hidden"> ${i.nome}</span></a>` : ''}
    </div></div>
  </li>`).join('');
}

// Mobile: no começo o único menu é a faixa do hero; quando ela sai por cima,
// a barra fixa (WhatsApp · Encomendar · Rotas) entra. Sem JS, a barra fica sempre.
// (a troca acontece no quadro() das animações de scroll, mais abaixo)
const barra = $('.barra');
const faixaHero = $('.painel--video .faixa-info');
const trocaMenu = () => { if (barra && faixaHero) barra.classList.toggle('escondida', faixaHero.getBoundingClientRect().bottom > 0); };
trocaMenu();

// Vídeo do hero: não toca para quem pediu menos movimento no sistema
const video = $('video.hero__midia');
if (video && reduz) video.pause();

// ---------- Animações de scroll ----------
const vidro = $('.site-header--vidro');
const vitrine = $('[data-vitrine]');
const trilho = $('.vitrine-rolo__trilho');
const contador = $('[data-contador]');
const progresso = $('[data-progresso]');
const carimbo = $('[data-carimbo]');
const polaroide = $('[data-polaroide]');
const dois = (n) => String(n).padStart(2, '0');

if (reduz) raiz.classList.add('sem-anima');

// a vitrine tem a altura do palco + o quanto a prateleira precisa andar:
// o palco fica preso exatamente durante esses "extra" pixels de rolagem
let extra = 0, topo = 0;
const mede = () => {
  if (!vitrine || reduz) return;
  topo = parseFloat(getComputedStyle(vitrine.querySelector('.vitrine-rolo__palco')).top) || 0;
  extra = Math.max(0, prateleira.scrollWidth - trilho.clientWidth);
  vitrine.style.height = `calc(100svh - ${topo}px + ${extra}px)`;
};

let ultimoY = scrollY, vel = 0, rodando = false;
function quadro() {
  const y = scrollY;
  // header da home: transparente sobre o vídeo, ganha fundo depois dele
  if (vidro) vidro.classList.toggle('tem-fundo', y > innerHeight - vidro.offsetHeight);
  trocaMenu();
  if (!reduz) {
    if (vitrine) {
      // prateleira anda de lado conforme a vitrine passa pela tela
      const p = extra ? Math.min(Math.max((y - vitrine.offsetTop + topo) / extra, 0), 1) : 0;
      prateleira.style.transform = `translate3d(${(-p * extra).toFixed(1)}px, 0, 0)`;
      contador.textContent = `${dois(Math.round(p * (produtos.length - 1)) + 1)} / ${dois(produtos.length)}`;
      progresso.style.setProperty('--p', `${(p * 100).toFixed(1)}%`);
      // plaquinhas balançam contra o movimento e voltam devagar
      prateleira.style.setProperty('--balanco', `${Math.max(-10, Math.min(10, -vel * 0.35)).toFixed(2)}deg`);
    }
    // carimbo gira e a polaroide da fornada sobe um pouco mais devagar que a página
    if (polaroide) {
      const rel = polaroide.getBoundingClientRect().top - innerHeight / 2;
      polaroide.style.setProperty('--sobe', `${(rel * 0.08).toFixed(1)}px`);
      carimbo.style.setProperty('--giro', `${(y * 0.06).toFixed(1)}deg`);
    }
  }
  vel = vel * 0.8 + (y - ultimoY) * 0.2;
  ultimoY = y;
  if (Math.abs(vel) > 0.05) requestAnimationFrame(quadro); else rodando = false;
}
const acorda = () => { if (!rodando) { rodando = true; requestAnimationFrame(quadro); } };
addEventListener('scroll', acorda, { passive: true });
addEventListener('resize', () => { mede(); acorda(); });
addEventListener('load', () => { mede(); acorda(); });
mede();
quadro();

// fotos do mural caem no lugar quando entram na tela
const mural = document.querySelectorAll('.galeria li');
if (!reduz && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  mural.forEach((li) => io.observe(li));
  // rede de segurança: nada fica escondido se o observer falhar
  setTimeout(() => mural.forEach((li) => li.classList.add('visto')), 8000);
} else {
  mural.forEach((li) => li.classList.add('visto'));
}
