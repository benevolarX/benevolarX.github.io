const resize = (elem, w, h) => {
  const maxw = document.documentElement.clientWidth
  const maxh = document.documentElement.clientHeight
  const ratioH = maxh / h
  const widthH = ratioH * w
  let ratioW = 1.0
  if (widthH > maxw) {
    ratioW = maxw / widthH
  }
  const ratioTotal = ratioH * ratioW
  const nw = w * ratioTotal
  const nh = h * ratioTotal
  elem.style.minWidth = `${nw}px`
  elem.style.minHeight = `${nh}px`
  elem.style.maxWidth = `${nw}px`
  elem.style.maxHeight = `${nh}px`
  elem.style.padding = 0
  elem.style.margin = 0
}

const gererFullScreen = () => {
  const btn = document.getElementById('full-screen')
  let full = false;
  btn.onclick = () => {
    if (!full) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    full = !full
  }
}

const gererResize = () => {
  const main = document.getElementById('main')
  const c = document.querySelector('.combat')
  const f = e => {
    resize(main, 1248, 768)
    resize(c, 1248, 768)
  }
  window.addEventListener('resize', f, false)
  f()
}

class Game {
  constructor() {
    this.etat = 'wait_cible'
    this.numCible = -1
    this.numCompetence = -1
    this.runCanvas = null
    this.canvas = document.querySelector('canvas#animation')
    this.combat = document.querySelector('.combat')
    this.cibles = document.querySelectorAll('.cible')
    this.annuler = document.querySelector('.annuler-attaque')
    this.valider = document.querySelector('.valider-attaque')
    this.competences = document.querySelectorAll('input[type=radio][name=attaque]')
    this.panelCompetences = document.querySelector('.competences')
    this.init()
  }

  unSelectCible() {
    this.cibles.forEach(c => {
      c.classList.remove('select')
    })
  }

  selectCible(cible, n = -1) {
    if (this.etat === 'wait_cible' || this.etat === 'wait_competence') {
      if (n > 0) {
        this.numCible = n
        this.unSelectCible()
        cible.classList.add('select')
        this.panelCompetences.style.display = 'flex'
        this.etat = 'wait_competence'
      }
    }
  }

  unSelectCompetence() {
    this.competences.forEach(c => c.parentNode.classList.remove('atk-select'))
    this.numCompetence = -1
  }

  selectCompetence(comp) {
    if (this.etat === 'wait_competence') {
      if (comp.checked) {
        comp.parentNode.classList.add('atk-select')
        this.valider.disabled = false;
        this.numCompetence = comp.dataset.num
      }
    }
  }

  stopAnimaton() {
    this.annulerCompetence()
    this.toggleForAnim()
    window.cancelAnimationFrame(this.runCanvas)
  }

  toggleForAnim() {
    const ch = this.combat.children
    for (let i = 0; i < ch.length; i++) {
      const elem = ch[i]
      elem.classList.toggle('hidden')
    }
  }

  animate(self) {
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
    /*
    self.luffy.style.width = '70px'
    self.luffy.style.height = '70px'*/
    ctx.fillRect(500, 500, 100, 100)
    /*
    ctx.drawImage(
      self.luffy, 
      500, 
      500, 
      70, 
      70
    )*/
    ctx.fill()
    self.runCanvas = window.requestAnimationFrame(() => self.animate(self))
  }

  startAnimation(cible, atk) {
    this.toggleForAnim()
    this.canvas.style.minHeight = this.combat.style.minHeight
    this.canvas.style.maxHeight = this.combat.style.maxHeight
    this.canvas.style.minWidth = this.combat.style.minWidth
    this.canvas.style.maxWidth = this.combat.style.maxWidth
    this.canvas.style.height = this.combat.style.maxHeight
    this.canvas.style.width = this.combat.style.maxWidth
    this.canvas.height = this.combat.style.maxHeight
    this.canvas.width = this.combat.style.maxWidth
    const self = this
    console.log(this.canvas)
    this.runCanvas = window.requestAnimationFrame(() => self.animate(self))
  }

  validerCompetence() {
    const self = this
    if (this.etat === 'wait_competence') {
      if (this.numCible > 0 && this.numCompetence > 0) {
        this.etat = 'wait_animation'
        const atk = this.numCompetence
        const cible = this.numCible
        window.setTimeout(() => {
          self.stopAnimaton()
        }, 3000)
        self.startAnimation(cible, atk)
      }
    }
  }

  annulerCompetence() {
    if (this.etat === 'wait_competence' || this.etat === 'wait_animation') {
      this.unSelectCompetence()
      this.numCible = -1
      this.panelCompetences.style.display = 'none'
      this.competences.forEach(c => c.checked = false)
      this.valider.disabled = true
      this.unSelectCible()
      this.etat = 'wait_cible'
    }
  }

  init() {
    const self = this;
    self.luffy = document.querySelector("img.cible[data-target='3']")
    self.luffy.style.width = '70px'
    self.luffy.style.height = '70px'
    // selectionner une cible
    for (let i = 0; i < this.cibles.length; i++) {
      const cible = this.cibles[i]
      cible.addEventListener('click', e => {
        e.preventDefault()
        self.selectCible(cible, Number(cible.dataset.target))
      });
    }

    for (let i = 0; i < this.competences.length; i++) {
      const comp = this.competences[i]
      comp.addEventListener('change', e => {
        self.unSelectCompetence()
        self.selectCompetence(comp)
      })
    }

    this.annuler.addEventListener('click', e => {
      e.preventDefault()
      self.annulerCompetence()
    })

    this.valider.addEventListener('click', e => {
      e.preventDefault()
      self.validerCompetence()
    })
  }

  start() {

  }

  runCanvas() {

  }
}

const oprpgStart = e => {
  console.log('oprpg start')
  gererFullScreen()
  gererResize()
  const game = new Game()
  game.start()
}

document.addEventListener('readystatechange', () => {    
  if (window.attachEvent) {
    window.attachEvent('onload', oprpgStart)
  } else {
    if (window.addEventListener) {
      window.addEventListener('load', oprpgStart, false)
    } else {
      document.addEventListener('load', oprpgStart, false)
    }
  }
})
