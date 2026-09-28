// Coloca canonical, Open Graph, Twitter Card e JSON-LD (Bakery) no <head> das 4 páginas.
// Uso: node tools/atualizar-seo.cjs  (pode rodar quantas vezes quiser; troca o bloco anterior)
const fs = require('fs');
const DOMINIO = 'https://padocadaka.com.br'; // [A CONFIRMAR] domínio sugerido no brief; trocar aqui e rodar de novo
const paginas = { 'index.html': '/', 'cardapio.html': '/cardapio.html', 'encomendas.html': '/encomendas.html', 'visite.html': '/visite.html' };

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Padoca da Ka',
  image: `${DOMINIO}/assets/og/padoca-da-ka.jpg`,
  logo: `${DOMINIO}/assets/brand/mascote-640.webp`,
  url: `${DOMINIO}/`,
  telephone: '+55-47-99943-1617',
  priceRange: '$',
  servesCuisine: 'Padaria',
  paymentAccepted: 'Pix, Cartão de crédito, Cartão de débito, Dinheiro',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'R. São Firmino, 555',
    addressLocality: 'Joinville',
    addressRegion: 'SC',
    postalCode: '89237-355',
    addressCountry: 'BR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -26.2920769, longitude: -48.9109379 },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '07:00',
    closes: '19:30',
  }],
  sameAs: ['https://www.instagram.com/padocada.ka/'],
  hasMenu: `${DOMINIO}/cardapio.html`,
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
for (const [arq, caminho] of Object.entries(paginas)) {
  let c = fs.readFileSync(arq, 'utf8');
  c = c.replace(/\n  <!-- SEO[\s\S]*?<!-- \/SEO -->/, ''); // idempotente: tira o bloco anterior
  const titulo = c.match(/<title>([^<]+)<\/title>/)[1];
  const desc = c.match(/<meta name="description" content="([^"]+)">/)[1];
  const url = DOMINIO + caminho;
  const bloco = `
  <!-- SEO (gerado por tools/atualizar-seo.cjs; domínio em DOMINIO) -->
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Padoca da Ka">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${DOMINIO}/assets/og/padoca-da-ka.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Mascote da Padoca da Ka sobre fundo bordô e foto da Ka no balcão">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2).replace(/^/gm, '  ')}
  </script>
  <!-- /SEO -->`;
  const ancora = c.match(/  <meta name="description" content="[^"]+">/)[0];
  c = c.replace(ancora, ancora + bloco);
  fs.writeFileSync(arq, c);
  console.log(arq, '→', url);
}
