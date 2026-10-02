document.addEventListener("DOMContentLoaded", function () {
  const schedule = document.getElementById("clinicSchedule");
  const dialog = document.getElementById("scheduleDialog");
  const largeImage = document.getElementById("scheduleLarge");
  const zoomButton = document.getElementById("scheduleZoom");
  const downloadLink = document.getElementById("scheduleDownload");

  function syncSchedule() {
    largeImage.src = schedule.src;
    downloadLink.href = schedule.src;
    document.getElementById("scheduleDialogTitle").textContent =
      "門診時間表 " + document.getElementById("weekRange").textContent;
  }

  zoomButton.addEventListener("click", function () {
    syncSchedule();
    dialog.showModal();
  });
  downloadLink.addEventListener("click", syncSchedule);
  document.getElementById("scheduleClose").addEventListener("click", function () {
    dialog.close();
  });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  schedule.addEventListener("load", function () {
    if (dialog.open) syncSchedule();
  });

  const hero = document.getElementById("carouselExampleFade");
  const pauseButton = document.querySelector(".carousel-pause");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const carousel = bootstrap.Carousel.getOrCreateInstance(hero);

  function setPaused(paused) {
    if (paused) carousel.pause();
    else carousel.cycle();
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", paused ? "播放輪播" : "暫停輪播");
    pauseButton.title = paused ? "播放輪播" : "暫停輪播";
    pauseButton.querySelector("i").className = paused ? "bi bi-play-fill" : "bi bi-pause-fill";
  }

  pauseButton.addEventListener("click", function () {
    setPaused(pauseButton.getAttribute("aria-pressed") !== "true");
  });
  window.addEventListener("load", function () {
    if (reducedMotion.matches) setPaused(true);
  });
  reducedMotion.addEventListener("change", function (event) {
    setPaused(event.matches);
  });

  const navigation = document.getElementById("navbarNav");
  navigation.querySelectorAll("a:not(.dropdown-toggle)").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navigation.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
      }
    });
  });

  new Swiper("#preventive-care .slide-content", {
    slidesPerView: 3,
    spaceBetween: 20,
    grabCursor: true,
    watchOverflow: true,
    pagination: { el: "#preventive-care .swiper-pagination", clickable: true },
    navigation: {
      nextEl: "#preventive-care .swiper-button-next",
      prevEl: "#preventive-care .swiper-button-prev"
    },
    a11y: {
      prevSlideMessage: "上一項",
      nextSlideMessage: "下一項",
      paginationBulletMessage: "前往第 {{index}} 項"
    },
    breakpoints: {
      0: { slidesPerView: 1.15, spaceBetween: 14 },
      520: { slidesPerView: 2, spaceBetween: 18 },
      950: { slidesPerView: 3, spaceBetween: 20 }
    }
  });
});
