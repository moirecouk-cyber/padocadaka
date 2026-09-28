// [HIPÓTESE] preços da seção 4.7. `foto` (caminho sem o sufixo -480/-960/-1440) só quando existir a imagem;
// sem foto, a etiqueta aparece só com nome e preço. `destaque: true` entra em "Hoje no balcão".
window.CARDAPIO = [
  {
    categoria: "paes",
    titulo: "Pães",
    itens: [
      { id: "pao-frances", nome: "Pão francês", preco: 16.9, unidade: "kg", fornada: "16:30", encomenda: "mini-pao-frances", foto: "assets/img/fornadas/paezinhos" },
      { id: "croissant", nome: "Croissant com chocolate", preco: 10, unidade: "un", destaque: true, fornada: "08:30", encomenda: "croissant-caixa", foto: "assets/img/paes/croissant" },
      { id: "pao-caseiro", nome: "Pão caseiro", preco: 14, unidade: "un", foto: "assets/img/paes/pao-caseiro" },
      { id: "pao-de-queijo", nome: "Pão de queijo", preco: 3.5, unidade: "un", fornada: "07:00", encomenda: "pao-de-queijo-congelado", foto: "assets/img/fornadas/pao-de-queijo-cafe" },
      { id: "sonho", nome: "Sonho", preco: 7, unidade: "un", foto: "assets/img/paes/sonho" }
    ]
  },
  {
    categoria: "salgados",
    titulo: "Salgados",
    itens: [
      { id: "coxinha", nome: "Coxinha de frango", descricao: "Massa leve, recheio cremoso", preco: 8, unidade: "un", fornada: "11:00", encomenda: "salgados-fritos", foto: "assets/img/salgados/coxinha" },
      { id: "risole", nome: "Risole de presunto e queijo", preco: 8, unidade: "un", encomenda: "salgados-fritos", foto: "assets/img/salgados/risole" },
      { id: "esfiha", nome: "Esfiha de carne", preco: 7, unidade: "un", encomenda: "salgados-assados", foto: "assets/img/salgados/esfiha" },
      { id: "rosca-queijo", nome: "Rosca de queijo e ervas", preco: 9, unidade: "un", destaque: true, fornada: "11:00", encomenda: "salgados-assados", foto: "assets/img/salgados/rosca-queijo" },
      { id: "empada", nome: "Empada de frango", preco: 8, unidade: "un", foto: "assets/img/salgados/empada" }
    ]
  },
  {
    categoria: "doces",
    titulo: "Doces e bolos",
    itens: [
      { id: "bolo-cenoura", nome: "Bolo de cenoura com chocolate", preco: 9, unidade: "fatia", encomenda: "bolo-caseiro", foto: "assets/img/doces/bolo-cenoura" },
      { id: "bolo-limao", nome: "Bolo de limão", descricao: "Com calda de limão", preco: 9, unidade: "fatia", destaque: true, fornada: "10:00", encomenda: "bolo-caseiro", foto: "assets/img/doces/bolo-limao" },
      { id: "bolo-chocolate-morango", nome: "Bolo de chocolate com morango", preco: 11, unidade: "fatia", destaque: true, encomenda: "bolo-festa", foto: "assets/img/doces/bolo-chocolate-morango" },
      { id: "rocambole", nome: "Rocambole de doce de leite", descricao: "Coberto com amendoim", preco: 10, unidade: "fatia", destaque: true, encomenda: "rocambole-inteiro", foto: "assets/img/doces/rocambole" },
      { id: "donut", nome: "Donut de chocolate", preco: 9, unidade: "un", destaque: true, fornada: "15:00", encomenda: "donuts-caixa", foto: "assets/img/doces/donut" },
      { id: "casadinho", nome: "Casadinho", descricao: "Recheado, com açúcar", preco: 3.5, unidade: "un", destaque: true, encomenda: "casadinho-cento", foto: "assets/img/doces/casadinho" },
      { id: "bolo-fuba", nome: "Bolo de fubá", preco: 7, unidade: "fatia", encomenda: "bolo-caseiro", foto: "assets/img/doces/bolo-fuba" },
      { id: "cookie", nome: "Cookie da Ka", descricao: "A receita da casa", preco: 8, unidade: "un", fornada: "15:00", encomenda: "cookies-caixa", foto: "assets/img/doces/cookie" }
    ]
  },
  {
    categoria: "lanches",
    titulo: "Lanches",
    itens: [
      { id: "misto", nome: "Misto quente", preco: 12, foto: "assets/img/lanches/misto" },
      { id: "pao-na-chapa", nome: "Pão na chapa", preco: 7, foto: "assets/img/lanches/pao-na-chapa" }
    ]
  },
  {
    categoria: "cafe",
    titulo: "Café",
    itens: [
      { id: "cafe-coado", nome: "Café coado", preco: 5, foto: "assets/img/cafe/cafe-coado-filtro" },
      { id: "espresso", nome: "Espresso", preco: 6, foto: "assets/img/cafe/espresso" },
      { id: "cappuccino", nome: "Cappuccino", preco: 10, foto: "assets/img/cafe/cappuccino" },
      { id: "suco", nome: "Suco natural", preco: 10, foto: "assets/img/cafe/suco" }
    ]
  }
];

