<template>
  <div class="progress-bar" ref="progressBar">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn" ref="progressBtn"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  const BTN_WIDHT = 16
  export default {
    name: 'progressBar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    methods: {
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.left = `${offsetWidth}px`
      }
    },
    watch: {
      percent (val) {
        let offsetWidth = (this.$refs.progressBar.clientWidth - BTN_WIDHT) * val
        this._offset(offsetWidth)
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

