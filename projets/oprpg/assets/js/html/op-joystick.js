const SIZE_BACK = 150
const SIZE_FRONT = 90
const MAX_MOVE = 25
const COLOR = '#0000A2'
const COLOR_HOVER = '#B2B2FF'

class OpJoystick extends window.HTMLElement {
  constructor () {
    super()
    this.SIZE_BACK = (this.hasAttribute('size-block')) ? parseInt(this.getAttribute('size-block')) : SIZE_BACK
    this.SIZE_FRONT = (this.hasAttribute('size-stick')) ? parseInt(this.getAttribute('size-stick')) : SIZE_FRONT
    this.color_stick = (this.hasAttribute('color-stick')) ? this.getAttribute('color-stick') : COLOR
    this.colorHover = (this.hasAttribute('color-stick-hover')) ? this.getAttribute('color-stick-hover') : COLOR_HOVER
    this.survol = false
    this.canvas = null
    this.pressed = false
    this.old_clic_x = this.clic_x = 0
    this.old_clic_y = this.clic_y = 0
    this.need_render = true
    this.onMove = this.onMove.bind(this)
    this.onDown = this.onDown.bind(this)
    this.onUp = this.onUp.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.identifier = null
    if (this.isTouchDevice) {
      this.touchStart = this.touchStart.bind(this)
      this.touchEnd = this.touchEnd.bind(this)
      this.touchMove = this.touchMove.bind(this)
    }
  }

  dst (x, y, dx, dy) {
    return Math.sqrt(((dx - x) ** 2) + ((dy - y) ** 2))
  }

  // virtual
  onUp (e) {
    this.old_clic_x = this.clic_x = 0
    this.old_clic_y = this.clic_y = 0
    this.pressed = false
    this.need_render = true
    this.renderCanvas()
  }

  onDown (e) {
    if (!this.pressed) {
      const cx = e.pageX
      const cy = e.pageY
      const d = this.dst(cx, cy, this.centerX, this.centerY)
      if (d <= this.SIZE_FRONT / 2) {
        this.old_clic_x = this.clic_x = cx
        this.old_clic_y = this.clic_y = cy
        this.pressed = true
        this.identifier = e.identifier
      }
    }
  }

  onMove (e) {
    const cx = e.pageX
    const cy = e.pageY
    const dx = cx - this.centerX
    const dy = cy - this.centerY
    this.hover = Math.sqrt(dx ** 2 + dy ** 2) < (this.SIZE_FRONT / 2)
    if (this.pressed) {
      this.clic_x = cx
      this.clic_y = cy
      this.need_render = true
    }
    this.renderCanvas()
  }

  // pad
  touchStart (e) {
    this.onDown(e.changedTouches[0])
  }

  touchEnd (e) {
    if (this.identifier === e.changedTouches[0].identifier) {
      this.onUp(e.changedTouches[0])
    }
  }

  touchMove (e) {
    if (this.identifier === e.changedTouches[0].identifier) {
      this.onMove(e.changedTouches[0])
    }
  }

  // mouse
  mouseDown (e) {
    return this.onDown(e)
  }

  mouseUp (e) {
    return this.onUp(e)
  }

  mouseMove (e) {
    return this.onMove(e)
  }

  renderCanvas () {
    if (this.need_render) {
      const ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      let cx = this.canvas.width / 2
      let cy = this.canvas.height / 2
      let r = Math.min(cx, cy) * 0.9
      ctx.beginPath()
      ctx.strokeStyle = this.color_stick
      ctx.lineWidth = 2
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true)
      ctx.stroke()
      r *= 0.6
      const dd = Math.sqrt(this.deltaX ** 2 + this.deltaY ** 2)
      let ax = this.deltaX
      let ay = this.deltaY
      if (dd > MAX_MOVE) {
        ax *= MAX_MOVE / dd
        ay *= MAX_MOVE / dd
      }
      cx += ax
      cy += ay
      ctx.beginPath()
      ctx.strokeStyle = this.hover ? this.colorHover : this.color_stick
      ctx.lineWidth = 6
      ctx.arc(cx, cy, r, 0, Math.PI * 2, true)
      ctx.stroke()
    }
    this.need_render = false
  }

  buildCanvas () {
    const canvas = document.createElement('canvas')
    canvas.width = this.SIZE_BACK
    canvas.height = this.SIZE_BACK
    canvas.style.position = 'absolute'
    canvas.style.zIndex = 255
    canvas.style.background = 'rgba(0, 0, 0, 0.0)'
    return canvas
  }

  // html element
  connectedCallback () {
    this.attachEvents()
  }

  attachEvents () {
    if (this.canvas === null) {
      this.canvas = this.buildCanvas()
    }
    this.canvas.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
    if (this.isTouchDevice) {
      this.canvas.addEventListener('touchstart', this.touchStart)
      document.addEventListener('touchend', this.touchEnd)
      document.addEventListener('touchcancel', this.touchEnd)
      document.addEventListener('touchmove', this.touchMove)
    }
    this.appendChild(this.canvas)
    this.renderCanvas()
  }

  disconnectedCallback () {
    if (this.isTouchDevice) {
      this.canvas.removeEventListener('touchstart', this.touchStart)
      document.removeEventListener('touchend', this.touchEnd)
      document.removeEventListener('touchcancel', this.touchEnd)
      document.removeEventListener('touchmove', this.touchMove)
    }
    this.canvas.removeEventListener('mousedown', this.mouseDown)
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
    this.removeChild(this.canvas)
  }

  get stickColor () {
    return this.color_stick
  }

  set stickColor (val) {
    if (val !== this.color_stick) {
      this.need_render = true
      this.color_stick = val
    }
  }

  get colorHover () {
    return this.color_stick_hover
  }

  set colorHover (val) {
    if (val !== this.color_stick) {
      this.need_render = true
      this.color_stick_hover = val
    }
  }

  get hover () {
    return this.pressed || this.survol
  }

  /**
   * @param {boolean} val
   */
  set hover (val) {
    if (this.survol !== val) {
      this.need_render = true
      this.survol = val
    }
  }

  get isTouchDevice () {
    return 'ontouchstart' in window
  }

  get centerX () {
    return this.canvas.getBoundingClientRect().x + this.canvas.width / 2
  }

  get centerY () {
    return this.canvas.getBoundingClientRect().y + this.canvas.height / 2
  }

  get deltaX () {
    return this.clic_x - this.old_clic_x
  }

  get deltaY () {
    return this.clic_y - this.old_clic_y
  }

  get isUp () {
    if (this.pressed === false) return false
    const dy = this.deltaY
    if (dy >= 0) return false
    const dx = this.deltaX
    return !(Math.abs(dx) > 2 * Math.abs(dy))
  }

  get isDown () {
    if (this.pressed === false) return false
    const dy = this.deltaY
    if (dy <= 0) return false
    const dx = this.deltaX
    return !(Math.abs(dx) > 2 * Math.abs(dy))
  }

  get isLeft () {
    if (this.pressed === false) return false
    const dx = this.deltaX
    if (dx >= 0) return false
    const dy = this.deltaY
    return !(Math.abs(dy) > 2 * Math.abs(dx))
  }

  get isRight () {
    if (this.pressed === false) return false
    const dx = this.deltaX
    if (dx <= 0) return false
    const dy = this.deltaY
    return !(Math.abs(dy) > 2 * Math.abs(dx))
  }
}

window.customElements.define('op-joystick', OpJoystick)
