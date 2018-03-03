<template>
  <div id="main_container">
    <ul class="rank-list" v-if="topList.length">
      <li class="rank-list-item" v-for="topitem in topList">
        <div class="icon">
          <img v-lazy="topitem.picUrl" alt="img">
        </div>
        <ul class="song-list">
          <li class="song-list-item h-ellipse-1-line" v-for="(index, song) in topitem.songList">
            {{index}}.{{song.songname}}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getTopList} from 'api/rank'
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
            console.log(this.topList)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  #main_container
    .rank-list
      .rank-list-item
        height: 100px
        padding-left: 100px
        font-size: $font-size-medium-x
        position: relative
        margin: 20px
        background: $color-highlight-background
        .icon
          width: 100px
          height: 100px
          position: absolute
          top: 0
          left: 0
          img
            width: 100%
            height: 100%
        .song-list
          padding: 0 5%
          height: 100px
          display: flex
          flex-direction: column
          justify-content: space-around
</style>

