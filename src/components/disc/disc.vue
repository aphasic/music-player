<template>
  <div id="main_container">
    <div id="main_header">
      <h2 class="h-list-title">全部歌单</h2>
      <div class="sort-tag-wrap">
        <a href="#" class="sort-tag" :class="{'active' : (currentSortId === sortId['recommand'])}" @click="selectSort('recommand')">最热</a>
        <a href="#" class="sort-tag" :class="{'active' : (currentSortId === sortId['latest'])}" @click="selectSort('latest')">最新</a>
      </div>
    </div>
    <div id="main_body">
      <scroll class="scroll-content" :data="disclist" :probeType="probeType" :listenScroll="true" @onscroll="onscroll"  ref="scroll">
        <div>
          <disclist :disclist="disclist" ref="discList" @selectItem="selectItem"></disclist>
          <div class="loading-box" v-if="isLoading">
            <loading :title="loadingText"></loading>
          </div>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Disclist from 'base/disclist/disclist'
  import {ERR_OK} from 'api/config'
  import {getDiscList} from 'api/disc'
  import {discInterval, sortId} from 'controllers/disc'
  import {mapMutations} from 'vuex'
  const LoadRefreshDelay = 20
  const DataRefreshDelay = 100
  export default {
    name: 'disc',
    data () {
      return {
        probeType: 3,
        disclist: [],
        sortId: sortId,
        currentSin: 0,
        currentSortId: sortId['recommand'],
        scrollHeight: 0,
        isLoading: false,  // scroll 正好到达底部的标志，是否正在加载下一次数据
        loadingText: '正在加载中'
      }
    },
    created () {
      this._getDiscList(this.currentSin, this.currentEin, this.currentSortId)
    },
    mounted () {
      this.scrollHeight = this.$refs.scroll.$el.offsetHeight
      this.$refs.scroll.refresh()
    },
    computed: {
      currentEin () {
        return this.currentSin + discInterval
      }
    },
    methods: {
      _getDiscList (sin, ein, sortId) {
        getDiscList(sin, ein, sortId).then((res) => {
          if (res.code === ERR_OK) {
            this.disclist = res.data.list
          }
        })
      },
      // isLoading 值发生改变时调用，用于改变 isLoading 同时刷新 scroll
      _loadingChange (refreshDelay) {
        let _this = this
        _this.isLoading = !_this.isLoading
        setTimeout(() => {
          _this.$refs.scroll.refresh()
        }, refreshDelay)
      },
      _loadNextList () {
        let sin = this.currentEin + 1
        getDiscList(sin, sin + discInterval, this.currentSortId).then((res) => {
          if (res.code === ERR_OK) {
            let newList = res.data.list
            this.disclist.push(...newList)
            this.currentSin = sin
            this._loadingChange(DataRefreshDelay)
          }
        })
      },
      onscroll (pos) {
        let discListHeight = this.$refs.discList.$el.offsetHeight
        if (!this.isLoading && (pos.y < (this.scrollHeight - discListHeight))) {
          this._loadingChange(LoadRefreshDelay)
          this._loadNextList()
        }
      },
      selectSort (title) {
        this.currentSin = 0
        this.currentSortId = sortId[title]
        this.discList = []
        this.$refs.scroll.scrollTo(0, 0, 0)
        this._getDiscList(this.currentSin, this.currentEin, this.currentSortId)
      },
      selectItem (disc) {
        this.$router.push({
          path: `/disc/${disc.dissid}`
        })
        this.setDisc(disc)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
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
      height: 35px
      padding: 0 5%
      display: flex
      justify-content: space-around
      align-items: center
      font-size: $font-size-medium
      color: $color-text-l
      .h-list-title
        height: 35px
        line-height: 35px
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
      top: 35px
      bottom: 0
      overflow: hidden
      .scroll-content
        height: 100%
        .loading-box
          height: 60px
          position: relative
</style>

