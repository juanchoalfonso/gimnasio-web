document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAVBAR QUE SE PONE NEGRO AL BAJAR ---
    const navbar = document.querySelector('nav');

    function handleScroll() {
        if (window.scrollY > 50) {
            // Estado scrolleado: Fondo Negro sólido y un poco de sombra
            navbar.classList.remove('bg-transparent', 'py-6');
            navbar.classList.add('bg-[#0A0A0A]', 'shadow-lg', 'py-4');
        } else {
            // Estado inicial: Transparente y más espaciado
            navbar.classList.add('bg-transparent', 'py-6');
            navbar.classList.remove('bg-[#0A0A0A]', 'shadow-lg', 'py-4');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // --- 2. ANIMACIÓN DE APARICIÓN PREMIUM (CON DELAY) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Busca el delay en el HTML. Si no hay, usa 0 segundos.
                const delay = el.getAttribute('data-delay') || '0s';

                // Aplicamos la animación usando el delay del HTML
                el.style.transition = `all 1.2s ease-out ${delay}`;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Activamos el observador para todo lo que tenga opacity: 0 en el style
    document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => observer.observe(el));



  // --- LÓGICA DEL MENÚ MÓVIL INTELIGENTE ---
  const menuBtn = document.querySelector('button.md\\:hidden'); // El botón de 3 rayitas
  const mobileMenu = document.getElementById('mobile-menu'); // El cajón del menú
  const menuLinks = document.querySelectorAll('#mobile-menu a'); // Todos los links del menú

  // 1. ABRIR / CERRAR con el botón
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el click cierre el menú inmediatamente
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. CERRAR al hacer clic en un enlace (Redirige y limpia)
  if (mobileMenu) {
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden'); // Se esconde al instante
      });
    });
  }

  // 3. CERRAR al hacer Scroll (Si bajo la pantalla, chau menú)
  window.addEventListener('scroll', () => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });

  // 4. (Opcional) CERRAR si toco afuera del menú
  document.addEventListener('click', (e) => {
    if (mobileMenu && !mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
      mobileMenu.classList.add('hidden');
    }
  });


    // --- 4. LÓGICA DE LAS FLECHITAS (SCROLL DOWN) ---
    // Buscamos todos los elementos que tengan el ícono de la flecha hacia abajo
    const scrollArrows = document.querySelectorAll('.lucide-chevron-down');

    scrollArrows.forEach(icon => {
        // Encontramos el contenedor clickeable (el padre que tiene cursor-pointer)
        const button = icon.closest('.cursor-pointer');

        if (button) {
            button.addEventListener('click', () => {
                // Truco: Buscamos la sección "padre" donde está la flecha
                const currentSection = button.closest('section');

                // Y buscamos la sección que le sigue (hermano siguiente)
                const nextSection = currentSection.nextElementSibling;

                if (nextSection) {
                    // Hacemos scroll suave hasta la próxima sección
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });


    // --- 5. NAVEGACIÓN DEL MENÚ (SCROLL A SECCIONES) ---
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionText = button.textContent.toLowerCase().trim();

            // Si el botón dice "Inicio" o es el logo "Atletic", sube al inicio
            if (sectionText === 'inicio' || sectionText === 'atletic') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Para los demás botones, busca por ID
            const targetSection = document.getElementById(sectionText);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // --- 6. LÓGICA DEL CARRITO (VERSIÓN DEFINITIVA) ---
let cart = [];

function updateCartUI() {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        return;
    }
    
    cartContainer.style.display = 'block';
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div style="display:flex; align-items:center; justify-content:between; color:white; font-size:12px; border-bottom:1px solid #222; padding-bottom:8px; margin-bottom:8px;">
            <span>${item.name} <strong>x${item.quantity}</strong></span>
        </div>
    `).join('');
}

// Escucha global de clics para atrapar los botones del Shop
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Detectamos si es un botón del Shop buscando el texto o iconos
    const isAdd = btn.innerText.includes('Agregar') || btn.querySelector('.lucide-plus');
    const isRemove = btn.querySelector('.lucide-minus');

    if (isAdd || isRemove) {
        // Buscamos el nombre del producto subiendo hasta el contenedor principal
        const productCard = btn.closest('div.p-4') || btn.closest('.bg-[#111111]');
        if (!productCard) return;

        const productName = productCard.querySelector('h3').innerText.trim();
        const productImg = productCard.querySelector('img')?.getAttribute('src') || '';

        let item = cart.find(i => i.name === productName);

        if (isAdd) {
            if (item) {
                item.quantity++;
            } else {
                cart.push({ name: productName, img: productImg, quantity: 1 });
            }
            // Habilitar botón de menos
            const minusBtn = productCard.querySelector('button:has(.lucide-minus)');
            if (minusBtn) minusBtn.disabled = false;
        } else if (isRemove) {
            if (item && item.quantity > 0) {
                item.quantity--;
                if (item.quantity === 0) {
                    cart = cart.filter(i => i.name !== productName);
                    btn.disabled = true;
                }
            }
        }

        // Actualizar el contador visual en la tarjeta
        const counter = productCard.querySelector('span.text-white.w-6');
        if (counter) counter.innerText = cart.find(i => i.name === productName)?.quantity || "0";
        
        updateCartUI();
    }
});

// --- 7. ACCIONES DEL CARRITO (WHATSAPP Y VACIAR) ---
document.getElementById('whatsapp-order')?.addEventListener('click', () => {
    // El encabezado que pediste
    let message = "Hola Atletic SHOP! Me gustaría hacer el siguiente pedido:\n\n";
    
    // Lista de productos con emojis para que quede prolijo
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity})\n`;
    });
    
    message += "\nMuchas gracias. ¿Me confirman disponibilidad?";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5491172386506?text=${encodedMessage}`, '_blank');
});

document.getElementById('clear-cart')?.addEventListener('click', () => {
    cart = [];
    updateCartUI();
    // Reseteamos los numeritos "0" en las tarjetas de la tienda
    document.querySelectorAll('span.text-white.w-6').forEach(s => s.innerText = "0");
});



    // --- BACK TO TOP ---
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backToTop?.classList.add('visible');
        else backToTop?.classList.remove('visible');
    }, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


    // --- FAQ ACCORDION ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    // --- LIGHTBOX ---
    const lbImages = [];
    let lbIndex = 0;

    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCounter = document.getElementById('lightbox-counter');

    function lbOpen(index) {
        lbIndex = index;
        lbImg.src = lbImages[index].src;
        lbImg.alt = lbImages[index].alt;
        lbCounter.textContent = lbImages.length > 1 ? `${index + 1} / ${lbImages.length}` : '';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function lbClose() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    function lbNav(dir) {
        lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = lbImages[lbIndex].src;
            lbImg.alt = lbImages[lbIndex].alt;
            lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
            lbImg.style.opacity = '1';
        }, 150);
    }

    document.querySelectorAll('[data-lightbox]').forEach((img, i) => {
        lbImages.push({ src: img.src, alt: img.alt });
        img.addEventListener('click', () => lbOpen(i));
    });

    document.getElementById('lightbox-close')?.addEventListener('click', lbClose);
    lb?.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    document.getElementById('lightbox-prev')?.addEventListener('click', () => lbNav(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => lbNav(1));

    document.addEventListener('keydown', e => {
        if (!lb?.classList.contains('active')) return;
        if (e.key === 'Escape') lbClose();
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'ArrowRight') lbNav(1);
    });

    let lbTouchX = 0;
    lb?.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lb?.addEventListener('touchend', e => {
        const diff = lbTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) lbNav(diff > 0 ? 1 : -1);
    });


    // --- NAVBAR SECCIÓN ACTIVA ---
    const normalize = str => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    const navBtns = document.querySelectorAll('nav .hidden.md\\:flex button');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = normalize(entry.target.id);
            navBtns.forEach(btn => {
                btn.classList.toggle('nav-active', normalize(btn.textContent) === id);
            });
        });
    }, { rootMargin: '-30% 0px -65% 0px', threshold: 0 });

    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

});


// --- PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 700);
    }
});


  // --- BASE DE DATOS DE ACTIVIDADES ---
  // IMPORTANTE: Revisá que los nombres de las imágenes (assets/...) sean los correctos
  const activitiesData = {
    musculacion: {
      title: "Musculación",
      desc: "Entrenamiento planificado, con acompañamiento profesional y máquinas propias. Ideal para ganar fuerza, mejorar tu físico y entrenar con criterio.",
      img: "assets/overview4.jpeg",
      tags: ["Máquinas propias", "Fuerza y Control", "Seguimiento"]
    },
    funcional: {
      title: "Funcional",
      desc: "Trabajo integral del cuerpo, en grupos guiados, dinámicos y adaptables a todos los niveles. Mejorá tu movilidad y resistencia.",
      img: "assets/plancha.jpeg",
      tags: ["Grupos reducidos", "Todos los niveles", "Dinámico"]
    },
    cross: {
      title: "Cross Training",
      desc: "Alta intensidad para romper tus límites. Combinamos fuerza, gimnasia y resistencia en entrenamientos desafiantes cada día.",
      img: "assets/sentadilla.jpeg",
      tags: ["Alta Intensidad", "Comunidad", "Desafío"]
    },
    gap: {
      title: "G.A.P.",
      desc: "Clase focalizada en Glúteos, Abdomen y Piernas. Tonificá y fortalecé el tren inferior con ejercicios específicos.",
      img: "assets/step.jpeg",
      tags: ["Tonificación", "Focalizado", "Intenso"]
    },
    calistenia: {
      title: "Calistenia",
      desc: "Dominá tu propio peso corporal. Ganá fuerza relativa, control y habilidades gimnásticas progresivas.",
      img: "assets/calistenia.jpeg",
      tags: ["Peso Corporal", "Control", "Habilidades"]
    }
  };

  // --- FUNCIÓN QUE SE EJECUTA AL HACER CLICK ---
  function changeActivity(key) {
    const data = activitiesData[key];
    if (!data) return;

    // 1. Actualizar Textos e Imagen
    document.getElementById('activity-title').innerText = data.title;
    document.getElementById('activity-desc').innerText = data.desc;
    document.getElementById('activity-img').src = data.img;

    // 2. Actualizar Tags
    const tagsContainer = document.getElementById('activity-tags');
    tagsContainer.innerHTML = data.tags.map(tag => 
      `<span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20 rounded-full">${tag}</span>`
    ).join('');

    // 3. Actualizar Colores de los Botones (Activo/Inactivo)
    document.querySelectorAll('.activity-btn').forEach(btn => {
      const isSelected = btn.getAttribute('data-id') === key;
      const icon = btn.querySelector('svg.lucide:not(.lucide-chevron-right)'); // El icono de la izquierda
      
      if (isSelected) {
        // Estilo Activo: Dorado y letras negras
        btn.classList.remove('bg-[#111111]', 'text-white', 'hover:bg-[#1a1a1a]');
        btn.classList.add('bg-[#D2C18D]', 'text-black');
        if(icon) icon.classList.remove('text-[#D2C18D]'); // Icono negro
      } else {
        // Estilo Inactivo: Negro y letras blancas
        btn.classList.remove('bg-[#D2C18D]', 'text-black');
        btn.classList.add('bg-[#111111]', 'text-white', 'hover:bg-[#1a1a1a]');
        if(icon) icon.classList.add('text-[#D2C18D]'); // Icono dorado
      }
    });

    // 4. (MAGIA PARA MÓVIL) Si es pantalla chica, scrollear hasta la imagen
    if (window.innerWidth < 1024) { // 1024px es el corte de 'lg' en Tailwind
        const displayArea = document.getElementById('activity-display-area');
        if(displayArea) {
            displayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
  }
