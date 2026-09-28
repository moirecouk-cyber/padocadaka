# Padoca da Ka — Site institucional + encomendas (piloto)

> Brief para o Claude Code. Salvar como `CLAUDE.md` na raiz do projeto.
> **Confirmado com a dona:** horário, encomendas, entrega, formas de pagamento e exibição de preços.
> Tudo marcado com **[HIPÓTESE]** foi definido por nós para o piloto e será validado com a dona depois. Construir o site já com esses valores.

---

## 1. Contexto

- **Cliente:** Padoca da Ka, padaria recém-aberta no bairro Vila Nova, Joinville/SC.
- **Endereço:** R. São Firmino, 555 — Vila Nova, Joinville — SC, 89237-355
- **Telefone/WhatsApp:** (47) 99943-1617 → `5547999431617`
- **Instagram:** @padocada.ka — https://www.instagram.com/padocada.ka/
- **Linktree atual:** linktr.ee/padocada.ka (botões: avaliar no Google, endereço)
- **Google:** 5,0 com 8 avaliações (set/2026), categoria Padaria
- **Horário:** todos os dias, das 7h às 19h30
- **Encomendas:** sim · **Entrega:** sim · **Pagamento:** Pix, cartão e dinheiro · **Preços no site:** sim
- **Bio/tom atual:** "Pães quentinhos, salgados, doces e café · Sabor, afeto e bons momentos"
- **Projeto:** demo especulativo da Royco Studio, usado como pitch.

### Problema que o site resolve
1. A busca "Padoca da Ka Joinville" é confundida pelo Google com a "Padoka da Ka" de Jundiaí (@padokadaka), que aparece antes.
2. O campo "site" do Google Maps aponta para `instagram.com` genérico.
3. Não existe um lugar para mostrar cardápio nem receber **encomendas** de forma organizada.

### Objetivos (em ordem)
1. Gerar **encomendas pelo WhatsApp** (salgados de festa, bolos, coffee break, cestas).
2. Levar gente até a loja (rotas, horário, "aberto agora").
3. Firmar a identidade local no Google (dados de negócio consistentes + JSON-LD).
4. Juntar avaliações no Google.

---

## 2. Stack e regras técnicas

- HTML + CSS + JS puro. **Sem framework e sem etapa de build.** Multi-página estática.
- Header e footer **escritos em cada HTML** (nada de injeção via JS, por SEO).
- Dados que mudam (telefone, horários, produtos, preços) ficam em **um único lugar**: `js/config.js` e `js/cardapio-data.js`.
- Usar as skills `frontend-design` e `web-design-guidelines`.
- Mobile first. A maior parte do tráfego virá do link da bio do Instagram.
- Metas: Lighthouse ≥ 90 em Performance, Acessibilidade e SEO no mobile.
- Imagens em WebP, com `width`/`height` definidos, `loading="lazy"` abaixo da dobra e `srcset` com 480/960/1440.
- Respeitar `prefers-reduced-motion`, foco visível no teclado e contraste AA.
- Deploy do demo: Netlify, Vercel ou GitHub Pages. Domínio `.com.br` fica para depois do fechamento.

### Estrutura de pastas

```
padoca-da-ka/
├── index.html
├── cardapio.html
├── encomendas.html
├── visite.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── tokens.css        # cores, tipografia, espaçamentos
│   ├── base.css          # reset, tipografia, layout base
│   └── components.css    # header, etiqueta, botões, montador, etc.
├── js/
│   ├── config.js         # dados do negócio (fonte única)
│   ├── cardapio-data.js  # produtos (fonte única)
│   ├── status.js         # "aberto agora / fecha às…"
│   ├── cardapio.js       # renderiza o cardápio a partir dos dados
│   ├── encomendas.js     # montador de encomenda → WhatsApp
│   └── main.js           # menu mobile, barra fixa, utilidades
└── assets/
    ├── img/              # fotos (ver seção 7)
    ├── brand/            # logo, mascote, favicon
    └── og/               # imagens de compartilhamento 1200x630
```

---

## 3. Direção visual

### Ideia central
**O site é a vitrine da padaria.** O elemento memorável é a **etiqueta de vitrine**: cada produto aparece com aquela plaquinha de preço de padaria de bairro (retangular, cantinho recortado, nome + preço + unidade). É a única ousadia do projeto. O resto fica quieto e disciplinado.

