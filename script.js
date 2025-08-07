document.getElementById('excel-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array', codepage: 65001 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: true });
    if (!rows.length || !rows[0]["Chuyến"]) {
      alert("Không tìm thấy cột 'Chuyến' trong file Excel.");
      return;
    }
    renderFullDashboard(rows);
  };
  reader.readAsArrayBuffer(file);
});

function renderFullDashboard(rows) {
  const tbody = document.getElementById('dashboard-body');
  tbody.innerHTML = '';
  const grouped = {};

  for (const row of rows) {
    if (!row["Chuyến"]) continue;
    const chuyen = String(row["Chuyến"]).trim();
    if (!grouped[chuyen]) grouped[chuyen] = [];
    grouped[chuyen].push(row);
  }

  for (const chuyen in grouped) {
    const group = grouped[chuyen];
    const status = (group[0]["Tình trạng"] || "").toLowerCase();
    if (status.includes("hoàn thành")) continue;

    group.forEach((row, i) => {
      const tr = document.createElement('tr');
      if (i === 0) {
        const tdChuyen = document.createElement('td');
        tdChuyen.rowSpan = group.length;
        tdChuyen.textContent = row["Chuyến"];
        tr.appendChild(tdChuyen);
      }

      const tdStore = document.createElement('td');
      tdStore.textContent = row["Cửa hàng"] || '';
      tr.appendChild(tdStore);

      if (i === 0) {
        const tdTime = document.createElement('td');
        tdTime.rowSpan = group.length;
        tdTime.textContent = row["Giờ xuất"] || '';
        tr.appendChild(tdTime);

        const tdQty = document.createElement('td');
        tdQty.rowSpan = group.length;
        tdQty.textContent = row["Số lượng"] || '';
        tr.appendChild(tdQty);

        const tdStatus = document.createElement('td');
        tdStatus.rowSpan = group.length;
        tdStatus.textContent = row["Tình trạng"] || '';
        const st = (row["Tình trạng"] || "").toLowerCase();
        if (st.includes("hủy")) tdStatus.className = "status-huy";
        else if (st.includes("chờ")) tdStatus.className = "status-dangcho";
        tr.appendChild(tdStatus);
      }

      tbody.appendChild(tr);
    });
  }
}