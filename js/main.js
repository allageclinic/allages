// 頁面共用功能
document.addEventListener('DOMContentLoaded', function() {
  // 懶加載圖片
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  // 添加淡入動畫
  const fadeElements = document.querySelectorAll('.fade-in');
  
  // 在視窗滾動時檢查元素是否在視窗中
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('lazy-load')) {
          // 如果是懶加載圖片
          entry.target.classList.add('loaded');
          if (entry.target.dataset.src) {
            entry.target.src = entry.target.dataset.src;
          }
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // 觀察所有懶加載圖片
  lazyImages.forEach(img => {
    observer.observe(img);
  });
  
  // 觀察所有淡入元素
  fadeElements.forEach(el => {
    observer.observe(el);
  });
  
  // 回到頂部按鈕功能
  const toTopButton = document.querySelector('.to-top-button');
  if (toTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 200) {
        toTopButton.classList.add('show');
      } else {
        toTopButton.classList.remove('show');
      }
    });

    toTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}); 