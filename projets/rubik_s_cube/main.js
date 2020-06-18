"use strict";

class RubiksCube extends HTMLElement {

    constructor() {
        super();
        this.classList.add('rubik');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let div = document.createElement('div');
                if (i === 0) {
                    div.classList.add('c-haut');
                }
                if (i === 2) {
                    div.classList.add('c-bas');
                }
                if (j === 0) {
                    div.classList.add('c-gauche');
                }
                if (j === 2) {
                    div.classList.add('c-droite');
                }
                if (i === 1 && j === 1) {
                    div.classList.add('c-mid');
                }
                if ((i === 1 || j === 1) && i !== j) {
                    div.classList.add('c-arete');
                }

                if (i !== 1 && j !== 1) {
                    div.classList.add('c-coin');
                }
                div.classList.add('c-face');
                this.appendChild(div);
            }
        }
    }

}

window.customElements.define('rubiks-cube', RubiksCube);

window.onload = () => {
    let mc = new RubiksCube();
    let main = document.querySelector('main');
    main.appendChild(mc);
}

function special() {
    let select = document.querySelectorAll('.c-coin.c-haut.c-gauche');
    select.forEach(elem => {
        console.log(elem.style);
        elem.style.setProperty('transition-duration', '0ms');
        elem.style.setProperty('--to', 'top left');
        elem.style.setProperty('transition-duration', '1s');
        elem.style.setProperty('--rz', '90deg');
    });
}

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
