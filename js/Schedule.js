document.addEventListener("DOMContentLoaded", function() {
  // 取得今天
  const today = new Date();

  // 找出本週一
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  // 找出本月第一個週一（改為：回傳「包含當月1日」那一週的週一，若1日當天為週一就回傳1日；否則回傳在1日前的週一）
  function getFirstMondayOnOrBeforeFirstDay(year, month) {
    const firstDay = new Date(year, month, 1);
    // (firstDay.getDay()+6)%7 會把星期一轉成 0，星期日轉成 6
    const offset = (firstDay.getDay() + 6) % 7;
    const monday = new Date(firstDay);
    monday.setDate(firstDay.getDate() - offset);
    // 回傳的 monday 可能落在前一個月，這是預期行為
    return monday;
  }

  // 計算本週是以「包含1日的那週之週一」為起點的第幾週
  function getWeekNumberFromFirstMonday(date) {
    const firstMonday = getFirstMondayOnOrBeforeFirstDay(date.getFullYear(), date.getMonth());
    const diff = Math.floor((date - firstMonday) / (7 * 24 * 60 * 60 * 1000));
    return diff + 1;
  }

  const weekNum = getWeekNumberFromFirstMonday(monday);
  const weekImg = `week_${weekNum}.jpg`;

  // debug: 在 console 檢查計算結果
  console.log('today:', today.toISOString().slice(0,10), 
              'monday:', monday.toISOString().slice(0,10),
              'firstMonday:', getFirstMondayOnOrBeforeFirstDay(monday.getFullYear(), monday.getMonth()).toISOString().slice(0,10),
              'weekNum:', weekNum, 'weekImg:', weekImg);

  // 產生週期字串
  function getWeekRange(monday) {
    const end = new Date(monday);
    end.setDate(monday.getDate() + 4);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(monday.getMonth() + 1)}/${pad(monday.getDate())}~${pad(end.getMonth() + 1)}/${pad(end.getDate())}`;
  }
  const weekRange = getWeekRange(monday);

  // 設定畫面
  document.getElementById("weekRange").innerText = weekRange;
  document.getElementById("clinicSchedule").src = `./images/${weekImg}`;
});