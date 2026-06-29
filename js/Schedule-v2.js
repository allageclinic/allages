document.addEventListener("DOMContentLoaded", function() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  function getWeekNumberInMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    return Math.ceil((date.getDate() + firstDayIndex) / 7);
  }

  function getWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(startDate.getMonth() + 1)}/${pad(startDate.getDate())}~${pad(endDate.getMonth() + 1)}/${pad(endDate.getDate())}`;
  }

  const weekNum = getWeekNumberInMonth(monday);
  const weekImg = `week_${weekNum}.jpg`;

  console.log(
    "today:",
    today.toISOString().slice(0, 10),
    "monday:",
    monday.toISOString().slice(0, 10),
    "weekNum:",
    weekNum,
    "weekImg:",
    weekImg
  );

  document.getElementById("weekRange").innerText = getWeekRange(monday);
  const clinicImg = document.getElementById("clinicSchedule");
  const weekSrc = `./images/${weekImg}`;

  // 嘗試載入預期檔名，若失敗則嘗試帶底線的檔名，最後回退到通用圖片
  clinicImg.onerror = function () {
    if (!this._triedAlt) {
      this._triedAlt = true;
      this.src = `./images/week_${weekNum}_.jpg`;
    } else {
      this.src = `./images/list.jpg`;
    }
  };

  clinicImg.src = weekSrc;
});
