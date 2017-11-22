<template>
  <div class="progress-bar" ref="progressBar" @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn" ref="progressBtn"></div>
  </div>
</template>
<script type="text/ecmascript-6">
//  import {deleteUnit} from 'common/js/util'
  const BTN_WIDHT = 16
  export default {
    name: 'progressBar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
      this.bartouch = {}
      this.btn_left = 0
    },
    methods: {
      _setOffset (percent) {
        let offsetWidth = (this.$refs.progressBar.clientWidth - BTN_WIDHT) * percent
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.left = `${offsetWidth}px`
        this.btn_left = offsetWidth
      },
      onTouchStart (e) {
        this.touch.started = true
        this.touch.startX = e.touches[0].pageX
        let wrapPageX = this.$refs.progressBar.getBoundingClientRect().left
        let wrapWidth = this.$refs.progressBar.clientWidth
        let offset = e.touches[0].pageX - wrapPageX
        let percent = offset / wrapWidth
        this.touch.startOffset = e.touches[0].pageX - wrapPageX
        this.touch.percent = percent
        this._setOffset(this.touch.percent)
        this.$emit('progressChange', {percent: this.touch.percent, endFlag: false})
      },
      onTouchMove (e) {
        if (!this.touch.started) {
          return
        }
        let wrapWidth = this.$refs.progressBar.clientWidth
        let deltaX = e.touches[0].pageX - this.touch.startX
        let offset = Math.max(0, Math.min(this.touch.startOffset + deltaX, wrapWidth))
        let percent = offset / wrapWidth
        this.touch.percent = percent
        this._setOffset(this.touch.percent)
        this.$emit('progressChange', {percent: this.touch.percent, endFlag: false})
      },
      onTouchEnd (e) {
        this.touch.started = false
        this._setOffset(this.touch.percent)
        this.$emit('progressChange', {percent: this.touch.percent, endFlag: true})
      }
    },
    watch: {
      percent (percent) {
        this._setOffset(percent)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 100%
    background: rgba(0, 0, 0, 0.3)
    position: relative
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn
      position: absolute
      top: 50%
      margin-top: -8px
      box-sizing: border-box
      width: 16px
      height: 16px
      border: 3px solid $color-text
      border-radius: 50%
      background: $color-theme
</style>

