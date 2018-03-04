<template>
  <transition name="slide">
    <div class="h-full-page">
      <div class="rank-info-wrap" ref="rankInfoWrap">
        <detail-info  :title="rankInfo.name" :bgStyle="bgStyle" :scrollY="scrollY" @goBack="_goBack" v-if="songList.length">
          <div slot="content" class="rank-info-content">
            <h2 class="title-name">{{rankInfo.name}}</h2>
            <div class="random-play-btn">
              <i class="icon-play"></i>
              <span class="text-play">随机播放全部</span>
            </div>
          </div>
        </detail-info>
      </div>
      <scroll class="scroll-content" :data="songList" :probeType="probeType" @onscroll="onscroll" :listenScroll="true" ref="scroll">
        <div>
          <songlist :songlist="songList" :bgColor="listBgColor" @selectItem="selectItem"></songlist>
        </div>
      </scroll>
      <loading v-if="!songList.length"></loading>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import DetailInfo from 'base/detail-info/detail-info'
  import Songlist from 'base/songlist/songlist'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playerMixin, playerCreatedMixin} from 'controllers/mixin'
  import {playerHeight} from 'controllers/player'
  import {createSong} from 'controllers/song'
  import {mapGetters} from 'vuex'
  import {getRankDetail} from 'api/rank'
  import {ERR_OK} from 'api/config'
  const COLOR_BACKGROUND = '#222'
  export default {
    name: 'rank-detail',
    mixins: [playerMixin, playerCreatedMixin],
    data () {
      return {
        songList: [],
        rankInfo: {},
        listBgColor: COLOR_BACKGROUND,
        probeType: 3,
        scrollY: 0,
        bgStyle: ''            // rank-info 处的背景样式
      }
    },
    created () {
      console.log(this.rank)
      this.rankInfo.name = this.rank.topTitle
      this.bgStyle = `background-image:url(${this.rank.picUrl})`
      this._getRankDetail()
    },
    mounted () {
      this.$nextTick(() => {
        if (!this.$refs.rankInfoWrap) {
          return
        }
        let imageHeight = this.$refs.rankInfoWrap.offsetHeight
        this.$refs.scroll.$el.style.top = `${imageHeight}px`
      })
    },
    computed: {
      ...mapGetters(['rank'])
    },
    methods: {
      _goBack () {
        this.$router.back()
      },
      _getRankDetail () {
        if (!this.rank.id) {
          this.$router.push('/rank')
          return
        }
        getRankDetail(this.rank.id).then((res) => {
          if (res.code === ERR_OK) {
//            console.log(res)
            this.songList = this._normalizeSong(res.songlist)
          }
        })
      },
      _normalizeSong (resData) {
//        console.log('rankDetailData:')
//        console.log(resData)
        return resData.map((song) => {
          let data = song.data
          return createSong(1, data)
        })
      },
      onscroll (pos) {
        this.scrollY = pos.y
      },
      selectItem (song, index) {
        if (!this.player.isCreated) {
          this.setIsCreated(true)
        }
        this.setSequenceList(this.songList)
        this.setCurrentIndex(index)
        this._changePlayList(this.songList, this.player.playMode)
      },
      onPlayerCreated (flag) {
        if (flag === true) {
          this.$refs.scroll.$el.style.bottom = `${playerHeight}px`
          this.$refs.scroll.refresh()
        }
      }
    },
    components: {
      Songlist,
      Scroll,
      Loading,
      DetailInfo
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .rank-info-wrap
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
  .scroll-content
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
</style>

