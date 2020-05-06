<template>
    <svg viewBox="0 0 100 100">
        <path :d="trackPath"
              stroke="#2B68DD"
              :stroke-width="relativeStrokeWidth"
              fill="none"
              :style="trailPathStyle"
        />
        <path
            :d="trackPath"
            :stroke="color"
            fill="none"
            stroke-linecap="round"
            :stroke-width="percentage ? relativeStrokeWidth : 0"
            :style="circlePathStyle"
        />
    </svg>
</template>

<script>
export default {
    name: 'Progress',
    props: {
        width: {
            type: Number,
            default: 180
        },
        color: {
            type: String,
            default: '#11FD74'
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    computed: {
        radius () {
            return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
        },
        perimeter () {
            return 2 * Math.PI * this.radius
        },
        rate () {
            return this.type === 'dashboard' ? 0.75 : 1
        },
        relativeStrokeWidth () {
            return (6 / this.width * 100).toFixed(1)
        },
        trackPath () {
            const radius = this.radius
            return `
                M 50 50
                m 0 -${ radius }
                a ${ radius } ${ radius } 0 1 1 0 ${ radius * 2 }
                a ${ radius } ${ radius } 0 1 1 0 -${ radius * 2 }
            `
        },
        trailPathStyle () {
            return {
                strokeDasharray: `${ (this.perimeter * this.rate) }px, ${ this.perimeter }px`,
                strokeDashoffset: this.strokeDashoffset
            }
        },
        circlePathStyle () {
            return {
                strokeDasharray: `${ this.perimeter * this.rate * (this.percentage / 100) }px, ${ this.perimeter }px`,
                strokeDashoffset: this.strokeDashoffset,
                transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
            }
        }
    }
}
</script>
