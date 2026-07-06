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
  document.getElementById("clinicSchedule").src = `./images/${weekImg}`;
});
