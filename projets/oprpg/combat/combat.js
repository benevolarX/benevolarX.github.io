class Competence {
  constructor(nom, ratio, niveau, temps, debut, critique, esquive) {
    this.nom = nom
    this.ratio_base = ratio
    this.niveau = niveau
    this.temps_recuperation = temps
    this.recuperation = debut
    this.critique = critique
    this.esquive = esquive
  }

  get Nom() {
    return this.nom
  }

  get Ratio() {
    return this.ratio_base
  }

  get Niveau() {
    return this.niveau
  }

  get TempsRecuperationMax() {
    return this.temps_recuperation
  }

  get Recuperation() {
    return this.recuperation
  }

  get Critique() {
    return this.critique
  }

  get Esquive() {
    return this.esquive
  }

  get IsActivable() {
    return this.Recuperation <= 0
  }
}

class Panel {
  constructor(player) {
    this.player = player
  }
}

class Combattant {
  static ID = 0
  constructor(nom, niveau) {
    this.id = Combattant.ID++
    this.nom = nom
    this.niveau = niveau
    this.vie = this.VieMax
    this.critique = 5
    this.esquive = 10
    this.competences = []
    this.url = ''
  }

  addCompetence(c) {
    this.competences.push(c)
  }

  get Atk() { 
    return this.affine(-0.1, 30, 500)
  }

  get Def() {
    return this.affine(0, 10, 500)
  }

  get Critique() {
    return this.critique
  }

  get Esquive() {
    return this.esquive
  }

  get Vie() {
    return this.vie
  }

  get VieMax() {
    return this.affine(0.25, 75, 2000)
  }

  affine(a, b, c) {
    const x = this.niveau
    const x2 = x ** 2
    return Math.trunc(a * x2 + b * x + c)
  }
}

class Camp {
  constructor() {
    this.combattants = []
  }

  addCombattant(c) {
    this.combattants.push(c)
  }

  draw(x, y, w, h, ctx, imgs) {
    for (let i = 0; i < this.combattants.length; i++) {
      const cible = this.combattants[i]
      const img = imgs[cible.url]
      if (img !== false) {
        ctx.drawImage(img, w / 2, y, 96, 96)
      }
      
    }
  }

  get Alive() {
    return this.combattants.length > 0
  }

  toHTML(imgs, game) {
    const div = document.createElement('div')
    div.classList.add('bloc')
    for (let i = 0; i < this.combattants.length; i++) {
      const joueur = this.combattants[i]
      const p = document.createElement('p')
      const img = document.createElement('img')
      img.src = imgs[joueur.url]
      img.onload = () => {
        lien.appendChild(img)
      }
      const lien = document.createElement('a')
      lien.classList.add('clic')
      lien.addEventListener('click', e => {
        e.preventDefault()
        console.log(joueur)
        game.selectEnnemi(joueur)
      })
      p.appendChild(lien)
      const barre_vie = document.createElement('progress')
      barre_vie.max = joueur.VieMax
      barre_vie.value = joueur.Vie
      p.appendChild(document.createElement('br'))
      p.appendChild(document.createTextNode(`${joueur.Vie} / ${joueur.VieMax}`))
      p.appendChild(document.createElement('br'))
      p.appendChild(barre_vie)
      div.appendChild(p)
    }
    return div
  }
}

class Game {
  constructor(main) {
    this.main = main
    this.images = []
    this.run_canvas = null
    this.ctx = null
    this.last = null
    this.moi = null
    this.allies = new Camp()
    this.ennemis = new Camp()
    this.panelADV = null
    this.panelATK = null
    this.panelMOI = null
  }

