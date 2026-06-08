import PDFDocument from "pdfkit";

export const generatePdfReport = (res, title, data, filename) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text(title, { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  data.forEach((item, index) => {
    let line = `${index + 1}. `;
    for (const [key, value] of Object.entries(item)) {
      if (key !== "_id" && key !== "__v") {
        line += `${key}: ${value} | `;
      }
    }
    doc.text(line.slice(0, -3));
    doc.moveDown(0.5);
  });

  doc.end();
};