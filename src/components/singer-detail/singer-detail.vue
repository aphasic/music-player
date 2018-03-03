<template>
  <transition name="slide">
    <div class="h-full-page">
      <div class="singer-info-wrap" ref="singerInfoWrap">
        <detail-info  :title="singerInfo.name" :bgStyle="bgStyle" :scrollY="scrollY" @goBack="_goBack" v-if="songList.length">
          <div slot="content" class="singer-info-content">
            <h2 class="title-name">{{singerInfo.name}}</h2>
            <p><span class="desc">粉丝:{{singerInfo.fans | toThousand}}</span></p>
            <div class="random-play-btn">
              <i class="icon-play"></i>
              <span class="text-play">随机播放全部</span>
            </div>
          </div>
        </detail-info>
      </div>
      <scroll class="scroll-content" :data="songList" :probeType="probeType" :listenScroll="true" @onscroll="onscroll" ref="scroll">
        <div>
          <songlist :songlist="songList" :bgColor="listBgColor" @selectItem="selectItem"></songlist>
        </div>
      </scroll>
      <loading v-if="!songList.length"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // singer-detail 组件是singer中的子路由中构建的，fixed 定位， 整体z-index 为 50
  import {ERR_OK} from 'api/config'
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'controllers/song'
  import {mapGetters} from 'vuex'
  import {playerMixin, playerCreatedMixin} from 'controllers/mixin'
  import {playerHeight} from 'controllers/player'
  import Songlist from 'base/songlist/songlist'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import DetailInfo from 'base/detail-info/detail-info'
  const COLOR_BACKGROUND = '#222'
  export default {
    name: 'singer-detail',
    mixins: [playerMixin, playerCreatedMixin],
    data () {
      return {
        songList: [],
        fans: '',
        singerInfo: {},
        listBgColor: COLOR_BACKGROUND,
        probeType: 3,
        scrollY: 0,
        bgStyle: ''            // singer-info 处的背景样式
      }
    },
    created () {
      this._getDetail()
    },
    mounted () {
      this.$nextTick(() => {
        if (!this.$refs.singerInfoWrap) {
          return
        }
        let imageHeight = this.$refs.singerInfoWrap.offsetHeight
        this.$refs.scroll.$el.style.top = `${imageHeight}px`
      })
    },
    computed: {
      ...mapGetters(['singer'])
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.list)
            this.songList = this._normalizeSong(res.data.list)
            this.singerInfo = {
              fans: res.data.fans,
              name: this.singer.name,
              imgurl: this.singer.imgurl
            }
            this.bgStyle = `background-image:url(${this.singerInfo.imgurl})`
          }
        })
      },
      _normalizeSong (resData) {
//        console.log('singerDetailData:')
//        console.log(resData)
        return resData.map((song) => {
          let data = song.musicData
          return createSong(1, data)
        })
      },
      _goBack () {
        this.$router.back()
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .singer-info-wrap
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

