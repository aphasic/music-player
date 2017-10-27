<template>
  <div>
    <ul class="song-list">
      <li class="list-item" v-for="item in songlist">
        <h2 class="title ellipse-1-line">{{item.name}}</h2>
        <p class="desc ellipse-1-line">
          <a class="singer" href="" v-for="(singer, index) in item.singer">
            <span v-if="index !== 0">/</span>
            {{singer.name}}
          </a>
          {{getDesc(item)}}
        </p>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'songlist',
    props: {
      songlist: {
        type: Array,
        default: []
      }
    },
    methods: {
      getDesc (song) {
        if (song.desc) {
          return `-${song.desc}`
        }
        return `-${song.albumname}`
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .song-list
    padding: 10px 30px
    .list-item
      line-height: 20px
      height: 64px
      .title
        color: $color-text
      .desc
        margin: 4px 0
        color: $color-text-d
</style>

