import { Textbook } from '../data/textbooksData';

/**
 * Escapes characters for PDF literal string format: (...)
 */
function escapePdfText(text: string): string {
  if (!text) return '';
  return text
    // Replace Uzbek curly apostrophes with standard single quote
    .replace(/[ʻʼ`’‘]/g, "'")
    // Replace non-ascii chars that might break WinAnsi with clean alternatives
    .replace(/[–—]/g, '-')
    .replace(/[«»“”]/g, '"')
    // Escape backslashes and parentheses
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates a complete, valid multi-page PDF 1.4 document for any textbook
 * Returns a base64 Data URL (data:application/pdf;base64,...)
 */
export function generateTextbookPdf(book: Textbook): string {
  const pages: string[] = [];
  const pageWidth = 595; // A4 width in pt
  const pageHeight = 842; // A4 height in pt

  // Convert hue to RGB values (0-1)
  const hue = (book.coverHue || 160) % 360;
  // Simple hue to rgb
  const h = hue / 60;
  const c = 0.7;
  const x = c * (1 - Math.abs((h % 2) - 1));
  let r = 0, g = 0.5, b = 0.4;
  if (h >= 0 && h < 1) { r = c; g = x; b = 0; }
  else if (h >= 1 && h < 2) { r = x; g = c; b = 0; }
  else if (h >= 2 && h < 3) { r = 0; g = c; b = x; }
  else if (h >= 3 && h < 4) { r = 0; g = x; b = c; }
  else if (h >= 4 && h < 5) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  // Soften
  const rF = (r * 0.7 + 0.1).toFixed(2);
  const gF = (g * 0.7 + 0.1).toFixed(2);
  const bF = (b * 0.7 + 0.1).toFixed(2);

  // -------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // -------------------------------------------------------------
  let coverStream = '';
  // Background top banner
  coverStream += `${rF} ${gF} ${bF} rg 0 680 595 162 re f\n`;
  coverStream += `0.97 0.98 0.97 rg 30 40 535 620 re f\n`;
  coverStream += `0.85 0.88 0.86 RG 2 w 30 40 535 620 re S\n`;

  // Header Ministry text (White on banner)
  coverStream += `BT /F1 11 Tf 1 1 1 rg 50 780 Td (O'ZBEKISTON RESPUBLIKASI MAKTAB VA MAKTABGACHA TA'LIM VAZIRLIGI) Tj ET\n`;
  coverStream += `BT /F2 9 Tf 0.9 0.95 0.9 rg 50 762 Td (Respublika ta'lim markazi tomonidan tavsiya etilgan rasmiy darslik) Tj ET\n`;

  // Grade badge
  coverStream += `${rF} ${gF} ${bF} rg 50 560 120 40 re f\n`;
  coverStream += `BT /F1 18 Tf 1 1 1 rg 60 573 Td (${book.grade}-SINF) Tj ET\n`;

  // Title
  coverStream += `BT /F1 24 Tf 0.08 0.15 0.12 rg 50 510 Td (${escapePdfText(book.title)}) Tj ET\n`;

  // Subtitle / description
  coverStream += `BT /F2 13 Tf 0.25 0.35 0.30 rg 50 480 Td (Umumiy o'rta ta'lim maktablari uchun darslik) Tj ET\n`;
  coverStream += `BT /F2 11 Tf 0.35 0.45 0.40 rg 50 450 Td (${escapePdfText(book.desc.slice(0, 75))}) Tj ET\n`;
  if (book.desc.length > 75) {
    coverStream += `BT /F2 11 Tf 0.35 0.45 0.40 rg 50 432 Td (${escapePdfText(book.desc.slice(75, 150))}) Tj ET\n`;
  }

  // Decorative middle card
  coverStream += `1 1 1 rg 50 200 495 200 re f\n`;
  coverStream += `0.85 0.88 0.86 RG 1 w 50 200 495 200 re S\n`;
  coverStream += `${rF} ${gF} ${bF} rg 50 360 495 40 re f\n`;
  coverStream += `BT /F1 13 Tf 1 1 1 rg 70 374 Td (DARSLIK HAQIDA MA'LUMOT) Tj ET\n`;

  coverStream += `BT /F1 11 Tf 0.1 0.2 0.15 rg 70 330 Td (Mualliflar:) Tj ET\n`;
  coverStream += `BT /F2 11 Tf 0.2 0.3 0.25 rg 150 330 Td (${escapePdfText(book.author)}) Tj ET\n`;

  coverStream += `BT /F1 11 Tf 0.1 0.2 0.15 rg 70 300 Td (Nashriyot:) Tj ET\n`;
  coverStream += `BT /F2 11 Tf 0.2 0.3 0.25 rg 150 300 Td (${escapePdfText(book.publisher)}) Tj ET\n`;

  coverStream += `BT /F1 11 Tf 0.1 0.2 0.15 rg 70 270 Td (Nashr yili:) Tj ET\n`;
  coverStream += `BT /F2 11 Tf 0.2 0.3 0.25 rg 150 270 Td (${book.year}-yil · ${book.pages} bet) Tj ET\n`;

  coverStream += `BT /F1 11 Tf 0.1 0.2 0.15 rg 70 240 Td (Holati:) Tj ET\n`;
  coverStream += `BT /F2 11 Tf 0.05 0.5 0.3 rg 150 240 Td (Tasdiqlangan elektron nashr - To'liq o'qish uchun tayyor) Tj ET\n`;

  // Footer
  coverStream += `BT /F1 11 Tf 0.2 0.3 0.25 rg 210 70 Td (Toshkent - ${book.year}) Tj ET\n`;
  coverStream += `BT /F2 9 Tf 0.5 0.6 0.55 rg 200 52 Td (Elektron ta'lim platformasi nusxasi) Tj ET\n`;

  pages.push(coverStream);

  // -------------------------------------------------------------
  // PAGE 2: TABLE OF CONTENTS (MUNDARIJA)
  // -------------------------------------------------------------
  let tocStream = '';
  // Top bar
  tocStream += `${rF} ${gF} ${bF} rg 0 790 595 52 re f\n`;
  tocStream += `BT /F1 14 Tf 1 1 1 rg 50 808 Td (${escapePdfText(book.title.toUpperCase())} - MUNDARIJA) Tj ET\n`;

  // Subheader
  tocStream += `BT /F1 18 Tf 0.08 0.15 0.12 rg 50 740 Td (Darslik Mundarijasi va Boblar Tuzilishi) Tj ET\n`;
  tocStream += `0.8 0.85 0.82 RG 1.5 w 50 725 495 0 m 545 725 l S\n`;

  let yOffset = 690;
  book.chapters.forEach((ch, idx) => {
    // Chapter Box
    tocStream += `0.96 0.98 0.96 rg 50 ${yOffset - 35} 495 50 re f\n`;
    tocStream += `0.85 0.88 0.86 RG 1 w 50 ${yOffset - 35} 495 50 re S\n`;

    tocStream += `${rF} ${gF} ${bF} rg 50 ${yOffset - 35} 6 50 re f\n`;

    tocStream += `BT /F1 12 Tf 0.08 0.15 0.12 rg 70 ${yOffset - 5} Td (${ch.num}-bob. ${escapePdfText(ch.title)}) Tj ET\n`;
    tocStream += `BT /F1 10 Tf 0.05 0.5 0.35 rg 470 ${yOffset - 5} Td (${escapePdfText(ch.pages)} bet) Tj ET\n`;

    if (ch.summary) {
      tocStream += `BT /F2 9 Tf 0.35 0.45 0.40 rg 70 ${yOffset - 22} Td (${escapePdfText(ch.summary.slice(0, 95))}) Tj ET\n`;
    }

    yOffset -= 65;
  });

  // Methodical notes at bottom
  tocStream += `0.93 0.96 0.94 rg 50 110 495 80 re f\n`;
  tocStream += `BT /F1 11 Tf 0.05 0.45 0.3 rg 65 165 Td (Metodik tavsiya va o'quv qo'llanma:) Tj ET\n`;
  tocStream += `BT /F2 9.5 Tf 0.25 0.35 0.3 rg 65 145 Td (Har bir bob oxirida berilgan amaliy mashqlar va savollarni mustaqil bajarish tavsiya etiladi.) Tj ET\n`;
  tocStream += `BT /F2 9.5 Tf 0.25 0.35 0.3 rg 65 125 Td (Bilimlarni mustahkamlash uchun mavzular bo'yicha test sinovlaridan o'ting.) Tj ET\n`;

  // Page number
  tocStream += `BT /F2 9 Tf 0.5 0.6 0.55 rg 285 30 Td (Sahifa 2) Tj ET\n`;

  pages.push(tocStream);

  // -------------------------------------------------------------
  // PAGES 3+: CHAPTER DETAILS (Each chapter gets a formatted page)
  // -------------------------------------------------------------
  book.chapters.forEach((ch, idx) => {
    let chStream = '';
    const pageNum = idx + 3;

    // Top banner
    chStream += `${rF} ${gF} ${bF} rg 0 800 595 42 re f\n`;
    chStream += `BT /F2 9 Tf 1 1 1 rg 50 815 Td (${escapePdfText(book.title)} · ${book.grade}-sinf) Tj ET\n`;
    chStream += `BT /F1 10 Tf 1 1 1 rg 450 815 Td (Sahifalar: ${escapePdfText(ch.pages)}) Tj ET\n`;

    // Chapter Header
    chStream += `BT /F1 11 Tf 0.05 0.5 0.35 rg 50 760 Td (${book.grade}-SINF · ${ch.num}-BOB) Tj ET\n`;
    chStream += `BT /F1 18 Tf 0.08 0.15 0.12 rg 50 735 Td (${escapePdfText(ch.title)}) Tj ET\n`;
    chStream += `0.8 0.85 0.82 RG 1.5 w 50 720 495 0 m 545 720 l S\n`;

    // Section 1: Nazariy qism (Theory & Abstract)
    chStream += `0.97 0.98 0.97 rg 50 600 495 105 re f\n`;
    chStream += `0.88 0.90 0.88 RG 1 w 50 600 495 105 re S\n`;
    chStream += `${rF} ${gF} ${bF} rg 50 600 5 105 re f\n`;

    chStream += `BT /F1 12 Tf 0.08 0.15 0.12 rg 68 680 Td (1-Mavzu: Nazariy tushunchalar va qonuniyatlar) Tj ET\n`;
    chStream += `BT /F2 10.5 Tf 0.2 0.3 0.25 rg 68 655 Td (${escapePdfText(ch.summary || 'Ushbu bobda berilgan asosiy qoidalar, xulosalar va ta\'riflar o\'rganiladi.')}) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.3 0.4 0.35 rg 68 635 Td (Darslik materialini puxta o'zlashtirish uchun dars jarayonida qaydlarni yozib boring.) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.3 0.4 0.35 rg 68 615 Td (Tushunarsiz formulalar va ta'riflar yuzasidan o'qituvchidan qo'shimcha izoh so'rang.) Tj ET\n`;

    // Section 2: Amaliy mashqlar va formulalar
    chStream += `BT /F1 13 Tf 0.08 0.15 0.12 rg 50 560 Td (Amaliy misollar va qo'llanish sohalari:) Tj ET\n`;
    chStream += `BT /F2 10.5 Tf 0.2 0.3 0.25 rg 50 535 Td (1. Mavzuga doir asosiy formulalar va tushunchalar tahlili.) Tj ET\n`;
    chStream += `BT /F2 10.5 Tf 0.2 0.3 0.25 rg 50 515 Td (2. Standart va nostandart amaliy masalalarni yechish uslubiyati.) Tj ET\n`;
    chStream += `BT /F2 10.5 Tf 0.2 0.3 0.25 rg 50 495 Td (3. Hayotiy misollar va fanlararo integratsiya tadbiqlari.) Tj ET\n`;

    // Section 3: Interactive Exercises box
    chStream += `1 1 1 rg 50 310 495 160 re f\n`;
    chStream += `0.85 0.88 0.86 RG 1 w 50 310 495 160 re S\n`;
    chStream += `0.94 0.97 0.95 rg 50 435 495 35 re f\n`;
    chStream += `BT /F1 11 Tf 0.05 0.45 0.3 rg 65 448 Td (O'Z-O'ZINI TEKSHIRISH UCHUN TOPSHIRIQLAR:) Tj ET\n`;

    chStream += `BT /F1 10 Tf 0.1 0.2 0.15 rg 65 410 Td (1-savol:) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.2 0.3 0.25 rg 115 410 Td (${escapePdfText(ch.title)} mavzusining asosiy maqsadi nimadan iborat?) Tj ET\n`;

    chStream += `BT /F1 10 Tf 0.1 0.2 0.15 rg 65 380 Td (2-savol:) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.2 0.3 0.25 rg 115 380 Td (Ushbu bobdagi qoidalar kundalik amaliyotda qayerda qo'llaniladi?) Tj ET\n`;

    chStream += `BT /F1 10 Tf 0.1 0.2 0.15 rg 65 350 Td (3-topshiriq:) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.2 0.3 0.25 rg 125 350 Td (Darslikning ${escapePdfText(ch.pages)} sahifalaridagi 1-5 gacha mashqlarni daftarda ishlang.) Tj ET\n`;

    chStream += `BT /F2 9.5 Tf 0.4 0.5 0.45 rg 65 325 Td (* Masalalar yechimini fan o'qituvchisiga tekshirtiring.) Tj ET\n`;

    // Section 4: Bob xulosasi
    chStream += `0.96 0.96 0.96 rg 50 180 495 100 re f\n`;
    chStream += `BT /F1 11 Tf 0.15 0.25 0.2 rg 65 255 Td (Bob bo'yicha xulosa:) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.25 0.35 0.3 rg 65 235 Td (Bobni muvaffaqiyatli tamomlagan o'quvchi mustaqil fikrlash, tahlil qilish) Tj ET\n`;
    chStream += `BT /F2 10 Tf 0.25 0.35 0.3 rg 65 215 Td (hamda amaliy masalalarni erkin yechish ko'nikmasiga ega bo'ladi.) Tj ET\n`;
    chStream += `BT /F1 10 Tf 0.05 0.5 0.35 rg 65 195 Td (Navbatdagi mavzuga o'tishdan oldin bilimlaringizni sinovdan o'tkazing.) Tj ET\n`;

    // Page footer
    chStream += `BT /F2 9 Tf 0.5 0.6 0.55 rg 280 30 Td (Sahifa ${pageNum}) Tj ET\n`;

    pages.push(chStream);
  });

  // -------------------------------------------------------------
  // BUILD PDF 1.4 BINARY STREAM WITH CROSS-REFERENCE TABLE
  // -------------------------------------------------------------
  const totalPages = pages.length;
  const objects: string[] = [];

  // Obj 1: Catalog
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  // Obj 2: Pages root
  const kidsRefs = Array.from({ length: totalPages }, (_, i) => `${3 + i * 2} 0 R`).join(' ');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${kidsRefs}] /Count ${totalPages} >>\nendobj\n`);

  // Font objects: Obj F1 (Helvetica-Bold), Obj F2 (Helvetica)
  const f1ObjNum = 3 + totalPages * 2;
  const f2ObjNum = f1ObjNum + 1;

  // For each page: Page object + Content stream object
  for (let i = 0; i < totalPages; i++) {
    const pageObjNum = 3 + i * 2;
    const contentObjNum = pageObjNum + 1;
    const streamContent = pages[i];
    const streamBytesLen = new TextEncoder().encode(streamContent).length;

    // Page Object
    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${f1ObjNum} 0 R /F2 ${f2ObjNum} 0 R >> >> >>\nendobj\n`
    );

    // Content Stream Object
    objects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamBytesLen} >>\nstream\n${streamContent}endstream\nendobj\n`
    );
  }

  // F1 Font (Helvetica-Bold)
  objects.push(`${f1ObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

  // F2 Font (Helvetica)
  objects.push(`${f2ObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);

  // Calculate byte offsets for xref
  let pdf = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;
  const offsets: number[] = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += objects[i];
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    pdf += `${offStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  // Encode to base64 Data URL safely handling utf-8
  const base64 = btoa(
    encodeURIComponent(pdf).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );

  return `data:application/pdf;base64,${base64}`;
}