A marca já traz a direção pronta, e ela deve ser seguida à risca: **bordô como cor dominante** (como no logo, no letreiro redondo da fachada e nos posts), creme como respiro e a **mascote da Ka** (menina com lenço, cookie e pão) como assinatura.

Evitar o clichê de "fundo creme + serifa + terracota". Aqui o bordô ocupa grandes áreas (hero, faixas, rodapé) e o creme aparece como papel das etiquetas e das seções de leitura.

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bordo-ka` | `#6D020C` | Cor principal, fundos de destaque, botões (tirado do fundo da logo oficial) |
| `--bordo-forno` | `#3F060C` | Texto escuro, rodapé |
| `--miolo` | `#FAF0E4` | Fundo das seções de leitura |
| `--etiqueta` | `#FFFDF8` | Papel das etiquetas de vitrine |
| `--casca` | `#C8843F` | Dourado de pão: preços, detalhes, estados ativos |
| `--bochecha` | `#F2A7A0` | Rosa da mascote, usado com muita parcimônia |

O bordô principal já foi extraído da logo oficial. Os outros tons seguem aproximados. `--casca` só como texto sobre bordô ou como detalhe (2,7:1 sobre creme, não passa AA).

### Tipografia
- Uma família só: **Bricolage Grotesque** (Google Fonts, variável), com pesos e larguras diferentes para títulos e texto corrido. Tem calor e personalidade sem cair na serifa genérica.
- O nome "Padoca da Ka" em script (do logo) entra **sempre como imagem/SVG da marca**, nunca como fonte.
- Escala tipográfica modular (razão ~1,25), texto corrido com 16–18px, linhas com até ~70 caracteres.
- ~~Sem rótulos em caixa alta acima dos títulos, sem destacar uma palavra só do título em outra cor~~ → **mudou (ver seção 10):** a home segue o estilo do site do Kimi, com eyebrow em caixa alta espaçada e o fim do título em destaque. Continua: sem setas "→" nos botões.
- Títulos (h1/h2) finos, peso 300, largura normal. Preços e horas também finos. Rótulos, links e botões em caixa alta pequena e espaçada.

### Movimento
- Um único momento orquestrado: no hero, eyebrow, título e selo "Aberto agora" entram juntos no carregamento (a mascote foi para o painel 2).
- Animações de scroll da home (seção 10): a vitrine anda de lado, as plaquinhas balançam no barbante, o carimbo gira, a polaroide da fornada tem parallax leve e as fotos do mural caem no lugar. Tudo desliga com `prefers-reduced-motion`.
- Fora isso, só movimento em resposta à ação (abrir menu, adicionar item na encomenda, contador do carrinho).

### Componentes-chave
- **Etiqueta de vitrine:** nome, descrição curta, preço + unidade ("R$ 89 o cento"), selo opcional "sai quentinho às 16h" **[HIPÓTESE: 7h, 11h e 16h]**.
- **Selo de status:** "Aberto agora · fecha às 19h30" ou "Fechado · abre amanhã às 6h30", calculado em `status.js` com fuso `America/Sao_Paulo`.
- **Barra fixa no mobile (rodapé):** WhatsApp | Encomendar | Como chegar.
- **Botão de WhatsApp** sempre com mensagem pré-preenchida e contextual à página.

---

## 4. Mapa do site e conteúdo

**4 páginas:** Início, Cardápio, Encomendas e Visite. A história da Ka é um bloco da home, não uma página.

### Regra de texto (obrigatória)
**Só o essencial.** Quem entra quer ver o produto, saber se está aberto, onde fica e como encomendar. As fotos e as etiquetas falam pelo site.

- Título de seção: no máximo ~6 palavras.
- Subtítulo só quando for indispensável, com uma frase só.
- Nenhum texto institucional além do bloco "A padaria da Ka" na home (um parágrafo curto).
- Descrição de produto: opcional, até 5 palavras.
- Nada de texto de enchimento, slogan repetido ou introdução de seção ("Confira abaixo…", "Aqui você encontra…").
- Na dúvida entre ter ou não um texto, **não ter**.

Tom: conversa de balcão, simples e caloroso.

### 4.1 `index.html` — Início

**Title:** Padoca da Ka | Padaria no Vila Nova, Joinville
**Meta description:** Pães, salgados, doces e café todos os dias na R. São Firmino, 555, Vila Nova. Encomendas pelo WhatsApp.

A home funciona como landing page completa: quem só rolar ela já sabe o que tem, como encomendar, quando está aberto e onde fica. As outras páginas aprofundam.

