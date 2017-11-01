<template>
  <div v-if="player.playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="player.isFullpage">
        <div class="background">
          <img :src="currentSong.image" alt="img">
        </div>
        <div class="top-content">
          <div class="icon" @click="back">
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
        <div class="cd-content" :class="cdClass">
          <img :src="currentSong.image" alt="img">
        </div>
        <div class="lyric-content">
          歌词区域
        </div>
        <div class="bottom-content">
          <div class="progress-wrap">
            <span class="time time-left">{{audio.currentTime}}</span>
            <div class="progress">
              <progress-bar :percent="audio.percent"></progress-bar>
            </div>
            <span class="time time-right">{{audio.duration}}</span>
          </div>
          <div class="control-wrap">
            <div class="control-icon">
              <i class="icon-sequence"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon control-play-icon">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="control-icon">
              <i class="icon-next"></i>
            </div>
            <div class="control-icon">
              <i class="icon-prev"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-palyer" v-show="!player.isFullpage" @click="open">
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
    <audio ref="audio" :src="currentSong.url" @error="audio.error" @timeupdate="audio.updateTime"
           @ended="audio.end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {playerCreatedMixin, playerMixin} from 'controllers/mixin'
  import progressBar from 'base/progress-bar/progress-bar'
  import {normalizeTime} from 'common/js/util'
  export default {
    mixins: [playerCreatedMixin, playerMixin],
    data () {
      return {
        isPlayerShow: false,
        audio: {}
      }
    },
    created () {
      this.audio = {
        isReady: false,
        isPlaying: this.player.isPlaying,
        currentTime: '00:00',
        duration: normalizeTime(this.currentSong.duration),
        percent: 0,
        play: () => {
          this.$refs.audio.play()
        },
        pause: () => {
          this.$refs.audio.pause()
        },
        error: () => {
          this.audio.isReady = true
        },
        end: () => {
          console.log('end')
        },
        updateTime: (e) => {
          let currentTime = e.target.currentTime
          this.audio.currentTime = normalizeTime(currentTime)
          this.audio.percent = currentTime / this.currentSong.duration
        }
      }
    },
    computed: {
      playIcon () {
        return this.audio.isPlaying ? 'icon-pause' : 'icon-play'
      },
      cdClass () {
        return this.audio.isPlaying ? 'play' : 'play pause'
      },
      progress () {
        return this.audio.currentTime
      }
    },
    methods: {
      onPlayerCreated (flag) {
        this.isPlayerShow = flag
      },
      back () {
        this.setFullPage(false)
      },
      open () {
        this.setFullPage(true)
      },
      togglePlaying () {
        let newFlag = !this.audio.isPlaying
        this.setPlayingState(newFlag)
        this.audio.isPlaying = newFlag
        newFlag ? this.audio.play() : this.audio.pause()
      }
    },
    components: {
      progressBar
    },
    watch: {
//      'player.isPlaying': function (newFlag) {
//        this.$nextTick(() => {
//          newFlag ? this.audio.play() : this.audio.pause()
//        })
//      },
      currentSong: function (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong) {
          return
        }
        console.log(newSong)
        console.log(oldSong)
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
      &.play
        animation: rotate 20s linear infinite
      &.pause
        animation-play-state: paused
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
      left: 10%
      bottom: 50px
      width: 80%
      .progress-wrap
        display: flex
        justify-content: space-between
        align-items: center
        .time
          width: 30px
          padding: 0 10px
          color: $color-text
          font-size: $font-size-small
          line-height: 30px
          text-align: center
        .progress
          flex: 1
          height: 4px
      .control-wrap
        display: flex
        justify-content: space-between
        align-items: center
        .control-icon
          padding: 0 10px
          font-size: 30px
          text-align: center
          color: $color-theme
          &.control-play-icon
            font-size: 40px
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
