<template>
  <div id="main_container">
    <scroll class="scroll-content" :data="topList">
      <div>
        <ul class="rank-list" v-if="topList.length">
          <li class="rank-list-item" @click="selectItem(topitem)" v-for="topitem in topList">
            <icon-with-footer :imgurl="topitem.picUrl" :listennum="topitem.listenCount" :isPlayIconShow="true"></icon-with-footer>
            <ul class="song-list">
              <li class="song-list-item h-ellipse-1-line" v-for="(song, index) in topitem.songList">
                <span class="song-index">{{index + 1}}</span>
                <span class="song-name">{{song.songname}}</span>
                <span class="singer-name">{{song.singername}}</span>
              </li>
            </ul>
            <i class="read-more fa fa-chevron-right"></i>
          </li>
        </ul>
      </div>
    </scroll>
    <loading v-if="!topList.length"></loading>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getTopList} from 'api/rank'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapMutations} from 'vuex'
  import IconWithFooter from 'base/icon-with-footer/icon-with-footer'
  export default {
    name: 'rank',
    data () {
      return {
        topList: []
      }
    },
    created () {
      this._getTopList()
    },
    methods: {
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      selectItem (topitem) {
        this.$router.push({
          path: `/rank/${topitem.id}`
        })
        this.setRank(topitem)
      },
      ...mapMutations({
        setRank: 'SET_RANK'
      })
    },
    components: {
      Scroll,
      IconWithFooter,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  #main_container
    height: 100%
    .scroll-content
      height: 100%
      overflow: hidden
      .rank-list
        border: 1px solid transparent
        .rank-list-item
          height: 120px
          padding-left: 120px
          font-size: $font-size-medium
          position: relative
          margin: 10px
          background: $color-highlight-background
          .read-more
            display: block
            width: 16px
            height: 16px
            text-align: center
            line-height: 16px
            position: absolute
            right: 12px
            top: 50%
            margin-top: -8px
            color: $color-text-d
          .icon
            width: 120px
            height: 120px
            position: absolute
            top: 0
            left: 0
            img
              width: 100%
              height: 100%
          .song-list
            padding: 0 40px 0 5%
            height: 120px
            display: flex
            flex-direction: column
            justify-content: space-around
            .song-list-item
              letter-spacing: 2px
              color: $color-text-d
              .song-name,.song-index
                color: $color-text
              .singer-name
                position: relative
                margin-left: 18px
                &:before
                  content: ''
                  display: inline-block
                  width: 7px
                  height: 1px
                  background: $color-text
                  position: absolute
                  top: 50%
                  left: -15px
</style>

