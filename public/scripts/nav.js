// Navbar hide/show on scroll with tolerance and smooth background transition
let lastScroll = 0;
const navbar = document.getElementById('site-header');
const scrollTolerance = 10; // Only react if user scrolls at least 10px

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (Math.abs(currentScroll - lastScroll) <= scrollTolerance) {
    return;
  }

  if (currentScroll > lastScroll) {
    navbar.classList.add('nav-up');
  } else {
    navbar.classList.remove('nav-up');

    if (currentScroll > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

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
