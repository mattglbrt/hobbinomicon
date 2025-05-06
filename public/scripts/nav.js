const navbar = document.getElementById('site-header');
const marker = document.getElementById('hero-marker');
let lastScroll = 0;

// Intersection Observer to detect hero background
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    navbar.classList.add('nav-over-hero');
  } else {
    navbar.classList.remove('nav-over-hero');
  }
}, {
  rootMargin: '-50px 0px 0px 0px', // trigger a little earlier
  threshold: 0
});

if (marker) {
  observer.observe(marker);
}

// Scroll behavior to hide/show nav + fade
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScroll) {
    navbar.classList.add('nav-up');
  } else {
    navbar.classList.remove('nav-up');
  }

  if (currentScroll > 50) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// Mobile menu toggling
document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');

  if (menuButton && mobileMenu && hamburger) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }
});
