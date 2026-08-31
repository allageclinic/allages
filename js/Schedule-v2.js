document.addEventListener("DOMContentLoaded", function() {
  // 2026-08-31 修正版本 - 兼容 week_1.jpg / 1w.jpg 兩種命名，並加入 cache bust
  const today = new Date();
  let monday = new Date(today);
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

  const totalImages = 5;
  const images = [];
  for (let i = 1; i <= totalImages; i++) {
    images.push({
      main: `week_${i}.jpg`,
      alt: `${i}w.jpg`
    });
  }

  let currentIndex = (weekNum - 1) % images.length;
  const imgEl = document.getElementById("clinicSchedule");
  const weekRangeEl = document.getElementById("weekRange");

  function buildScheduleUrl(fileName) {
    return `./images/${fileName}?v=${Date.now()}`;
  }

  function setImageByIndex(i) {
    const candidates = [images[i].main, images[i].alt];
    let attempt = 0;

    function tryNextCandidate() {
      if (attempt >= candidates.length) {
        imgEl.src = buildScheduleUrl(candidates[0]);
        return;
      }

      const currentName = candidates[attempt];
      imgEl.src = buildScheduleUrl(currentName);
      attempt += 1;
    }

    imgEl.onerror = function() {
      tryNextCandidate();
    };

    tryNextCandidate();
  }

  function updateWeekRange() {
    weekRangeEl.innerText = getWeekRange(monday);
  }

  setImageByIndex(currentIndex);
  updateWeekRange();

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
    const daysToFri = (5 - d.getDay() + 7) % 7;
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
    monday.setDate(monday.getDate() + 7);
    updateWeekRange();
  }

  const now = new Date();
  const todayKey = formatYMD(now);
  const isTodayFriday = now.getDay() === 5;

  if (isTodayFriday) {
    localStorage.removeItem(storageKey);
  }

  if (isTodayFriday && !localStorage.getItem(storageKey)) {
    advanceImage();
    localStorage.setItem(storageKey, todayKey);
    console.log("Friday image switched to:", images[currentIndex].main, "Week range:", weekRangeEl.innerText, "Updated at:", new Date().toISOString());
  }

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
