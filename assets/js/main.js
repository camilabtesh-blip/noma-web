// Slideshow simple de crossfade para el hero de home.
// Para cambiar las fotos: editar el array de <img class="slide"> dentro de #hero-slides en index.html.
(function () {
  const slides = document.querySelectorAll('#hero-slides .slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 5500);
})();
