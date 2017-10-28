<template>
  <div class="singer-info" ref="singerInfo">
    <div class="wrap" ref="wrap" :style="bgStyle">
      <h2 class="title-name" ref="top">
        <div class="icon-wrap">
          <i class="icon-back" @click="clickBack"></i>
        </div>
        <span ref="topName" class="top-name">{{info.name}}</span>
      </h2>
      <div class="content" ref="content">
        <h2 class="title-name">{{info.name}}</h2>
        <p><span class="desc">粉丝:{{info.fans}}</span></p>
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text-play">随机播放全部</span>
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
      },
      scrollY: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        topHeight: 0,
        wrapHeight: 0
      }
    },
    created () {
      this.info.fans = normalizeFans(this.info.fans)
      this.bgStyle = `background-image:url(${this.info.imgurl})`
    },
    mounted () {
      this.topHeight = this.$refs.top.offsetHeight
      this.wrapHeight = this.$refs.wrap.offsetHeight
    },
    methods: {
      clickBack () {
        this.$emit('goBack')
      }
    },
    watch: {
      scrollY () {
        let _height = this.scrollY + this.wrapHeight
        this.$refs.topName.style.opacity = 0
        this.$refs.wrap.style.height = `${_height}px`
        if (this.scrollY <= 0 && _height >= this.topHeight) {
          let _opacity = Math.abs((this.wrapHeight - this.topHeight + this.scrollY) / (this.wrapHeight - this.topHeight))
          this.$refs.content.style.opacity = _opacity
        } else if (_height < this.topHeight) {
          this.$refs.content.style.opacity = 0
          this.$refs.topName.style.opacity = 1
          this.$refs.wrap.style.height = `${this.topHeight}px`
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .singer-info
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
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
      z-index: 100
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
        .top-name
          opacity: 0
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
        left: 0
        width: 100%
        text-align: center
        .desc
          color: rgba(255,255,255,0.5)
          text-with-line(rgba(255,255,255,0.1))
        .play-btn
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 10px auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text-play
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small

</style>

