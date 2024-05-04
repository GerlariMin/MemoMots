// On attend le chargement de la page HTML
document.addEventListener("DOMContentLoaded", async function () {
    let identifiantLocalStorage = 'mots';
    let mots;
    let motsATrouver;
    let nombreDeMots = document.getElementById('words-number').value;
    let nombreDeMotsATrouver;
    let nombreDeMotsTrouves = 0;
    let nombreDeTentatives = 0;
    let titreMotsATrouver = document.getElementById('words-guess-title');
    // Par défaut, on masque le tire du module dédié à retrouver les mots à retenir
    titreMotsATrouver.style.display = 'none';
    // On génère un nombre de mots par défaut (3) pour une prochaine manche
    await genererMotsAMemoriser();
    // Si on récupère une variable stockée côté client, correspondant au site
    if (localStorage.getItem(identifiantLocalStorage)) {
        // On récupère la liste des mots
        motsATrouver = JSON.parse(localStorage.getItem(identifiantLocalStorage));
        // On actualise le nombre de mots à trouver
        nombreDeMotsATrouver = motsATrouver.length;
        // Affichage du titre
        titreMotsATrouver.style.display = 'block';
        // Génération des blocs dédiés à saisir les mots qui devaient être mémorisés
        genererMotsATrouver();
    }
    // Lorsque l'utilisatuer veut modifier le nombre de mots à mémoriser
    document.getElementById('words-number').addEventListener('change', function() {
        // On actualise la variable dédiée
        nombreDeMots = this.value;
        // On actualise les mots à afficher
        genererMotsAMemoriser();
    });
    // Lorsque l'utilisateur veut modifier les mots à mémoriser
    document.getElementById('words-generator').addEventListener('click', function() {
        // On actualise les mots à afficher
        genererMotsAMemoriser();
    });
    // Lorsque l'utilisateur veut sauvegarder la liste de mots à mémoriser
    document.getElementById('words-save-list').addEventListener('click', function() {
        // On actualise le nombre de tentatives
        nombreDeTentatives = 0;
        // ON actualise le nombre de mots trouvés
        nombreDeMotsTrouves = 0;
        // On stocke côté client la liste de mots à mémoriser
        localStorage.setItem(identifiantLocalStorage, JSON.stringify(mots));
        // Si le stockage s'est bien effectué
        if (localStorage.getItem(identifiantLocalStorage)) {
            // On récupère la liste des mots
            motsATrouver = JSON.parse(localStorage.getItem(identifiantLocalStorage));
            // On actualise le nombre de mots à trouver
            nombreDeMotsATrouver = motsATrouver.length;
            // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
            genererNotification('success', 'fa-regular fa-floppy-disk', 'Les mots sont bien sauvegardés pour votre prochaine visite!<br><br>Faites attention à ne pas supprimer vos données de ce site sur votre navigateur, cela supprimera les mots à trouver!', 'Sauvegarde des mots', true);
            // Affichage du titre
            titreMotsATrouver.style.display = 'block';
            // Génération des blocs dédiés à saisir les mots qui devaient être mémorisés
            genererMotsATrouver();
            // Génération de nouveaux mots pour ne pas avoir les réponses sous les yeux
            genererMotsAMemoriser();
        } else {
            // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
            genererNotification('danger', 'fa-solid fa-bomb', 'Oups, ça n\'a pas fonctionné! Veuillez réessayer ultérieurement!', 'Sauvegarde des mots', true);
        }
    });
    // Lorsque l'utilisateur veu supprimer les notifications du centre de notifications
    document.getElementById('toasts-eraser').addEventListener('click', function () {
        // On retire tout le HTML dans la div du centre de notifications
        document.getElementById('notifications-space').innerHTML = "";
        // On rajoute le message indiquant qu'il n'y a plus denotification
        document.getElementById('notifications-space').insertAdjacentHTML("beforeend", '<p id="notifications-text-none">Pas de notification pour le moment.</p>');
        // On remet le compteur de notifications à zéro
        document.getElementById('notifications-counter').textContent = "0";
    });
    // Lorsque le hash du lien change
    window.addEventListener("hashchange", () => {
        // On s'assure qu'il n'est pas vide
        if (window.location.hash) {
            // On récupère le contenu après le #
            let indiceMot = window.location.hash.split('#')[1];
            // On vérifie si le hash filtré est bien un nombre
            if (!isNaN(parseInt(indiceMot))) {
                // On récupère l'input concernant le mot à trouver
                let motATrouver = document.getElementById('word-guess-' + indiceMot);
                // On récupère le bouton lié à l'input
                let boutonLie = document.getElementById('word-button-' + indiceMot);
                // On réinitialise le contenu du bouton
                boutonLie.innerHTML = "";
                // On actualise le nombre de tentatives effectuées
                nombreDeTentatives++;
                // Si la valeur de la saisie utilisateur correspondant à la valeur du mot à trouver
                if (motATrouver.value === motsATrouver[indiceMot].name) {
                    // On ajoute la classe spécifiée
                    boutonLie.classList.add('btn-success');
                    // On retire la classe spécifiée, si présente
                    boutonLie.classList.remove('btn-outline-dark');
                    // On retire la classe spécifiée, si présente
                    boutonLie.classList.remove('btn-outline-danger');
                    // Modification du contenu du bouton
                    boutonLie.insertAdjacentHTML("beforeend", '<i class="fa-regular fa-handshake fa-beat"></i> Pas mal!');
                    // On retire l'action qu'effectue le bouton de vérification
                    boutonLie.removeAttribute("href");
                    // On indique visuellement que c'est le bon mot
                    motATrouver.classList.add("is-valid");
                    // On retire la partie visuelle indiquant que la saisie est incorrecte, si présente
                    motATrouver.classList.remove("is-invalid");
                    // On passe l'input en lecture seule, l'utilisateur ne peut plus modifier sa saisie
                    motATrouver.setAttribute("readonly", "");
                    // On actualise le nombre de mots trouvés
                    nombreDeMotsTrouves++;
                    // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
                    genererNotification('success', 'fa-flip-horizontal fa-regular fa-thumbs-up', 'Bien joué! Vous avez trouvé le mot ' + (parseInt(indiceMot) + 1) + '!', 'Retrouve-mots', true);
                    // Si la valeur de la saisie utilisateur est différente de la valeur du mot à trouver
                } else {
                    // On ajoute la classe spécifiée
                    boutonLie.classList.add('btn-outline-danger');
                    // On retire la classe spécifiée, si présente
                    boutonLie.classList.remove('btn-outline-dark');
                    // On retire la classe spécifiée, si présente
                    boutonLie.classList.remove('btn-success');
                    // Modification du contenu du bouton
                    boutonLie.insertAdjacentHTML("beforeend", '<i class="fa-regular fa-circle-xmark fa-shake"></i> Ça craint...');
                    // On indique visuellement que la saisie est correcte
                    motATrouver.classList.add("is-invalid");
                    // On retire la partie visuelle indiquant que la saisie est correcte, si présente
                    motATrouver.classList.remove("is-valid");
                    // On retire le fait que l'input est en lecture seule, si l'attribut est présent
                    motATrouver.removeAttribute("readonly");
                    // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
                    genererNotification('danger', 'fa-regular fa-circle-xmark', 'Dommage! Ce n\'est pas le mot ' + (parseInt(indiceMot) + 1), 'Retrouve-mots',  true);
                }
                // Vérification de si l'utilisateur a trouvé tous les mots
                if (nombreDeMotsTrouves === nombreDeMotsATrouver) {
                    // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
                    genererNotification('success', 'fa-solid fa-trophy fa-bounce', 'Bravo! Vous avez trouvé tous les mots en <strong>' + nombreDeTentatives + ' tentatives!</strong>', 'Félicitations',  true);
                }
            } else {
                // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
                genererNotification('warning', 'fa-solid fa-magnifying-glass', 'Hum... Action suspecte détectée. On tente de trouver quelque chose?', 'Cher fouineur :)',  true);
            }
            // Réinitialisation du hash
            window.location.hash = "";
        }
    });

    /**
     * Génération des mots à mémoriser.
     * Les mots générés via l'API trouve mot: https://trouve-mot.fr/
     * Les définitions des mots devrait être générées via une API dictionnaire (à venir)
     *
     * @returns {Promise<void>}
     */
    async function genererMotsAMemoriser() {
        // Suppression du contenu de l'élément HTML qui contiendra toutes les cards des mots aléatoires générés
        document.getElementById('words-cards').innerHTML = "";
        // Actualisation de la valeur affichées sur l'interface utilisateur
        document.getElementById('words-number-counter').textContent = nombreDeMots;
        try {
            // Appel de l'API trouve mot: https://trouve-mot.fr/ pour générer nombreDeMots mots aléatoires
            mots = await fetch("https://trouve-mot.fr/api/random/" + nombreDeMots)
                .then((response) => response.json())
                .then((words) => {
                    return words
                });
            // Parcourt de l'ensemble des mots générés par l'API
            mots.forEach((mot) => {
                // Ajout des cards nouvellement créées pour les mots générés
                document.getElementById('words-cards').insertAdjacentHTML("beforeend",
                    '<div class="col-4 p-1">\n' +
                    '    <div class="card text-center">\n' +
                    '        <div class="card-body">\n' +
                    '            <h5 class="card-title">' + mot.name + '</h5>\n' +
                    '            <h6 class="card-subtitle mb-2 text-body-secondary"></h6>\n' +
                    '            <p class="card-text">Définition à venir prochainement...</p>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            // Génération d'une notification dans le centre de notifications
            genererNotification('info', 'fa-solid fa-server', 'Mots aléatoires générés avec succès!', 'Application');
        } catch (error) {
            // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
            genererNotification('danger', 'fa-solid fa-server', 'Un problème technique est survenu lors de la génération des mots! Erreur: ' + error.message, 'Application', true);
        }
    }

    /**
     * Génération des cards à afficher sur l'interface utilisateur.
     * Chaque card contient un champ de saisie et un bouton pour vérifier le résultat.
     */
    function genererMotsATrouver() {
        try {
            // Suppression du contenu de l'élément HTML qui contiendra toutes les cards des mots à retrouver
            document.getElementById('words-guess-cards').innerHTML = "";
            // Parcourt de l'ensemble des mots à retrouver
            mots.forEach((mot, indice) => {
                document.getElementById('words-guess-cards').insertAdjacentHTML("beforeend",
                    '<div class="col-4 p-1">\n' +
                    '    <div class="card text-center">\n' +
                    '        <div class="card-header">\n' +
                    '            <h5>Mot <i class="fa-solid fa-hashtag"></i>' + (indice+1) + '</h5>\n' +
                    '        </div>' +
                    '        <div class="card-body">\n' +
                    '            <div class="form-floating mb-2">\n' +
                    '                <input class="form-control" id="word-guess-' + indice + '" placeholder="Mot #' + (indice+1) + '" type="text">\n' +
                    '                <label for="word-guess-' + indice + '">Quel était donc ce mot ?</label>\n' +
                    '            </div>' +
                    '            <a class="btn btn-outline-dark col-10" href="#' + indice + '" id="word-button-' + indice + '" role="button"><i class="fa-solid fa-magnifying-glass"></i> Vérifier le mot</a>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>');
            });
            // Génération d'une notification dans le centre de notifications
            genererNotification('info', 'fa-solid fa-server', 'Module "Retrouvez vos mots" généré avec succès!', 'Application');
        } catch (error) {
            // Génération d'une notification dans le centre de notifications et en toast pour prévenir l'utilisateur
            genererNotification('danger', 'fa-solid fa-server', 'Un problème technique est survenu lors de la génération du module "Retrouvez vos mots"! Erreur: ' + error.message, 'Application', true);
        }
    }

    /**
     * Génération des notifications sur l'interface.
     *
     * @param couleur
     * @param fontawesome
     * @param message
     * @param titre
     * @param toast
     */
    function genererNotification(couleur, fontawesome, message, titre = '', toast = false) {
        let espaceNotifications = document.getElementById('notifications-space');
        let nombreNotifications = parseInt(document.getElementById('notifications-counter').textContent)+1;
        let dateCourante = new Date();
        // Si element HTML indiquant qu'il n'y a pas de notification existe
        if (document.getElementById('notifications-text-none')) {
            // Retrait du message indiquant qu'il n'y a pas de notifications
            document.getElementById('notifications-text-none').style.display = 'none';
        }
        // Ajout de la notification dans le centre de notifications
        espaceNotifications.insertAdjacentHTML("beforeend",
            '<div class="border-' + couleur + ' card mb-3">\n' +
            '    <div class="card-header d-flex justify-content-between">' +
            '        <strong class="text-' + couleur + '"><i class="' + fontawesome + '"></i> ' + titre + '</strong>\n' +
            '        <small>' + dateCourante.getDay().toString().padStart(2, '0') + '/' + dateCourante.getMonth().toString().padStart(2, '0') + '/' + dateCourante.getFullYear().toString().padStart(4, '0') + ' ' + dateCourante.getHours().toString().padStart(2, '0') + ':' + dateCourante.getMinutes().toString().padStart(2, '0') + '</small>\n' +
            '    </div>\n' +
            '    <div class="card-body text-' + couleur + '">\n' +
            '        <p class="card-text">' + message + '</p>\n' +
            '    </div>\n' +
            '</div>');
        // Actualisation du compteur de notifications
        document.getElementById('notifications-counter').textContent = nombreNotifications.toString();
        // Si on doit générer une notification toast
        if (toast) {
            // On appelle la fonction dédée
            genererToast(couleur, dateCourante, message, nombreNotifications);
        }
    }

    /**
     * Génération d'une notification de type toast sur l'interface utilisateur.
     *
     * @param couleur
     * @param dateCourante
     * @param message
     * @param nombreNotifications
     */
    function genererToast(couleur, dateCourante, message, nombreNotifications) {
        // Ajout du toast dans le bloc dédié
        document.getElementById('notifications-toats').insertAdjacentHTML("beforeend",
            '<div aria-atomic="true" aria-live="assertive" class="text-bg-' + couleur + ' toast" id="toast-' + nombreNotifications + '" role="alert">\n' +
            '    <div class="toast-header">\n' +
            '        <strong class="me-auto"><i class="fa-solid fa-bullhorn fa-beat"></i> MémoMots</strong>\n' +
            '        <small>' + dateCourante.getDay().toString().padStart(2, '0') + '/' + dateCourante.getMonth().toString().padStart(2, '0') + '/' + dateCourante.getFullYear().toString().padStart(4, '0') + ' ' + dateCourante.getHours().toString().padStart(2, '0') + ':' + dateCourante.getMinutes().toString().padStart(2, '0') + '</small>\n' +
            '        <button  aria-label="Close" class="btn-close" data-bs-dismiss="toast" id="toast-' + nombreNotifications + '-close" type="button"></button>\n' +
            '    </div>\n' +
            '    <div class="toast-body">\n' +
            '        ' + message + '\n' +
            '    </div>\n' +
            '</div>');
        // Afficher le toast nouvellement créé
        document.getElementById('toast-' + nombreNotifications).style.display = 'block';
        // Lorsque l'utilisateur veut fermer la notification
        document.getElementById('toast-' + nombreNotifications + '-close').addEventListener('click', function() {
            // Masquer le toast en question
            document.getElementById('toast-' + nombreNotifications).style.display = 'none';
        });
    }
});
