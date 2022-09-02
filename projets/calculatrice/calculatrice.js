const LETTRES = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '/', '*', '(', ')', '.'
]

export default class Calculatrice extends HTMLElement {
  constructor() {
    super()
    this.keydown = e => {
      e.preventDefault()
      if (e.key) {
        if (LETTRES.includes(e.key)) {
          this.ajouterLettre(e.key)
        }
        if (e.key === 'Enter') {
          this.calculerResultat()
        }
        if (e.key === 'Backspace') {
          this.eff()
        }
        if (e.key === 'Delete') {
          this.reset()
        }
      }
    }
    this.keydown = this.keydown.bind(this)

    console.log('create')
    this.calcul = ''
    let shadow = this.attachShadow({mode: 'open'});
    const bloc = document.createElement('div')
    bloc.classList.add('calculatrice')
    /**
     *  affichage 
     *  (  c  )  <
     *  7  8  9  x
     *  4  5  6  -
     *  1  2  3  +
     *  .  0  /  =
     */
    this.affichage = document.createElement('header')
    this.affichage.classList.add('affichage')
    const blocTouche = document.createElement('div')
    blocTouche.classList.add('gridforbtn')
    bloc.appendChild(this.affichage)
    bloc.appendChild(blocTouche)

    this.chiffres = []
    for (let i = 0; i <= 9; i++) {
      let chiffre = this.creerTouche(i, i)
      this.chiffres.push(chiffre)
    }

    this.gauche = this.creerTouche('(', '(')
    this.cancel = this.creerTouche('C')
    this.droite = this.creerTouche(')', ')')
    this.effacer = this.creerTouche('<=')
    blocTouche.appendChild(this.gauche)
    blocTouche.appendChild(this.cancel)
    blocTouche.appendChild(this.droite)
    blocTouche.appendChild(this.effacer)
    
    this.fois = this.creerTouche('x', '*')
    this.plus = this.creerTouche('+', '+')
    this.moins = this.creerTouche('-', '-')
    this.egal = this.creerTouche('=')
    this.virgule = this.creerTouche('.', '.')
    this.divise = this.creerTouche('/', '/')

    blocTouche.appendChild(this.chiffres[7])
    blocTouche.appendChild(this.chiffres[8])
    blocTouche.appendChild(this.chiffres[9])
    blocTouche.appendChild(this.fois)

    blocTouche.appendChild(this.chiffres[4])
    blocTouche.appendChild(this.chiffres[5])
    blocTouche.appendChild(this.chiffres[6])
    blocTouche.appendChild(this.moins)

    blocTouche.appendChild(this.chiffres[1])
    blocTouche.appendChild(this.chiffres[2])
    blocTouche.appendChild(this.chiffres[3])
    blocTouche.appendChild(this.plus)

    blocTouche.appendChild(this.virgule)
    blocTouche.appendChild(this.chiffres[0])
    blocTouche.appendChild(this.divise)
    blocTouche.appendChild(this.egal)

    const css = `<style>
    .calculatrice {
      background-color: lightblue;
      min-width: 200px;
      min-height: 300px;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .affichage {
      background-color: transparent;
      height: clamp(50px, 8rem, 150px);
      font-size: clamp(1rem, calc(1rem + 1vh + 1vw), 5rem);
    }

    .gridforbtn {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      width: 100%;
      height: 100%;
      text-align: center;
      gap: 0;
    }

    .btn-number {
      display: inline-block;
      width: clamp(50px, 8rem, 100px);
      height: clamp(50px, 8rem, 100px);
      background-color: #ccc;
      font-size: 2rem;
    }

    .btn-number:hover {
      background-color: #aaa;
    }
    </style>`

    shadow.innerHTML = css
    shadow.appendChild(bloc)
  }

  creerTouche(txt, symbol = null) {
    const btn = document.createElement('button')
    btn.classList.add('btn-number')
    btn.innerText = txt
    if (symbol !== null) {
      btn.dataset.symbol = `${symbol}`
    }
    return btn
  }

  eff() {
    this.calcul = this.calcul.slice(0, -1)
    this.render()
  }

  render() {
    this.affichage.innerHTML = `<br/><span>${this.calcul}</span>`
  }

  ajouterLettre(n) {
    if (LETTRES.includes(n)) {
      this.calcul = `${this.calcul}${n}`
      this.render()
    }
  }

  calculerResultat() {
    let resultat = 0
    try {
      resultat = eval(this.calcul)
    } catch {
      resultat = ''
    } finally {
      this.calcul = `${resultat}`
      this.render()
    }
  }

  reset() {
    this.calcul = ''
    this.render()
  }

  addClickEvent(btn, self) {
    btn.addEventListener('click', e => {
      e.preventDefault()
      if (btn.dataset.symbol) {
        self.ajouterLettre(btn.dataset.symbol)
      }
    })
  }

  connectedCallback() {
    console.log('connected')
    const self = this
    for (let i = 0; i < this.chiffres.length; i++) {
      self.addClickEvent(this.chiffres[i], self)
    }
    this.effacer.addEventListener('click', e => {
      e.preventDefault()
      self.eff()
    })
    self.addClickEvent(self.plus, self)
    self.addClickEvent(self.moins, self)
    self.addClickEvent(self.fois, self)
    self.addClickEvent(self.divise, self)
    self.addClickEvent(self.virgule, self)
    self.addClickEvent(self.droite, self)
    self.addClickEvent(self.gauche, self)
    self.egal.addEventListener('click', e => {
      e.preventDefault()
      self.calculerResultat()
    })
    self.cancel.addEventListener('click', e => {
      e.preventDefault()
      self.reset()
    })
    document.addEventListener('keydown', this.keydown)
  }

  disconnectedCallback() {
    console.log('disconnected')
    document.removeEventListener('keydown', this.keydown)
  }

}
