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
  const heroSlides = document.querySelectorAll('.hero__slide'); // Novo elemento do carrossel

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
  // Mostra o primeiro slide
  showSlide(0);
  
  // Configura o intervalo apenas se houver mais de um slide
  if (heroSlides.length > 1) {
    setInterval(nextSlide, slideInterval);
  }
}

  // Inicia o carrossel apenas se existirem slides
  if (heroSlides.length > 1) { // Só roda se tiver mais de uma imagem
    showSlide(0);
    setInterval(nextSlide, 5000); // Muda a cada 5 segundos
  } else if (heroSlides.length === 1) { // Caso tenha apenas 1 imagem
    heroSlides[0].style.opacity = 1;
    heroSlides[0].style.zIndex = 2;
  }
  // ========== FIM DO CÓDIGO DO CARROSSEL ========== //

  // Verifica se elementos existem antes de manipular
  if (!mobileBtn || !menu || !menuLinks.length || !anchorLinks.length) return;

  // Menu Mobile - Melhorado com acessibilidade
  mobileBtn.addEventListener('click', () => {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    
    // Alterna visibilidade do menu
    menu.style.display = isExpanded ? 'none' : 'flex';
    
    // Atualiza atributos ARIA para acessibilidade
    mobileBtn.setAttribute('aria-expanded', !isExpanded);
    mobileBtn.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
    
    // Foco no primeiro item do menu quando aberto
    if (!isExpanded && menuLinks.length > 0) {
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

  // Scroll suave
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

  // Função de scroll suave
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

  // Filtro de Projetos (no seu script.js)
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
          // Mostra apenas cards de música
          card.style.display = card.dataset.category === 'music' ? 'block' : 'none';
        } else {
          // Filtro normal para acadêmicos/artísticos
          card.style.display = card.dataset.category === filter ? 'block' : 'none';
        }
      });
    });
  });
}

  // Controle de Players de Áudio
  if (audioPlayers.length) {
    audioPlayers.forEach(player => {
      player.addEventListener('play', () => {
        audioPlayers.forEach(p => {
          if (p !== player) p.pause();
        });
      });
    });
  }

  // Atualiza o ano no rodapé
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Fechar menu ao clicar fora (melhoria UX)
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

  // Fechar menu ao redimensionar a janela
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      menu.style.display = '';
      mobileBtn.setAttribute('aria-expanded', 'false');
    } else {
      menu.style.display = 'none';
    }
  });
});