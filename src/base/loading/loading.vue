<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .loading
    width: 100%
    text-align: center
    position: absolute
    top: 50%
    -webkit-transform: translateY(-50%)
    -moz-transform: translateY(-50%)
    -ms-transform: translateY(-50%)
    -o-transform: translateY(-50%)
    transform: translateY(-50%)
    img
      width: 24px
      height: 24px
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>

