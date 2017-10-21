<template>
  <div class="slider" ref="slider">
    <div class="slider-items-wrap" ref="sliderItemsWrap">
      <slot>
      </slot>
    </div>
    <div class="slider-dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots">
      </span>
    </div>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    overflow: hidden
    position: relative
    .slider-items-wrap
      overflow: hidden
      .slider-item
        float: left
    .slider-dots
      position: absolute
      text-align: center;
      left: 0
      right: 0
      bottom: 12px
      .dot
        display: inline-block
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        margin: 0 4px
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BetterScroll from 'better-scroll'
  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data () {
      return {
        dotsLen: 0,
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._setSliderWidth(true)
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      })
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(false)
      })
    },
    methods: {
      _setSliderWidth (isInit) {
        let children = this.$refs.sliderItemsWrap.children
        let _width = this.$refs.slider.clientWidth
        let len = children.length
        for (let i = 0; i < len; i++) {
          let child = children[i]
          addClass(child, 'slider-item')
          child.style.width = _width + 'px'
        }
        if (isInit && this.loop) {
          this.dotsLen = len
          len += 2
        }
        this.$refs.sliderItemsWrap.style.width = len * _width + 'px'
      },
      _initDots () {
        this.dots = new Array(this.dotsLen)
      },
      _initSlider () {
        this.slider = new BetterScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
          this.currentPageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            this.currentPageIndex --
          }
          if (this.autoPlay) {
            clearInterval(this.timer)
            this._play()
          }
        })
      },
      _play () {
        this.timer = setInterval(() => {
          let nextIndex = this.currentPageIndex + 1
          if (this.loop) {
            nextIndex++
          }
          this.slider.goToPage(nextIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
</script>
