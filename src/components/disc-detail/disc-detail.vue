<template>
  <transition name="slide">
    <div class="h-full-page">
      <div class="disc-info-wrap">
        <disc-info :discInfo="discInfo" @goBack="_goBack"></disc-info>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import discInfo from './disc-info.vue'
  import {mapGetters} from 'vuex'
  import {getDiscDetail} from 'api/disc'
  import {ERR_OK} from 'api/config'
  export default {
    name: 'disc-detail',
    data () {
      return {
        isLoading: true,
        discInfo: {}
      }
    },
    created () {
      this._getDiscDetail()
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
            this.discInfo = {
              name: disc.dissname,
              desc: disc.desc,
              author: disc.nickname,
              headurl: disc.headurl,
              imgurl: disc.logo,
              listennum: disc.visitnum
            }
          }
          console.log(res)
        })
      },
      _goBack () {
        this.$router.back()
      }
    },
    components: {
      discInfo
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
</style>

