document.addEventListener("DOMContentLoaded", function() {
  const totalImages = 5;
  const images = Array.from({ length: totalImages }, function(_, index) {
    const week = index + 1;
    return {
      main: `week_${week}.jpg`,
      alt: `${week}w.jpg`
    };
  });

  const imgEl = document.getElementById("clinicSchedule");
  const weekRangeEl = document.getElementById("weekRange");

  if (!imgEl || !weekRangeEl) return;

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getMonday(date) {
    const monday = startOfDay(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  }

  function getFriday(date) {
    const friday = getMonday(date);
    friday.setDate(friday.getDate() + 4);
    return friday;
  }

  function shouldShowNextWeek(now) {
    const day = now.getDay();
    const cutoff = new Date(now);
    cutoff.setHours(23, 59, 0, 0);

    return day === 6 || day === 0 || (day === 5 && now >= cutoff);
  }

  function getDisplayDate(now) {
    const displayDate = new Date(now);

    if (shouldShowNextWeek(now)) {
      displayDate.setDate(displayDate.getDate() + ((8 - displayDate.getDay()) % 7));
    }

    return displayDate;
  }

  function getWeekNumberInMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    return Math.ceil((date.getDate() + firstDayIndex) / 7);
  }

  function getScheduleWeekNumber(displayDate) {
    return getWeekNumberInMonth(displayDate);
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function formatMD(date) {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
  }

  function getWeekRange(displayDate) {
    const firstDayOfMonth = startOfDay(new Date(displayDate.getFullYear(), displayDate.getMonth(), 1));
    const monday = getMonday(displayDate);
    const friday = getFriday(displayDate);
    const rangeStart = monday < firstDayOfMonth ? firstDayOfMonth : monday;

    return `${formatMD(rangeStart)}~${formatMD(friday)}`;
  }

  function buildScheduleUrl(fileName, displayDate) {
    const version = [
      displayDate.getFullYear(),
      pad(displayDate.getMonth() + 1),
      pad(displayDate.getDate())
    ].join("");

    return `./images/${fileName}?v=${version}`;
  }

  function setImageByIndex(index, displayDate) {
    const candidates = [images[index].main, images[index].alt];
    let attempt = 0;

    function tryNextCandidate() {
      const currentName = candidates[attempt] || candidates[0];
      attempt += 1;
      imgEl.src = buildScheduleUrl(currentName, displayDate);
    }

    imgEl.onerror = function() {
      if (attempt < candidates.length) {
        tryNextCandidate();
      }
    };

    tryNextCandidate();
  }

  function updateSchedule() {
    const now = new Date();
    const displayDate = getDisplayDate(now);
    const weekNum = getScheduleWeekNumber(displayDate);
    const imageIndex = (weekNum - 1) % images.length;

    weekRangeEl.innerText = getWeekRange(displayDate);
    setImageByIndex(imageIndex, displayDate);

    console.log(
      "schedule display date:",
      displayDate.toISOString().slice(0, 10),
      "weekNum:",
      weekNum,
      "image:",
      images[imageIndex].main,
      "range:",
      weekRangeEl.innerText
    );
  }

  updateSchedule();
  setInterval(updateSchedule, 60 * 1000);
});
