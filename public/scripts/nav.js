// Navbar hide/show on scroll with tolerance
let lastScroll = 0;
const navbar = document.querySelector('nav');
const scrollTolerance = 10; // Only react if user scrolls at least 10px

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (Math.abs(currentScroll - lastScroll) <= scrollTolerance) {
    // Ignore tiny scrolls
    return;
  }

  if (currentScroll <= 0) {
    navbar.classList.remove('nav-up');
    return;
  }

  if (currentScroll > lastScroll && !navbar.classList.contains('nav-up')) {
    navbar.classList.add('nav-up');
  } else if (currentScroll < lastScroll && navbar.classList.contains('nav-up')) {
    navbar.classList.remove('nav-up');
  }
  lastScroll = currentScroll;
});

document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
});