// Itens só de encomenda, agrupados como no montador. `home: true` aparece na faixa da home.
// `sugere`: ids sugeridos na sacola ("Combina com o seu pedido") quando há item do grupo no pedido.
// `chamada`: frase curta que aparece na sugestão.
window.ENCOMENDAS = [
  {
    grupo: "kits", titulo: "Kits festa", descricao: "Salgados, docinhos e bolo", home: true, sugere: ["refri-2l", "churros-porcao", "descartaveis"], foto: "assets/img/doces/bolo-chocolate-morango",
    itens: [
      { id: "kit-festa-p", nome: "Kit festa P · 10 pessoas", inclui: "100 salgados, 50 docinhos e bolo de 2 kg", preco: 319, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "bolosECestas" },
      { id: "kit-festa-m", nome: "Kit festa M · 20 pessoas", inclui: "200 salgados, 100 docinhos e bolo de 3 kg", preco: 549, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "bolosECestas" },
      { id: "kit-festa-g", nome: "Kit festa G · 40 pessoas", inclui: "400 salgados, 200 docinhos e bolo de 5 kg", preco: 999, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "bolosECestas" }
    ]
  },
  {
    grupo: "salgados", titulo: "Salgados de festa", descricao: "Fritos e assados, por cento", home: true, sugere: ["refri-2l", "docinhos", "churros-porcao"], foto: "assets/img/salgados/rosca-queijo",
    itens: [
      { id: "salgados-fritos", nome: "Salgados fritos sortidos", chamada: "Coxinha, risole e cia., por cento", sabores: ["Coxinha", "Risole", "Bolinha de queijo", "Quibe"], maxSabores: 4, preco: 95, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" },
      { id: "salgados-assados", nome: "Salgados assados sortidos", sabores: ["Mini esfiha", "Mini pizza", "Enroladinho"], maxSabores: 3, preco: 110, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" }
    ]
  },
  {
    grupo: "docinhos", titulo: "Docinhos", descricao: "Casadinho, brigadeiro, beijinho", home: true, sugere: ["salgados-fritos", "refri-2l"], foto: "assets/img/doces/casadinho",
    itens: [
      { id: "docinhos", nome: "Docinhos sortidos", chamada: "Brigadeiro, beijinho e cajuzinho", sabores: ["Brigadeiro", "Beijinho", "Cajuzinho"], maxSabores: 3, preco: 120, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" },
      { id: "casadinho-cento", nome: "Casadinho", preco: 140, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" },
      { id: "cookies-caixa", nome: "Cookie da Ka · caixa com 6", chamada: "A receita da casa, em caixa", preco: 45, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "donuts-caixa", nome: "Donut de chocolate · caixa com 6", preco: 50, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "croissant-caixa", nome: "Croissant com chocolate · caixa com 6", preco: 55, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" }
    ]
  },
  {
    grupo: "bolos", titulo: "Bolos", descricao: "De festa, caseiro e rocambole", home: true, sugere: ["docinhos", "refri-2l", "descartaveis"], foto: "assets/img/doces/bolo-limao",
    itens: [
      { id: "bolo-festa", nome: "Bolo de festa", sabores: ["Brigadeiro", "Prestígio", "Ninho com morango", "Dois amores"], maxSabores: 1, preco: 95, unidade: "kg", minimo: 2, multiplo: 1, antecedencia: "bolosECestas" },
      { id: "bolo-caseiro", nome: "Bolo caseiro inteiro", sabores: ["Cenoura", "Fubá", "Chocolate", "Limão"], maxSabores: 1, preco: 45, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "rocambole-inteiro", nome: "Rocambole de doce de leite inteiro", preco: 55, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" }
    ]
  },
  {
    grupo: "coffee", titulo: "Coffee break", descricao: "Kits, sanduíches e café", home: true, sugere: ["cafe-garrafa", "suco-1l", "cookies-caixa"], foto: "assets/img/encomendas/coffee-break",
    itens: [
      { id: "kit-coffee-p", nome: "Kit coffee break · 10 pessoas", inclui: "30 mini sanduíches, 1 kg de pão de queijo, bolo caseiro e 2 L de café", preco: 229, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "kit-coffee-m", nome: "Kit coffee break · 20 pessoas", inclui: "60 mini sanduíches, 2 kg de pão de queijo, 2 bolos caseiros e 4 L de café", preco: 429, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "mini-sanduiche", nome: "Mini sanduíche", preco: 4.5, unidade: "un", minimo: 20, multiplo: 10, antecedencia: "padrao" },
      { id: "pao-de-queijo-congelado", nome: "Pão de queijo congelado", preco: 45, unidade: "kg", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "cafe-garrafa", nome: "Café coado na garrafa · 1 L", chamada: "Passado na hora, pra servir quente", preco: 25, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" }
    ]
  },
  {
    grupo: "tortas", titulo: "Tortas e pães de festa", descricao: "Torta salgada, doce e pão de metro", sugere: ["refri-2l", "suco-1l"],
    itens: [
      { id: "torta-frango", nome: "Torta salgada de frango · 1,5 kg", preco: 89, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "torta-limao", nome: "Torta de limão", preco: 79, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "pao-de-metro", nome: "Pão de metro recheado · 1 m", preco: 79, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "mini-pao-frances", nome: "Mini pão francês", preco: 45, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" }
    ]
  },
  {
    grupo: "cestas", titulo: "Cestas", descricao: "Café da manhã completo", home: true, sugere: ["suco-1l", "cookies-caixa"], foto: "assets/img/encomendas/cesta-cafe",
    itens: [
      { id: "cesta-individual", nome: "Cesta de café da manhã individual", preco: 149, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "bolosECestas" },
      { id: "cesta-dois", nome: "Cesta de café da manhã para dois", preco: 249, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "bolosECestas" }
    ]
  },
  {
    grupo: "extras", titulo: "Bebidas e extras", descricao: "Para completar a festa", sugere: ["churros-porcao"],
    itens: [
      { id: "refri-2l", nome: "Refrigerante 2 L", chamada: "Pra acompanhar os salgados", preco: 14, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "suco-1l", nome: "Suco natural 1 L", chamada: "Feito na hora, na garrafa", preco: 22, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "churros-porcao", nome: "Mini churros · 25 un", chamada: "Um docinho pra fechar a festa", preco: 35, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" },
      { id: "descartaveis", nome: "Kit descartáveis · 20 pessoas", inclui: "Pratos, copos, garfos e guardanapos", chamada: "Pratos, copos e guardanapos", preco: 19, unidade: "un", minimo: 1, multiplo: 1, antecedencia: "padrao" }
    ]
  }
];
