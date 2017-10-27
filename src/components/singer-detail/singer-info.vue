<template>
  <div class="singer-info" :style="bgStyle">
    <div class="wrap">
      <h2 class="title">
        <i class="icon-back"></i>
        {{info.name}}
      </h2>
      <div class="content">
        <span class="desc">{{info.fans}}</span>
        <div class="play-btn">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {normalizeFans} from 'controllers/singer'
  export default {
    name: 'singer-info',
    props: {
      info: {
        type: Object,
        default: {},
        bgStyle: ''
      }
    },
    created () {
      this.info.fans = normalizeFans(this.info.fans)
      this.bgStyle = `background-image:url(${this.info.imgurl})`
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .singer-info
    position: relative
    background-size: cover
    width: 100%
    height: 0
    padding-top: 70%
    .wrap
      width: 100%
      position: absolute
      top: 0
      bottom: 0
      background: rgba(7, 17, 27, 0.4)
      .title
        padding: 10px
        font-size: $font-size-large
        text-align: center
        line-height: 40px
        color: $color-text
        .icon-back
          color: $color-theme
          font-size: $font-size-large-x
          float: left
          position: relative
          top: 9px
      .content
        position: absolute
        bottom: 0
        left: 0
        text-align: center


</style>

