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

    /*
    // --- 2. ANIMACIÓN DE APARICIÓN (FADE-IN) ---
    // Esto busca todos los elementos que tengan opacity: 0 y los hace aparecer suavemente
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando se ve el 10% del elemento
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando el elemento entra en pantalla:
                entry.target.style.transition = "all 1s ease-out"; // Suavidad
                entry.target.style.opacity = "1";                  // Hacer visible
                entry.target.style.transform = "translateY(0)";    // Mover a su lugar
                observer.unobserve(entry.target); // Dejar de vigilarlo una vez que apareció
            }
        });
    }, observerOptions);

    // Seleccionamos los elementos que queremos animar
    // (Asegurate de que en tu HTML estos divs tengan style="opacity: 0;")
    const hiddenElements = document.querySelectorAll('[style*="opacity: 0"]');
    hiddenElements.forEach((el) => observer.observe(el));*/

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


    // --- 3. BOTÓN DE MENÚ (MOBILE) ---
    const menuBtn = document.querySelector('button.md\\:hidden');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log("Menú clickeado - Aquí iría la lógica para abrir el menú");
            // Por ahora solo probamos que el clic funcione
            alert("¡Botón de menú funcionando!");
        });
    }

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

// Configurar botones de WhatsApp y Vaciar (con chequeo de existencia)
setTimeout(() => {
    document.getElementById('whatsapp-order')?.addEventListener('click', () => {
        let msg = "Hola Atletic! 👋 Mi pedido es:\n\n" + cart.map(i => `- ${i.name} (x${i.quantity})`).join('\n');
        window.open(`https://wa.me/5491123947976?text=${encodeURIComponent(msg)}`, '_blank');
    });

    document.getElementById('clear-cart')?.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        document.querySelectorAll('span.text-white.w-6').forEach(s => s.innerText = "0");
    });
}, 1000);
   
});
