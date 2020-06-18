const COULEURS = ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'blanc', 'noir'];
const AVANT = 0;
const ARRIERE = 1;
const DROITE = 2;
const GAUCHE = 3;
const HAUT = 4;
const BAS = 5;

class MiniCube {
    constructor(i, j, k) {
        this.faces = [0, 1, 2, 3, 4, 5];
        this.i = i; // droite / gauche
        this.j = j; // haut / bas
        this.k = k; // avant / arriere 
    }

    toString() {
        return `<div class="face avant ${COULEURS[this.faces[AVANT]]}"></div>
        <div class="face arriere ${COULEURS[this.faces[ARRIERE]]}"></div>
        <div class="face droite ${COULEURS[this.faces[DROITE]]}"></div>
        <div class="face gauche ${COULEURS[this.faces[GAUCHE]]}"></div>
        <div class="face haut ${COULEURS[this.faces[HAUT]]}"></div>
        <div class="face bas ${COULEURS[this.faces[BAS]]}"></div>`;
    }
}

class GrosCube {
    constructor() {
        this.mini_cubes = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    const cube = new MiniCube(i, j, k);
                    this.mini_cubes.push(cube);
                    console.log(cube.toString());
                }
            }
        }
    }
}

class RubiksCube extends HTMLElement {
    constructor() {
        super();
        this.cubes = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let cube = { avant: '', arriere: '', droite: '', gauche: '', haut: '', bas: '', i, j , k };
                    this.cubes.push(cube);
                }
            }
        }
    }
    connectedCallback() {

        return "<div>ok</div>";
    }
}

window.customElements.define('rubiks-cube', RubiksCube);

function tourner(x, y) {
    const styles = getComputedStyle(document.documentElement);
    const rx = styles.getPropertyValue('--rx');
    const ry = styles.getPropertyValue('--ry');
    const val_rx = parseInt(rx.replace('deg', ''));
    const n_val_rx = (val_rx + x);
    document.documentElement.style.setProperty('--rx', `${n_val_rx}deg`);
    const val_ry = parseInt(ry.replace('deg', ''));
    const n_val_ry = (val_ry + y);
    document.documentElement.style.setProperty('--ry', `${n_val_ry}deg`);
}

function tourner_face(f, h) {
    // h = horaire / antihoraire

}

function current_face() {
    const styles = getComputedStyle(document.documentElement);
    const rx = ((parseInt(styles.getPropertyValue('--rx').replace('deg', '')) % 360) + 360) % 360;
    const ry = ((parseInt(styles.getPropertyValue('--ry').replace('deg', '')) % 360) + 360) % 360;
    console.log(`rx : ${rx} / ry : ${ry}`);
    let premier = (t) => (t >= 0 && t <= 45) || (t >= 315 && t <= 360);
    let second = (t) => (t >= 45 && t <= 135);
    let troisieme = (t) => (t >= 135 && t <= 225);
    let quatrieme = (t) => (t >= 225 && t <= 315);
    let avant = premier(rx) && premier(ry);

    // ry : avant / droite / arriere / gauche
    // haut / 

    // 0-45 315-360 => avant / centre : 0
    // 45-135 => centre : 90
    // 135-225 => centre : 180
    // 225-315 => centre : 270
}

function avant() {
    document.documentElement.style.setProperty('--rx', `0deg`);
    document.documentElement.style.setProperty('--ry', `0deg`);
    tourner(-20, -20);
}

function arriere() {
    document.documentElement.style.setProperty('--rx', `180deg`);
    document.documentElement.style.setProperty('--ry', `0deg`);
    tourner(-20, -20);
}

function bas() {
    document.documentElement.style.setProperty('--rx', `90deg`);
    document.documentElement.style.setProperty('--ry', `0deg`);
    tourner(-20, -20);
}

function haut() {
    document.documentElement.style.setProperty('--rx', `-90deg`);
    document.documentElement.style.setProperty('--ry', `0deg`);
    tourner(-20, -20);
}

function gauche() {
    document.documentElement.style.setProperty('--rx', `0deg`);
    document.documentElement.style.setProperty('--ry', `90deg`);
    tourner(-20, -20);
}

function droite() {
    document.documentElement.style.setProperty('--rx', `0deg`);
    document.documentElement.style.setProperty('--ry', `-90deg`);
    tourner(-20, -20);
}

window.onload = () => {
    new GrosCube();
    let faces = document.querySelectorAll('.face');
    const colo = ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'blanc'];
    faces.forEach(face => {
        for (let i = 0; i < 9; i++) {
            let c = document.createElement('div');
            const n = parseInt(Math.random() * 6);
            c.classList.add('couleur', colo[n]);
            face.appendChild(c);
        }
    });
}