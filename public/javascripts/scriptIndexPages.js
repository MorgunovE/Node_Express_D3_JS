document.addEventListener('DOMContentLoaded', () => {

    const thankYouModal = document.getElementById('thank-you-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const returnButtons = document.querySelectorAll('.return-btn');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Gestion du diaporama
    const gallery = document.querySelector('.gallery_main-block');
    const images = document.querySelectorAll('.gallery_main-block img');
    const prevBtn = document.querySelector('.prev-btn_main-block');
    const nextBtn = document.querySelector('.next-btn_main-block');
    let currentIndex = 0;
    let slideInterval;

    // Affichage d'une diapositive spécifique
    function showSlide(index) {
        if (index >= images.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex = index;
        }
        gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Démarrage du diaporama
    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 2000); // Change slide every 2 seconds
    }

    // Arrêt du diaporama
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Navigation dans le diaporama
    prevBtn.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentIndex - 1);
        startSlideShow();
    });

    // Navigation dans le diaporama
    nextBtn.addEventListener('click', () => {
        stopSlideShow();
        showSlide(currentIndex + 1);
        startSlideShow();
    });

    showSlide(currentIndex); // Afficher la première diapositive
    startSlideShow(); // Démarrer le diaporama

    // Gestion des boutons de fermeture et de retour
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.parentElement.style.display = 'none';
            enableScroll();
        });
    });

    // Gestion des boutons de fermeture et de retour
    returnButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.parentElement.style.display = 'none';
            enableScroll();
        });
    });

    // Gestion de la soumission du formulaire
    document.querySelector('.submit-btn').addEventListener('click', (e) => {
        let isValid = true;

        [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
            input.classList.remove('invalid');
        });

        if (nameInput.value.trim() === '') {
            nameInput.classList.add('invalid');
            isValid = false;
        }

        // Format du numéro de téléphone : 10 chiffres
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            phoneInput.classList.add('invalid');
            isValid = false;
        }

        // Format de l'adresse email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add('invalid');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            e.preventDefault();
            thankYouModal.style.display = 'block';
            disableScroll();
            [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
                input.value = '';
            });
        }
    });

    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNav = document.querySelector('.menu-nav-mobile');
    const menuLinks = document.querySelectorAll('.menu-nav-mobile a');

    // Ouverture et fermeture du menu mobile
    menuToggle.addEventListener('click', () => {
        menuNav.classList.toggle('expanded');
        menuToggle.classList.toggle('expanded');
    });

    // Fermeture du menu mobile lorsqu'un lien est cliqué
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuNav.classList.remove('expanded');
            menuToggle.classList.remove('expanded');
        });
    });

    // Désactivation du scroll lorsqu'un modal est ouvert
    function disableScroll() {
        document.body.classList.add('no-scroll');
    }

    // Réactivation du scroll lorsqu'un modal est fermé
    function enableScroll() {
        document.body.classList.remove('no-scroll');
    }

    // Fermeture des modals lorsqu'on clique en dehors de leur contenu
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                enableScroll();
            }
        });
    });
});

