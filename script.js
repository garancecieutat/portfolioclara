let lastScrollY = window.scrollY;
let ticking = false; // Variable pour éviter de surcharger le navigateur

// On sépare la logique de calcul dans une fonction dédiée
function updateLogoPosition(scrollTop) {
  const scrollLogo = document.getElementById('scroll-logo');

  if (scrollLogo) {
    if (scrollTop > lastScrollY) {
      scrollLogo.src = "img/logo_balade/droite.png";
    } else if (scrollTop < lastScrollY) {
      scrollLogo.src = "img/logo_balade/gauche.png";
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0; // Sécurité si la page est petite
    const maxX = window.innerWidth - scrollLogo.offsetWidth;
    const newLeft = scrollPercent * maxX;

    scrollLogo.style.left = `${newLeft}px`;
  }
  
  lastScrollY = scrollTop;
}

// L'événement scroll est maintenant optimisé
window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      updateLogoPosition(window.scrollY);
      ticking = false;
    });
    ticking = true;
  }
});