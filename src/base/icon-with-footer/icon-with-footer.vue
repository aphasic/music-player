<template>
  <div class="icon">
    <img class="disc-cover" v-lazy="imgurl" alt="img">
    <div class="icon-footer">
      <span class="left">
        <i class="fa fa-headphones"></i>
        <span>{{listennum | toThousand}}</span>
      </span>
      <span class="right" v-if="isPlayIconShow">
        <i class="fa fa-play-circle" @click.stop="onPlayClick"></i>
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'icon-with-footer',
    props: {
      imgurl: {
        type: String,
        default: ''
      },
      listennum: {
        type: Number,
        default: 0
      },
      isPlayIconShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onPlayClick () {
        this.$emit('onPlayClick')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
  .icon
    position: relative
    .disc-cover
      width: 100%
    .icon-footer
      width: 90%
      padding: 0 5%
      position: absolute
      z-index: 3
      font-size: $font-size-large-x
      height: 1.5em
      line-height: 1.5em
      bottom: 0
      display: flex
      justify-content: space-between
      .left
        font-size: 0.5em
</style>

