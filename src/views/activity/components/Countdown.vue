<template>
    <div class="countdown-wrapper">
        <slot :time="parsedTime">
            {{ formattedTime }}
        </slot>
    </div>
</template>

<script>
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const parseTime = time => {
    const days = Math.floor(time / DAY)
    const hours = Math.floor((time % DAY) / HOUR)
    const minutes = Math.floor((time % HOUR) / MINUTE)
    const seconds = Math.floor((time % MINUTE) / SECOND)

    return {
        days,
        hours,
        minutes,
        seconds
    }
}

const parseFormat = (format, parsedTime) => {
    const { days } = parsedTime
    let { hours, minutes, seconds } = parsedTime

    if (~format.indexOf('DD')) {
        format = format.replace('DD', String(days).padStart(2, '0'))
    } else {
        hours += days * 24
    }

    if (~format.indexOf('HH')) {
        format = format.replace('HH', String(hours).padStart(2, '0'))
    } else {
        minutes += hours * 60
    }

    if (~format.indexOf('mm')) {
        format = format.replace('mm', String(minutes).padStart(2, '0'))
    } else {
        seconds += minutes * 60
    }

    if (~format.indexOf('ss')) {
        format = format.replace('ss', String(seconds).padStart(2, '0'))
    }

    return format
}

class Raf {
    constructor (root = window) {
        Object.assign(this, {
            root,
            prev: Date.now(),
            setHandler: root.requestAnimationFrame || this.fallback,
            clearHandler: root.cancelAnimationFrame || root.clearTimeout
        })
    }

    fallback (callback) {
        let { prev } = this
        const curr = Date.now()
        const ms = Math.max(0, 16 - (curr - prev))
        const id = setTimeout(callback, ms)
        prev = curr + ms
        return id
    }

    set (fn) {
        return this.setHandler.call(this.root, fn)
    }

    clear (id) {
        this.clearHandler.call(this.root, id)
    }
}

export default {
    name: 'Countdown',
    props: {
    // 倒计时时长
        duration: {
            type: [Number, String],
            default: 0
        },
        format: {
            type: String,
            default: 'HH:mm:ss'
        },
        autoStart: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            endTime: 0,
            remain: 0,
            raf: null,
            rafId: null,
            isCounting: false,
            isKeepAlivePaused: false
        }
    },
    computed: {
        parsedTime () {
            return parseTime(this.remain)
        },
        formattedTime () {
            return parseFormat(this.format, this.parsedTime)
        }
    },
    watch: {
        duration: {
            immediate: true,
            handler: 'reset'
        }
    },
    created () {},
    activated () {
        if (this.isKeepAlivePaused) {
            this.isCounting = true
            this.isKeepAlivePaused = false
            this.tick()
        }
    },
    deactivated () {
        if (this.isCounting) {
            this.pause()
            this.isKeepAlivePaused = true
        }
    },
    beforeDestroy () {
        this.pause()
    },
    methods: {
        getRemain () {
            return Math.max(this.endTime - Date.now(), 0)
        },
        updateRemain (remain) {
            this.remain = remain
            this.$emit('change', this.parsedTime)
        },
        tick () {
            this.rafId = this.raf.set(() => {
                if (!this.isCounting) {
                    return
                }

                const remain = this.getRemain()
                this.updateRemain(remain)

                if (this.remain > 0) {
                    this.tick()
                } else {
                    this.pause()
                    this.$emit('finish')
                }
            })
        },
        start () {
            if (this.isCounting) {
                return
            }

            this.isCounting = true
            this.endTime = Date.now() + this.remain
            this.tick()
        },
        pause () {
            this.isCounting = false
            if (this.raf) {
                this.raf.clear(this.rafId)
            }
        },
        reset (duration) {
            if (!duration) {
                return false
            }
            if (!this.raf) {
                this.raf = new Raf()
            }
            this.pause()
            this.remain = +this.duration

            if (this.autoStart) {
                this.start()
            }
        }
    }
}
</script>

<style lang="scss">
.countdown-wrapper {
    display: inline-flex;
    align-items: center;
}

</style>
