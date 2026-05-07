import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crc]);
}

// Draws a rounded-rect gradient icon: purple → violet → rose (matches logo.svg)
// Uses a solid approximation: top-left #667eea, blended toward bottom-right #f5576c
function createPNG(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Build raw scanlines: filter byte (0) + RGB per pixel
  const rowLen = 1 + size * 3;
  const raw = Buffer.alloc(size * rowLen, 0);

  const radius = Math.round(size * 0.2); // 20% corner radius

  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter None
    for (let x = 0; x < size; x++) {
      // Rounded rect check
      const inCorner =
        (x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius) ||
        (x >= size - radius && y < radius && Math.hypot(x - (size - radius), y - radius) > radius) ||
        (x < radius && y >= size - radius && Math.hypot(x - radius, y - (size - radius)) > radius) ||
        (x >= size - radius && y >= size - radius && Math.hypot(x - (size - radius), y - (size - radius)) > radius);

      if (inCorner) {
        // Transparent-ish: use dark background (#0C0C0C)
        raw[y * rowLen + 1 + x * 3] = 12;
        raw[y * rowLen + 2 + x * 3] = 12;
        raw[y * rowLen + 3 + x * 3] = 12;
      } else {
        // Linear gradient: top-left #667eea → bottom-right #f5576c
        const t = (x + y) / (size * 2 - 2);
        const r = Math.round(0x66 + t * (0xf5 - 0x66));
        const g = Math.round(0x7e + t * (0x57 - 0x7e));
        const b = Math.round(0xea + t * (0x6c - 0xea));
        raw[y * rowLen + 1 + x * 3] = r;
        raw[y * rowLen + 2 + x * 3] = g;
        raw[y * rowLen + 3 + x * 3] = b;
      }
    }
  }

  const idat = deflateSync(raw);

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192x192.png', createPNG(192));
writeFileSync('public/icons/icon-512x512.png', createPNG(512));
console.log('PWA icons written to public/icons/');
