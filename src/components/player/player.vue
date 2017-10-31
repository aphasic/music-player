<template>
  <div v-if="player.playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="player.isFullpage">
        <div class="background">
          <img src="../../common/image/default.png" alt="img">
        </div>
        <div class="top-content">
          <div class="icon" @click="_goBack">
            <i class="icon-back"></i>
          </div>
          <h2 class="title h-ellipse-1-line">{{currentSong.name}}</h2>
          <h3 class="subtitle h-ellipse-1-line">
            <span v-for="(singer, index) in currentSong.singer">
              <span v-if="index !== 0">/</span>
              {{singer.name}}
            </span>
          </h3>
        </div>
        <div class="cd-content">
          <img :src="currentSong.image" alt="img">
        </div>
        <div class="lyric-content">
          dfhetu
        </div>
        <div class="bottom-content">
          <div class="progress-wrap">
          </div>
          <div class="control-wrap">
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-palyer" v-show="!player.isFullpage" @click="_goFullpage">
        <div class="left h-media-middle">
          <div class="icon">
            <img src="../../common/image/default.png" alt="img">
          </div>
          <div class="text">
            <h3 class="title h-ellipse-1-line">title</h3>
            <p class="name h-ellipse-1-line">
              name
            </p>
          </div>
        </div>
        <div class="right operators">
          <div class="control-icon">
            <i class="icon-play"></i>
          </div>
          <div class="control-icon">
            <i class="icon-next"></i>
          </div>
          <div class="control-icon">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {playerCreatedMixin, playerMixin} from 'controllers/mixin'
  export default {
    mixins: [playerCreatedMixin, playerMixin],
    data () {
      return {
        isPlayerShow: false,
        songReady: false
      }
    },
    created () {
      console.log(this.player)
      console.log(this.currentSong)
    },
    methods: {
      onPlayerCreated (flag) {
        this.isPlayerShow = flag
      },
      _goBack () {
        this.setFullPage(false)
      },
      _goFullpage () {
        this.setFullPage(true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .normal-player
    position: fixed
    width: 100%
    height: 100%
    bottom: 0
    z-index: 200
    background: $color-highlight-background
    .background
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      img
        width: 100%
        height: 100%
    .top-content
      position: relative
      text-align: center
      position: relative
      .icon
        position: absolute
        font-size: $font-size-large-x
        color: $color-theme
        transform: rotate(-90deg)
        left: 6px
        top: 0
        padding: 9px
      .title
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        font-size: $font-size-medium
        color: $color-text
    .cd-content
      width: 80%
      height: 0
      padding-top: 80%
      margin: 25px auto
      position: relative
      img
        display: block
        position: absolute
        width: 100%
        height: 100%
        top: 0
        left: 0
        border-radius: 50%
        border: 10px solid rgba(255, 255, 255, 0.1)
        box-sizing: border-box
    .bottom-content
      position: absolute
      left: 5%
      bottom: 50px
      width: 90%
      .control-wrap
        display: flex
        .control-icon
          flex: 1
          padding: 0 10px
          font-size: 30px
          text-align: center
          color: $color-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top-content, .bottom-content
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top-content
        transform: translate3d(0, -100px, 0)
      .bottom-content
        transform: translate3d(0, 100px, 0)
  .mini-palyer
    position: fixed
    height: 60px
    width: 100%
    bottom: 0
    z-index: 200
    background: $color-highlight-background
    display: flex
    align-items: center
    justify-content: space-between
    .left
      .icon
        width: 40px
        height: 40px
        flex: 0 0 40px
        margin-right: 10px
        margin-left: 20px
        img
          display: block
          border-radius: 50%
      .text
        line-height: 20px
        .title
          font-size: $font-size-medium
          color: $color-text
        .name
          font-size: $font-size-small
          color: $color-text-d
    .right
      display: flex
      padding: 0 20px
      .control-icon
        padding: 0 10px
        font-size: 30px
        color: $color-theme-d
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
</style>
