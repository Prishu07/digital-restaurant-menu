const fs = require('fs');

let html = fs.readFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', 'utf8');

const oldSigBlock = `      <table style="width: 100%; border: none; margin-bottom: 25px;">
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

const newSigBlock = `      <table style="width: 100%; border: none; margin-bottom: 25px;">
        <tr>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 48px;">TRAINER’S SIGNATURE</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
          <td style="width: 50%; border: none; vertical-align: top;">
            <div style="font-weight: bold; font-size: 9.5pt; margin-bottom: 5px;">SUBMITTED BY</div>
            <div style="font-size: 11pt; font-weight: bold; color: #0f172a; margin-bottom: 28px; font-family: 'Times New Roman', Times, serif; line-height: 1.2;">Priyanshu Durlav</div>
            <div style="width: 180px; border-bottom: 1.5px solid #0f172a;"></div>
          </td>
        </tr>
      </table>`;

if (!html.includes(oldSigBlock)) {
    console.error("Old signature block not found!");
    process.exit(1);
}

html = html.replace(oldSigBlock, newSigBlock);
fs.writeFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', html, 'utf8');
console.log("Successfully updated signature block in internship-report.html!");

