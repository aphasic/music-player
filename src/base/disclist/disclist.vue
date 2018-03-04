<template>
  <div>
    <ul class="disc-list">
      <li class="disc-list-item" v-for="disc in disclist" @click="onItemClick(disc)">
        <icon-with-footer :imgurl="disc.imgurl" :listennum="disc.listennum" :isPlayIconShow="true" @onPlayClick="onPlayClick(disc)"></icon-with-footer>
        <div class="text">
          <p class="h-ellipse-2-line">{{disc.dissname}}</p>
          <p class="name">{{disc.creator.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import IconWithFooter from 'base/icon-with-footer/icon-with-footer'
  export default {
    name: 'disclist',
    props: {
      disclist: {
        type: Array,
        default: []
      }
    },
    methods: {
      onItemClick (disc) {
        this.$emit('selectItem', disc)
      },
      onPlayClick (disc) {
        this.$emit('clickPlay', disc)
      }
    },
    components: {
      IconWithFooter
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
      .text
        margin-top: 5px
        line-height: 1.3em
        height: 3.9em
        .name
          font-size: $font-size-small-s
          color: $color-text-d
          margin: 5px 0

</style>

