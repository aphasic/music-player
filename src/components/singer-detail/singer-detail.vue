<template>
  <transition name="slide">
    <div class="h-full-page">
      <div class="singer-info-wrap" ref="singerInfoWrap">
        <singer-info  :info="singerInfo" :scrollY="scrollY" @goBack="_goBack" v-if="songList.length"></singer-info>
      </div>
      <scroll class="scroll-content" :data="songList" :probeType="probeType" :listenScroll="true" @onscroll="onscroll" ref="scroll">
        <div>
          <songlist :songlist="songList" :bgColor="listBgColor"></songlist>
        </div>
      </scroll>
      <loading v-if="!songList.length"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import Songlist from 'base/songlist/songlist'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'controllers/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SingerInfo from './singer-info.vue'
  const COLOR_BACKGROUND = '#222'
  export default {
    name: 'singer-detail',
    data () {
      return {
        songList: [],
        fans: '',
        singerInfo: {},
        listBgColor: COLOR_BACKGROUND,
        probeType: 3,
        scrollY: 0
      }
    },
    created () {
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSong(res.data.list)
          this.singerInfo = {
            fans: res.data.fans,
            name: this.singer.name,
            imgurl: this.singer.imgurl
          }
        }
      })
    },
    mounted () {
      this.$nextTick(() => {
        let imageHeight = this.$refs.singerInfoWrap.offsetHeight
        this.$refs.scroll.$el.style.top = `${imageHeight}px`
      })
    },
    computed: {
      ...mapGetters(['singer'])
    },
    methods: {
      _normalizeSong (resData) {
        return resData.map((song) => {
          let data = song.musicData
          return createSong(data)
        })
      },
      _goBack () {
        this.$router.back()
      },
      onscroll (pos) {
        this.scrollY = pos.y
      }
    },
    components: {
      Songlist,
      Scroll,
      Loading,
      SingerInfo
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

