function noop() {}

function fscrub(
  node,
  handlers = {},
  options
) {
  const { onStart = noop, onMove = noop, onEnd = noop } = handlers
  options = Object.assign({ mouse: false, touch: true }, options)
  const { mouse, touch } = options
  const isMouseEnabled = Boolean(mouse)
  const isTouchEnabled = Boolean(touch)
  const isMouseTypePointerEvent = e => e.pointerType === 'mouse'
  const isTouchTypePointerEvent = e => e.pointerType === 'touch'
  const isTouchEvent = e => Boolean(TouchEvent && e instanceof TouchEvent)

  const isPointerSupported = Boolean(window.PointerEvent)
  const events = isPointerSupported
    ? ['pointerdown', 'pointermove', 'pointerup']
    : ['touchstart', 'touchmove', 'touchend']

  const cancelEvent = isPointerSupported ? 'pointercancel' : 'touchcancel'

  const [startEvent, moveEvent, endEvent] = events
  let scrubbing = false

  function handleStart(e) {
    scrubbing = true
    if (isMouseEnabled && isMouseTypePointerEvent(e)) onStart(e)
    if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e))) onStart(e)
  }

  function handleMove(e) {
    if (scrubbing) {
      if (isMouseEnabled && isMouseTypePointerEvent(e)) onMove(e)
      if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e))) onMove(e)
    }
  }

  function handleEnd(e) {
    scrubbing = false
    if (isMouseEnabled && isMouseTypePointerEvent(e)) onEnd(e)
    if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e))) onEnd(e)
  }

  node.addEventListener(startEvent, handleStart)
  node.addEventListener(moveEvent, handleMove)
  document.addEventListener(endEvent, handleEnd)

  node.addEventListener(cancelEvent, handleEnd)

  if (!isPointerSupported && isMouseEnabled) {
    node.addEventListener('mousedown', handleStart)
    node.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
  }

  return function release() {
    node.removeEventListener(startEvent, handleStart)
    node.removeEventListener(moveEvent, handleStart)
    document.removeEventListener(endEvent, handleStart)

    if (!isPointerSupported && isMouseEnabled) {
      node.removeEventListener('mousedown', handleStart)
      node.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
    }

    node.removeEventListener(cancelEvent, handleEnd)
  }
}

export default fscrub
