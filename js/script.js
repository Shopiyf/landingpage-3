document.addEventListener("DOMContentLoaded", () => {
  console.log("Limova Clone JS Loaded 🚀");

  // =========================================
  // 1. GESTION DU MENU (Mobile & Desktop)
  // =========================================
  const initNavbar = () => {
    const menuBtn = document.querySelector('.menu-button');
    const body = document.body;

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const isOpen = body.getAttribute('data-nav-status') === 'open';
        // Bascule l'état
        body.setAttribute('data-nav-status', isOpen ? 'closed' : 'open');
        menuBtn.classList.toggle('close');
      });
    }

    // Effet au scroll (réduire le header)
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        body.setAttribute('data-scrolling-started', 'true');
      } else {
        body.setAttribute('data-scrolling-started', 'false');
      }
    });
  };

  // =========================================
  // 2. MODALES (Pricing, Contact)
  // =========================================
  const initModals = () => {
    const triggers = document.querySelectorAll('[data-modal-trigger]');
    const closers = document.querySelectorAll('[data-modal-close]');
    const body = document.body;

    // Ouvrir la modale
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-modal-trigger');
        const targetModal = document.querySelector(`[data-modal-target="${targetId}"]`);
        
        if (targetModal) {
          targetModal.style.display = 'flex'; // On force l'affichage
          // Petit délai pour permettre l'animation CSS si besoin
          setTimeout(() => {
            body.setAttribute('data-modal-status', 'open');
            targetModal.classList.add('open');
          }, 10);
        }
      });
    });

    // Fermer la modale
    closers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        body.setAttribute('data-modal-status', 'closed');
        const openModals = document.querySelectorAll('.modal_box_wrap');
        openModals.forEach(modal => {
            modal.classList.remove('open');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Temps de l'animation CSS
        });
      });
    });
  };

  // =========================================
  // 3. SYSTÈME D'ONGLETS (Agents IA)
  // =========================================
  const initTabs = () => {
    const tabButtons = document.querySelectorAll('.agent_tabs_btn');
    const tabContents = document.querySelectorAll('.agent_tabs_content_item');

    // Fonction pour activer un onglet
    const activateTab = (index) => {
      // Retirer la classe active de partout
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');

      // Ajouter la classe active sur l'élément cliqué
      if(tabButtons[index]) {
          tabButtons[index].classList.add('active');
          // Animation simple d'apparition
          tabContents[index].style.display = 'block';
          tabContents[index].style.opacity = '0';
          setTimeout(() => {
            tabContents[index].style.opacity = '1';
          }, 50);
      }
    };

    // Ajouter les écouteurs d'événements
    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => activateTab(index));
    });

    // Activer le premier onglet par défaut s'il y en a
    if (tabButtons.length > 0) activateTab(0);
  };

  // =========================================
  // 4. SWIPER (Carousels)
  // =========================================
  const initSwipers = () => {
    // Vérifier si Swiper est chargé
    if (typeof Swiper !== 'undefined') {
        
      // Slider des témoignages ou scénarios
      new Swiper('.swiper_tabs_agent', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            }
        }
      });
      
    } else {
      console.warn("Swiper JS n'est pas chargé. Vérifiez le lien dans le HTML.");
    }
  };

  // =========================================
  // 5. ANIMATIONS AU SCROLL (Remplacement GSAP)
  // =========================================
  const initScrollAnimations = () => {
    // On cible tous les éléments qui ont "data-reveal"
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // On arrête d'observer une fois animé
          observer.unobserve(entry.target); 
        }
      });
    }, {
      threshold: 0.1 // Déclenche quand 10% de l'élément est visible
    });

    revealElements.forEach(el => {
      // Préparation CSS via JS pour éviter le fouc
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      
      observer.observe(el);
    });

    // Ajout d'un écouteur global pour la classe is-visible
    // (Note: cela fonctionne grâce au style inline ajouté juste au dessus)
    // Astuce: On injecte une règle CSS dynamique pour la classe .is-visible
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      [data-reveal].is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(styleSheet);
  };

  // =========================================
  // 6. GESTION DES COOKIES
  // =========================================
  const initCookies = () => {
    const cookieBanner = document.querySelector('[data-cookie="group"]');
    const acceptBtn = document.querySelector('[data-cookie="accept-all"]');
    const closeBtn = document.querySelector('[data-cookie="close"]');

    if (!cookieBanner) return;

    // Vérifier si déjà accepté
    if (!localStorage.getItem('limova_cookie_consent')) {
        // Attendre un peu avant d'afficher
        setTimeout(() => {
            cookieBanner.setAttribute('data-cookie-state', 'open');
        }, 2000);
    }

    const closeCookie = () => {
        cookieBanner.setAttribute('data-cookie-state', 'closed');
        localStorage.setItem('limova_cookie_consent', 'true');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', closeCookie);
    if (closeBtn) closeBtn.addEventListener('click', closeCookie);
  };

  // =========================================
  // INITIALISATION GLOBALE
  // =========================================
  initNavbar();
  initModals();
  initTabs();
  initSwipers();
  initScrollAnimations();
  initCookies();

});