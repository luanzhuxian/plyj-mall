export function on (
  target,
  event,
  handler,
  passive = false
) {
  target.addEventListener(
    event,
    handler,
    { capture: false, passive }
  )
}

export function off (target, event, handler) {
  target.removeEventListener(event, handler)
}

export function stopPropagation (event) {
  event.stopPropagation()
}

export function preventDefault (event, isStopPropagation) {
  event.preventDefault()

  if (isStopPropagation) {
    stopPropagation(event)
  }
}