  init() {
    const images = {
        moi: '../assets/img/test/luffy.png',
        adversaire: '../assets/img/test/pipo.png',
        lieu: '../assets/img/test/baratie.webp'
    }
    const self = this
    Object.entries(images).map(tab => {
        const key = tab[0]
        const url = tab[1]
        self.addImg(url, key)
    })
    this.canvas = document.createElement('canvas')
    this.canvas.width = '1248'
    this.canvas.height = '768'
    this.canvas.classList.add('page')
    this.canvas.style.width = '1248px'
    this.canvas.style.height = '768px'
    this.main.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    this.panel = document.createElement('div')
    this.panel.classList.add('panel')
    this.main.appendChild(this.panel)

    const atk_faible = new Competence("pichenette", 10, 4, 1, 0, -30, 10)
    const atk_moyenne = new Competence("coup de poing", 15, 2, 2, 0, -20, 5)
    const atk_forte = new Competence("coup de pied", 20, 3, 3, 1, 10, 0)
    const ultra = new Competence("enchaînement mortel", 25, 5, 7, 5, 15, -25)
    const contre = new Competence("contre-attaque", 15, 1, 6, 3, -20, 45)

    this.moi = new Combattant('luffy', 80)
    this.moi.url = 'moi'
    this.moi.addCompetence(atk_faible)
    this.moi.addCompetence(atk_moyenne)
    this.moi.addCompetence(atk_forte)
    this.moi.addCompetence(ultra)
    this.moi.addCompetence(contre)
    this.allies.addCombattant(this.moi)
    
    const adversaire = new Combattant('ussop', 75)
    adversaire.url = 'adversaire'
    adversaire.addCompetence(atk_faible)
    adversaire.addCompetence(atk_moyenne)
    adversaire.addCompetence(atk_forte)
    this.ennemis.addCombattant(adversaire)

    this.panelADV = this.ennemis.toHTML(images, this)
    this.panel.appendChild(this.panelADV)

    const bloc = document.createElement('div')
    bloc.classList.add('bloc')
    this.panelATK = bloc
    this.panel.appendChild(this.panelATK)

    this.panelMOI = this.allies.toHTML(images, this)
    this.panel.appendChild(this.panelMOI)
  }

  selectEnnemi(combattant) {
    this.generateBlocATK()
  }

  generateBlocATK() {
    this.panelATK.innerHTML = ''
    this.moi.competences.forEach(comp => {
      const div = document.createElement('div')
      div.classList.add('competence')
      const title = document.createElement('h2')
      title.innerText = comp.Nom
      const p = document.createElement('p')
      p.innerHTML = `ratio : ${comp.Ratio} <br/>
      niveau : ${comp.Niveau} <br/>
      critique : ${comp.Critique} % <br/>
      esquive: ${comp.Esquive} % <br/><br/>
      récupération : ${comp.Recuperation} / ${comp.TempsRecuperationMax}<br/>`
      const btn = document.createElement('button')
      btn.innerHTML = `attaquer`
      btn.classList.add('btn-comp')
      btn.disabled = !comp.IsActivable
      div.appendChild(title)
      div.appendChild(p)
      div.appendChild(btn)
      this.panelATK.appendChild(div)
    })
  }

  start(self = null) {
    if (self === null) {
      self = this
    }
    this.last = Date.now()
    if (self.images.filter(img => img === false).length === 0) {
      self.run_canvas = window.requestAnimationFrame(() => self.run(self))
    } else {
      self.run_canvas = window.requestAnimationFrame(() => self.start(self))
    }
  }

  run(self = null) {
    const ctx = self.ctx
    ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
    const current = Date.now()
    const temps = (current - self.last)
    const ellapse = temps / 1000
    const lieu = self.images['lieu']
    if (lieu !== false) {
      ctx.drawImage(lieu, 0, 0, 1248, 768)
    }
    this.allies.draw(600, 768 - 192, 1248, 384, ctx, self.images)
    this.ennemis.draw(600, 196, 1248, 384, ctx, self.images)
    ctx.fill()
    self.last = current
    self.run_canvas = window.requestAnimationFrame(() => self.run(self))
  }

  async loadImg(url) {
      return new Promise((resolve, reject) => {
          const img = document.createElement('img')
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = url
      })
  }

  async addImg(url, key) {
      this.images[key] = false
      const self = this
      return this.loadImg(url).then(img => {
          self.images[key] = img
          return img
      })
  }

}