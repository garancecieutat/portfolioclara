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


//////////////////////////////////////////////////

// 1. On cherche toutes les boîtes d'images de tes tuiles
const imageWrappers = document.querySelectorAll('.card-image-wrapper');

imageWrappers.forEach(wrapper => {
  const img = wrapper.querySelector('.art-image');
  const prevBtn = wrapper.querySelector('.prev-btn');
  const nextBtn = wrapper.querySelector('.next-btn');
  
  // Si la tuile n'a pas de data-images, on ignore et on passe à la suivante
  if (!img || !img.getAttribute('data-images')) return; 

  // On découpe la liste des images grâce aux virgules pour en faire un tableau
  const imagesList = img.getAttribute('data-images').split(',').map(url => url.trim());
  let currentIndex = 0; // On commence toujours à l'image 0 (la première)

  // Fonction qui met à jour l'image et gère les flèches
  function updateSlider() {
    img.src = imagesList[currentIndex]; // Change l'image
    
    // Gère la flèche gauche
    if (currentIndex === 0) {
      prevBtn.style.display = 'none'; // Si on est au début, on cache la flèche gauche
    } else {
      prevBtn.style.display = 'flex'; // Sinon on l'affiche
    }

    // Gère la flèche droite
    if (currentIndex === imagesList.length - 1) {
      nextBtn.style.display = 'none'; // Si on est à la fin, on cache la flèche droite
    } else {
      nextBtn.style.display = 'flex'; // Sinon on l'affiche
    }
  }

  // Quand on clique sur la flèche droite
  nextBtn.addEventListener('click', () => {
    if (currentIndex < imagesList.length - 1) {
      currentIndex++; // On avance d'une image
      updateSlider(); // On met à jour l'affichage
    }
  });

  // Quand on clique sur la flèche gauche
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--; // On recule d'une image
      updateSlider(); // On met à jour l'affichage
    }
  });
  
  // On lance la fonction une première fois pour que tout soit bien réglé
  updateSlider();
});


/////////////////

// --- LIGHTBOX (ZOOM IMAGE) ---

// 1. On fabrique la fenêtre noire directement en JS (pas besoin de toucher au HTML !)
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <span class="close-lightbox">&times;</span>
  <button class="lightbox-btn prev-lightbox">◀</button>
  <img id="lightbox-img" src="">
  <button class="lightbox-btn next-lightbox">▶</button>
`;
document.body.appendChild(lightbox);

// 2. On récupère les éléments qu'on vient de créer
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-lightbox');
const prevLbBtn = document.querySelector('.prev-lightbox');
const nextLbBtn = document.querySelector('.next-lightbox');

let lbImages = []; // Liste des images à afficher en grand
let lbIndex = 0;   // Numéro de l'image en cours

// 3. Fonction pour mettre à jour l'image dans le grand zoom
function updateLightbox() {
  lightboxImg.src = lbImages[lbIndex];
  
  // Affiche ou cache les flèches selon si on est au début ou à la fin
  prevLbBtn.style.display = lbIndex === 0 ? 'none' : 'flex';
  nextLbBtn.style.display = lbIndex === lbImages.length - 1 ? 'none' : 'flex';
}

// 4. On rend TOUTES les images de tes tuiles cliquables
const allArtImages = document.querySelectorAll('.art-card img');

allArtImages.forEach(img => {
  // Ajoute un curseur "main" pour faire comprendre que c'est cliquable
  img.style.cursor = 'pointer';

  img.addEventListener('click', () => {
    // A. L'image cliquée fait-elle partie d'un carrousel (a-t-elle data-images) ?
    if (img.hasAttribute('data-images')) {
      // On copie la liste des images
      lbImages = img.getAttribute('data-images').split(',').map(url => url.trim());
      // On trouve à quelle image exacte on s'était arrêté sur la petite tuile
      lbIndex = lbImages.findIndex(url => img.src.includes(url));
      if (lbIndex === -1) lbIndex = 0; // Sécurité
    } 
    // B. Sinon, c'est une image seule
    else {
      lbImages = [img.src];
      lbIndex = 0;
    }

    // On met à jour et on affiche la grande fenêtre !
    updateLightbox();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
  });
});

/// 5. Actions pour fermer ou changer d'image dans la Lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = ''; // Réactive le scroll
});

// Permet de fermer si on clique dans le vide (sur le fond noir)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Réactive le scroll
  }
});

nextLbBtn.addEventListener('click', () => {
  if (lbIndex < lbImages.length - 1) {
    lbIndex++;
    updateLightbox();
  }
});

prevLbBtn.addEventListener('click', () => {
  if (lbIndex > 0) {
    lbIndex--;
    updateLightbox();
  }
});

// 6. Contrôle au clavier (Échap, Flèche Gauche, Flèche Droite)
document.addEventListener('keydown', (e) => {
  // On ne réagit que si la Lightbox est ouverte
  if (lightbox.style.display === 'flex') {
    if (e.key === 'Escape') {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
    else if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) {
      lbIndex++;
      updateLightbox();
    }
    else if (e.key === 'ArrowLeft' && lbIndex > 0) {
      lbIndex--;
      updateLightbox();
    }
  }
});