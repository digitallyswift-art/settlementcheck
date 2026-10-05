import fs from 'fs';
import path from 'path';

// Helper to draw anti-aliased squircle and checkmark on a 32x32 buffer
function createIco32() {
  const width = 32;
  const height = 32;
  const bpp = 4; // BGRA
  const pixels = Buffer.alloc(width * height * bpp, 0);

  // Colors in BGRA
  const navy = [58, 31, 11, 255];       // #0B1F3A
  const parchment = [238, 244, 247, 255]; // #F7F4EE
  const coral = [59, 96, 217, 255];      // #D9603B

  function setPixel(x, y, color) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    // ICO BMP pixel data is stored bottom-up
    const row = height - 1 - y;
    const offset = (row * width + x) * 4;
    pixels[offset + 0] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
    pixels[offset + 3] = color[3];
  }

  // Draw rounded rect (squircle)
  const radius = 7;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let inside = false;
      let isBorder = false;

      // Distance from inner corners
      const dx = Math.max(0, Math.max(radius - x, x - (width - 1 - radius)));
      const dy = Math.max(0, Math.max(radius - y, y - (height - 1 - radius)));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        inside = true;
        if (dist >= radius - 1.5 || x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2) {
          isBorder = true;
        }
      }

      if (inside) {
        if (isBorder) {
          setPixel(x, y, parchment);
        } else {
          setPixel(x, y, navy);
        }
      }
    }
  }

  // Draw bold checkmark on 32x32
  // Vector line 1: (9, 16) to (14, 22)
  // Vector line 2: (14, 22) to (24, 10)
  function drawLine(x0, y0, x1, y1, strokeWidth, color) {
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 3);
    const half = strokeWidth / 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x0 + (x1 - x0) * t;
      const cy = y0 + (y1 - y0) * t;
      for (let oy = -Math.ceil(half); oy <= Math.ceil(half); oy++) {
        for (let ox = -Math.ceil(half); ox <= Math.ceil(half); ox++) {
          if (ox * ox + oy * oy <= half * half) {
            setPixel(Math.round(cx + ox), Math.round(cy + oy), color);
          }
        }
      }
    }
  }

  drawLine(9, 16, 14, 22, 3.2, coral);
  drawLine(14, 22, 23, 10, 3.2, coral);

  // ICO header structures
  const headerSize = 6;
  const dirEntrySize = 16;
  const bihSize = 40;
  const pixelDataSize = width * height * 4;
  const andMaskSize = (width / 8) * height; // 32 / 8 * 32 = 128 bytes
  const imageSize = bihSize + pixelDataSize + andMaskSize;

  const ico = Buffer.alloc(headerSize + dirEntrySize + imageSize);

  // 1. ICONDIR
  ico.writeUInt16LE(0, 0); // reserved
  ico.writeUInt16LE(1, 2); // 1 = ICO
  ico.writeUInt16LE(1, 4); // 1 image

  // 2. ICONDIRENTRY
  ico.writeUInt8(width, 6);
  ico.writeUInt8(height, 7);
  ico.writeUInt8(0, 8); // color count
  ico.writeUInt8(0, 9); // reserved
  ico.writeUInt16LE(1, 10); // planes
  ico.writeUInt16LE(32, 12); // bpp
  ico.writeUInt32LE(imageSize, 14); // size
  ico.writeUInt32LE(headerSize + dirEntrySize, 18); // offset = 22

  // 3. BITMAPINFOHEADER
  const bihOffset = 22;
  ico.writeUInt32LE(40, bihOffset + 0);
  ico.writeInt32LE(width, bihOffset + 4);
  ico.writeInt32LE(height * 2, bihOffset + 8); // doubled for ICO
  ico.writeUInt16LE(1, bihOffset + 12);
  ico.writeUInt16LE(32, bihOffset + 14);
  ico.writeUInt32LE(0, bihOffset + 16); // BI_RGB
  ico.writeUInt32LE(pixelDataSize + andMaskSize, bihOffset + 20);
  ico.writeInt32LE(0, bihOffset + 24);
  ico.writeInt32LE(0, bihOffset + 28);
  ico.writeUInt32LE(0, bihOffset + 32);
  ico.writeUInt32LE(0, bihOffset + 36);

  // 4. Pixel data
  pixels.copy(ico, bihOffset + bihSize);

  // 5. AND mask (0 for opaque/transparent handled in alpha)
  const andMaskOffset = bihOffset + bihSize + pixelDataSize;
  for (let i = 0; i < andMaskSize; i++) {
    ico.writeUInt8(0, andMaskOffset + i);
  }

  return ico;
}

const icoBuffer = createIco32();
fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), icoBuffer);
console.log('Successfully wrote public/favicon.ico (' + icoBuffer.length + ' bytes)');
