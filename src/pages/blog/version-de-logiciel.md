---
layout: ../../layouts/blog.astro
title: Les versions de Logiciel
client: Self
publishDate: 2022-09-09 00:00:00
img: https://images.unsplash.com/photo-1548391350-1a529f6ea42d?fit=crop&w=1400&h=700&q=75
description: |
  Les versions de logiciels
tags:
  - apprendre
  - généraliste
  - trucs & astuces
  - logiciel
---


Si je devais enseigner l'informatique à quelqu'un, je commencerai par là.
Ce n'est pas très intéressant mais c'est un exemple assez parlant de l'informatique en soit.
Tant au niveau de la prise de décision technique que de l'aspect commercial / marketing.
C'est un exemple type des différents moyens de faire quelque chose de simple et fonctionnel avec au final très peu.

Le numéro de version de logiciel est un identifiant composé de 3 nombres : 
<p style="text-align:center; font-size:4rem">
<span style="color:red">5</span>.
<span style="color:blue">2</span>.
<span style="color:lightgreen">9</span>
</p>

- Le <span style="color:red">premier Nombre</span> correspond au numéro de version <span style="color:red">MAJEUR</span>.
- Le <span style="color:blue">second</span> au numéro de version <span style="color:blue">MINEUR</span>.
- Le <span style="color:lightgreen">dernier</span> correspond au numéro de <span style="color:lightgreen">PATCH</span>.

Jusque là tout va bien ?

Commençons par le <span style="color:lightgreen">numéro de patch</span>. Lorsqu'un logiciel comporte un bug et que celui ci est repéré par un utilisateur qui fait remonter l'information, l'équipe en charge du projet va alors corriger le bug et publier une mise à jour corrective aussi appellée mise à jour de patch. 
Le but de cette mise est jour est de corriger des bugs.

Si vous avez un logiciel en version X.X.<span style="color:lightgreen">N</span> et qu'une version X.X.<span style="color:lightgreen">N + 1</span> est disponible alors n'hésitez pas à faire la mise à jour.

Maintenant imaginons que l'équipe en charge du projet améliore son logiciel en lui <span style="text-decoration:underline">ajoutant une nouvelle fonctionnalité</span>. Cette nouvelle fonctionnalité a besoin d'être publiée via une <span style="color:blue">mise à jour mineure</span>. 
Entendez par <span style="color:blue">mineure</span>, une mise à jour non indispensable. Une mise à jour qui n'apporte que <span style="color:blue">des améliorations mineures</span>. 

Et enfin LA grosse mise à jour. Celle où on met le paquet niveau com / marketing : la mise à jour vers la version MAJEURE. Dans cette mise à jour TOUT est possible; le pire également !

Cette mise à jour, contrairement aux autres ne fait pas que rajouter. Elle autorise à ENLEVER des éléments. Autrement dit, si la version 2.x.x vous permet d'imprimer, il se peut que la version 3.x.x supprime cette fonctionnalité.

