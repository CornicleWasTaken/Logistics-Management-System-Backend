import ExcelJS from "exceljs";

export const generateExcelReport = async (res, data, columns, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  worksheet.columns = columns;

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
};