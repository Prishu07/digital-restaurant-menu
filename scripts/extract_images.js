const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pdfPath = "C:/Users/silp3/.gemini/antigravity/brain/41369b4a-ca8a-4bcc-8150-4bf85c4ae71f/.user_uploaded/media_1794112990349_654a2d2d.pdf";
const outDir = "C:/AWS PROJECT/digital-restaurant-menu/extracted_images";

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const buf = fs.readFileSync(pdfPath);
console.log("PDF read, length:", buf.length);

// Let's find JPEG images directly by looking for SOI marker 0xFF 0xD8 0xFF and EOI marker 0xFF 0xD9
let pos = 0;
let jpgCount = 0;
while (pos < buf.length - 4) {
    if (buf[pos] === 0xFF && buf[pos+1] === 0xD8 && buf[pos+2] === 0xFF) {
        // Found possible start of JPEG
        let end = pos + 3;
        while (end < buf.length - 1) {
            if (buf[end] === 0xFF && buf[end+1] === 0xD9) {
                // End of JPEG
                const jpgData = buf.subarray(pos, end + 2);
                if (jpgData.length > 500) { // filter out tiny false positives
                    jpgCount++;
                    const fileName = `extracted_${jpgCount}_${jpgData.length}b.jpg`;
                    fs.writeFileSync(path.join(outDir, fileName), jpgData);
                    console.log(`Saved ${fileName} (${jpgData.length} bytes) at pos ${pos}`);
                }
                pos = end + 2;
                break;
            }
            end++;
        }
    }
    pos++;
}
console.log(`Total JPEGs extracted: ${jpgCount}`);