- **Hero com vídeo** (`assets/video/hero.mp4`, tela cheia, véu bordô): eyebrow "Padaria · Vila Nova, Joinville", título **Pão quentinho no Vila Nova, *todo dia.*** e selo de status. A faixa de informações fecha a tela.
- **Faixa de informações** (rodapé do painel 1, de vidro, 3 colunas compactas no mobile): endereço · horário · WhatsApp, cada um clicável (Maps, Visite, wa.me). É o único lugar da home com essas informações por extenso, sem repetir o bloco em outras seções.
- **Relógio da fornada** (logo depois do hero): "Próxima fornada · Pão francês e sonho *sai às 16h30.* · faltam 50 min", com a foto da fornada em polaroide + carimbo da mascote, a barra do dia e os cartões das fornadas (detalhes no item abaixo).
- **Hoje no balcão = vitrine:** os produtos com foto (`foto`) em redomas de vidro sobre uma tábua, cada um com a plaquinha de preço pendurada no barbante e "Encomendar". Rolar para baixo passa a prateleira de lado. Link "Ver cardápio".
- **Fornadas do dia** **[HIPÓTESE]:** jornada inteira, da abertura ao fechamento: barra 7h → 19h30 com um ponto por fornada e o marcador "Agora", mais um cartão por fornada (grade de 4 no desktop, carrossel no mobile que abre na próxima). Estados: já saiu · saindo agora (30 min) · em 1h20 · amanhã. 8 fornadas em `config.fornadas`.
- **Encomendas** (faixa bordô)
  - Título: Encomendas para festa e café
  - 6 etiquetas (grupos com `home: true`): Kits festa · Salgados de festa · Docinhos · Bolos · Coffee break · Cestas, com "a partir de" o menor preço do grupo
  - Botão: Montar encomenda
- **A padaria da Ka** (bloco curto: foto grande da Ka + foto pequena sobreposta)
  - Um parágrafo, **[HIPÓTESE — texto provisório, trocar pela história real]**:
    > A Padoca da Ka nasceu em 2026, na São Firmino, para ser a padaria do bairro: pão saindo do forno o dia todo, café passado na hora e aquele salgado que vira hábito.
  - Sem botão, sem página própria. Quando houver história real e fotos suficientes, esse bloco pode virar `sobre.html`.
- **Direto do balcão = mural:** 6 fotos como polaroides levemente tortas, coladas com fita, com legenda (3 colunas no desktop, 2 no mobile), link "Mais no Instagram".
- **Google:** "5,0 no Google" + 2 avaliações reais, curtas. Botão "Avaliar".
- **Visite:** foto da fachada + mapa pequeno + botão Rotas. Sem repetir endereço e horário por extenso (já estão na faixa de informações). Link "Ver horários e como chegar".

### 4.2 `cardapio.html` — Cardápio

**Title:** Cardápio | Padoca da Ka — Padaria no Vila Nova, Joinville

- Título: Cardápio
- Âncoras fixas: Pães · Salgados · Doces e bolos · Lanches · Café
- Etiquetas renderizadas de `cardapio-data.js`. Sem texto entre as categorias.
- Preços visíveis (`config.mostrarPrecos = true`). A opção `false` continua existindo e troca o preço por "Consulte".
- Itens `encomendavel: true` têm botão "Encomendar" (`encomendas.html?item=id`).
- Rodapé da página, uma linha: "Preços sujeitos a alteração."

Itens e preços de balcão na seção 4.7.

### 4.3 `encomendas.html` — Encomendas

**Title:** Encomendas de salgados e bolos | Padoca da Ka Joinville
**Meta description:** Salgados por cento, bolos, docinhos, coffee break e cestas. Monte e envie pelo WhatsApp.

- Título: Encomendas
- **Como funciona**, uma linha com 3 passos curtos: Escolha · Marque a data · Envie no WhatsApp
- **Montador** (`encomendas.js`) — é a página inteira, sem blocos de texto em volta:
  - Itens encomendáveis agrupados (Salgados de festa · Docinhos · Bolos · Coffee break · Cestas) com +/−. Salgados em múltiplos de 25 ou 50 **[HIPÓTESE]**.
  - Salgados sortidos: escolher até N sabores.
  - Campos: nome, data (respeita `antecedenciaMinimaHoras`), horário, retirada ou entrega, observação.
  - Resumo com total estimado + "Valor confirmado no WhatsApp." (no mobile, painel fixo embaixo)
  - Botão: **Enviar no WhatsApp** → `https://wa.me/5547999431617?text=...`

