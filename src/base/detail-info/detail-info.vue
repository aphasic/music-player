<template>
  <div class="detail-info">
    <div class="wrap" ref="wrap" :style="bgStyle">
      <slot name="bgImage"></slot>
      <h2 class="title-name" ref="top">
        <div class="icon-wrap">
          <i class="icon-back" @click="clickBack"></i>
        </div>
        <span ref="topName" class="top-name">{{title}}</span>
      </h2>
      <div class="content-wrap" ref="contentWrap">
        <slot name="content"></slot>
      </div>
      <div v-if="hasListTitle" class="song-list-title">
        <div class="random-play-btn">
          <i class="icon-play"></i>
          <span class="text-play">随机播放全部</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'detail-info',
    props: {
      hasListTitle: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      bgStyle: {
        type: String,
        default: ''
      },
      scrollY: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        topHeight: 0,
        wrapHeight: 0,
        isClassifyTitleShow: true
      }
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
          this.$refs.contentWrap.style.opacity = _opacity
        } else if (_height < this.topHeight) {
          this.$refs.contentWrap.style.opacity = 0
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
  .title-name
    height: 40px
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
    background-color: #2c2424
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
      position: relative
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
        &:hover
          cursor: pointer
    .content-wrap
      position: absolute
      top: 50px
      bottom: 0
      left: 0
      width: 100%
      .singer-info-content
        width: 100%
        position: absolute
        bottom: 0
        left: 0
        text-align: center
        .desc
          color: rgba(255,255,255,0.5)
          text-with-line(rgba(255,255,255,0.1))

      .disc-info-content
        width: 84%
        padding: 0 8%
        position: absolute
        top: 50%
        margin-top: -90px
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
      .rank-info-content
        position: absolute
        width: 100%
        bottom: 0
    .song-list-title
      width: 100%
      height: 50px
      border: 1px solid #222
      background: #222
      position: absolute
      bottom: -50px
</style>

