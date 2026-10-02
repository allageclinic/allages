document.addEventListener("DOMContentLoaded", function() {
  const imgEl = document.getElementById("clinicSchedule");
  const weekRangeEl = document.getElementById("weekRange");
  if (!imgEl || !weekRangeEl) return;

  const previousButton = document.getElementById("schedulePrevious");
  const nextButton = document.getElementById("scheduleNext");
  const todayButton = document.getElementById("scheduleToday");
  const zoomButton = document.getElementById("scheduleZoom");
  const downloadLink = document.getElementById("scheduleDownload");
  const statusEl = document.getElementById("scheduleStatus");
  let monthKey = "";
  let availableSchedules = [];
  let selectedWeek = null;
  let currentIndex = -1;

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function getMonthKey(date) {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}`;
  }

  function getMonday(date) {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  }

  function formatMD(date) {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
  }

  function getDefaultWeek(now) {
    const date = new Date(now);
    const cutoff = new Date(now);
    cutoff.setHours(23, 59, 0, 0);
    if (now.getDay() === 6 || now.getDay() === 0 || (now.getDay() === 5 && now >= cutoff)) {
      date.setDate(date.getDate() + ((8 - date.getDay()) % 7));
    }
    if (getMonthKey(date) !== getMonthKey(now)) return 5;
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return Math.ceil((date.getDate() + (first.getDay() + 6) % 7) / 7);
  }

  function loadImage(url) {
    return new Promise(function(resolve) {
      const image = new Image();
      image.onload = function() { resolve(url); };
      image.onerror = function() { resolve(null); };
      image.src = url;
    });
  }

  function renderSchedule(now) {
    const defaultWeek = getDefaultWeek(now);
    currentIndex = availableSchedules.findIndex(function(schedule) {
      return schedule.week === selectedWeek;
    });
    if (currentIndex < 0 && availableSchedules.length) {
      currentIndex = 0;
      availableSchedules.forEach(function(schedule, index) {
        if (schedule.week <= defaultWeek) currentIndex = index;
      });
    }

    const schedule = availableSchedules[currentIndex];
    previousButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex < 0 || currentIndex >= availableSchedules.length - 1;
    todayButton.disabled = !schedule;
    zoomButton.disabled = !schedule;
    downloadLink.hidden = !schedule;
    imgEl.hidden = !schedule;
    statusEl.hidden = !!schedule;
    if (!schedule) {
      weekRangeEl.textContent = `${now.getFullYear()}/${pad(now.getMonth() + 1)}`;
      return;
    }

    weekRangeEl.textContent = `${formatMD(schedule.start)}~${formatMD(schedule.end)}`;
    imgEl.alt = "門診時間表 " + weekRangeEl.textContent;
    if (imgEl.getAttribute("src") !== schedule.url) imgEl.src = schedule.url;
    downloadLink.href = schedule.url;
  }

  async function updateSchedule() {
    const now = new Date();
    const nextMonthKey = getMonthKey(now);
    if (nextMonthKey === monthKey) {
      renderSchedule(now);
      return;
    }

    monthKey = nextMonthKey;
    selectedWeek = null;
    availableSchedules = [];
    statusEl.textContent = "門診表載入中";
    renderSchedule(now);
    // Expire the uploaded month's JPGs instead of relabeling them next month.
    if (imgEl.dataset.scheduleMonth !== `${now.getFullYear()}-${pad(now.getMonth() + 1)}`) {
      statusEl.textContent = "本月門診表尚未提供";
      return;
    }
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstMonday = getMonday(first);
    const candidates = [];
    for (let week = 1; week <= 5; week += 1) {
      const monday = new Date(firstMonday);
      monday.setDate(monday.getDate() + (week - 1) * 7);
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      if (friday < first || monday > last) continue;
      const start = monday < first ? first : monday;
      const end = friday > last ? last : friday;
      candidates.push((async function() {
        // Keep the existing week filenames; only successful loads are selectable.
        const url = await loadImage(`./images/week_${week}.jpg?v=${nextMonthKey}`);
        return url ? { week, start, end, url } : null;
      })());
    }
    const schedules = await Promise.all(candidates);
    if (monthKey !== nextMonthKey) return;
    // A request finishing after midnight must not restore the previous month.
    if (getMonthKey(new Date()) !== nextMonthKey) {
      updateSchedule();
      return;
    }
    availableSchedules = schedules.filter(Boolean);
    statusEl.textContent = "本月門診表尚未提供";
    renderSchedule(new Date());
  }

  function changeWeek(offset) {
    if (getMonthKey(new Date()) !== monthKey) {
      updateSchedule();
      return;
    }
    renderSchedule(new Date());
    const schedule = availableSchedules[currentIndex + offset];
    if (!schedule) return;
    selectedWeek = schedule.week;
    renderSchedule(new Date());
  }

  previousButton.addEventListener("click", function() { changeWeek(-1); });
  nextButton.addEventListener("click", function() { changeWeek(1); });
  todayButton.addEventListener("click", function() {
    selectedWeek = null;
    updateSchedule();
  });

  updateSchedule();
  setInterval(updateSchedule, 60 * 1000);
});
