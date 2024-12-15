document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.createElement('div');
  splashScreen.className = 'splash-screen';
  
  const logo = document.createElement('img');
  logo.src = '/logo.svg';
  logo.className = 'splash-logo';
  logo.alt = 'Invest Mastery Mind';
  
  splashScreen.appendChild(logo);
  document.body.appendChild(splashScreen);

  // Masquer l'écran de démarrage après le chargement complet
  window.addEventListener('load', () => {
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      // Supprimer l'élément après la transition
      setTimeout(() => {
        splashScreen.remove();
      }, 500);
    }, 2000); // Afficher pendant 2 secondes
  });
});