```
Oi, Padoca da Ka! Encomenda pelo site:

• 100 salgados sortidos (coxinha, risole, esfiha)
• Bolo de cenoura com chocolate — 2 kg

Retirada: sáb 04/10, 15h
Nome: Mariana
Obs.: sem pimenta

Total estimado: R$ 000,00
```

  - Rascunho salvo em `localStorage` (try/catch).
  - Erros curtos e diretos: "Escolha pelo menos um item." / "Encomendas a partir de 04/10."
- **Dúvidas** (acordeão, respostas de uma linha): antecedência, sinal, entrega, pagamento (respostas na seção 4.6).

### 4.4 `visite.html` — Visite

**Title:** Como chegar | Padoca da Ka — R. São Firmino, 555, Vila Nova

- Título: Visite a gente
- Mapa (iframe Google Maps, sem API key)
- Endereço + botões **Google Maps** · **Waze**
- Horários da semana, dia de hoje destacado (de `config.horarios`)
- WhatsApp, ligar (`tel:+5547999431617`), Instagram
- Botão: Avaliar no Google

### 4.5 Header e footer (iguais em todas as páginas)

- **Header:** mascote centralizada entre dois grupos de links (Início · Cardápio | Encomendas · Visite), caixa alta espaçada, sem botão "Encomendar" (no mobile a barra fixa faz esse papel). Menu hambúrguer no mobile. Na home ele é transparente sobre o vídeo e fica bordô quando o painel 2 chega nele; nas outras páginas é bordô sólido.
- **Footer:** mascote pequena (`assets/brand/mascote-160.webp`), endereço, horário, WhatsApp, Instagram, "Site por Royco Studio". Sem texto institucional.
- **Barra fixa mobile:** WhatsApp · Encomendar · Rotas (some quando o painel do pedido está aberto).

---

### 4.6 Regras de encomenda e entrega **[HIPÓTESE]**

Valores pensados para o piloto, dentro da média de mercado de 2026. Tudo fica em `config.js`, então ajustar depois é trocar um número.

| Regra | Valor |
|---|---|
| Pedido mínimo para retirada | R$ 80 |
| Pedido mínimo para entrega | R$ 120 |
| Antecedência — salgados, docinhos e lanches | 48 horas |
| Antecedência — bolos de festa e cestas | 72 horas |
| Sinal | 50% no Pix para pedidos acima de R$ 150; o restante na retirada ou entrega |
| Cancelamento | Até 24h antes, sinal devolvido. Depois disso, o sinal fica |
| Horário de retirada | 7h às 19h |
| Horário de entrega | 8h às 19h |
| Taxa de entrega | Até 3 km: R$ 8 · 3 a 6 km: R$ 14 · Mais longe: a combinar |
| Pagamento | Pix, cartão (crédito e débito) e dinheiro, na loja e na entrega |

Comportamento no montador:
- O botão de enviar só libera quando o pedido atinge o mínimo. Mensagem curta: "Faltam R$ 23 para o pedido mínimo de entrega."
- A data mínima muda sozinha conforme os itens do carrinho (tem bolo ou cesta → 72h).
- Na entrega: campo de endereço + aviso "Taxa a partir de R$ 8, confirmada no WhatsApp." O site não calcula distância.
- Se houver sinal, mostrar no resumo: "Sinal de 50% (R$ 00) no Pix para confirmar."

Respostas do acordeão "Dúvidas" (uma linha cada):
- **Antecedência?** 48h para salgados e docinhos, 72h para bolos e cestas.
- **Precisa de sinal?** Acima de R$ 150, 50% no Pix para confirmar.
- **Vocês entregam?** Sim, das 8h às 19h. Taxa a partir de R$ 8.
- **Formas de pagamento?** Pix, cartão e dinheiro.
- **Posso cancelar?** Sim, até 24h antes, com o sinal devolvido.

### 4.7 Tabela de preços do piloto **[HIPÓTESE]**

Faixas coerentes com padaria de bairro em Joinville em 2026. Servem para o demo parecer real, não para serem publicadas sem validação.

**Balcão**

