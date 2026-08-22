window.addEventListener('scroll', function() {
  const scrollLogo = document.getElementById('scroll-logo');
  
  if (scrollLogo) {
    // Calcul de la progression du défilement
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight);
    
    // Calcul de la position maximale autorisée (largeur de la fenêtre moins le logo)
    const maxX = window.innerWidth - scrollLogo.offsetWidth;
    const newLeft = scrollPercent * maxX;
    
    // Mise à jour de la position du logo en fonction du scroll
    scrollLogo.style.left = `${newLeft}px`;
  }
});