
let autoSlideInterval;

function startAutoSlideFullscreen() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    if (groupedTrips && groupedTrips.length > 0) {
      nextSlide();
    }
  }, 5000);
}

// Lắng nghe sự kiện fullscreen
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    startAutoSlideFullscreen();
  } else {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }
});


function startAutoSlide() {
  setInterval(() => {
    if (groupedTrips && groupedTrips.length > 0) {
      nextSlide();
    }
  }, 7000);
}

let currentIndex = 0;
let groupedTrips = [];

document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("excel-input");
  const uploadStatus = document.getElementById("upload-status");

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && uploadStatus) {
      uploadStatus.textContent = "✅ Đã tải file thành công!";
      uploadStatus.style.color = "#00ff88";
    }

    const reader = new FileReader();
    const isCSV = file.name.endsWith(".csv");

    reader.onload = function (e) {
      if (isCSV) {
        const text = e.target.result;
        const rows = text.split("\n").map(r => r.split(","));
        renderCSVData(rows);
      } else {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", codepage: 65001 });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: true });
saveDataToLocal(rows);
        prepareGroupedTrips(rows);
        showTripSlide(0);
  updateTripIndicator();
        updateMarqueeFromThongBao(rows);

if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

}
    };

    if (isCSV) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });
});
("DOMContentLoaded", function () {
  document.getElementById('excel-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const isCSV = file.name.endsWith('.csv');

    reader.onload = function(e) {
      if (isCSV) {
        const text = e.target.result;
        const rows = text.split('\n').map(r => r.split(','));
        renderCSVData(rows);
      } else {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', codepage: 65001 });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: true });
saveDataToLocal(rows);
        prepareGroupedTrips(rows);
        showTripSlide(0);
  updateTripIndicator();
        updateMarqueeFromThongBao(rows);

if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

}
    };

    if (isCSV) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });
});

function prepareGroupedTrips(rows) {
  groupedTrips = [];
  const grouped = {};
  for (const row of rows) {
    if (!row["Chuyến"]) continue;
    const chuyen = String(row["Chuyến"]).trim();
    if (!grouped[chuyen]) grouped[chuyen] = [];
    grouped[chuyen].push(row);
  }
  groupedTrips = Object.values(grouped); // giữ tất cả chuyến, không lọc hoàn thành
}

function showTripSlide(index) {
  if (!groupedTrips.length) return;
  currentIndex = index;
  const tbody = document.getElementById('dashboard-body');
  tbody.innerHTML = '';
  const group = groupedTrips[index];

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
      else if (st.includes("hoàn thành")) tdStatus.className = "status-hoanthanh";
      tr.appendChild(tdStatus);
    }
    tbody.appendChild(tr);
  });
}

function nextSlide() {
  if (!groupedTrips.length) return;
  currentIndex = (currentIndex + 1) % groupedTrips.length;
  showTripSlide(currentIndex);
  updateTripIndicator();
        updateMarqueeFromThongBao(rows);

if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

}

function prevSlide() {
  if (!groupedTrips.length) return;
  currentIndex = (currentIndex - 1 + groupedTrips.length) % groupedTrips.length;
  showTripSlide(currentIndex);
  updateTripIndicator();
        updateMarqueeFromThongBao(rows);

if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

}


function updateTripIndicator() {
  const indicator = document.getElementById("trip-indicator");
  if (!indicator || !groupedTrips.length) return;
  indicator.textContent = "Chuyến " + (currentIndex + 1) + " / " + groupedTrips.length;
}

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m + ':' + s;
}
setInterval(updateClock, 1000);
updateClock();

function updateMarquee() {
  const allStores = groupedTrips.flat().map(r => r["Cửa hàng"]).filter(Boolean).join(" • ");
  const text = allStores || "Không có dữ liệu cửa hàng";
  const marqueeSpan = document.getElementById("marquee-text");
  if (marqueeSpan) marqueeSpan.textContent = text;
}

function updateMarqueeFromThongBao(rows) {
  const marqueeSpan = document.getElementById("marquee-text");
  if (!marqueeSpan) return;
  const messages = rows.map(r => r["Thông báo"]).filter(Boolean);
  marqueeSpan.textContent = messages.length > 0 ? messages.join(" • ") : "Không có thông báo nào.";
}


// Tự động chuyển slide sau mỗi 7 giây


document.addEventListener("DOMContentLoaded", () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
});

function saveDataToLocal(rows) {
  localStorage.setItem("dashboardData", JSON.stringify(rows));
}
function loadDataFromLocal() {
  const stored = localStorage.getItem("dashboardData");
  if (!stored) return;
  try {
    const rows = JSON.parse(stored);
    prepareGroupedTrips(rows);
    showTripSlide(0);
    updateTripIndicator();
    updateMarqueeFromThongBao(rows);
  } catch (e) {
    console.error("Dữ liệu localStorage không hợp lệ", e);
  }
}
function clearSavedData() {
  localStorage.removeItem("dashboardData");
  location.reload();
}
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromLocal();
});
