const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunkBuf = Buffer.alloc(12 + len);
  chunkBuf.writeUInt32BE(len, 0);
  chunkBuf.write(type, 4, 4, 'ascii');
  data.copy(chunkBuf, 8);
  const typeAndData = chunkBuf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunkBuf.writeUInt32BE(crc, 8 + len);
  return chunkBuf;
}

function createPng(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowStride = 1 + width * 4;
  const raw = Buffer.alloc(rowStride * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;
  const cornerR = width * 0.22; // rounded rect corner

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    raw[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      let r = 6, g = 78, b = 59, a = 255; // #064e3b Deep Emerald

      // Background styling
      if (!isMaskable) {
        // Squircle / rounded container
        const dx = Math.max(Math.abs(x - cx) - (cx - cornerR), 0);
        const dy = Math.max(Math.abs(y - cy) - (cy - cornerR), 0);
        const distToCorner = Math.sqrt(dx * dx + dy * dy);
        if (distToCorner > cornerR) {
          a = 0; // Transparent outside rounded app icon
        } else if (distToCorner > cornerR - 1.5) {
          a = Math.max(0, Math.min(255, Math.floor(255 * (cornerR - distToCorner) / 1.5)));
        }
      }

      if (a > 0) {
        // Subtle Radial Gradient
        const distFromCenter = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
        const grad = Math.min(distFromCenter / (width * 0.65), 1.0);
        r = Math.round(6 * (1 - grad * 0.3));
        g = Math.round(78 * (1 - grad * 0.25) + 30 * (1 - grad));
        b = Math.round(59 * (1 - grad * 0.2));

        // Decorative Gold Outer Ring
        const ringR = width * 0.38;
        const ringThickness = width * 0.018;
        const ringDist = Math.abs(distFromCenter - ringR);
        if (ringDist < ringThickness) {
          const goldFactor = Math.max(0, 1 - ringDist / ringThickness);
          r = Math.round(r * (1 - goldFactor) + 234 * goldFactor); // #eab308 Gold
          g = Math.round(g * (1 - goldFactor) + 179 * goldFactor);
          b = Math.round(b * (1 - goldFactor) + 8 * goldFactor);
        }

        // Draw Stylized Open Quran Icon in Center (White & Gold)
        // Center book: width * 0.36 wide, width * 0.26 high
        const bookW = width * 0.34;
        const bookH = width * 0.22;
        const relX = (x - cx) / (bookW / 2);
        const relY = (y - (cy + width * 0.02)) / (bookH / 2);

        // Open book curvature
        if (Math.abs(relX) <= 1.0 && Math.abs(relY) <= 1.0) {
          const spineCurve = 0.2 * (1 - relX * relX);
          const pageDist = Math.abs(relY - spineCurve);
          if (pageDist < 0.75 && Math.abs(relX) > 0.04) {
            // Book page (Warm Ivory #fffbeb)
            const edgeBlend = Math.min(1.0, (0.75 - pageDist) * 8);
            r = Math.round(r * (1 - edgeBlend) + 255 * edgeBlend);
            g = Math.round(g * (1 - edgeBlend) + 251 * edgeBlend);
            b = Math.round(b * (1 - edgeBlend) + 235 * edgeBlend);

            // Gold line highlights inside page
            if (Math.abs(relY - 0.1) < 0.06 || Math.abs(relY + 0.2) < 0.06) {
              if (Math.abs(relX) > 0.2 && Math.abs(relX) < 0.8) {
                r = 217; g = 119; b = 6; // gold accent
              }
            }
          } else if (Math.abs(relX) <= 0.05 && pageDist < 0.85) {
            // Spine (Golden)
            r = 234; g = 179; b = 8;
          }
        }

        // Lens / Star motif on top (y: cy - width * 0.18)
        const starY = cy - width * 0.20;
        const starDist = Math.sqrt((x - cx) * (x - cx) + (y - starY) * (y - starY));
        if (starDist < width * 0.055) {
          const starBlend = Math.max(0, 1 - starDist / (width * 0.055));
          r = Math.round(r * (1 - starBlend) + 250 * starBlend);
          g = Math.round(g * (1 - starBlend) + 204 * starBlend);
          b = Math.round(b * (1 - starBlend) + 21 * starBlend); // Bright gold
        }
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(raw));
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate standard icons
console.log('Generating 192x192 icon...');
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192, false));

console.log('Generating 512x512 icon...');
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512, false));

console.log('Generating 512x512 maskable icon...');
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.png'), createPng(512, 512, true));

console.log('Generating 180x180 apple-touch-icon...');
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPng(180, 180, false));

// Also place apple-touch-icon.png in public root for iOS Safari compatibility
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Icons generated successfully!');
