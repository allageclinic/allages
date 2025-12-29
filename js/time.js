 const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11，7 代表 8 月
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 本月第一天是星期幾（0=星期日）

  const day = today.getDate(); // 今天是幾號
  const weekOfMonth = Math.ceil((day + dayOfWeek) / 7); // 本月第幾週

  // 顯示圖片 week1.jpg ~ week5.jpg（根據週數切換）
  const displayWeek = weekOfMonth;
  const imgPath = `./image/week_${displayWeek}.jpg`;

  document.getElementById("clinicSchedule").src = imgPath;

  // 顯示週數說明
  document.getElementById("weekInfo").innerText =
    `目前為 ${month + 1} 月的第 ${weekOfMonth} 週，顯示圖 week${displayWeek}.jpg`;
