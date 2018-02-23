<template>
  <div class="disc-info">
    <div class="wrap" ref="wrap">
      <div class="h-img-background-blur">
        <img :src="discInfo.imgurl" alt="img">
      </div>
      <h2 class="title-name" ref="top">
        <div class="icon-wrap">
          <i class="icon-back" @click="clickBack"></i>
        </div>
        <span ref="topName" class="top-name">歌单</span>
      </h2>
      <div class="content">
        <div class="h-media-middle">
          <div class="icon">
            <img :src="discInfo.imgurl" alt="img">
            <div class="icon-footer">
              <i class="fa fa-headphones"></i>
              <!--<span>{{discInfo.listennum | toThousand}}</span>-->
            </div>
          </div>
          <div class="text">
            <h3 class="line title h-ellipse-2-line">{{discInfo.name}}</h3>
            <p class="line author h-ellipse-1-line">
              <img :src="discInfo.headurl" alt="author">
              {{discInfo.author}}
            </p>
            <p class="line description h-ellipse-1-line">
              简介:{{discInfo.desc}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      discInfo: {
        type: Object,
        default: {}
      }
    },
    name: 'disc-info',
    methods: {
      clickBack () {
        this.$emit('goBack')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .title-name
    padding: 5px
    font-size: $font-size-large
    text-align: center
    line-height: 40px
    color: $color-text
    position: relative
  .wrap
    width: 100%
    position: absolute
    top: 0
    bottom: 0
    background-size: cover
    background-position: center center
    min-height: 50px
    z-index: 80
    &:before
      content: ''
      display: block
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
      position: absolute
      left: 0
      top: 0
    .title-name
      position: relative
      z-index: 100
      .top-name
        /*opacity: 0*/
        transition: opacity 1s;
      .icon-wrap
        position: absolute
        left: 10px
        top: 50%
        -webkit-transform: translateY(-50%)
        -moz-transform: translateY(-50%)
        -ms-transform: translateY(-50%)
        -o-transform: translateY(-50%)
        transform: translateY(-50%)
        color: $color-theme
        font-size: $font-size-large-x
    .content
      position: absolute
      bottom: 0
      top: 50%
      margin-top: -55px
      width: 84%
      padding: 0 8%
      .h-media-middle
        .icon
          width: 140px
          height: 140px
          flex: 0 0 140px
          position: relative
          .icon-footer
            position: absolute
            bottom: 0
            padding: 0 5%
            line-height: 30px
            font-size: $font-size-small
        .text
          .line
            margin: 10px 0
            color: $color-text
          .title
            font-size: $font-size-medium-x
          .author
            img
              width: 30px
              height: 30px
              margin-right: 10px
              border-radius: 50%
              vertical-align: middle
          .description
            color: $color-text-ll
</style>

