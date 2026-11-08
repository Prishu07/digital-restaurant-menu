const fs = require('fs');

let html = fs.readFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', 'utf8');

// Target 1: The title
const oldTitle = `<h1 class="main-title">INTERNSHIP TRAINING REPORT<br/><span style="font-size: 14pt; font-weight: normal;">ON</span><br/>INTERNSHIP ON CLOUD COMPUTING<br/>USING AWS</h1>`;
const newTitle = `<h1 class="main-title">INTERNSHIP TRAINING REPORT<br/><span style="font-size: 14pt; font-weight: normal;">ON</span><br/>CLOUD COMPUTING<br/>USING AWS</h1>`;

if (!html.includes(oldTitle)) {
    console.error("Old title not found!");
    process.exit(1);
}

html = html.replace(oldTitle, newTitle);

// Target 2: FIELD OF TRAINING
const oldField = `<div><strong>FIELD OF TRAINING :</strong> INTERNSHIP ON CLOUD COMPUTING USING AWS</div>`;
const newField = `<div><strong>FIELD OF TRAINING :</strong> CLOUD COMPUTING USING AWS</div>`;

if (html.includes(oldField)) {
    html = html.replace(oldField, newField);
    console.log("Updated FIELD OF TRAINING as well!");
}

fs.writeFileSync('C:/AWS PROJECT/digital-restaurant-menu/internship-report.html', html, 'utf8');
console.log("Successfully updated title in internship-report.html!");
