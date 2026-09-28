// Cardápio: monta as categorias a partir de js/cardapio-data.js.
// Reaproveita do main.js (carregado antes): P, hora, brl, precoHTML, srcset, UNIDADE.
(() => {
  const alvo = document.querySelector('[data-cardapio]');
  if (!alvo) return;

  const encomendar = (i) => (i.encomenda
    ? `<a class="quadro__encomendar" href="encomendas.html?item=${i.encomenda}">Encomendar<span class="visually-hidden"> ${i.nome}</span></a>`
    : '');

  // com foto: redoma + plaquinha (mesmo desenho da vitrine da home)
  const comFoto = (i) => `<li class="produto">
    <div class="redoma"><img src="${i.foto}-960.webp" srcset="${srcset(i.foto)}" sizes="(min-width: 60em) 22vw, (min-width: 40em) 30vw, 45vw" width="960" height="1200" alt="${i.nome}" loading="lazy"></div>
    <div class="pendurada"><div class="plaquinha">
      ${i.fornada ? `<span class="plaquinha__sai">Sai às ${hora(i.fornada)}</span>` : ''}
      <span class="plaquinha__nome">${i.nome}</span>
      ${i.descricao ? `<span class="plaquinha__desc">${i.descricao}</span>` : ''}
      <span class="plaquinha__preco">${precoHTML(i)}</span>
      ${i.encomenda ? `<a href="encomendas.html?item=${i.encomenda}">Encomendar<span class="visually-hidden"> ${i.nome}</span></a>` : ''}
    </div></div>
  </li>`;

  // sem foto: linha do quadro de preços (nome ······ preço)
  const semFoto = (i) => `<li class="quadro__linha">
    <span class="quadro__nome">${i.nome}${i.descricao ? `<small>${i.descricao}</small>` : ''}${i.fornada ? `<small class="quadro__sai">Sai às ${hora(i.fornada)}</small>` : ''}</span>
    <span class="quadro__pontos" aria-hidden="true"></span>
    <span class="quadro__preco">${P.mostrarPrecos ? `${brl(i.preco)}${i.unidade ? ` <small>${UNIDADE[i.unidade]}</small>` : ''}` : 'Consulte'}</span>
    ${encomendar(i)}
  </li>`;

  document.querySelector('[data-categorias-nav]').innerHTML = window.CARDAPIO
    .map((c) => `<a href="#${c.categoria}">${c.titulo}</a>`).join('');

  alvo.innerHTML = window.CARDAPIO.map((c) => {
    const fotos = c.itens.filter((i) => i.foto);
    const resto = c.itens.filter((i) => !i.foto);
    return `<section class="categoria" id="${c.categoria}" aria-labelledby="c-${c.categoria}">
      <h2 id="c-${c.categoria}">${c.titulo}</h2>
      ${fotos.length ? `<ul class="cardapio-fotos" role="list">${fotos.map(comFoto).join('')}</ul>` : ''}
      ${resto.length ? `<ul class="quadro" role="list">${resto.map(semFoto).join('')}</ul>` : ''}
    </section>`;
  }).join('');
})();
