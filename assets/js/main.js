// ===== MENU SHOW Y HIDDEN =====
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close'),
      menuCanvas = document.getElementById('menuCanvas'); // Obtener el elemento canvas

let ctx, particles = [];
const menuOpenColor = '#E53E3E'; // Color principal del menú abierto (rojo)
const particleCount = 100; // Número de partículas para la animación

// Clase para las partículas del canvas
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`; // Partículas blancas semi-transparentes
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Inicializar el canvas
function initCanvas() {
    if (menuCanvas) {
        menuCanvas.width = window.innerWidth;
        menuCanvas.height = window.innerHeight;
        ctx = menuCanvas.getContext('2d');
    }
}

// Crear partículas
function createParticles(x, y) {
    particles = []; // Limpiar partículas anteriores
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
    }
}

// Animar el canvas
function animateCanvas() {
    if (!ctx) return;
    
    // Rellenar el fondo con el color del menú
    ctx.fillStyle = menuOpenColor;
    ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    // Elimina partículas muy pequeñas para evitar acumulación infinita
    particles = particles.filter(particle => particle.size > 0.2);

    // Solo continúa la animación si el menú está abierto y hay partículas
    if (navMenu.classList.contains('show-menu') || particles.length > 0) {
        requestAnimationFrame(animateCanvas);
    }
}

// Listener para el redimensionamiento de la ventana
window.addEventListener('resize', initCanvas);

// Inicializar el canvas al cargar la página
initCanvas();


// MENU SHOW
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
        menuCanvas.classList.add('show'); // Mostrar el canvas
        initCanvas(); // Re-inicializar canvas al abrir para asegurar dimensiones correctas
        // Crea las partículas en el centro de la pantalla
        createParticles(window.innerWidth / 2, window.innerHeight / 2); 
        animateCanvas(); // Iniciar la animación
    })
}

// MENU HIDDEN
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
        menuCanvas.classList.remove('show'); // Ocultar el canvas
        particles = []; // Limpiar las partículas al cerrar el menú
    })
}

// ===== REMOVE MENU MOBILE =====
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
    menuCanvas.classList.remove('show'); // Ocultar el canvas también al hacer click en un enlace
    particles = []; // Limpiar las partículas al hacer click en un enlace
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// ===== CHANGE BACKGROUND HEADER =====
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

// ===== ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(navLink) { // Add a check to ensure navLink exists
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                navLink.classList.add('active-link')
            } else {
                navLink.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/* ===== PRELOADER ===== */
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
    <div class="preloader__spinner">
        <img src="assets/img/logo.png" alt="Kaizen" class="preloader__logo">
    </div>
`;

// Add preloader styles (inline, for quick setup, consider moving to style.css)
const preloaderStyles = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF; /* Using white-color directly */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    
    .preloader__spinner {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .preloader__logo {
        width: 80px;
        height: auto;
    }
    
    .preloader.hide {
        opacity: 0;
        visibility: hidden;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = preloaderStyles;
document.head.appendChild(styleSheet);
document.body.prepend(preloader);

// Hide preloader when page loads
window.addEventListener('load', () => {
    preloader.classList.add('hide');
});


// ===== SCROLL UP =====
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 200 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 200) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


/* ===== TESTIMONIALS CAROUSEL ===== */
const testimonialsContainer = document.querySelector('.testimonials__carousel');
const testimonialCards = document.querySelectorAll('.testimonial__card');
const prevButton = document.getElementById('prev-testimonial');
const nextButton = document.getElementById('next-testimonial');

let currentIndex = 0;

function updateCarousel() {
    const cardWidth = testimonialCards[0].offsetWidth; // Get the width of a single card
    testimonialsContainer.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
}

nextButton.addEventListener('click', () => {
    if (currentIndex < testimonialCards.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to the beginning
    }
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = testimonialCards.length - 1; // Loop to the end
    }
    updateCarousel();
});

// Update carousel on load and resize
window.addEventListener('load', updateCarousel);
window.addEventListener('resize', updateCarousel);