| Categoria | Item | Preço |
|---|---|---|
| Pães | Pão francês | R$ 16,90 o kg |
| Pães | Pão caseiro | R$ 14,00 un |
| Pães | Pão de queijo | R$ 3,50 un |
| Pães | Sonho | R$ 7,00 un |
| Salgados | Coxinha de frango | R$ 8,00 un |
| Salgados | Risole de presunto e queijo | R$ 8,00 un |
| Salgados | Esfiha de carne | R$ 7,00 un |
| Salgados | Empada de frango | R$ 8,00 un |
| Doces e bolos | Bolo de cenoura com chocolate | R$ 9,00 a fatia |
| Doces e bolos | Bolo de fubá | R$ 7,00 a fatia |
| Doces e bolos | Cookie da Ka | R$ 8,00 un |
| Lanches | Misto quente | R$ 12,00 |
| Lanches | Pão na chapa | R$ 7,00 |
| Café | Café coado | R$ 5,00 |
| Café | Espresso | R$ 6,00 |
| Café | Cappuccino | R$ 10,00 |
| Bebidas | Suco natural | R$ 10,00 |

**Encomendas**

| Item | Preço | Mínimo / múltiplo |
|---|---|---|
| Salgados fritos sortidos (coxinha, risole, bolinha de queijo, quibe — até 4 sabores) | R$ 95 o cento | 50 un, de 25 em 25 |
| Salgados assados sortidos (mini esfiha, mini pizza, enroladinho) | R$ 110 o cento | 50 un, de 25 em 25 |
| Docinhos (brigadeiro, beijinho, cajuzinho) | R$ 120 o cento | 50 un, de 25 em 25 |
| Bolo de festa (sabores: brigadeiro, prestígio, ninho com morango, dois amores) | R$ 95 o kg | 2 kg |
| Bolo caseiro inteiro (cenoura, fubá, chocolate) | R$ 45 un | 1 un |
| Mini sanduíche para coffee break | R$ 4,50 un | 20 un |
| Pão de queijo congelado | R$ 45 o kg | 1 kg |
| Cesta de café da manhã individual | R$ 149 | 1 un |
| Cesta de café da manhã para dois | R$ 249 | 1 un |
| Kit festa P · 10 pessoas (100 salgados, 50 docinhos, bolo 2 kg) | R$ 319 | 1 un |
| Kit festa M · 20 pessoas (200 salgados, 100 docinhos, bolo 3 kg) | R$ 549 | 1 un |
| Kit festa G · 40 pessoas (400 salgados, 200 docinhos, bolo 5 kg) | R$ 999 | 1 un |
| Kit coffee break · 10 pessoas (30 mini sanduíches, 1 kg pão de queijo, bolo caseiro, 2 L café) | R$ 229 | 1 un |
| Kit coffee break · 20 pessoas (60 mini sanduíches, 2 kg pão de queijo, 2 bolos caseiros, 4 L café) | R$ 429 | 1 un |
| Café coado na garrafa · 1 L | R$ 25 | 1 un |
| Torta salgada de frango · 1,5 kg | R$ 89 | 1 un |
| Torta de limão | R$ 79 | 1 un |
| Pão de metro recheado · 1 m | R$ 79 | 1 un |
| Mini pão francês | R$ 45 o cento | 50 un, de 25 em 25 |

---

## 5. Arquivos de dados

### `js/config.js`

```js
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
  fornadas: [                            // [HIPÓTESE] ver o arquivo real: 8 fornadas
    { hora: "07:00", itens: "Pão francês e pão de queijo", foto: "assets/img/fornadas/pao-de-queijo-cafe" }
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
```

### `js/cardapio-data.js` (formato)

```js
window.CARDAPIO = [
  {
    categoria: "salgados",
    titulo: "Salgados",
    itens: [
      {
        id: "coxinha",
        nome: "Coxinha de frango",
        descricao: "Massa leve, recheio cremoso.",
        preco: 8.00,
        unidade: "un",        // "un" | "cento" | "kg" | "fatia"
        foto: "assets/img/salgados/coxinha", // opcional, sem o sufixo -480/-960/-1440; sem foto = etiqueta só com texto
        destaque: true,                       // aparece em "Hoje no balcão"
        fornada: "11:00",                     // opcional: selo "Sai quentinho às 11h"
        encomenda: "salgados-fritos"          // id de um item de window.ENCOMENDAS (botão "Encomendar")
      }
    ]
  }
];

// Itens só de encomenda, agrupados como no montador
window.ENCOMENDAS = [
  {
    grupo: "salgados", titulo: "Salgados de festa", descricao: "Fritos e assados, por cento",
    home: true, foto: "assets/img/salgados/rosca-queijo",
    itens: [
      { id: "salgados-fritos", nome: "Salgados fritos sortidos", sabores: ["Coxinha", "Risole"], maxSabores: 4,
        preco: 95, unidade: "cento", minimo: 50, multiplo: 25, antecedencia: "padrao" }
    ]
  }
];
```

