let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
  const scrollLogo = document.getElementById('scroll-logo');

  if (scrollLogo) {
    // Position actuelle du scroll
    const scrollTop = window.scrollY;

    // Détection du sens du scroll
    if (scrollTop > lastScrollY) {
      // On descend → regarde vers la droite
      scrollLogo.src = "droite.png";
    } else if (scrollTop < lastScrollY) {
      // On remonte → regarde vers la gauche
      scrollLogo.src = "gauche.png";
    }

    // Calcul de la progression du défilement
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    // Position horizontale
    const maxX = window.innerWidth - scrollLogo.offsetWidth;
    const newLeft = scrollPercent * maxX;

    // Déplacement du bonhomme
    scrollLogo.style.left = `${newLeft}px`;
  }

  // Mémorise la position actuelle
  lastScrollY = window.scrollY;
});
