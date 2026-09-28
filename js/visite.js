// Visite: horários da semana a partir de config.horarios, com o dia de hoje destacado.
// Reaproveita do main.js (carregado antes): P, S, hora.
(() => {
  const lista = document.querySelector('[data-horarios]');
  if (!lista) return;
  const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = S.agora(new Date()).dia;
  // a semana começa na segunda
  lista.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const h = P.horarios[d];
    const eHoje = d === hoje;
    return `<li${eHoje ? ' class="hoje" aria-current="date"' : ''}>
      <span>${DIAS[d]}${eHoje ? ' <em>hoje</em>' : ''}</span>
      <span>${h ? `${hora(h[0])} às ${hora(h[1])}` : 'Fechado'}</span>
    </li>`;
  }).join('');
})();
