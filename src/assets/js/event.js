export const on = function (target, event, handler, passive = false) {
    target.addEventListener(
        event,
        handler,
        { capture: false, passive }
    )
}

export const off = function (target, event, handler) {
    target.removeEventListener(event, handler)
}

export const stopPropagation = function (event) {
    event.stopPropagation()
}

export const preventDefault = function (event, isStopPropagation) {
    event.preventDefault()

    if (isStopPropagation) {
        stopPropagation(event)
    }
}
