function noop() {}

function scrub(
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

  const cancelEvent = isPointerSupported ? 'pointerleave' : 'touchcancel'

  const [startEvent, moveEvent, endEvent] = events
  let scrubbing = false

  function handleStart(e) {
    scrubbing = true
    if (isMouseEnabled && isMouseTypePointerEvent(e)) onStart(e)
    if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e)))
      onStart(e)
  }

  function handleMove(e) {
    if (scrubbing) {
      if (isMouseEnabled && isMouseTypePointerEvent(e)) onMove(e)
      if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e)))
        onMove(e)
    }
  }

  function handleEnd(e) {
    scrubbing = false
    if (isMouseEnabled && isMouseTypePointerEvent(e)) onEnd(e)
    if (isTouchEnabled && (isTouchTypePointerEvent(e) || isTouchEvent(e)))
      onEnd(e)
  }

  node.addEventListener(startEvent, handleStart)
  node.addEventListener(moveEvent, handleMove)
  node.addEventListener(endEvent, handleEnd)
  node.addEventListener(cancelEvent, handleEnd)

  if (!isPointerSupported && isMouseEnabled) {
    node.addEventListener('mousedown', handleStart)
    node.addEventListener('mousemove', handleMove)
    node.addEventListener('mouseup', handleEnd)
    node.addEventListener('mouseleave', handleEnd)
  }
}

export default scrub
