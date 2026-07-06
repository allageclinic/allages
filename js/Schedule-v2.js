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

  // 預設圖片清單（可依實際圖片數量調整）
  const totalImages = 5; // 若有更多/更少張，改這個數字
  const images = [];
  for (let i = 1; i <= totalImages; i++) images.push(`week_${i}.jpg`);

  let currentIndex = (weekNum - 1) % images.length;

  const imgEl = document.getElementById("clinicSchedule");
  document.getElementById("weekRange").innerText = getWeekRange(monday);

  function setImageByIndex(i) {
    imgEl.src = `./images/${images[i]}`;
  }

  setImageByIndex(currentIndex);

  // 每週五 15:00 自動切下一張的排程與狀態儲存
  const storageKey = "lastFridayChangeDate";

  function formatYMD(d) {
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function getThisFriday15(now) {
    const d = new Date(now);
    const daysToFri = (5 - d.getDay() + 7) % 7; // Friday === 5
    d.setDate(d.getDate() + daysToFri);
    d.setHours(15, 0, 0, 0);
    return d;
  }

  function getNextFriday15(now) {
    const candidate = getThisFriday15(now);
    if (candidate <= now) candidate.setDate(candidate.getDate() + 7);
    return candidate;
  }

  function advanceImage() {
    currentIndex = (currentIndex + 1) % images.length;
    setImageByIndex(currentIndex);
  }

  const now = new Date();
  const thisFriday15 = getThisFriday15(now);
  const thisFridayKey = formatYMD(thisFriday15);

  // 如果已過本週五15:00且尚未切換過（以 localStorage 紀錄），則立即切換
  if (now >= thisFriday15 && localStorage.getItem(storageKey) !== thisFridayKey) {
    advanceImage();
    localStorage.setItem(storageKey, thisFridayKey);
  }

  // 排程下一次在下一個週五15:00執行，並建立每週定時器
  const nextFriday15 = getNextFriday15(now);
  const msUntilNext = nextFriday15 - now;
  setTimeout(function() {
    advanceImage();
    localStorage.setItem(storageKey, formatYMD(nextFriday15));
    setInterval(function() {
      const todayKey = formatYMD(new Date());
      advanceImage();
      localStorage.setItem(storageKey, todayKey);
    }, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNext);

  console.log("today:", today.toISOString().slice(0, 10), "monday:", monday.toISOString().slice(0, 10), "weekNum:", weekNum, "currentIndex:", currentIndex);
});
