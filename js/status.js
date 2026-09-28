// Selo "Aberto agora / Fechado" e próxima fornada, sempre no fuso de Joinville.
(function (raiz) {
  const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const SEMANA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const relogio = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });

  const minutos = (h) => { const [a, b] = h.split(":"); return a * 60 + +b; };
  // "07:00" → "7h", "19:30" → "19h30"
  const hora = (h) => h.replace(/^0/, "").replace(":00", "h").replace(":", "h");

  function agora(date) {
    const p = Object.fromEntries(relogio.formatToParts(date).map((x) => [x.type, x.value]));
    return { dia: SEMANA[p.weekday], min: p.hour * 60 + +p.minute };
  }

  function status(date, horarios) {
    const { dia, min } = agora(date);
    const h = horarios[dia];
    if (h && min >= minutos(h[0]) && min < minutos(h[1])) return { aberto: true, texto: `Aberto agora · fecha às ${hora(h[1])}` };
    if (h && min < minutos(h[0])) return { aberto: false, texto: `Fechado · abre às ${hora(h[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (horarios[d]) return { aberto: false, texto: `Fechado · abre ${i === 1 ? "amanhã" : DIAS[d]} às ${hora(horarios[d][0])}` };
    }
    return { aberto: false, texto: "Fechado" };
  }

  // Estado de cada fornada de hoje: saiu | agora (até 30 min depois) | proxima | depois | amanha
  function fornadasHoje(date, fornadas) {
    const { min } = agora(date);
    let achou = false;
    const r = fornadas.map((f) => {
      const d = min - minutos(f.hora);
      if (d >= 0 && d < 30) { achou = true; return { estado: "agora" }; }
      if (d >= 0) return { estado: "saiu" };
      if (!achou) { achou = true; return { estado: "proxima", falta: -d }; }
      return { estado: "depois" };
    });
    if (!achou) r[0] = { estado: "amanha" };
    return r;
  }

  // 80 → "1h20", 120 → "2h", 45 → "45 min"
  const duracao = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}` : `${m} min`);

  raiz.PadocaStatus = { status, fornadasHoje, duracao, hora, agora, minutos };

  if (typeof document === "undefined") return;
  const pinta = () => {
    const s = status(new Date(), raiz.PADOCA.horarios);
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.textContent = s.texto;
      el.classList.toggle("aberto", s.aberto);
      el.classList.toggle("fechado", !s.aberto);
    });
  };
  pinta();
  setInterval(pinta, 60000);
})(typeof window !== "undefined" ? window : globalThis);
