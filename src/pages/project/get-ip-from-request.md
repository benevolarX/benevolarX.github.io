---
layout: ../../layouts/project.astro
title: get-ip-from-request
client: Self
publishDate: 2020-09-09 00:00:00
img: https://images.unsplash.com/photo-1548391350-1a529f6ea42d?fit=crop&w=1400&h=700&q=75
description: |
  Framework css personnel sans js
tags:
  - ip
  - back
  - unit-test
  - npm
---

Alors là, on attaque un gros morceau. 
Ne vous fiez pas au [repo github](https://github.com/benevolarX/get-ip-from-request), le projet a bel et bien été publié en 2020. 
A la base, je travaillais sur un projet back et je souhaitais récupérer l'ip de l'utilisateur ainsi que le numéro de version de son navigateur (User Agent) afin d'avoir une emprunt numérique assez fiable pour l'identifier sans que celui ci n'ai besoin de créer un compte utilisateur. 
Rapidement, je suis tombé sur [request-ip](https://www.npmjs.com/package/request-ip).

En regardant le code (en version 2.1.3 à l'époque) j'ai trouvé un truc que j'ai trouvé dommage : une dépendance à is_js en n'important que la fonction permettant de tester l'ip via une expression régulière.
Parallèlement, je suis aussi tombé sur is-ip qui m'a ensuite redirigé sur [ip-regex](https://www.npmjs.com/package/ip-regex). 
C'est l'un des gros points noirs de node js et ces paquets npm. 
Souvent les gens téléchargent une dépendance juste pour une fonction populaire au lieu de la créer eux même et si la dépendance part à l'abbandon et bien temps pi pour vous.

En m'inspirant de ceux deux là, j'ai créé ma propre lib get-ip-from-request (le nom est un peut long je sais) afin de réaliser la même tâche que request-ip MAIS avec une regex personnelle inspirée de ip-regex. 
Après quelques tests (unitaires repris d'autres libs de test d'ip) j'ai pu me rendre compte que ma version 0-dependancy était plus rapide (jusqu'à 40% plus rapide pour l'ip v4-v6 par rapport à is_js qui était utilisé par request-ip)
J'étais tout fier au moment où j'ai publié mes résultats surtout que j'avais un ryzen 3 1300x donc un processeur 4 coeurs; très loin de pouvoir rivaliser avec les processeurs de serveur web.

J'ai maintenu la lib à jour, fait d'autres tests (1 par an) puis il y a 2 mois, la version 3.1.0 de request-ip est apparue. 
Et quelle mise à jour ! La librairie était devenue 0-dependancy !
Sans m'en rendre compte, je venais de proposer pas moins de 2 ans AVANT la 3.1.0 une amélioration d'une librairy téléchargée plus de 500 000 fois par semaine !
VISIONNAIRE !

Bon. En théorie, j'aurai pu me contenter d'un simple pull request sur le projet principal mais à la base, j'ignorais la pertinance de mon idée.
C'était surtout un caprice de ma part de voir du code moche avec des micros dépendances de partout qui m'a motivé.

Aujourd'hui il s'agit de mon projet le plus téléchargé (+4500 téléchargement au total) :p
