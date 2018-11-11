window.addEventListener('load', function() {
  const nav = document.getElementById('nav');
  document.getElementById('navMenu').addEventListener('click', function() {
    nav.classList.toggle('open');
  });
});