import './styles.css'
import scrub from '../'

const logs = []
const logNode = document.getElementById('logs')
const statusNode = document.getElementById('status')
const rootNode = document.getElementById('app')
const mouseToggler = document.querySelector('#mouse-toggler')
const touchToggler = document.querySelector('#touch-toggler')
const block = document.querySelector('.scrub__head')

const mouseEvents = [
  'mouseenter',
  'mouseleave',
  'mouseup',
  'mousedown',
  'mousemove'
]

const touchEvents = ['touchstart', 'touchmove', 'touchend']

const pointerEvents = mouseEvents.map(e => e.replace('mouse', 'pointer'))

function logging(text) {
  const maxCount = 12
  logs.push(text)
  if (logs.length > maxCount) logs.shift()
}

function renderLog() {
  const html = logs.map(t => `<div>${t}</div>`).join('')
  return (logNode.innerHTML = html)
}

function app() {
  const allEvents = []; mouseEvents.concat(touchEvents).concat(pointerEvents)
  allEvents.forEach(event => {
    rootNode.addEventListener(event, () => {
      // add promise 'cause directly re-render will block checkbox triggering
      Promise.resolve(() => {
        const args = [event, event.pointerType].filter(Boolean)
        logging(args.join(' '))
        renderLog()
      })
    })
  })

  function start(e) {
    statusNode.innerText = 'Scrub Start'
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    block.style.left = `${clientX - 40}px`
  }

  function move(e) {
    statusNode.innerText = 'Scrub Move'
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    block.style.left = `${clientX - 40}px`
  }

  function end() {
    statusNode.innerText = 'Scrub End'
  }

  function observeScrubConfiguration({isMouseSupportEnabled, isTouchSupportEnabled}) {
    return scrub(
      block,
      {
        onStart: start,
        onMove: move,
        onEnd: end
      },
      {
        mouse: isMouseSupportEnabled,
        touch: isTouchSupportEnabled,
      }
    )
  }

  let releaseScrub = () => {}
  ;[mouseToggler, touchToggler].forEach(toggler => {
    toggler.addEventListener('change', () => {
      console.log('onchange', mouseToggler.value, mouseToggler.checked, touchToggler.checked)
      if (!mouseToggler.checked) mouseToggler.removeAttribute('checked')
      if (!touchToggler.checked) touchToggler.removeAttribute('checked')
      releaseScrub();
      releaseScrub = observeScrubConfiguration({
        isMouseSupportEnabled: mouseToggler.checked, 
        isTouchSupportEnabled: touchToggler.checked
      })
    })
  })

  releaseScrub = observeScrubConfiguration({
    isMouseSupportEnabled: mouseToggler.checked, 
    isTouchSupportEnabled: touchToggler.checked
  })
}

app()
