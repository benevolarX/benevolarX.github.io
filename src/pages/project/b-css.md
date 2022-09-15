---
layout: ../../layouts/project.astro
title: b-css
client: Self
publishDate: 2018-09-09 00:00:00
img: https://images.unsplash.com/photo-1548391350-1a529f6ea42d?fit=crop&w=1400&h=700&q=75
description: |
  Framework css personnel sans js
tags:
  - design
  - dev
  - css
  - front
  - framework
  - npm
---


Il y a quelques année, j'ai découvert le framework [bulma](https://bulma.io/). 
A l'époque, je ne connaissais pas grand chose du front. 
Je savais qu'il existait des outils comme [bootstrap](https://getbootstrap.com/) mais à part ça, je ne connaissais pas grand chose d'autre.
En même temps, je venais de découvrir les [Custom Properties](https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties) en css.
J'avais eu envie d'essayer en intégrant ces nouvelles variables dans un projet. 
Malheureusement, je n'avais pas d'idée de projet nécessitant un css poussé. 
J'ai donc choisi de m'inspirer de bulma et créer mon propre framework css.

J'ai dans un premier temps repris la configuration de build de bulma car j'aimais énormément ne pas dépendre du js pour le design.
```json
{
  "scripts": {
    "build": "npm run build-sass && npm run build-autoprefix && npm run build-cleancss",
    "build-autoprefix": "postcss --use autoprefixer --map false --output css/bulma.css css/bulma.css",
    "build-cleancss": "cleancss -o css/bulma.min.css css/bulma.css",
    "build-sass": "node-sass --output-style expanded --source-map true bulma.sass css/bulma.css",
    "clean": "rimraf css",
    "rtl": "npm run rtl-sass && npm run rtl-autoprefix && npm run rtl-cleancss",
    "rtl-sass": "node-sass --output-style expanded --source-map true bulma-rtl.sass css/bulma-rtl.css",
    "rtl-autoprefix": "postcss --use autoprefixer --map false --output css/bulma-rtl.css css/bulma-rtl.css",
    "rtl-cleancss": "cleancss -o css/bulma-rtl.min.css css/bulma-rtl.css",
    "deploy": "npm run clean && npm run build && npm run rtl",
    "start": "npm run build-sass -- --watch"
  },
}
```
Ensuite, je me suis concentré en priorité sur la mise en place des blocs de type grid et flex. 
Pour cela, je me suis cette fois inspiré de [tailwind css](https://tailwindcss.com/).
L'idée de retrouver la simplicité d'antant (où on pouvait mettre du style dans une propriété style sans que ça ne gène) me plaisait... 

J'ai poursuivi dans cette direction (un peu trop) en ajoutant des tonnes de propriétés plus ou moins utiles mais toujours modifiable avec des variables css. 
Je me suis renseigné sur les différentes normes existantes et je me suis fait un gloubi boulga de ce que j'ai retenu de l'ITCSS, BEM, ...
Je me suis créé un dossier de favori avec une petite liste de framework css plus ou moins connus, plus ou moins gros et plus ou moins actifs.
- [inuitCSS](https://github.com/inuitcss/inuitcss)
- [helium](https://github.com/cbrauckmuller/helium)
- [blaze atoms](https://github.com/BlazeSoftware/atoms)
- [Pure.css](https://github.com/pure-css/pure)
- [UIkit](https://github.com/uikit/uikit)
- [Bulma](https://github.com/jgthms/bulma)
- [Flat-Remix-CSS](https://github.com/daniruiz/flat-remix-css)
- [lotus.css](https://github.com/goatslacker/lotus.css)
- [Mimic.css](https://github.com/erictreacy/mimic.css)
- [Milligram](https://github.com/milligram/milligram)
- [TentCSS](https://github.com/sitetent/tentcss)
- [KNACSS](https://github.com/alsacreations/KNACSS)
- [mini.css](https://github.com/Chalarangelo/mini.css/)
- [Spectre.css](https://github.com/picturepan2/spectre)
- [tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [Pico.css](https://github.com/picocss/pico)

Je les ai consultés dans l'ordre de dernière mise à jour et j'ai comparés leur code sur certains aspect. 
C'est de cette façon que j'ai pu ajouter une petite ligne concernant le clearfix après m'être renseigné sur son utilité.

Après m'être lassé du projet, j'y suis revenu quelques années plus tard pour tenter de redonner un coup de neuf à ce vieux projet. 
Pour celà, il me fallait avoir un objectif clair et précis pour refactorer le code dans la bonne direction. 
Les nouveaux points importants de la prochaine version sont : 

- avoir un reset css au début
- une bonne base pour utiliser flex / grid
- ne PAS avoir de variable initialisée dans le code de sorti
- avoir un framework léger full css avec seulement le minimum au niveau des composants de structure


Pour le premier et le second point, c'est facile à faire. Il m'a simplement fallu refactorer le code au niveau de flex / grid pour mettre en place un système de breakpoint.
Pour le 3ème point, c'est un parti pris de ma part. 
En effet, la plupart des framework css arrivent avec un style par défaut qu'il faut ensuite remplacer si l'on veut avoir le sien.

J'ai tout de suite pensé au mobile-first. Je me suis dit que laisser des valeurs vide plutôt que de changer des valeurs par défaut était une idée intéressante à tester.

Changer des valeurs par défaut est une étape qui peut être longue et fastidieuse (sauf pour tailwind) durant laquelle il n'est pas rare d'oublier de changer la valeur d'une propriété. 
Pourtant, lorsqu'on a un projet sans css il est très simple de faire une mise en page rapide.
C'est pour compenser l'absence d'un outil lourd de compilation (comme tailwind) que j'ai choisi de complètement supprimer le systèmes de couleur par défaut.

Attention ! Je garde les variables css, c'est juste que leur valeur n'est pas défini. 
L'utilisateur peut donc charger une fichier css personnel contenant l'initialisation des variables 
css dont il a besoin AVANT b-css pour que tout fonctionne.

Le projet est actuellement en pause. La création de ce site internet me donnera peut être de l'inspiration pour sortir une version stable est utile.
