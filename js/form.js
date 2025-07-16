// 聯繫表單處理
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // 不阻止表單提交，但進行驗證
      // e.preventDefault();
      
      // 表單驗證
      let isValid = true;
      const formElements = contactForm.elements;
      
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        
        if (element.hasAttribute('required') && element.value.trim() === '') {
          element.classList.add('is-invalid');
          isValid = false;
        } else if (element.type === 'email' && element.value.trim() !== '') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(element.value)) {
            element.classList.add('is-invalid');
            isValid = false;
          } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
          }
        } else if (element.type === 'tel' && element.value.trim() !== '') {
          const phonePattern = /^[0-9\-\+\s\(\)]{8,}$/;
          if (!phonePattern.test(element.value)) {
            element.classList.add('is-invalid');
            isValid = false;
          } else {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
          }
        } else if (element.value.trim() !== '') {
          element.classList.remove('is-invalid');
          element.classList.add('is-valid');
        }
      }
      
      if (!isValid) {
        e.preventDefault(); // 如果表單無效，則阻止提交
        
        // 添加錯誤提示
        const existingAlerts = contactForm.querySelectorAll('.alert-danger');
        if (existingAlerts.length === 0) {
          const errorMessage = document.createElement('div');
          errorMessage.className = 'alert alert-danger mt-3';
          errorMessage.innerHTML = '<strong>錯誤!</strong> 請檢查表單並修正錯誤。';
          
          // 將錯誤訊息插入到表單開頭
          contactForm.insertBefore(errorMessage, contactForm.firstChild);
          
          // 滾動到錯誤訊息
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // 準備郵件內容
        const name = formElements.name.value;
        const phone = formElements.phone.value;
        const email = formElements.email.value;
        const subject = formElements.subject.value || "診所網站表單聯繫";
        const message = formElements.message.value;
        
        // 修改表單的 action 屬性使其包含更有用的主旨
        contactForm.action = `mailto:wowamin125@gmail.com?subject=${encodeURIComponent(subject)}`;
        
        // 準備郵件正文
        const mailBody = 
          `姓名: ${name}%0D%0A` +
          `電話: ${phone}%0D%0A` +
          `電子郵件: ${email}%0D%0A` +
          `%0D%0A訊息內容:%0D%0A${message}`;
        
        // 設置表單的 body 參數
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'body';
        hiddenInput.value = mailBody;
        contactForm.appendChild(hiddenInput);
        
        // 表單提交後延遲顯示成功消息
        setTimeout(function() {
          // 移除現有提示訊息
          const existingAlerts = contactForm.querySelectorAll('.alert');
          existingAlerts.forEach(alert => alert.remove());
          
          const successMessage = document.createElement('div');
          successMessage.className = 'alert alert-success mt-3';
          successMessage.innerHTML = '<strong>成功!</strong> 您的郵件客戶端已開啟，請檢查並發送訊息。';
          
          contactForm.appendChild(successMessage);
          
          // 清空表單
          contactForm.reset();
          
          // 移除驗證狀態
          for (let i = 0; i < formElements.length; i++) {
            formElements[i].classList.remove('is-valid');
          }
        }, 1000);
      }
    });
    
    // 添加輸入事件監聽器，在輸入時移除錯誤狀態
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          this.classList.remove('is-invalid');
        }
      });
    });
  }
}); 