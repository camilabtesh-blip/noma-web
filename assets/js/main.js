// Slideshow de crossfade para el hero de home.
// Las fotos se administran desde el CMS (Sanity → Home → Fotos del inicio).
(function () {
  const hero = document.getElementById('hero-slides');
  const center = hero.querySelector('.hero-center');

  sanityQuery(`*[_type == "homepage"][0]{heroImages[]{"url": asset->url}}`).then((data) => {
    const images = (data && data.heroImages) || [];
    if (!images.length) return;

    images.forEach((img, i) => {
      const el = document.createElement('img');
      el.className = 'slide' + (i === 0 ? ' is-active' : '');
      el.src = sanityImageUrl(img.url, 1900);
      el.alt = 'noma estudio';
      hero.insertBefore(el, center);
    });

    const slides = hero.querySelectorAll('.slide');
    if (slides.length < 2) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5500);
  });
})();
