function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString('mn-MN');
}

module.exports = function generateInvoiceHtml(items) {
  if (!items || !items.length) {
    items = [];
  }

  const invoiceDate = items[0]?.date || '';

  const rowsHtml = items
    .map((item, index) => {
      return `
        <tr>
          <td class="cell center">${index + 1}</td>
          <td class="cell left">${item.name || ''}</td>
          <td class="cell center">1</td>
          <td class="cell right">${formatNumber(item.unitPrice)}</td>
          <td class="cell right">${formatNumber(item.totalPrice)}</td>
        </tr>
      `;
    })
    .join('');

  const totalSum = items.reduce(
    (sum, item) => sum + (Number(item.totalPrice) || 0),
    0
  );

  return `
<!DOCTYPE html>
<html lang="mn">
  <head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <style>
      * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 32px 40px;
        font-size: 12px;
        color: #111827;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 700;
        color: #22c55e;
      }
      .logo-mark {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 2px solid #22c55e;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .company-info {
        font-size: 9px;
        text-align: right;
        color: #4b5563;
      }
      .title {
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 2px;
        margin: 32px 0 24px;
      }
      .meta-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
        font-size: 11px;
      }
      .meta-table td {
        padding: 4px 6px;
      }
      .label {
        font-weight: 600;
        width: 80px;
      }
      .value {
        border-bottom: 1px solid #9ca3af;
      }
      .main-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
        font-size: 11px;
      }
      .main-table th {
        border: 1px solid #9ca3af;
        padding: 6px 4px;
        background-color: #e5e7eb;
        font-weight: 600;
      }
      .cell {
        border: 1px solid #9ca3af;
        padding: 6px 4px;
      }
      .center {
        text-align: center;
      }
      .right {
        text-align: right;
      }
      .left {
        text-align: left;
      }
      .total-row td {
        font-weight: 700;
        border-top: none;
      }
      .footer-note {
        margin-top: 40px;
        font-size: 10px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">
        <div class="logo-mark">Δ</div>
        <span>deltasoft</span>
      </div>
      <div class="company-info">
        Монгол улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 8 хороо, GB Center, 202 тоот<br />
        Утас: 75331177 &nbsp;|&nbsp; Вэб: deltasoft.mn &nbsp;|&nbsp;
        И-мэйл: info@deltasoft.mn
      </div>
    </div>

    <div class="title">НЭХЭМЖЛЭХ</div>

    <table class="meta-table">
      <tr>
        <td class="label">ХАРИЛЦАГЧ:</td>
       <td class="value"></td>
      </tr>
      <tr>
        <td class="label">ОГНОО:</td>
        <td class="value">${invoiceDate || ''}</td>
      </tr>
      <tr>
        <td class="label">УТАС:</td>
        <td class="value"></td>
      </tr>
    </table>

    <table class="main-table">
      <thead>
        <tr>
          <th style="width: 30px;">№</th>
          <th>Барааны нэр</th>
          <th style="width: 40px;">Тоо</th>
          <th style="width: 90px;">Нэгж үнэ (₮)</th>
          <th style="width: 100px;">Нийт үнэ (₮)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || `
        <tr>
          <td class="cell center">1</td>
          <td class="cell left"></td>
          <td class="cell center">1</td>
          <td class="cell right"></td>
          <td class="cell right"></td>
        </tr>`}
        <tr class="total-row">
          <td class="cell right" colspan="4">Нийт дүн /НӨАТ-гүй төгрөг/</td>
          <td class="cell right">${formatNumber(totalSum)}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-note">
      Энэхүү нэхэмжлэхийг Deltasoft системээс автоматаар үүсгэв.
    </div>
  </body>
</html>
`;
};


