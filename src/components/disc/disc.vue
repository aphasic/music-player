<template>
  <div id="main_container">
    <div id="main_header">
      <h2 class="h-list-title">全部歌单</h2>
      <div class="sort-tag-wrap">
        <a href="#" class="sort-tag active">最热</a>
        <a href="#" class="sort-tag">最新</a>
      </div>
    </div>
    <div id="main_body">
      <scroll class="scroll-content" :data="disclist" :probeType="probeType" :listenScroll="true" @onscroll="onscroll"  ref="scroll">
        <div>
          <disclist :disclist="disclist" ref="discList"></disclist>
          <div class="loading-box" v-if="isLoading">
            <loading :title="loadingText"></loading>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Disclist from 'base/disclist/disclist'
  import {ERR_OK} from 'api/config'
  import {getDiscList} from 'api/disc'
  import {discInterval} from 'controllers/disc'
  export default {
    name: 'disc',
    data () {
      return {
        probeType: 3,
        disclist: [],
        currentSin: 0,
        scrollHeight: 0,
        isLoading: false,  // scroll 正好到达底部的标志，是否正在加载下一次数据
        loadingText: '正在加载中'
      }
    },
    created () {
      this._getDiscList(this.currentSin, this.currentEin)
    },
    mounted () {
      this.scrollHeight = this.$refs.scroll.$el.offsetHeight
    },
    computed: {
      currentEin () {
        return this.currentSin + discInterval
      }
    },
    methods: {
      _getDiscList (sin, ein) {
        getDiscList(sin, ein).then((res) => {
          if (res.code === ERR_OK) {
            this.disclist = res.data.list
          }
        })
      },
      // isLoading 值发生改变时调用，用于改变 isLoading 同时刷新 scroll
      _loadingChange () {
        let _this = this
        this.isLoading = !this.isLoading
        setTimeout(() => {
          _this.$refs.scroll.refresh()
        }, 20)
//        this.$nextTick(() => {
//          _this.$refs.scroll.refresh()
//        })
      },
      _loadNextList () {
        let sin = this.currentEin + 1
        getDiscList(sin, sin + discInterval).then((res) => {
          if (res.code === ERR_OK) {
            let newList = res.data.list
            this.disclist.push(...newList)
            this.currentSin = sin
            this._loadingChange()
          }
        })
      },
      onscroll (pos) {
        console.log(this.disclist.length)
        let discListHeight = this.$refs.discList.$el.offsetHeight
        if (!this.isLoading && (pos.y < (this.scrollHeight - discListHeight))) {
          this._loadingChange()
          this._loadNextList()
        }
      }
    },
    components: {
      Disclist,
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  #main_container
    height: 100%
    position: relative
    #main_header
      height: 65px
      padding: 0 5%
      display: flex
      justify-content: space-around
      align-items: center
      font-size: $font-size-medium
      color: $color-text-l
      .h-list-title
        flex: 0 0 auto
        color: $color-text-l
      .sort-tag-wrap
        overflow: hidden
        text-align: right
        flex: 1
        .sort-tag
          padding: 0 8px
          margin-right: -1px
          text-align: center
          border-right: 1px solid $color-text-l
          &.active
            color: $color-theme

    #main_body
      position: absolute
      top: 65px
      bottom: 0
      overflow: hidden
      .scroll-content
        height: 100%
        .loading-box
          height: 60px
          position: relative
</style>

