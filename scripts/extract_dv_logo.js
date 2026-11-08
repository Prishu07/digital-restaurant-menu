const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pdfPath = "C:/Users/silp3/.gemini/antigravity/brain/41369b4a-ca8a-4bcc-8150-4bf85c4ae71f/.user_uploaded/media_1794112990349_654a2d2d.pdf";
const pdfBuf = fs.readFileSync(pdfPath);

function getStreamData(buf, objNum) {
    const pattern = new RegExp(`${objNum}\\s+0\\s+obj([\\s\\S]*?)stream\\r?\\n`, 'm');
    const match = pattern.exec(buf.toString('binary'));
    if (!match) {
        throw new Error(`Obj ${objNum} not found`);
    }
    
    // find index in buffer
    const streamStartStr = match[0];
    const streamStartPos = buf.indexOf(Buffer.from(streamStartStr, 'binary')) + Buffer.from(streamStartStr, 'binary').length;
    
    // find endstream
    const endstreamPos = buf.indexOf(Buffer.from('endstream', 'binary'), streamStartPos);
    
    // read slice
    let slice = buf.subarray(streamStartPos, endstreamPos);
    // strip trailing \r\n if present
    while (slice.length > 0 && (slice[slice.length - 1] === 0x0A || slice[slice.length - 1] === 0x0D)) {
        slice = slice.subarray(0, slice.length - 1);
    }
    return slice;
}

const rgbCompressed = getStreamData(pdfBuf, 51);
const maskCompressed = getStreamData(pdfBuf, 50);

console.log("RGB compressed length:", rgbCompressed.length);
console.log("Mask compressed length:", maskCompressed.length);

const rgbData = zlib.inflateSync(rgbCompressed);
const maskData = zlib.inflateSync(maskCompressed);

console.log("Decompressed RGB length:", rgbData.length, "expected:", 391 * 361 * 3);
console.log("Decompressed Mask length:", maskData.length, "expected:", 391 * 361);

const width = 391;
const height = 361;

// Prepare RGBA scanlines for PNG (each row has 1 filter byte = 0 + width * 4 bytes)
const rowSize = 1 + width * 4;
const rawPngData = Buffer.alloc(rowSize * height);

for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawPngData[rowOffset] = 0; // Filter: None
    
    for (let x = 0; x < width; x++) {
        const rgbIdx = (y * width + x) * 3;
        const maskIdx = y * width + x;
        const outIdx = rowOffset + 1 + x * 4;
        
        rawPngData[outIdx] = rgbData[rgbIdx];         // R
        rawPngData[outIdx + 1] = rgbData[rgbIdx + 1]; // G
        rawPngData[outIdx + 2] = rgbData[rgbIdx + 2]; // B
        rawPngData[outIdx + 3] = maskData[maskIdx];   // A
    }
}

// CRC32 table & function
const crcTable = [];
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c = c >>> 1;
    }
    crcTable[n] = c;
}

function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    
    const bodyBuf = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(bodyBuf);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    
    return Buffer.concat([lenBuf, bodyBuf, crcBuf]);
}

// PNG Header
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// IHDR
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // 8 bit depth
ihdrData[9] = 6; // color type 6: RGBA
ihdrData[10] = 0; // compression
ihdrData[11] = 0; // filter
ihdrData[12] = 0; // interlace
const ihdrChunk = createChunk('IHDR', ihdrData);

// IDAT
const compressedIdat = zlib.deflateSync(rawPngData);
const idatChunk = createChunk('IDAT', compressedIdat);

// IEND
const iendChunk = createChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);

const target1 = "C:/AWS PROJECT/digital-restaurant-menu/report-images/dv-logo.png";
const target2 = "C:/Users/silp3/.gemini/antigravity/brain/41369b4a-ca8a-4bcc-8150-4bf85c4ae71f/dv-logo.png";

fs.writeFileSync(target1, finalPng);
fs.writeFileSync(target2, finalPng);

console.log("Successfully wrote PNG to:", target1, `(${finalPng.length} bytes)`);
console.log("Successfully wrote PNG to:", target2, `(${finalPng.length} bytes)`);
