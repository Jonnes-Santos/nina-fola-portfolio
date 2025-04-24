document.addEventListener('DOMContentLoaded', () => {
  // ===== CONSTANTES E ELEMENTOS GERAIS =====
  const MOBILE_BREAKPOINT = 768;
  const HEADER_HEIGHT = 80;
  
  // Elementos do DOM
  const mobileBtn = document.querySelector('.main-header__mobile-btn');
  const menu = document.querySelector('.main-header__menu');
  const menuLinks = document.querySelectorAll('.main-header__menu a');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const workCards = document.querySelectorAll('.work-card');
  const audioPlayers = document.querySelectorAll('.audio-player');
  const heroSlides = document.querySelectorAll('.hero__slide');
  const readMoreBtn = document.querySelector('.about__read-more');
  const modal = document.getElementById('aboutModal');
  const currentYear = document.getElementById('current-year');

  // ===== CARROSSEL DE PROJETOS =====
  const carousel = document.querySelector('.works__carousel');
  const carouselItems = document.querySelectorAll('.work-card');
  const prevBtn = document.querySelector('.works__carousel-btn--prev');
  const nextBtn = document.querySelector('.works__carousel-btn--next');
  const dotsContainer = document.querySelector('.works__carousel-dots');
  const filterButtons = document.querySelectorAll('.works__filter-btn');

  let currentIndex = 0;
  let cardWidth = 0;
  let visibleCards = 3;

  function updateCardWidth() {
    if (!carousel) return;
    
    const containerWidth = document.querySelector('.works__carousel-container').offsetWidth;
    if (window.innerWidth <= 768) {
      visibleCards = 1;
    } else if (window.innerWidth <= 1024) {
      visibleCards = 2;
    } else {
      visibleCards = 3;
    }
    cardWidth = carouselItems[0]?.offsetWidth || 300;
  }

  function updateCarousel() {
    if (!carousel) return;
    
    updateCardWidth();
    const offset = -currentIndex * (cardWidth + 32);
    carousel.style.transform = `translateX(${offset}px)`;
    updateDots();
    updateButtonStates();
  }

  function updateDots() {
    if (!dotsContainer) return;
    
    const dots = document.querySelectorAll('.works__carousel-dot');
    const totalPages = Math.ceil(carouselItems.length / visibleCards);
    const currentPage = Math.floor(currentIndex / visibleCards);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }

  function createDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const totalItems = document.querySelectorAll('.work-card:not([style*="display: none"])').length;
    const totalPages = Math.ceil(totalItems / visibleCards);
    
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('works__carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i * visibleCards;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateButtonStates() {
    if (!prevBtn || !nextBtn) return;
    
    const totalItems = document.querySelectorAll('.work-card:not([style*="display: none"])').length;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalItems - visibleCards;
  }

  function filterProjects(category) {
    if (!filterButtons.length || !workCards.length) return;
    
    workCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    
    currentIndex = 0;
    createDots();
    updateCarousel();
  }

  // Event Listeners para o carrossel
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const totalItems = document.querySelectorAll('.work-card:not([style*="display: none"])').length;
      if (currentIndex < totalItems - visibleCards) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  // Event Listeners para filtros
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
        filterProjects(btn.dataset.filter);
      });
    });
  }

  // Inicialização do carrossel
  if (carousel) {
    window.addEventListener('resize', updateCarousel);
    updateCardWidth();
    createDots();
    updateCarousel();
    filterProjects('academic'); // Inicia mostrando projetos acadêmicos
  }

  // ===== CARROSSEL HERO =====
  let currentSlide = 0;
  const slideInterval = 5000;

  function showSlide(n) {
    if (!heroSlides.length) return;
    
    heroSlides.forEach((slide, index) => {
      slide.style.opacity = index === n ? 1 : 0;
    });
  }

  function nextSlide() {
    if (!heroSlides.length) return;
    
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
  }

  if (heroSlides.length > 0) {
    showSlide(0);
    if (heroSlides.length > 1) {
      setInterval(nextSlide, slideInterval);
    }
  }

  // ===== MENU MOBILE =====
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

  // ===== SCROLL SUAVE =====
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

  // ===== CONTROLE DE PLAYERS DE ÁUDIO =====
  if (audioPlayers.length) {
    audioPlayers.forEach(player => {
      player.addEventListener('play', () => {
        audioPlayers.forEach(p => {
          if (p !== player) p.pause();
        });
      });
    });
  }

  // ===== SEÇÃO SOBRE (MODAL COM TROCA DE IMAGENS) =====
  if (readMoreBtn && modal) {
    const closeBtn = modal.querySelector('.about-modal__close');
    const modalPrevBtn = modal.querySelector('.about-modal__prev');
    const modalNextBtn = modal.querySelector('.about-modal__next');
    const pages = modal.querySelectorAll('.modal-page');
    const modalImages = modal.querySelectorAll('.modal-image');
    const counter = modal.querySelector('.about-modal__counter');
    let currentPage = 0;

    const closeModal = () => {
      if (!modal) return;
      
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '1';
        document.body.style.overflow = 'auto';
      }, 300);
    };

    const updateModal = () => {
      const modalContent = modal.querySelector('.about-modal__content');
      
      if (modalContent) {
        modalContent.style.scrollBehavior = 'auto';
        modalContent.scrollTop = 0;
        
        setTimeout(() => {
          modalContent.style.scrollBehavior = 'smooth';
        }, 100);
      }
    
      pages.forEach((page, index) => {
        page.classList.toggle('active', index === currentPage);
      });
      
      modalImages.forEach((img, index) => {
        img.classList.toggle('active', index === currentPage);
        
        if (index === currentPage && !img.complete) {
          img.loading = 'eager';
          const src = img.src;
          img.src = '';
          img.src = src;
        }
      });
    
      counter.textContent = `${currentPage + 1}/${pages.length}`;
      modalPrevBtn.disabled = currentPage === 0;
      modalNextBtn.disabled = currentPage === pages.length - 1;
    };

    // Event listeners
    readMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = 0;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        modal.querySelector('.about-modal__content').scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        updateModal();
      }, 50);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    modalPrevBtn.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateModal();
      }
    });

    modalNextBtn.addEventListener('click', () => {
      if (currentPage < pages.length - 1) {
        currentPage++;
        updateModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage--;
        updateModal();
      }
      if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
        currentPage++;
        updateModal();
      }
    });

    updateModal();
  }

  // ===== ANIMAÇÃO DA SEÇÃO SOBRE =====
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(aboutSection);
  }

  // ===== ANO ATUAL NO RODAPÉ =====
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ===== FECHAR MENU AO CLICAR FORA (MOBILE) =====
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

  // ===== AJUSTAR MENU AO REDIMENSIONAR =====
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      menu.style.display = '';
      mobileBtn.setAttribute('aria-expanded', 'false');
    } else {
      menu.style.display = 'none';
    }
  });
});