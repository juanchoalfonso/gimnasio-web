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
    hiddenElements.forEach((el) => observer.observe(el));


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
});
