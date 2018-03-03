<template>
  <transition name="slide">
    <div class="h-full-page">
      <div class="disc-info-wrap" ref="discInfoWrap">
        <detail-info :hasListTitle="true" :title="disc.dissname" :scrollY="scrollY" @goBack="_goBack" v-if="songList.length">
          <div slot="bgImage" class="h-img-background-blur">
            <img :src="disc.imgurl" alt="img">
          </div>
          <div slot="content" class="disc-info-content">
            <div class="h-media-middle">
                <div class="icon">
                  <img :src="disc.imgurl" alt="img">
                  <div class="icon-footer">
                    <i class="fa fa-headphones"></i>
                    <span>{{disc.listennum | toThousand}}</span>
                  </div>
                </div>
                <div class="text">
                  <h3 class="line title h-ellipse-2-line">{{disc.dissname}}</h3>
                  <p class="line author h-ellipse-1-line">
                    <img v-lazy="discInfo.headurl" alt="author">
                    {{disc.creator.name}}
                  </p>
                  <p class="line description h-ellipse-1-line">
                    简介:{{discInfo.desc}}
                  </p>
                </div>
              </div>
          </div>
        </detail-info>
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
  import DetailInfo from 'base/detail-info/detail-info'
  import Songlist from 'base/songlist/songlist'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {createSong} from 'controllers/song'
  import {mapGetters} from 'vuex'
  import {getDiscDetail} from 'api/disc'
  import {ERR_OK} from 'api/config'
  const COLOR_BACKGROUND = '#222'
   // 随机播放按钮处的高度
  const LIST_TITLE_HEIGHT = 50
  export default {
    name: 'disc-detail',
    data () {
      return {
        probeType: 3,
        isLoading: true,
        discInfo: {},
        songList: [],
        listBgColor: COLOR_BACKGROUND,
        scrollY: 0,
        bgStyle: ''
      }
    },
    created () {
      this._getDiscDetail()
    },
    mounted () {
      this.$nextTick(() => {
        if (!this.$refs.discInfoWrap) {
          return
        }
        let imageHeight = this.$refs.discInfoWrap.offsetHeight
        this.$refs.scroll.$el.style.top = `${imageHeight + LIST_TITLE_HEIGHT}px`
      })
    },
    computed: {
      ...mapGetters(['disc'])
    },
    methods: {
      _getDiscDetail () {
        if (!this.disc.dissid) {
          this.$router.push('/disc')
          return
        }
        getDiscDetail(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            let disc = res.cdlist[0]
            this.songList = this._normalizeSong(disc.songlist)
            this.discInfo = {
              desc: disc.desc,
              headurl: disc.headurl
            }
          }
        })
      },
      onscroll (pos) {
        this.scrollY = pos.y
      },
      _goBack () {
        this.$router.back()
      },
      _normalizeSong (resData) {
        return resData.map((song) => {
          return createSong(2, song)
        })
      }
    },
    components: {
      DetailInfo,
      Scroll,
      Songlist,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .disc-info-wrap
    position: relative
    width: 100%
    height: 0
    padding-top: 60%
  .scroll-content
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
</style>

