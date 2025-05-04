<script>
// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
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
</script>