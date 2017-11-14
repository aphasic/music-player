<template>
  <div v-show="player.playList.length > 0">
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
        <div class="middle-content">
          <fade-slider :middleIndex="0" :rightIndex="1" @setOpacity="setOpacity">
            <div class="slider-item" :class="zindexClass" ref="middleSlideItem">
              <div class="cd-page">
                <div class="cd-content" :class="cdClass">
                  <img :src="currentSong.image" alt="img">
                </div>
                <p class="lyric">{{playingLyric}}</p>
              </div>
            </div>
            <div class="slider-item">
              <div class="lyric-page">
                <scroll :data="lyricData" ref="lyricScroll" class="scroll-content">
                  <div class="lines-wrap">
                    <div v-if="!currentLyric">
                      <p class="line">{{lyricErr}}</p>
                    </div>
                    <div v-if="currentLyric">
                      <p ref="lyricLine" class="line" :class="currentLyricIndex === index ? 'active':''" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                    </div>
                  </div>
                </scroll>
              </div>
            </div>
          </fade-slider>
        </div>
        <div class="bottom-content">
          <div class="progress-wrap">
            <span class="time time-left">{{normalizeTime(currentTime)}}</span>
            <div class="progress">
              <progress-bar :percent="percent"></progress-bar>
            </div>
            <span class="time time-right">{{normalizeTime(currentSong.duration)}}</span>
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
            <img :src="currentSong.image" alt="img">
          </div>
          <div class="text">
            <h3 class="title h-ellipse-1-line">{{currentSong.name}}</h3>
            <p class="name h-ellipse-1-line">
              <span v-for="(singer, index) in currentSong.singer">
              <span v-if="index !== 0">/</span>
                {{singer.name}}
              </span>
            </p>
          </div>
        </div>
        <div class="right operators">
          <div class="control-icon">
            <progress-circle :radius="radius" :percent="percent">
              <i class="icon-mini" @click.stop="togglePlaying" :class="miniPlayIcon"></i>
            </progress-circle>
          </div>
          <div class="control-icon">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @play="_audioPlay" @pause="_audioPause" @canplay="_canPlay" @timeupdate="_updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {playerCreatedMixin, playerMixin} from 'controllers/mixin'
  import progressBar from 'base/progress-bar/progress-bar'
  import progressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import {normalizeTime} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import fadeSlider from 'base/fade-slider/fade-slider'

  const MINI_BTN_WIDTH = 30
  const LYRIC_ERR = '没有歌词~ '
  export default {
    mixins: [playerCreatedMixin, playerMixin],
    data () {
      return {
        isPlayerShow: false,
        currentTime: 0,
        currentLyric: null,
        currentLyricIndex: -1,
        playingLyric: '',
        radius: MINI_BTN_WIDTH,
        percent: 0,
        zindexClass: 'can-click',
        normalizeTime: normalizeTime,
        lyricErr: LYRIC_ERR,
        songReady: false                      // audio 是否 canPlay
      }
    },
    mounted () {
      this._getLyric()
    },
    computed: {
      lyricData () {
        return this.currentLyric ? this.currentLyric.lines : []
      },
      playIcon () {
        return this.player.isPlaying ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon () {
        return this.player.isPlaying ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass () {
        return this.player.isPlaying ? 'play' : 'play pause'
      },
      progress () {
        return this.currentTime
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
        let newFlag = !this.player.isPlaying
        this.setPlayingState(newFlag)
        newFlag ? this._play() : this._pause()
      },
      setOpacity (percent) {
        this.zindexClass = percent === 0 ? 'no-click' : 'can-click'
        this.$refs.middleSlideItem.style.opacity = percent
      },
      _play () {
        this.$refs.audio.play()
      },
      _pause () {
        this.$refs.audio.pause()
      },
      // 考虑到 canplay 播放后可能因为网速而导致中途暂停，加载成功后继续播放
      // 所以将 audio 的 播放和暂停事件提出来，避免音乐暂停了而歌词却在继续播放
      _audioPlay () {
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      _audioPause () {
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      _canPlay () {
        this.songReady = true
        if (this.player.isPlaying) {
          this.$nextTick(() => {
            this._play()
            this.$refs.lyricScroll.scrollTo(0, 0, 1000)
          })
        }
      },
      _updateTime (e) {
        let currentTime = e.target.currentTime
        this.currentTime = currentTime
        this.percent = currentTime / this.currentSong.duration
      },
      _getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this._handleLyric)
          console.log(this.currentLyric)
          // songReady 为true就说明 audio 已经加载并播放了，即歌词获取较慢
          // 在 audio 的 play 事件里面歌词尚未获取到所以没有设置播放，因此此处要设置歌词播放
//          if (this.songReady && this.player.isPlaying) {
//            this.currentLyric.seek(this.currentTime * 1000)
//          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = LYRIC_ERR
          this.currentLineNum = 0
        })
      },
      _handleLyric ({lineNum, txt}) {
        this.currentLyricIndex = lineNum
//        this.playingLyric = txt
//        if (lineNum > 5) {
//          console.log(this.$refs.lyricScroll)
//          let line = this.$refs.lyricLine[lineNum - 5]
//          this.$refs.lyricScroll.scrollToElement(line, 1000)
//        }
      }
    },
    components: {
      progressBar,
      progressCircle,
      fadeSlider,
      Scroll
    },
    watch: {
      'player.isFullpage': function (newFlag) {
        if (newFlag) {
          this.$nextTick(() => {
            this.$refs.lyricScroll.refresh()
          })
        }
      },
      currentSong: function (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        this.currentTime = 0
        this.songReady = false
        this._getLyric()
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
    .middle-content
      position: absolute
      width: 100%
      top: 60px
      bottom: 130px
      .slider-item
        position: relative
        &.can-click
          z-index: 200
        &.no-click
          z-index: -99
        .cd-page
          width: 100%
          height: 100%
          .lyric
            width: 80%
            margin: 20px auto
            overflow: hidden
            text-align: center
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .cd-content
            width: 80%
            margin: auto
            height: 0
            padding-top: 80%
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
        .lyric-page
          width: 100%
          height: 100%
          .scroll-content
            width: 100%
            height: 100%
            overflow: hidden
            .lines-wrap
              width: 80%
              margin: auto
              text-align: center
              .line
                line-height: 32px
                color: $color-text-l
                font-size: $font-size-medium
                &.active
                  color: $color-text
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
        .icon-mini
          position: absolute
          left: 0
          top: 0
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
</style>
