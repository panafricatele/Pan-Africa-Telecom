import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { META, SECTIONS, SIGNOFF_INTRO } from './content.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(here, '..', '..', 'documents');
const shotsDir = path.join(docsDir, 'screenshots');
const outFile = path.join(docsDir, 'PAT-Project-Signoff.pdf');

const BLUE = '#0088FF';
const EMERALD = '#10B981';
const INK = '#0F172A';
const MUTED = '#64748B';
const LINE = '#E2E8F0';

const MARGIN = 56;
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: MARGIN, bottom: MARGIN + 18, left: MARGIN, right: MARGIN },
  info: {
    Title: `${META.client} — ${META.title}`,
    Author: META.vendor,
    Subject: META.subtitle,
  },
});

const W = doc.page.width - MARGIN * 2;
const BOTTOM = doc.page.height - MARGIN - 18;

const shots = fs.existsSync(path.join(shotsDir, 'manifest.json'))
  ? JSON.parse(fs.readFileSync(path.join(shotsDir, 'manifest.json'), 'utf8'))
  : { shots: [] };

const today = new Date().toLocaleDateString('en-ZA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/* ------------------------------------------------------------------ */
/*  Page furniture                                                     */
/* ------------------------------------------------------------------ */

let pageNo = 0;
let decorate = false;

function footer() {
  if (!decorate) return;
  pageNo += 1;
  const y = doc.page.height - MARGIN - 6;
  doc.save();
  doc.moveTo(MARGIN, y - 10).lineTo(MARGIN + W, y - 10).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.font('Helvetica').fontSize(7.5).fillColor(MUTED);
  // The footer sits inside the reserved bottom margin, below the body's
  // maxY. Zero the margin for this draw so PDFKit doesn't treat it as an
  // overflow and recurse into another addPage() via the pageAdded event.
  // doc.text() also moves doc.x/doc.y as a side effect, so both are
  // restored afterwards to the top-of-page position they held on entry.
  const bottomMargin = doc.page.margins.bottom;
  const { x: savedX, y: savedY } = doc;
  doc.page.margins.bottom = 0;
  doc.text(`${META.client} — ${META.title}`, MARGIN, y - 4, { width: W * 0.7, lineBreak: false });
  doc.text(`${META.reference}   |   Page ${pageNo}`, MARGIN, y - 4, { width: W, align: 'right', lineBreak: false });
  doc.page.margins.bottom = bottomMargin;
  doc.x = savedX;
  doc.y = savedY;
  doc.restore();
}

doc.on('pageAdded', footer);

function space(needed) {
  if (doc.y + needed > BOTTOM) doc.addPage();
}

function heading(text) {
  space(70);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(BLUE).text(text, MARGIN, doc.y);
  doc.moveTo(MARGIN, doc.y + 3).lineTo(MARGIN + W, doc.y + 3).lineWidth(1).strokeColor(BLUE).stroke();
  doc.moveDown(0.7);
}

function paragraph(text) {
  space(40);
  doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(text, MARGIN, doc.y, {
    width: W,
    align: 'justify',
    lineGap: 2.2,
  });
  doc.moveDown(0.6);
}

function bulletBlock(block) {
  if (!block) return;
  space(50);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text(block.title, MARGIN, doc.y, { width: W });
  doc.moveDown(0.35);
  for (const item of block.items) {
    space(30);
    const y = doc.y;
    doc.circle(MARGIN + 3.5, y + 4.6, 1.9).fillColor(BLUE).fill();
    doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(item, MARGIN + 12, y, {
      width: W - 12,
      align: 'left',
      lineGap: 2,
    });
    doc.moveDown(0.3);
  }
  doc.moveDown(0.5);
}

function table({ head, widths, rows }) {
  const pad = 6;
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = W / total;
  const cols = widths.map((w) => w * scale);

  const drawHead = () => {
    const h = 20;
    space(h + 26);
    const y = doc.y;
    doc.rect(MARGIN, y, W, h).fillColor(BLUE).fill();
    let x = MARGIN;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
    head.forEach((cell, i) => {
      doc.text(cell, x + pad, y + 6, { width: cols[i] - pad * 2, lineBreak: false });
      x += cols[i];
    });
    doc.y = y + h;
  };

  drawHead();

  rows.forEach((row, index) => {
    doc.font('Helvetica').fontSize(8.5);
    const heights = row.map((cell, i) =>
      doc.heightOfString(String(cell), { width: cols[i] - pad * 2, lineGap: 1.5 })
    );
    const h = Math.max(...heights) + pad * 2;

    if (doc.y + h > BOTTOM) {
      doc.addPage();
      drawHead();
    }

    const y = doc.y;
    if (index % 2 === 1) doc.rect(MARGIN, y, W, h).fillColor('#F5F8FB').fill();

    let x = MARGIN;
    row.forEach((cell, i) => {
      doc.font('Helvetica').fontSize(8.5).fillColor(INK).text(String(cell), x + pad, y + pad, {
        width: cols[i] - pad * 2,
        lineGap: 1.5,
      });
      x += cols[i];
    });

    doc.moveTo(MARGIN, y + h).lineTo(MARGIN + W, y + h).lineWidth(0.5).strokeColor(LINE).stroke();
    doc.y = y + h;
  });

  doc.moveDown(0.9);
}

/* ------------------------------------------------------------------ */
/*  Cover                                                              */
/* ------------------------------------------------------------------ */

doc.rect(0, 0, doc.page.width, doc.page.height).fillColor('#071324').fill();
doc.rect(0, 0, 8, doc.page.height).fillColor(BLUE).fill();

doc.font('Helvetica-Bold').fontSize(10).fillColor(BLUE).text('PAN AFRICA TELECOM', MARGIN, 92, {
  characterSpacing: 2.4,
});
doc.font('Helvetica').fontSize(9).fillColor('#94A3B8').text(META.reference, MARGIN, 110);

doc.font('Helvetica-Bold').fontSize(34).fillColor('#FFFFFF').text(META.title, MARGIN, 250, {
  width: W - 40,
  lineGap: 4,
});
doc.font('Helvetica').fontSize(12.5).fillColor('#CBD5E1').text(META.subtitle, MARGIN, doc.y + 14, {
  width: W - 60,
  lineGap: 3,
});

doc.roundedRect(MARGIN, doc.y + 30, 320, 26, 13).fillColor('#0F2A44').fill();
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(EMERALD).text(META.licence, MARGIN + 14, doc.y + 38);

let cy = doc.page.height - 190;
doc.moveTo(MARGIN, cy).lineTo(MARGIN + 200, cy).lineWidth(1).strokeColor('#1E3A56').stroke();

const coverRows = [
  ['Prepared for', META.client],
  ['Prepared by', META.vendor],
  ['Contact', META.vendorEmail],
  ['Date issued', today],
  ['Document version', META.version],
];
cy += 18;
for (const [label, value] of coverRows) {
  doc.font('Helvetica').fontSize(8).fillColor('#64748B').text(label.toUpperCase(), MARGIN, cy, {
    characterSpacing: 1.1,
  });
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF').text(value, MARGIN + 130, cy - 1);
  cy += 22;
}

/* ------------------------------------------------------------------ */
/*  Contents                                                           */
/* ------------------------------------------------------------------ */

decorate = true;
doc.addPage();

heading('Contents');
for (const section of SECTIONS) {
  doc.font('Helvetica').fontSize(10).fillColor(INK).text(section.heading, MARGIN + 6, doc.y, { width: W });
  doc.moveDown(0.45);
}
doc.font('Helvetica').fontSize(10).fillColor(INK).text('11. Acceptance & Sign-Off', MARGIN + 6, doc.y);
doc.moveDown(0.45);
doc.text('Appendix A — Screenshot Evidence', MARGIN + 6, doc.y);
doc.moveDown(1.2);

doc.roundedRect(MARGIN, doc.y, W, 62).fillColor('#F1F6FB').fill();
doc.font('Helvetica-Bold').fontSize(9).fillColor(BLUE).text('About this document', MARGIN + 12, doc.y + 10);
doc
  .font('Helvetica')
  .fontSize(9)
  .fillColor(INK)
  .text(
    `Appendix A contains ${shots.shots.length} screenshots captured directly from the running application, covering every public page, every page section, mobile layouts and each Admin Dashboard tab.`,
    MARGIN + 12,
    doc.y + 4,
    { width: W - 24, lineGap: 2 }
  );

/* ------------------------------------------------------------------ */
/*  Body                                                               */
/* ------------------------------------------------------------------ */

for (const section of SECTIONS) {
  doc.addPage();
  heading(section.heading);
  for (const para of section.body || []) paragraph(para);
  bulletBlock(section.bullets);
  if (section.table) table(section.table);
  bulletBlock(section.bulletsTwo);
}

/* ------------------------------------------------------------------ */
/*  Sign-off                                                           */
/* ------------------------------------------------------------------ */

doc.addPage();
heading('11. Acceptance & Sign-Off');
paragraph(SIGNOFF_INTRO);
doc.moveDown(0.8);

function signatureBlock(role, party) {
  space(150);
  const y = doc.y;
  doc.roundedRect(MARGIN, y, W, 132, 4).lineWidth(0.8).strokeColor(LINE).stroke();
  doc.rect(MARGIN, y, 4, 132).fillColor(BLUE).fill();

  doc.font('Helvetica-Bold').fontSize(10).fillColor(BLUE).text(role.toUpperCase(), MARGIN + 18, y + 14, {
    characterSpacing: 1.2,
  });
  doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(party, MARGIN + 18, y + 30);

  const fields = [
    ['Full name', 0],
    ['Position', 1],
    ['Signature', 2],
    ['Date', 3],
  ];
  for (const [label, i] of fields) {
    const fy = y + 58 + i * 18;
    doc.font('Helvetica').fontSize(8.5).fillColor(MUTED).text(label, MARGIN + 18, fy - 8);
    doc
      .moveTo(MARGIN + 95, fy + 2)
      .lineTo(MARGIN + W - 20, fy + 2)
      .lineWidth(0.6)
      .strokeColor('#C8D4E0')
      .stroke();
  }

  doc.y = y + 132;
  doc.moveDown(0.9);
}

signatureBlock('Accepted for the client', META.client);
signatureBlock('Delivered by the developer', META.vendor);

/* ------------------------------------------------------------------ */
/*  Appendix — screenshots                                             */
/* ------------------------------------------------------------------ */

doc.addPage();
heading('Appendix A — Screenshot Evidence');

if (shots.shots.length === 0) {
  paragraph(
    'No screenshots were available when this document was generated. Run "npm run capture" in scripts/signoff with the frontend running, then regenerate this document.'
  );
} else {
  paragraph(
    `Captured on ${new Date(shots.capturedAt).toLocaleString('en-ZA')} from ${shots.baseUrl}. Desktop captures are full-page at 1440px wide; mobile captures are at 390px wide.`
  );

  for (const shot of shots.shots) {
    const file = path.join(shotsDir, shot.file);
    if (!fs.existsSync(file)) continue;

    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(11).fillColor(BLUE).text(shot.title, MARGIN, doc.y, { width: W });
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(8.5).fillColor(MUTED).text(
      `${shot.route}${shot.kind === 'mobile' ? '  ·  mobile 390px' : shot.kind === 'section' ? '  ·  section detail' : '  ·  full page'}`,
      MARGIN,
      doc.y,
      { width: W }
    );
    doc.moveDown(0.3);
    if (shot.description) {
      doc.font('Helvetica').fontSize(9).fillColor(INK).text(shot.description, MARGIN, doc.y, {
        width: W,
        lineGap: 2,
      });
      doc.moveDown(0.5);
    }

    const top = doc.y + 4;
    const available = BOTTOM - top;
    doc.image(file, MARGIN, top, {
      fit: [W, available],
      align: 'center',
      valign: 'top',
    });
  }
}

doc.pipe(fs.createWriteStream(outFile)).on('finish', () => {
  const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
  console.log(`\nGenerated documents/PAT-Project-Signoff.pdf (${kb} KB, ${pageNo} pages)`);
});
footer();
doc.end();
