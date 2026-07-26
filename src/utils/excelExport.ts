import type { tableData } from "../types/inbox.types";

const EXCEL_MIME_TYPE = "application/vnd.ms-excel;charset=utf-8;";

const sanitizeFileNamePart = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "") || "table";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getExportValue = (value: unknown): string => {
  if (value == null) return "";

  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

const createExcelTable = ({
  rows,
  columnKeys,
  columnLabels,
}: {
  rows: tableData[];
  columnKeys: string[];
  columnLabels: Map<string, string>;
}) => {
  const headers = columnKeys
    .map((key) => `<th>${escapeHtml(columnLabels.get(key) ?? key)}</th>`)
    .join("");

  const body = rows
    .map((row) => {
      const data = row as unknown as Record<string, unknown>;
      
      return `<tr>${columnKeys
        .map(
          (key) =>
            `<td style="mso-number-format:'\\@';">${escapeHtml(
              getExportValue(data[key]),
            )}</td>`,
        )
        .join("")}</tr>`;
    })
    .join("");

  return `
    <!doctype html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${body}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export const downloadRowsAsExcel = ({
  rows,
  columnKeys,
  columnLabels,
  selectedPool,
}: {
  rows: tableData[];
  columnKeys: string[];
  columnLabels: Map<string, string>;
  selectedPool: string;
}) => {
  const fileName = `${sanitizeFileNamePart(selectedPool)}_${new Date()
    .toISOString()
    .slice(0, 10)}.xls`;

  const workbook = createExcelTable({
    rows,
    columnKeys,
    columnLabels,
  });

  const blob = new Blob([workbook], {
    type: EXCEL_MIME_TYPE,
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();

  requestAnimationFrame(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });
};
