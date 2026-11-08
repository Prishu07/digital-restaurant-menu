const fs = require('fs');

const logoBuf = fs.readFileSync('C:/AWS PROJECT/digital-restaurant-menu/report-images/dv-logo.png');
const base64Logo = logoBuf.toString('base64');
console.log('Logo base64 length:', base64Logo.length);

let html = fs.readFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', 'utf8');

// Target 1: The old DV Emblem
const oldEmblemTarget = `        <!-- Dreamz Vision Emblem -->
        <div style="margin: 35px auto; width: 110px; height: 110px; border-radius: 50%; border: 4px solid #881337; display: flex; align-items: center; justify-content: center; background: radial-gradient(#ffffff, #fef2f2); box-shadow: 0 0 10px rgba(136,19,55,0.2);">
          <div style="font-size: 32pt; font-family: serif; font-weight: bold; color: #881337; letter-spacing: -2px;">DV</div>
        </div>`;

const newEmblem = `        <!-- Dreamz Vision Emblem -->
        <div style="margin: 24px auto 18px auto; text-align: center;">
          <img src="data:image/png;base64,${base64Logo}" alt="Dreamz Vision Logo" style="width: 125px; height: auto; display: block; margin: 0 auto;" />
        </div>`;

if (!html.includes(oldEmblemTarget)) {
    console.error('Old emblem target not found!');
    process.exit(1);
}
html = html.replace(oldEmblemTarget, newEmblem);

// Target 2: The signature block
const oldSigTarget = `      <table style="width: 100%; border: none; margin-bottom: 25px;">
        <tr>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 45px;">TRAINER’S SIGNATURE</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 45px;">SUBMITTED BY</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
        </tr>
      </table>`;

const newSig = `      <table style="width: 100%; border: none; margin-bottom: 25px;">
        <tr>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-size: 11pt; line-height: 1.2; visibility: hidden; margin-bottom: 4px;">&nbsp;</div>
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 40px;">TRAINER’S SIGNATURE</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-size: 11pt; font-weight: bold; color: #0f172a; margin-bottom: 4px; font-family: 'Times New Roman', Times, serif; line-height: 1.2;">Priyanshu Durlav</div>
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 40px;">SUBMITTED BY</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
        </tr>
      </table>`;

if (!html.includes(oldSigTarget)) {
    console.error('Old signature target not found!');
    process.exit(1);
}
html = html.replace(oldSigTarget, newSig);

fs.writeFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', html, 'utf8');
console.log('Successfully updated internship-report.html!');
