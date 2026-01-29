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

// --- 8. LÓGICA DE CAMBIO DE ACTIVIDADES ---
const activityDetails = {
    musculacion: {
        title: "Musculación",
        desc: "Entrenamiento planificado, con acompañamiento profesional y máquinas propias. Ideal para ganar fuerza, mejorar tu físico y entrenar con criterio.",
        img: "assets/overview4.jpeg",
        tags: ["Máquinas propias", "Entrenamiento planificado", "Seguimiento profesional"],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dumbbell w-8 h-8 text-[#D2C18D]"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>'
    },
    funcional: {
        title: "Funcional",
        desc: "Trabajo integral del cuerpo, en grupos guiados, dinámicos y adaptables a todos los niveles.",
        img: "assets/plancha.jpeg", 
        tags: ["Grupos reducidos", "Todos los niveles", "Dinámico y variado"],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-8 h-8 text-[#D2C18D]"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
    },
    cross: {
        title: "Cross",
        desc: "Entrenamientos intensos, progresivos y desafiantes, enfocados en fuerza, resistencia y comunidad.",
        img: "assets/sentadilla.jpeg",
        tags: ["Intensidad progresiva", "Comunidad activa", "Resultados rápidos"],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame w-8 h-8 text-[#D2C18D]"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
    },
    gap: {
        title: "GAP",
        desc: "Trabajo específico de glúteos, abdomen y piernas, con clases organizadas y objetivos claros.",
        img: "assets/step.jpeg",
        tags: ["Trabajo localizado", "Clases grupales", "Tonificación efectiva"],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target w-8 h-8 text-[#D2C18D]"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
    },
    calistenia: {
        title: "Calistenia",
        desc: "Entrenamiento con el peso corporal, enfocado en fuerza real, control y movilidad.",
        img: "assets/calistenia.jpg",
        tags: ["Sin equipamiento", "Fuerza funcional", "Control corporal"],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-person-standing w-8 h-8 text-[#D2C18D]"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>'
    }
};

document.querySelectorAll('button[data-activity]').forEach(btn => {
    btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-activity');
        const data = activityDetails[act];
        const panelInner = document.querySelector('#actividades .lg\\:col-span-8 > div');
        
        panelInner.style.opacity = '0';
        
        setTimeout(() => {
            // 1. Cambiar Imagen, Icono, Título y Descripción
            document.querySelector('#actividades .lg\\:col-span-8 img').src = data.img;
            document.getElementById('activity-icon-container').innerHTML = data.icon;
            document.querySelector('#actividades .lg\\:col-span-8 h3').innerText = data.title;
            document.querySelector('#actividades .lg\\:col-span-8 p').innerText = data.desc;

            // 2. Cambiar Tags
            document.querySelector('#actividades .flex-wrap').innerHTML = data.tags.map(t => 
                `<span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20">${t}</span>`
            ).join('');

            panelInner.style.opacity = '1';
        }, 200);

        // 3. Estilos de botones (ACTIVO vs INACTIVO)
        document.querySelectorAll('button[data-activity]').forEach(b => {
            // Volver a estado oscuro
            b.classList.remove('bg-[#D2C18D]', 'text-black');
            b.classList.add('bg-[#111111]', 'text-white');
            
            // El icono del botón vuelve a ser dorado
            const icon = b.querySelector('svg');
            if (icon) icon.style.color = '#D2C18D';
        });

        // Aplicar estado dorado al botón clickeado
        btn.classList.add('bg-[#D2C18D]', 'text-black');
        btn.classList.remove('bg-[#111111]', 'text-white');
        
        // El icono de este botón pasa a ser negro para que se vea bien
        const activeIcon = btn.querySelector('svg');
        if (activeIcon) activeIcon.style.color = 'black';
    });
});
   
});
