// Gera as versões WebP 480/960/1440 de tudo que estiver em assets/img/_originais/<categoria>/.
// Uso (uma vez: npm i --no-save sharp):  node tools/otimizar-imagens.mjs
//   _originais/salgados/Coxinha Aberta.jpg → assets/img/salgados/coxinha-aberta-{480,960,1440}.webp
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const ORIGINAIS = "assets/img/_originais";
const LARGURAS = [480, 960, 1440];
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const pasta of await readdir(ORIGINAIS, { withFileTypes: true })) {
  if (!pasta.isDirectory()) continue;
  const destino = path.join("assets/img", pasta.name);
  await mkdir(destino, { recursive: true });
  for (const arquivo of await readdir(path.join(ORIGINAIS, pasta.name))) {
    if (!/\.(jpe?g|png|webp|avif|tiff?)$/i.test(arquivo)) continue;
    const nome = slug(path.parse(arquivo).name);
    for (const w of LARGURAS) {
      await sharp(path.join(ORIGINAIS, pasta.name, arquivo))
        .rotate() // respeita a orientação da foto do celular
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(destino, `${nome}-${w}.webp`));
    }
    console.log(`${pasta.name}/${nome}`);
  }
}
