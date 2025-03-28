/** 返回值为下次位移到的坐标，而不是下次要位移的距离
 * t: current time（当前时间） 0
 * b: beginning value（初始值） 0
 * c: change in value（变化量） 100
 * d: duration（持续时间） 10 (这其实是帧数)
 */
// 线性匀速运动效果
export const Linear = function (t, b, c, d) {
    return c * t / d + b
}

// 二次方的缓动
export const Quad = {
    easeIn (t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOut (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b
        return -c / 2 * ((--t) * (t - 2) - 1) + b
    }
}

// 三次方的缓动
export const Cubic = {
    easeIn (t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOut (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
        return c / 2 * ((t -= 2) * t * t + 2) + b
    }
}

// 四次方的缓动
export const Quart = {
    easeIn (t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOut (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    }
}

// 五次方的缓动
export const Quint = {
    easeIn (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOut (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    }
}

// 正弦曲线的缓动（sin(t))
export const Sine = {
    easeIn (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOut (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOut (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    }
}

// 指数曲线的缓动（2^t）
export const Expo = {
    easeIn (t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOut (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOut (t, b, c, d) {
        if (t === 0) return b
        if (t === d) return b + c
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    }
}

// 圆形曲线的缓动（sqrt(1-t^2)）
export const Circ = {
    easeIn (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOut (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }
}

// 指数衰减的正弦曲线缓动
export const Elastic = {
    easeIn (t, b, c, d, a, p) {
        let s
        if (t === 0) return b
        if ((t /= d) === 1) return b + c
        if (typeof p === 'undefined') p = d * 0.3
        if (!a || a < Math.abs(c)) {
            s = p / 4
            a = c
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a)
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOut (t, b, c, d, a, p) {
        let s
        if (t === 0) return b
        if ((t /= d) === 1) return b + c
        if (typeof p === 'undefined') p = d * 0.3
        if (!a || a < Math.abs(c)) {
            a = c
            s = p / 4
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a)
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b)
    },
    easeInOut (t, b, c, d, a, p) {
        let s
        if (t === 0) return b
        if ((t /= d / 2) === 2) return b + c
        if (typeof p === 'undefined') p = d * (0.3 * 1.5)
        if (!a || a < Math.abs(c)) {
            a = c
            s = p / 4
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a)
        }
        if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    }
}

// 超过范围的三次方缓动（(s+1)*t^3 – s*t^2）
export const Back = {
    easeIn (t, b, c, d, s) {
        if (typeof s === 'undefined') s = 1.70158
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOut (t, b, c, d, s) {
        if (typeof s === 'undefined') s = 1.70158
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOut (t, b, c, d, s) {
        if (typeof s === 'undefined') s = 1.70158
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    }
}

// 指数衰减的反弹缓动。
export const Bounce = {
    easeIn (t, b, c, d) {
        return c - this.Tween.Bounce.easeOut(d - t, 0, c, d) + b
    },
    easeOut (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
    },
    easeInOut (t, b, c, d) {
        if (t < d / 2) {
            return this.Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b
        }
        return this.Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    }
}
