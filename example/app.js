import './styles.css'
import scrub from '../'

const logs = []
const logNode = document.getElementById('logs')
const statusNode = document.getElementById('status')
const rootNode = document.getElementById('app')
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
  window.addEventListener('touchmove', e => e.preventDefault())

  const allEvents = mouseEvents.concat(touchEvents).concat(pointerEvents)
  allEvents.forEach(event => {
    rootNode.addEventListener(event, () => {
      const args = [event, event.pointerType].filter(Boolean)
      logging(args.join(' '))
      renderLog()
    })
  })

  function start(e) {
    statusNode.innerText = window.PointerEvent ? 'PointerStart' : 'Start'
    const clientX = e.touches ? e.touches[0].clientX : e.clientX

    block.style.left = `${clientX - 40}px`
  }

  function move(e) {
    statusNode.innerText = window.PointerEvent ? 'PointerMove' : 'Move'
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    block.style.left = `${clientX - 40}px`
  }

  function end() {
    statusNode.innerText = window.PointerEvent ? 'PointerEnd' : 'End'
  }

  scrub(
    block,
    {
      onStart: start,
      onMove: move,
      onEnd: end
    },
    {
      mouse: true,
      touch: true
    }
  )
}

app()
