<template>
  <div>
    <ul class="disc-list">
      <li class="disc-list-item" v-for="disc in disclist">
        <div class="icon">
          <img class="disc-cover" :src="disc.imgurl" alt="disc">
          <div class="icon-footer">
            <span class="left">
              <i class="fa fa-headphones"></i>
              <span>{{disc.listennum | toThousand}}</span>
            </span>
            <span class="right">
              <i class="fa fa-play-circle"></i>
            </span>
          </div>
        </div>
        <div class="text">
          <p class="h-ellipse-2-line">{{disc.dissname}}</p>
          <p class="name">{{disc.creator.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'disclist',
    props: {
      disclist: {
        type: Array,
        default: []
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .disc-list
    overflow: hidden
    margin-right: -2%
    .disc-list-item
      width: 48%
      margin-right: 2%
      padding: 5px 0
      float: left
      font-size: $font-size-small
      color: $color-text
      .icon
        position: relative
        .disc-cover
          width: 100%
        .icon-footer
          width: 90%
          padding: 0 5%
          position: absolute
          z-index: 3
          height: 1.5em
          line-height: 1.5em
          bottom: 1em
          display: flex
          justify-content: space-between
      .text
        margin-top: 5px
        line-height: 1.3em
        height: 3.9em
        .name
          font-size: $font-size-small-s
          color: $color-text-d
          margin: 5px 0

</style>

