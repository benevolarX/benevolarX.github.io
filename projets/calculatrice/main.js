import Calculatrice from './calculatrice.js'

const calculatriceStart = () => {
  const main = document.getElementById('main')
  window.customElements.define('my-calculator', Calculatrice);
  window.customElements.whenDefined('my-calculator')
  .then(() => {
    const calculator = document.createElement('my-calculator')
    main.appendChild(calculator)
  })
}

document.addEventListener('readystatechange', () => {    
  if (window.attachEvent) {
    window.attachEvent('onload', calculatriceStart)
  } else {
    if (window.addEventListener) {
      window.addEventListener('load', calculatriceStart, false)
    } else {
      document.addEventListener('load', calculatriceStart, false)
    }
  }
})