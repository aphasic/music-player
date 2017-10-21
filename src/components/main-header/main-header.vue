<template>
  <div class="main-header">
    <div class="icon-logo"></div>
    <h1>小九 Music </h1>
    <i class="icon-mine"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin.styl"

  .main-header
    height: 44px
    text-align: center
    font-size: 0
    color: $color-theme
    position: relative
    .icon-logo
      width: 30px
      height: 32px
      margin-top: 6px;
      display: inline-block
      bg-image('logo')
      background-size: 100% 100%
    h1
      display: inline-block
      font-size: $font-size-large
      margin: 0 9px
      line-height: 44px
      vertical-align: top
    .icon-mine
      position: absolute
      right: 12px
      top: 12px
      font-size: 20px
      display: block




</style>
