<template>
  <transition name="slide">
    <div class="full-page">
      <scroll class="scroll-content" :data="songList">
        <div>
          <singer-info :info="singerInfo" v-if="songList.length"></singer-info>
          <songlist :songlist="songList"></songlist>
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
  export default {
    name: 'singer-detail',
    data () {
      return {
        songList: [],
        fans: '',
        singerInfo: {}
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
    computed: {
      ...mapGetters(['singer'])
    },
    methods: {
      _normalizeSong (resData) {
        return resData.map((song) => {
          let data = song.musicData
          return createSong(data)
        })
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
  .scroll-content
    height: 100%
</style>

