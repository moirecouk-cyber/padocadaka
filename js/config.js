window.PADOCA = {
  nome: "Padoca da Ka",
  whatsapp: "5547999431617",
  telefoneExibicao: "(47) 99943-1617",
  endereco: {
    rua: "R. São Firmino, 555",
    bairro: "Vila Nova",
    cidade: "Joinville",
    uf: "SC",
    cep: "89237-355"
  },
  geo: { lat: -26.2920769, lng: -48.9109379 }, // aproximado, conferir no Maps
  instagram: "https://www.instagram.com/padocada.ka/",
  googleMaps: "",    // link curto do perfil (pegar no Google)
  googleAvaliar: "", // link direto de avaliação (pegar no Google)
  // 0 = domingo ... 6 = sábado. Confirmado: todos os dias, 7h às 19h30
  horarios: {
    0: ["07:00", "19:30"], 1: ["07:00", "19:30"], 2: ["07:00", "19:30"],
    3: ["07:00", "19:30"], 4: ["07:00", "19:30"], 5: ["07:00", "19:30"],
    6: ["07:00", "19:30"]
  },
  mostrarPrecos: true,
  pagamento: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],
  fornadas: [                            // [HIPÓTESE] jornada do dia, da abertura ao fechamento
    // `foto` opcional (caminho sem o sufixo -480/-960/-1440)
    { hora: "07:00", itens: "Pão francês e pão de queijo", foto: "assets/img/fornadas/pao-de-queijo-cafe" },
    { hora: "08:30", itens: "Croissant com chocolate e sonho", foto: "assets/img/paes/croissant" },
    { hora: "10:00", itens: "Bolo de limão e rocambole", foto: "assets/img/doces/bolo-limao" },
    { hora: "11:00", itens: "Coxinha, esfiha e rosca de queijo", foto: "assets/img/salgados/rosca-queijo" },
    { hora: "13:00", itens: "Pão francês", foto: "assets/img/fornadas/paezinhos" },
    { hora: "15:00", itens: "Donut e cookie da Ka", foto: "assets/img/doces/donut" },
    { hora: "16:30", itens: "Pão francês e sonho", foto: "assets/img/fornadas/vitrine-paes" },
    { hora: "18:00", itens: "Pão francês para o jantar", foto: "assets/img/fornadas/cesto-paes" }
  ],
  encomendas: {                          // [HIPÓTESE] valores da seção 4.6
    pedidoMinimoRetirada: 80,
    pedidoMinimoEntrega: 120,
    antecedenciaHoras: { padrao: 48, bolosECestas: 72 },
    sinal: { percentual: 50, aPartirDe: 150, forma: "Pix" },
    cancelamentoHoras: 24,
    horarioRetirada: ["07:00", "19:00"]
  },
  entrega: {                             // entrega confirmada; valores [HIPÓTESE]
    ativo: true,
    horario: ["08:00", "19:00"],
    faixas: [
      { ateKm: 3, taxa: 8 },
      { ateKm: 6, taxa: 14 }
    ],
    acima: "a combinar"
  }
};
