
      document.querySelectorAll('.env-menu a[data-target]').forEach(function(a){
        a.addEventListener('click', function(e){
          e.preventDefault();
          var id = this.dataset.target;
          // 移除左側 active
          document.querySelectorAll('.env-menu a').forEach(x=>x.classList.remove('active'));
          this.classList.add('active');
          // 顯示對應 gallery，隱藏其他
          document.querySelectorAll('.env-gallery').forEach(function(g){
            g.style.display = (g.id === id) ? 'block' : 'none';
          });
          // 可選：更新 URL hash
          history.replaceState(null, '', '#'+id);
        });
      });
      // 頁面載入時依 hash 顯示（若有）
      (function(){
        var h = location.hash.replace('#','');
        if(h){
          var link = document.querySelector('.env-menu a[data-target="'+h+'"]');
          if(link) link.click();
        }
      })();
