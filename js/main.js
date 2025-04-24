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
        mobileBtn && menu &&
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
      if (menu) menu.style.display = '';
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    } else if (menu) {
      menu.style.display = 'none';
    }
  });

  // ===== CARREGAR ARTIGOS DO GOOGLE SHEETS =====
  loadArticlesFromGoogleSheets();

  // ===== FECHAR MODAL DE ARTIGO =====
  const articleModalClose = document.querySelector('.article-modal__close');
  if (articleModalClose) {
    articleModalClose.addEventListener('click', () => {
      const articleModal = document.getElementById('articleModal');
      if (articleModal) {
        articleModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Fechar ao clicar fora
  window.addEventListener('click', (event) => {
    const articleModal = document.getElementById('articleModal');
    if (event.target === articleModal && articleModal) {
      articleModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // ===== CARREGAMENTO DE VÍDEOS =====
  document.querySelectorAll('.music__video-play').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const videoId = this.getAttribute('data-video-id');
      const videoWrapper = this.parentElement;
      
      // Adiciona um loader enquanto o iframe carrega
      videoWrapper.innerHTML = `
        <div class="video-loader">
          <div class="loader-spinner"></div>
        </div>
      `;
      
      // Cria o iframe após um pequeno delay para mostrar o loader
      setTimeout(() => {
        videoWrapper.innerHTML = `
          <iframe width="560" height="315" 
                  src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  loading="lazy"></iframe>
        `;
      }, 300);
    });
  });
  
  // Opcional: Permite clicar em qualquer área do card para reproduzir
  document.querySelectorAll('.music__video-card').forEach(card => {
    card.addEventListener('click', function() {
      const playButton = this.querySelector('.music__video-play');
      if (playButton) {
        playButton.click();
      }
    });
  });
});

// ===== FUNÇÕES AUXILIARES =====

function formatDate(dateValue) {
  if (!dateValue) return '';
  
  try {
    // Se for um objeto Date do Google Sheets (ex: "Date(2025,3,23)")
    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
      const dateParts = dateValue.match(/Date\((\d+),(\d+),(\d+)\)/);
      if (dateParts) {
        const year = parseInt(dateParts[1]);
        const month = parseInt(dateParts[2]);
        const day = parseInt(dateParts[3]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('pt-BR');
      }
    }
    
    // Se for um timestamp ou string de data
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Erro ao formatar data:', e);
    return '';
  }
}

function showFullArticle(row) {
  const articleModal = document.getElementById('articleModal');
  if (!articleModal) return;
  
  const cells = row.c;
  const title = cells[0]?.v || 'Sem título';
  const content = cells[2]?.v || 'Conteúdo não disponível';
  const date = cells[3]?.f || formatDate(cells[3]?.v) || '';
  const imageUrl = cells[4]?.v || '';
  
  // Preencher o modal com os dados do artigo
  articleModal.querySelector('.article-modal__title').textContent = title;
  articleModal.querySelector('.article-modal__date').textContent = date;
  articleModal.querySelector('.article-modal__body').innerHTML = content;
  
  // Lidar com a imagem (se existir)
  const modalImage = articleModal.querySelector('.article-modal__image');
  if (imageUrl) {
    modalImage.src = imageUrl;
    modalImage.alt = title;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }
  
  // Mostrar o modal
  articleModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Adicionar classe 'show' para ativar a animação
  setTimeout(() => {
    articleModal.classList.add('show');
  }, 10);
}

async function loadArticlesFromGoogleSheets() {
  const articlesContainer = document.querySelector('.blog__carousel');
  if (!articlesContainer) {
    console.error('Container de artigos não encontrado');
    return;
  }

  // Mostrar estado de carregamento
  articlesContainer.innerHTML = '<p class="loading-msg">Carregando artigos...</p>';

  try {
    const sheetId = '12lVPZBOGyRwBmSolW-F_iyQzXE9Trwlx2MbaNOgUwWo';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Extrair o JSON da resposta (forma mais robusta)
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const data = JSON.parse(jsonString);
    
    // Verificar se temos dados válidos
    if (!data.table || !data.table.rows || data.table.rows.length === 0) {
      articlesContainer.innerHTML = '<p class="no-articles">Nenhum artigo disponível no momento.</p>';
      return;
    }
    
    // Limpar artigos antigos
    articlesContainer.innerHTML = '';
    
    // Processar cada linha (ignorando o cabeçalho se houver)
    const rows = data.table.rows;
    const startRow = rows[0].c[0]?.v === "Título" ? 1 : 0; // Pular cabeçalho se existir
    
    for (let i = startRow; i < rows.length; i++) {
      const cells = rows[i].c;
      const title = cells[0]?.v || 'Sem título';
      const excerpt = cells[1]?.v || '';
      const content = cells[2]?.v || '';
      const date = cells[3]?.f || formatDate(cells[3]?.v) || '';
      const imageUrl = cells[4]?.v || '';
      const featured = (cells[5]?.v || '').toString().trim().toLowerCase() === 'sim';
      
      const articleHTML = `
        <article class="blog-post ${featured ? 'featured' : ''}" data-index="${i - startRow}">
          ${featured ? '<span class="featured-badge">Destaque</span>' : ''}
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="blog-post__image" loading="lazy">` : ''}
          <div class="blog-post__content">
            <h3 class="blog-post__title">${title}</h3>
            ${date ? `<p class="blog-post__date">${date}</p>` : ''}
            <p class="blog-post__excerpt">${excerpt}</p>
            <button class="blog-post__read-more">Ler artigo completo</button>
          </div>
        </article>
      `;
      
      articlesContainer.insertAdjacentHTML('beforeend', articleHTML);
    }
    
    // Inicializa o carrossel após carregar os artigos
    initArticlesCarousel();
    
    // Adiciona eventos para abrir o modal
    document.querySelectorAll('.blog-post').forEach(post => {
      post.addEventListener('click', () => {
        const index = post.dataset.index;
        showFullArticle(rows[parseInt(index) + startRow]);
      });
    });
    
  } catch (error) {
    console.error('Erro ao carregar artigos:', error);
    articlesContainer.innerHTML = `
      <p class="error-msg">Não foi possível carregar os artigos no momento. Por favor, tente novamente mais tarde.</p>
    `;
  }
}

// ===== CARROSSEL DE ARTIGOS =====
function initArticlesCarousel() {
  const carousel = document.querySelector('.blog__carousel');
  const carouselItems = document.querySelectorAll('.blog-post');
  const prevBtn = document.querySelector('.blog__carousel-btn--prev');
  const nextBtn = document.querySelector('.blog__carousel-btn--next');
  const dotsContainer = document.querySelector('.blog__carousel-dots');
  
  if (!carousel || !carouselItems.length) return;
  
  let currentIndex = 0;
  let cardWidth = 0;
  let visibleCards = 3;
  let autoScrollInterval;

  function updateCardWidth() {
    const containerWidth = document.querySelector('.blog__carousel-container').offsetWidth;
    
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
    updateCardWidth();
    const offset = -currentIndex * (cardWidth + 32);
    carousel.style.transform = `translateX(${offset}px)`;
    updateDots();
    updateButtonStates();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.blog__carousel-dot');
    const totalPages = Math.ceil(carouselItems.length / visibleCards);
    const currentPage = Math.floor(currentIndex / visibleCards);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }

  function createDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    const totalPages = Math.ceil(carouselItems.length / visibleCards);
    
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('blog__carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i * visibleCards;
        updateCarousel();
        resetAutoScroll();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateButtonStates() {
    const totalItems = carouselItems.length;
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= totalItems - visibleCards;
  }

  function nextSlide() {
    const totalItems = carouselItems.length;
    if (currentIndex < totalItems - visibleCards) {
      currentIndex++;
    } else {
      currentIndex = 0; // Volta para o primeiro item
    }
    updateCarousel();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = Math.max(0, carouselItems.length - visibleCards); // Vai para o último item
    }
    updateCarousel();
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoScroll();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoScroll();
    });
  }

  // Inicialização
  window.addEventListener('resize', updateCarousel);
  updateCardWidth();
  createDots();
  updateCarousel();
  startAutoScroll();

  // Pausar auto-scroll quando o mouse estiver sobre o carrossel
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    startAutoScroll();
  });
}