document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper (".slide-content", {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        grabCursor: true,
        autoHeight: false,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            0: { 
                slidesPerView: 1,
                spaceBetween: 10,
            },
            576: { 
                slidesPerView: 1.5,
                spaceBetween: 15,
            },
            768: { 
                slidesPerView: 2,
                spaceBetween: 15,
            },
            1024: { 
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
});