---

## 6. SEO local (prioridade alta)

- Nome, endereço e telefone **idênticos** ao Perfil da Empresa no Google, em todas as páginas.
- Nunca usar a grafia "Padoka" (é a padaria de Jundiaí).
- JSON-LD `Bakery` no `<head>` de todas as páginas:

```json
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Padoca da Ka",
  "image": "https://SEU-DOMINIO/assets/og/padoca-da-ka.jpg",
  "url": "https://SEU-DOMINIO/",
  "telephone": "+55-47-99943-1617",
  "priceRange": "$",
  "servesCuisine": "Padaria",
  "paymentAccepted": "Pix, Cartão de crédito, Cartão de débito, Dinheiro",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. São Firmino, 555",
    "addressLocality": "Joinville",
    "addressRegion": "SC",
    "postalCode": "89237-355",
    "addressCountry": "BR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": -26.2920769, "longitude": -48.9109379 },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "07:00",
      "closes": "19:30"
    }
  ],
  "sameAs": ["https://www.instagram.com/padocada.ka/"],
  "hasMenu": "https://SEU-DOMINIO/cardapio.html"
}
```

- `title` e `meta description` únicos por página (definidos na seção 4), sempre com "Vila Nova" e/ou "Joinville".
- Open Graph + Twitter Card com imagem 1200×630 (mascote sobre bordô + foto do balcão).
- `sitemap.xml`, `robots.txt`, `canonical` em cada página, `lang="pt-BR"`.
- Depois de publicar: trocar o campo "site" no Google Maps e o link da bio/Linktree pelo novo endereço.

---

## 7. Imagens

Fonte: posts do Instagram @padocada.ka (fornecidas pelo Rafael).

- Colocar os originais em `assets/img/_originais/<categoria>/` e gerar as versões WebP otimizadas (480/960/1440) como `assets/img/<categoria>/<nome>-<largura>.webp`. Atenção: `tools/otimizar-imagens.mjs` reprocessa todos os originais e desfaz cortes manuais (ex.: o casadinho foi cortado para tirar o texto do post).
- Nomes em minúsculas, com hífen e por categoria: `assets/img/salgados/coxinha.webp`, `assets/img/loja/fachada.webp`.
- Para o hero, escolher fotos **sem texto sobreposto** (vários posts têm arte com lettering).
- `alt` descritivo e em português ("Vitrine de salgados da Padoca da Ka").
- Onde faltar foto de produto, usar etiqueta sem imagem. Nada de banco de imagem genérico.
  - **Exceção aprovada pelo Rafael (set/2026):** 7 fotos do Unsplash, provisórias, nas fornadas sem foto real, nas encomendas de cestas e coffee break e no detalhe da história. Lista e créditos em `assets/img/_originais/CREDITOS-UNSPLASH.md`. Trocar pelas fotos da fase 2.
  - **Segunda exceção (set/2026):** mais 15 fotos (12 do Unsplash, 3 do Pexels) para todos os produtos do cardápio sem foto real; todo produto do cardápio tem foto. A vitrine da home continua só com os destaques (`destaque: true`), que são fotos reais da Padoca. Créditos no mesmo arquivo.
- Fase 2: sessão de fotos real na loja (fornada saindo, vitrine cheia, a Ka no balcão).

Marca: a logo oficial é a mascote da Ka (original em `assets/brand/_originais/mascote-oficial.jpg`). O fundo foi recortado: `assets/brand/mascote-{160,320,640}.webp` (transparente), `favicon-48.png` e `apple-touch-icon.png`. Falta a imagem de OG 1200×630.

---

## 8. Ordem de construção

1. `tokens.css` + `base.css` + header/footer + barra fixa mobile. Revisar no mobile antes de seguir.
2. `config.js` + `status.js` (selo aberto/fechado, com teste de todos os dias e horários).
3. Componente **etiqueta de vitrine** isolado, com todos os estados (com/sem foto, com/sem preço, destaque, encomendável).
4. `index.html` completa.
5. `cardapio-data.js` + `cardapio.html`.
6. `encomendas.html` + `encomendas.js` (montador, validação, mensagem do WhatsApp, rascunho salvo). Testar a mensagem gerada no WhatsApp real.
7. `visite.html`.
8. SEO: JSON-LD, OG, sitemap, robots, 404.
9. Passada de qualidade: Lighthouse mobile, teclado, leitor de tela, `prefers-reduced-motion`, textos revisados.
10. Deploy do demo e gravação do vídeo de pitch.

