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
              <div class="lyric-page" ref="lyricPage">
                <div class="lyric-control" v-show="lyricControl.show">
                  <div class="time">{{normalizeTime(lyricControl.time)}}</div>
                  <div class="icon-wrap" @click="updatePlay">
                    <i class="icon-play"></i>
                  </div>
                </div>
                <scroll
                  class="scroll-content"
                  ref="lyricScroll"
                  :data="lyricData"
                  :probe-type="probeType"
                  :listenScroll="true"
                  :listenScrollStart="true"
                  :listenScrollEnd="true"
                  :listenTouchStart="true"
                  :listenTouchMove="true"
                  :listenTouchEnd="true"
                  @onscroll="onLyricScroll"
                  @onscrollStart="onLyricScrollStart"
                  @onscrollEnd="onLyricScrollEnd"
                  @ontouchStart="onLyricTouchStart"
                  @ontouchMove="onLyricTouchMove"
                  @ontouchEnd="onLyricTouchEnd">
                  <div class="lines-wrap">
                    <div v-show="currentLyric" ref="lyricTopSpace"></div>
                    <div v-show="!currentLyric">
                      <p class="line">{{lyricErr}}</p>
                    </div>
                    <div v-if="currentLyric">
                      <p ref="lyricLine" class="line" :class="currentLyricIndex === index ? 'active':''" v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                    </div>
                    <div v-show="currentLyric" ref="lyricBottomSpace"></div>
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
              <progress-bar :percent="percent" @progressChange="onProgressChange"></progress-bar>
            </div>
            <span class="time time-right">{{normalizeTime(currentSong.duration)}}</span>
          </div>
          <div class="control-wrap">
            <div class="control-icon" @click="switchMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="control-icon" @click="prevSong">
              <i class="icon-prev"></i>
            </div>
            <div class="control-icon control-play-icon">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="control-icon" @click="nextSong">
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
            <progress-circle :radius="radius" :percent="percent" @click="togglePlaying">
              <i class="icon-mini" @click.stop="togglePlaying" :class="miniPlayIcon"></i>
            </progress-circle>
          </div>
          <div class="control-icon">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @pause="audioPause" @error="audioError" @canplay="audioCanPlay" @ended="audioEnded" @timeupdate="_updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {playerMixin} from 'controllers/mixin'
  import progressBar from 'base/progress-bar/progress-bar'
  import progressCircle from 'base/progress-circle/progress-circle'
  import Scroll from 'base/scroll/scroll'
  import {normalizeTime} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import fadeSlider from 'base/fade-slider/fade-slider'
  import {playmode} from 'controllers/player'

  const MINI_BTN_WIDTH = 30          // 迷你播放器中的播放按钮的尺寸
  const LYRIC_LINE_HEIGHT = 32       // 每行歌词的高度
  const LYRIC_ERR = '没有歌词~ '      // 没有歌词时的显示文本
  const LYRIC_SCROLL_START = 5      // 歌词超过第 n 行时才开始滚动
  export default {
    mixins: [playerMixin],
    data () {
      return {
        currentTime: 0,
        currentLyric: null,
        currentLyricIndex: 0,
        playingLyric: '',
        radius: MINI_BTN_WIDTH,
        zindexClass: 'can-click',
        normalizeTime: normalizeTime,
        lyricErr: LYRIC_ERR,
        lyricControl: {
          show: false,                        // 是否用户在滑动歌词，控制歌词控制按钮的显示
          time: 0,                             // 滑动歌词时，当前滑动到的歌词对应的时间
          clicked: false                      // 歌词控制条中的播放按钮是否被点击
        },
        songReady: false,                      // audio 是否 canPlay
        updateLyric: false,                    // 是否需要根据 audio 的 currentTime 来更新歌词进度
        probeType: 3
      }
    },
    created () {
      this.wrapHeight = 0                   // 歌词 scroll 的 wrap 高度
      this.hasLyricSpace = false            // 是否已经设置过歌词下的留白的高度
      this.lyricHeights = []
      this.lyricScroll = {
        hasEnd: true,
        isLyricTouching: false,
        moved: false
      }
      this._getLyric()
    },
    computed: {
      // 用于给 scroll 绑定的数据
      lyricData () {
        return this.currentLyric ? this.currentLyric.lines : []
      },
      playIcon () {
        return this.player.isPlaying ? 'icon-pause' : 'icon-play'
      },
      modeIcon () {
        for (let key in playmode) {
          if (this.player.playMode === playmode[key]) {
            return `icon-${key}`
          }
        }
      },
      miniPlayIcon () {
        return this.player.isPlaying ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass () {
        return this.player.isPlaying ? 'play' : 'play pause'
      },
      percent () {
        return this.currentSong ? this.currentTime / this.currentSong.duration : 0
      }
    },
    methods: {
      back () {
        this.setFullPage(false)
      },
      open () {
        this.setFullPage(true)
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        let newFlag = !this.player.isPlaying
        this.setPlayingState(newFlag)
        newFlag ? this._play() : this._pause()
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      switchMode () {
        let mode = this.player.playMode + 1
        if (mode === playmode.length) {
          mode = 0
        }
        this._changePlayList(this.player.sequenceList, mode)
      },
      prevSong () {
        this._prev()
      },
      nextSong () {
        this._next()
      },
      setOpacity (percent) {
        this.zindexClass = percent === 0 ? 'no-click' : 'can-click'
        this.$refs.middleSlideItem.style.opacity = percent
      },
      onLyricTouchStart (e) {
        this.lyricScroll.isLyricTouching = true
        this.lyricScroll.hasEnd = true
        this.lyricScroll.moved = false
      },
      onLyricTouchMove (e) {
        this.lyricScroll.moved = true
      },
      onLyricTouchEnd (e) {
        if (!this.lyricScroll.moved) {
          this.lyricScroll.isLyricTouching = false
          this.lyricScroll.hasEnd = false
        }
      },
      onLyricScrollStart () {
        if (!this.lyricScroll.isLyricTouching) {
          return
        }
        this.lyricScroll.hasEnd = false
        clearTimeout(this.lyricTimer)
        this.currentLyric.stop()
        this.lyricControl.show = true
        this.lyricControl.clicked = false
      },
      onLyricScroll (pos) {
        if (!this.lyricScroll.isLyricTouching) {
          return
        }
        if (this.lyricControl.clicked) {
          return
        }
        clearTimeout(this.lyricTimer)
        let index = this._getPosyIndex(pos.y)
        this.currentLyricIndex = index
        this.lyricControl.time = this.currentLyric.lines[index].time / 1000
      },
      onLyricScrollEnd () {
        if (!this.lyricScroll.isLyricTouching) {
          return
        }
        if (this.lyricScroll.hasEnd) {
          return
        }
        if (this.lyricControl.clicked) {
          return
        }
        this.lyricScroll.isLyricTouching = false
        this.lyricTimer = setTimeout(() => {
          if (this.player.isPlaying) {
            this.currentLyric.seek(this.currentTime * 1000)
          }
          this.lyricControl.show = false
        }, 2000)
      },
      onProgressChange (progress) {
        let percent = progress.percent
        let endFlag = progress.endFlag
        this._pause()
        this.currentTime = this.currentSong.duration * percent
        this._toCurrentTime()
        if (endFlag) {
          this.$refs.audio.currentTime = this.currentTime
          this._play()
          if (!this.player.isPlaying) {
            this.setPlayingState(true)
          }
        }
      },
      updatePlay () {
        this.lyricControl.show = false
        this.lyricControl.clicked = true
        clearTimeout(this.lyricTimer)
        this.currentTime = this.lyricControl.time
        this.$refs.audio.currentTime = this.lyricControl.time
        this._play()
        this._toCurrentTime()
        if (!this.player.isPlaying) {
          this.setPlayingState(true)
        }
      },
      _play () {
        this.$refs.audio.play()
      },
      _pause () {
        this.$refs.audio.pause()
      },
      // 考虑到 canplay 播放后可能因为网速而导致中途暂停，加载成功后继续播放
      // 所以将 audio 的 暂停事件提出来，避免音乐暂停了而歌词却在继续播放
      audioPause () {
        if (this.player.isPlaying) {
          this.setPlayingState(false)
          if (this.currentLyric) {
            this.currentLyric.stop()
            this.updateLyric = false
          }
        }
      },
      // 每首歌曲加载到可以播放时调用的事件，但是中途可能会因加载导致缓冲暂停
      audioCanPlay () {
        this.songReady = true
      },
      audioEnded () {
        let nextIndex = this.player.currentIndex + 1
        let len = this.player.playList.length
        if (this.player.playMode === playmode.sequence && nextIndex === len) {
          return
        }
        if (this.player.playMode === playmode.loop) {
          this.currentTime = 0
          this.$refs.audio.currentTime = 0
          this._play()
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        } else {
          this._next()
        }
      },
      audioError () {
        this._next()
      },
      _getPosyIndex (posY) {
        let index = 0
        let offsetY = posY + 1 / 2 * LYRIC_LINE_HEIGHT
        if (offsetY < 0) {
          let len = this.lyricHeights.length
          if (Math.abs(offsetY) >= this.lyricHeights[len - 1]) {
            return len - 1
          }
          for (var i = 0; i < len; i++) {
            if (Math.abs(offsetY) <= this.lyricHeights[i]) {
              index = i
              break
            }
          }
        }
        return index
      },
      _updateLyricHeights () {
        this.$nextTick(() => {
          let len = this.currentLyric.lines.length
          let lyricLines = this.$refs.lyricLine
          let heightSum = 0
          this.lyricHeights = []
          for (var i = 0; i < len; i++) {
            let _height = lyricLines[i].offsetHeight
            this.lyricHeights.push(heightSum)
            heightSum += _height
          }
        })
      },
      _updateTime (e) {
        let currentTime = e.target.currentTime
        this.currentTime = currentTime
        if (!this.updateLyric && this.currentLyric) {
          console.log(currentTime)
          this.currentLyric.seek(currentTime * 1000)
          this.updateLyric = true
        }
      },
      _getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this._handleLyric)
          console.log(this.currentLyric)
          // songReady 为true就说明 audio 已经加载并播放了，即歌词获取较慢
          // 在 audio 的 play 事件里面歌词尚未获取到所以没有设置播放，因此此处要设置歌词播放
          if (this.player.isFullpage) {
            this._updateLyricHeights()
          }
        }).catch(() => {
          console.log('error')
          this.playingLyric = LYRIC_ERR
        })
      },
      _next () {
        let nextIndex = this.player.currentIndex + 1
        let playList = this.player.playList
        if (nextIndex === playList.length) {
          nextIndex = 0
        }
        this.setCurrentIndex(nextIndex)
      },
      _prev () {
        let prevIndex = this.player.currentIndex - 1
        let len = this.player.playList.length
        if (prevIndex < 0) {
          prevIndex = len - 1
        }
        this.setCurrentIndex(prevIndex)
      },
      _handleLyric ({lineNum, txt}) {
        this.currentLyricIndex = lineNum
        this.playingLyric = txt
        this._toCurrentLine(1000)
      },
      _toCurrentTime () {
        if (this.currentLyric) {
          this.currentLyric.seek(this.currentTime * 1000)
        }
      },
      // 歌词滚动到 currentLyricIndex 对应的位置
      // time 为滚动渐变的时间
      _toCurrentLine (time = 0) {
        if (!this.currentLyric) {
          return
        }
        let index = 0
        if (this.currentLyricIndex > LYRIC_SCROLL_START) {
          index = this.currentLyricIndex - LYRIC_SCROLL_START
        }
        let line = this.$refs.lyricLine[index]
        this.$refs.lyricScroll.scrollToElement(line, time)
      },
      // 为保证歌词最后一句和第一句都可以滚动到歌词页面的正中间
      // 手动给滚动区域上下各添加页面一半的高度
      _initLyricSpace () {
        let spaceHeight = 1 / 2 * this.wrapHeight - 1 / 2 * LYRIC_LINE_HEIGHT
        this.$refs.lyricTopSpace.style.height = `${spaceHeight}px`
        this.$refs.lyricBottomSpace.style.height = `${spaceHeight}px`
      },
      _initCurrentLyric () {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLyricIndex = 0
        this.$refs.lyricScroll.scrollTo(0, 0, 0)
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
            // 只有 isFullpage 为 true 时其子 DOM 才会渲染，所以 wrapHeight 要在此获取
            this.wrapHeight = this.$refs.lyricPage.clientHeight
            if (!this.hasLyricSpace) {
              this._initLyricSpace()
              this.hasLyricSpace = true
              if (this.currentLyric) {
                this._updateLyricHeights()
              }
            }
            if (this.currentLyric) {
              this.$refs.lyricScroll.refresh()
              this._toCurrentLine()
            }
          })
        }
      },
      currentSong: function (newSong, oldSong) {
        this.songReady = false
        this.updateLyric = false
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (!this.player.isPlaying) {
          this.setPlayingState(true)
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this._initCurrentLyric()
        }
        this._getLyric()
        this.currentTime = 0
        this.$nextTick(() => {
          this._play()
        })
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
          position: relative
          .lyric-control
            position: absolute
            z-index: 300
            width: 100%
            height: 32px
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            top: 50%
            left: 0
            &:before
              content: ''
              display: block
              position: absolute
              width: 70%
              top: 50%
              left: 15%
              height: 0
              border-top: 1px dotted $color-text-l
            .time,.icon-wrap
              width: 15%
              height: 100%
              text-align: center
              float: left
            .icon-wrap
              float: right
              font-size: 20px
              padding: 6px 0
          .scroll-content
            width: 100%
            height: 100%
            overflow: hidden
            .lines-wrap
              width: 90%
              margin: auto
              text-align: center
              .line
                line-height: 32px
                color: $color-text-l
                font-size: $font-size-medium
                &.active
                  color: $color-theme
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
