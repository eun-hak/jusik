import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 각 크기별 SVG 생성
function makeSvg(size) {
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.56);
  const barX = Math.round(size * 0.21);
  const barY = Math.round(size * 0.79);
  const barW = Math.round(size * 0.58);
  const barH = Math.max(2, Math.round(size * 0.07));
  const barR = Math.max(1, Math.round(size * 0.035));
  const textY = Math.round(size * 0.66);

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#0A0A0A"/>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${barR}" fill="#6B2D3C"/>
  <text x="${size / 2}" y="${textY}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-weight="700" font-size="${fontSize}" fill="white">주</text>
</svg>`;
}

async function buildIco(sizes) {
  const pngs = await Promise.all(
    sizes.map(async (size) => {
      const buf = await sharp(Buffer.from(makeSvg(size)))
        .resize(size, size)
        .png()
        .toBuffer();
      return { size, data: buf };
    })
  );

  const count = pngs.length;
  const HEADER = 6;
  const DIR_ENTRY = 16;
  let dataOffset = HEADER + DIR_ENTRY * count;

  // 오프셋 계산
  const entries = pngs.map(({ size, data }) => {
    const entry = { size, data, offset: dataOffset };
    dataOffset += data.length;
    return entry;
  });

  const ico = Buffer.alloc(dataOffset);

  // ICO 헤더
  ico.writeUInt16LE(0, 0); // reserved
  ico.writeUInt16LE(1, 2); // type: ICO
  ico.writeUInt16LE(count, 4); // image count

  // 디렉토리 엔트리
  let pos = HEADER;
  for (const { size, data, offset } of entries) {
    ico.writeUInt8(size >= 256 ? 0 : size, pos);      // width
    ico.writeUInt8(size >= 256 ? 0 : size, pos + 1);  // height
    ico.writeUInt8(0, pos + 2);                        // colorCount
    ico.writeUInt8(0, pos + 3);                        // reserved
    ico.writeUInt16LE(1, pos + 4);                     // planes
    ico.writeUInt16LE(32, pos + 6);                    // bitCount
    ico.writeUInt32LE(data.length, pos + 8);           // size
    ico.writeUInt32LE(offset, pos + 12);               // offset
    pos += DIR_ENTRY;
  }

  // 이미지 데이터 삽입
  for (const { data, offset } of entries) {
    data.copy(ico, offset);
  }

  return ico;
}

const ico = await buildIco([16, 32, 48]);
const out = join(__dirname, "../src/app/favicon.ico");
writeFileSync(out, ico);
console.log(`✓ favicon.ico 생성 완료 (${ico.length} bytes) — 16, 32, 48px`);