---

## 9. Status das informações

**Confirmado:** horário (7h às 19h30, todos os dias) · encomendas · entrega · pagamento (Pix, cartão, dinheiro) · preços visíveis.

**Hipóteses do piloto, validar com a dona depois:**
- [ ] Pedido mínimo, antecedência, sinal e cancelamento (4.6)
- [ ] Taxas e horário de entrega (4.6)
- [ ] Itens e preços de balcão e encomenda (4.7)
- [ ] Horários e conteúdo das 8 fornadas (7h às 18h, `config.fornadas`)
- [ ] Nomes e preços dos produtos das fotos: rosca de queijo e ervas, rocambole de doce de leite, donut, croissant, bolo de limão, casadinho, caixas com 6 e kits
- [ ] Texto da história da Ka (bloco da home, 4.1)

**Só dá para resolver com dados reais (não inventar):**
- [ ] Avaliações do Google: copiar 2 reais do perfil. Até lá, mostrar só "5,0 no Google" + botão "Avaliar".
- [ ] Link direto de avaliação: Perfil da Empresa no Google → "Pedir avaliações". Até lá, usar o link do perfil no Maps.
- [ ] Autorização para usar as fotos do Instagram no site final.
- [ ] Vídeo do hero em resolução maior (o atual tem 640×360).
- [ ] Trocar as 7 fotos provisórias do Unsplash (fase 2).
- [ ] Domínio: sugestão `padocadaka.com.br`, verificar disponibilidade no Registro.br.

---

## 10. Decisões tomadas durante a construção (set/2026)

Pedidas ou aprovadas pelo Rafael. Valem por cima do resto do brief; não desfazer sem falar com ele.

**Direção atual (set/2026): "vitrine + relógio da fornada + papel de pão".** O Rafael pediu para não ficar igual ao Kimi. Aprovada a partir do protótipo (`prototipo.html`, que fica só como referência).
- **Vitrine:** produtos em redomas de vidro numa prateleira, plaquinha de preço pendurada no barbante.
- **Relógio da fornada:** a próxima fornada em destaque, com contagem regressiva, pela hora de Joinville.
- **Papel de pão:** fundo com grão de papel (`--papel`), polaroides com fita, carimbo redondo da mascote, pedido como "sacola".
- **Clima do dia:** `data-periodo` no `<html>` (manhã creme, tarde kraft, noite bordô escuro), definido no `main.js`. Componentes sobre a página usam `--pagina`, `--tinta`, `--suave`, `--acento`, `--linha` (tokens.css), nunca cor fixa. Cartões de papel (etiqueta, fornada, polaroide, Google) têm cor própria.
- **Demonstração para o pitch:** `/?demo` mostra a barrinha "Ver como Agora · Manhã · Tarde · Noite". Sem o parâmetro ela não aparece.
- **Do estilo Kimi ficaram:** o header com a mascote no centro (transparente sobre o vídeo), eyebrow em caixa alta, títulos finos e o destaque de cor no fim do título.

**Histórico — estilo Kimi (substituído):** a home foi "igual ao site do Kimi" (`C:\Users\rafae\Kimi sushi`) antes da direção atual.
- Header com a mascote no centro e links nos dois lados, em caixa alta espaçada; transparente sobre o vídeo na home.
- **No mobile o header é sempre fixo no topo** (pedido do Rafael: o menu fica à mão sem voltar ao topo). Nas páginas internas é sticky; a faixa de categorias gruda logo abaixo dele (`top: var(--header-h)`).
- Eyebrow em caixa alta pequena acima dos títulos do hero e destaque de cor no fim do título (dourado `--casca` sobre escuro, `--bordo-ka` sobre creme).
- Títulos e números finos (peso 300). Botões e links de texto em caixa alta pequena e espaçada, botão principal de contorno fino.
- Continua Bricolage Grotesque (o Kimi usa Fraunces; trocar só se o Rafael pedir).

**Hero:** só o painel do vídeo continua (`.pilha` > `.painel.painel--video` > `.painel__folha`). Os painéis 2 e 3 da pilha de scroll do Kimi saíram com a direção nova.
- **Testado e descartado:** o efeito "story scroll" (painel entrando girado 30° e endireitando). O Rafael achou estranho, não combinou com a padaria. Não reintroduzir.
- Use `overflow: clip`, não `hidden`, em volta de elementos sticky (a vitrine): `hidden` cria contêiner de rolagem e quebra o sticky.

