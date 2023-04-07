import PDFDocument from 'pdfkit';

function buildPDF(dataCallback, endCallback) {
    const doc = new PDFDocument()
    // doc.pipe(fs.createWriteStream('output.pdf'));

    doc.on("data", dataCallback)
    doc.on("end", endCallback)

    doc.fontSize(25).text('Some text with an embedded font!', 100, 100);

    doc.end();
}

export default { buildPDF }