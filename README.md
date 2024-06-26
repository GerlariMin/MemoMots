# MémoMots

## Auteur

**Morgan MINBIELLE**

## Table des matières

[Description du projet](#description-du-projet)  
[Langages utilisés](#langages-utilisés)  
[Frameworks utilisés](#frameworks-utilisés)  
[API](#api)  
[Développement](#développement)  
[Changelog](#changelog)
[Site Web](#site-web)

## Description du projet

> Le principe est très simple, choisissez un nombre de mots, aléatoires que vous devrez retenir et valider, puis revenir ultérieurement et les saisir.  
> Le but est de tester votre mémoire des mots et de leur disposition, car il faudra les saisir dans l'ordre dans lequel ils étaient!

> Les mots sont stockés côté client, via un localStorage, il est donc nécessaire que le navigateur ne supprime pas les données à la fermeture si l'utilisateur compte revenir plus tard pour tester sa mémoire.

## Langages utilisés

- HTML 5  
- JavaScript Vanilla

## Frameworks utilisés

- [Bootstrap 5.3.2](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Font Awesome 6.5.2](https://fontawesome.com/v6/search)

## API

- [Trouve-mot](https://trouve-mot.fr/) pour la génération de mots aléatoire.

## Développement

- [x] Génération de mots
- [x] Stockage des mots générés
- [x] Module de saisie des mots mémorisés
- [x] Gestion de la saisie
- [x] Système de notifications
- [x] Limiter le stockage client à 24h
- [x] Gestion du délai de stockage modifiable par l'utilisateur, entre 1h et 168h (7j)
- [ ] Proposer les définition des mots (en attente d'API)

## [Changelog](https://github.com/GerlariMin/MemoMots/blob/main/CHANGELOG.md)

[Changelog consultable ici](https://github.com/GerlariMin/MemoMots/blob/main/CHANGELOG.md).

## [Site Web](https://gerlarimin.github.io/MemoMots/index.html)

Vous pouvez consulter le [site Web ici](https://gerlarimin.github.io/MemoMots/index.html).