**Vídeo do hero:** toca em loop, sem som, em qualquer tela. **Sem botão de pausa** (pedido do Rafael); só para com `prefers-reduced-motion`. O Lighthouse pode apontar a falta de controle de pausa (WCAG 2.2.2).

**Fotos:** cada espaço aponta para um caminho fixo; foto que não existe vira moldura com o nome dela (`.foto.vazia`, via listener de erro no `<head>`). Antes de publicar, nenhuma moldura vazia pode sobrar.
- Home: Hoje no balcão só com produtos de foto real; galeria uniforme; fotos do Unsplash provisórias (seção 7).

**Encomendas:** além da tabela 4.7, entraram kits festa P/M/G, kits coffee break, café na garrafa, tortas, pão de metro, mini pão francês, casadinho por cento, caixas com 6 (cookie, donut, croissant) e rocambole inteiro. Tudo **[HIPÓTESE]** e está em `js/cardapio-data.js`.

**Ferramentas:** servidor local via `.claude/launch.json` (`npx serve` na porta 5173). Testes: `node tests/status.test.js` (selo e fornadas) e `node tests/encomendas.test.js` (montador).

**Estado da ordem de construção (seção 8):** etapas 1 a 7 feitas (a 6 veio antes da 5 por ser o objetivo nº 1): as 4 páginas existem. Etapa 8 (SEO) feita. Faltam a passada de qualidade (9) e o deploy (10).

**SEO:** JSON-LD `Bakery`, canonical, Open Graph e Twitter Card nas 4 páginas, gerados por `node tools/atualizar-seo.cjs` (o domínio fica na constante `DOMINIO`; hoje é o sugerido `padocadaka.com.br` **[A CONFIRMAR]**, trocar ali e no `sitemap.xml`/`robots.txt`). Imagem de compartilhamento em `assets/og/padoca-da-ka.jpg` (1200×630). `404.html` usa caminhos a partir da raiz e tem noindex. O cardápio é montado por JS (o Google renderiza JS; os dados do negócio estão no JSON-LD estático).

**Visite (`visite.html` + `js/visite.js`):** endereço no HTML (bom para SEO), Google Maps e Waze (coordenadas de `config.geo`, aproximadas), horários da semana com o dia de hoje destacado (de `config.horarios`), WhatsApp, ligar, Instagram e "Avaliar no Google" (ainda o link do perfil no Maps). Mapa grande com a fachada em polaroide colada no canto.

**Cardápio (`cardapio.html` + `js/cardapio.js`):** em cada categoria, primeiro os produtos com `foto` (redoma + plaquinha, igual à vitrine da home) e depois os sem foto num quadro de preços (nome ······ preço). `cardapio.js` reaproveita `precoHTML`, `srcset`, `hora` e `brl` do `main.js`, que precisa carregar antes.

**Encomendas (`encomendas.html` + `js/encomendas.js`):** lógica pura no topo do arquivo (preço, data mínima 48h/72h, validação, mensagem do WhatsApp), testada em `node tests/encomendas.test.js`. No mobile, a barrinha fixa da sacola substitui a barra de atalhos e **abre o pedido numa gaveta por cima da página** (pedido do Rafael: o cliente nunca é levado para o fim da página e não perde onde estava). No desktop o pedido fica fixo ao lado dos itens. `?item=<id de ENCOMENDAS>` já coloca o item na sacola. Rascunho em `localStorage` (chave `padoca-encomenda`). Na sacola, cada linha tem − / + / Remover. **Sugestão complementar (order bump):** um cartão "Combina com o seu pedido" que usa o `sugere` do grupo de cada item da sacola (ex.: kit festa → refrigerante 2 L → mini churros → kit descartáveis); não sugere o que já está na sacola nem o que foi dispensado ("Agora não"). Grupo novo `extras` (Bebidas e extras) **[HIPÓTESE]**: refrigerante 2 L R$ 14, suco natural 1 L R$ 22, mini churros 25 un R$ 35, kit descartáveis 20 pessoas R$ 19. Falta testar a mensagem num WhatsApp real (etapa 6 do brief). As páginas internas usam o header bordô sólido (sem `.site-header--vidro`) e reaproveitam etiqueta, eyebrow, botões e tipografia da home.
