class Lien {
    constructor(titre, url) {
        this.titre = titre;
        this.url = url;
    }
    toString() {
        return `<a href="${this.url}">${this.titre}</a>`;
    }
}

class Categorie {
    constructor(liens = []) {
        this.liens = liens;
    }

    toString() {
        return `<ul class="sous"> ${ this.liens.map(lien => `<li>${lien.toString()}</li>`).join('') } </ul>`;
    }
}

class MenuDeroulant
{
    constructor() {
        this.categories = [];
    }

    add(titre, categorie) {
        this.categories.push({ titre, categorie });
    }

    toString() {
        return `<nav><ul>${this.categories.map(c => `<li class="deroulant">${c.titre.toString() + c.categorie.toString()}</li>`).join('')}</ul></nav>`;
    }
}

window.onload = () => {

    const body = document.body;
    let menu_haut = document.createElement('header');
    menu_haut.classList.add('menu-fixe', 'txt-center');

    let md = new MenuDeroulant();
    md.add(new Lien('projets', '#'), new Categorie([
        new Lien('wikipedia', './projets/wikipedia/index.html'),
        new Lien('uno', './projets/uno/index.html')
    ]));
    md.add(new Lien('projets', '#'), new Categorie([
        new Lien('wikipedia', './projets/wikipedia/index.html'),
        new Lien('uno', './projets/uno/index.html')
    ]));
    menu_haut.innerHTML = md.toString();

    body.appendChild(menu_haut);

    let main = document.createElement('main');
    main.classList.add('full', 'demo', 'bg-blue');
    body.appendChild(main);

    const firework = new Firework({
        opacity: 0.9,
        width: 1400,
        height: 800,
        speed: 100,
        max_rocket: 100,
        max_luminosite: 10
    });
    if (main !== null) {
        firework.attach(main);
        firework.start();
    }
}
