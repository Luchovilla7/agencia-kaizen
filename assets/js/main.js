document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');

    if (carouselTrack) {
        // Clonar los hijos del carouselTrack
        const children = Array.from(carouselTrack.children);
        children.forEach(child => {
            const clonedChild = child.cloneNode(true);
            carouselTrack.appendChild(clonedChild);
        });
    }

    /* ===== SCROLL REVEAL ===== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Add reveal classes to sections
    const sectionsToReveal = document.querySelectorAll('.section, .services__card, .testimonial__card, .about__content');
    sectionsToReveal.forEach(el => {
        if (!el.classList.contains('hero')) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        }
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));
});

// ===== MENU SHOW Y HIDDEN =====
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close'),
    menuCanvas = document.getElementById('menuCanvas');

let ctx, particles = [];
const menuOpenColor = '#E53E3E';
const particleCount = 100;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
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

function initCanvas() {
    if (menuCanvas) {
        menuCanvas.width = window.innerWidth;
        menuCanvas.height = window.innerHeight;
        ctx = menuCanvas.getContext('2d');
    }
}

function createParticles(x, y) {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
    }
}

function animateCanvas() {
    if (!ctx) return;
    ctx.fillStyle = menuOpenColor;
    ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    particles = particles.filter(particle => particle.size > 0.2);
    if (navMenu.classList.contains('show-menu') || particles.length > 0) {
        requestAnimationFrame(animateCanvas);
    }
}

window.addEventListener('resize', initCanvas);
initCanvas();

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
        menuCanvas.classList.add('show');
        initCanvas();
        createParticles(window.innerWidth / 2, window.innerHeight / 2);
        animateCanvas();
    })
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
        menuCanvas.classList.remove('show');
        particles = [];
    })
}

const navLink = document.querySelectorAll('.nav__link')
function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
    menuCanvas.classList.remove('show');
    particles = [];
}
navLink.forEach(n => n.addEventListener('click', linkAction))

function scrollHeader() {
    const nav = document.getElementById('header')
    if (window.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

const sections = document.querySelectorAll('section[id]')
function scrollActive() {
    const scrollY = window.pageYOffset
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id')
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link')
            } else {
                navLink.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/* ===== PARALLAX EFFECT ===== */
function parallaxEffect() {
    const scroll = window.pageYOffset;
    const bgPattern = document.querySelector('.hero__bg-pattern');
    const parallax1 = document.querySelector('.hero__parallax-layer--1');
    const parallax2 = document.querySelector('.hero__parallax-layer--2');
    const heroImg = document.querySelector('.hero__img');
    const heroContent = document.querySelector('.hero__content');

    if (bgPattern) bgPattern.style.transform = `translateY(${scroll * 0.4}px)`;
    if (parallax1) parallax1.style.transform = `translateY(${scroll * -0.15}px) rotate(${scroll * 0.05}deg)`;
    if (parallax2) parallax2.style.transform = `translateY(${scroll * 0.3}px) rotate(${scroll * -0.03}deg)`;
    if (heroImg) heroImg.style.transform = `translateY(${scroll * 0.12}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${scroll * 0.05}px)`;
}
window.addEventListener('scroll', parallaxEffect);

/* ===== PRELOADER ===== */
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
    <div class="preloader__spinner">
        <img src="assets/img/logo.png" alt="Kaizen" class="preloader__logo">
    </div>
`;
const preloaderStyles = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    .preloader__spinner { animation: pulse 2s ease-in-out infinite; }
    .preloader__logo { width: 80px; height: auto; }
    .preloader.hide { opacity: 0; visibility: hidden; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = preloaderStyles;
document.head.appendChild(styleSheet);
document.body.prepend(preloader);
window.addEventListener('load', () => { preloader.classList.add('hide'); });

function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    if (window.scrollY >= 200) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/* ===== TESTIMONIALS CAROUSEL ===== */
const testimonialsContainer = document.querySelector('.testimonials__carousel');
const testimonialCards = document.querySelectorAll('.testimonial__card');
const prevButton = document.querySelector('.testimonials__button--prev');
const nextButton = document.querySelector('.testimonials__button--next');

if (testimonialsContainer && testimonialCards.length > 0) {
    let currentIndex = 0;
    function updateCarousel() {
        const cardWidth = testimonialCards[0].offsetWidth + 24;
        testimonialsContainer.scrollTo({
            left: currentIndex * cardWidth,
            behavior: 'smooth'
        });
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialCards.length - 1;
            updateCarousel();
        });
    }
    window.addEventListener('resize', updateCarousel);
}