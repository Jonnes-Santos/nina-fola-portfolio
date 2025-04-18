document.addEventListener('DOMContentLoaded', () => {
  // Constantes reutilizáveis
  const MOBILE_BREAKPOINT = 768;
  const HEADER_HEIGHT = 80;
  
  // Elementos do DOM
  const mobileBtn = document.querySelector('.main-header__mobile-btn');
  const menu = document.querySelector('.main-header__menu');
  const menuLinks = document.querySelectorAll('.main-header__menu a');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const filterButtons = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  const audioPlayers = document.querySelectorAll('.audio-player');
  const heroSlides = document.querySelectorAll('.hero__slide');
  const readMoreBtn = document.querySelector('.about__read-more');
  const modal = document.getElementById('aboutModal');

  // ========== CÓDIGO DO CARROSSEL ========== //
  let currentSlide = 0;
  const slideInterval = 5000; // 5 segundos

  function showSlide(n) {
    heroSlides.forEach((slide, index) => {
      slide.style.opacity = index === n ? 1 : 0;
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
  }

  // Inicia o carrossel apenas se existirem slides
  if (heroSlides.length > 0) {
    showSlide(0);
    if (heroSlides.length > 1) {
      setInterval(nextSlide, slideInterval);
    }
  }

  // ========== MENU MOBILE ========== //
  if (mobileBtn && menu && menuLinks.length) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      menu.style.display = isExpanded ? 'none' : 'flex';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileBtn.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
      
      if (!isExpanded) {
        menuLinks[0].focus();
      }
    });

    // Fechar menu ao clicar em um link (mobile)
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          menu.style.display = 'none';
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileBtn.setAttribute('aria-label', 'Abrir menu');
        }
      });
    });
  }

  // ========== SCROLL SUAVE ========== //
  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - HEADER_HEIGHT;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      history.pushState(null, null, targetId);
    }
  }

  if ('scrollBehavior' in document.documentElement.style) {
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });
  } else {
    import('smoothscroll-polyfill').then((module) => {
      module.polyfill();
      anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
      });
    });
  }

  // ========== FILTRO DE PROJETOS ========== //
  if (filterButtons.length && workCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        workCards.forEach(card => {
          if (filter === 'all') {
            card.style.display = 'block';
          } else if (filter === 'music') {
            card.style.display = card.dataset.category === 'music' ? 'block' : 'none';
          } else {
            card.style.display = card.dataset.category === filter ? 'block' : 'none';
          }
        });
      });
    });
  }

  // ========== CONTROLE DE PLAYERS DE ÁUDIO ========== //
  if (audioPlayers.length) {
    audioPlayers.forEach(player => {
      player.addEventListener('play', () => {
        audioPlayers.forEach(p => {
          if (p !== player) p.pause();
        });
      });
    });
  }

  // ========== MODAL DA SEÇÃO "SOBRE" ========== //
  if (readMoreBtn && modal) {
    const closeBtn = modal.querySelector('.about-modal__close');
    const prevBtn = modal.querySelector('.about-modal__prev');
    const nextBtn = modal.querySelector('.about-modal__next');
    const pages = modal.querySelectorAll('.about-modal__text > p');
    
    // Abrir modal
    readMoreBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
    
    // Fechar modal
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Navegação entre páginas (se houver múltiplos parágrafos)
    if (pages.length > 1) {
      let currentPage = 0;
      
      function showPage(pageIndex) {
        pages.forEach((page, index) => {
          page.style.display = index === pageIndex ? 'block' : 'none';
        });
      }
      
      showPage(0);
      
      prevBtn.addEventListener('click', () => {
        currentPage = Math.max(0, currentPage - 1);
        showPage(currentPage);
      });
      
      nextBtn.addEventListener('click', () => {
        currentPage = Math.min(pages.length - 1, currentPage + 1);
        showPage(currentPage);
      });
    } else {
      // Esconde navegação se só tiver uma página
      modal.querySelector('.about-modal__navigation').style.display = 'none';
    }
  }

  // ========== ATUALIZAR ANO NO RODAPÉ ========== //
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ========== FECHAR MENU AO CLICAR FORA ========== //
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= MOBILE_BREAKPOINT && 
        !mobileBtn.contains(e.target) && 
        !menu.contains(e.target) &&
        menu.style.display === 'flex') {
      menu.style.display = 'none';
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.setAttribute('aria-label', 'Abrir menu');
    }
  });

  // ========== FECHAR MENU AO REDIMENSIONAR ========== //
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      menu.style.display = '';
      mobileBtn.setAttribute('aria-expanded', 'false');
    } else {
      menu.style.display = 'none';
    }
  });
});