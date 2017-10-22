<template>
  <div class="wrap">
    <scroll :data="discList" ref="scroll" class="scroll-content">
      <div>
        <div class="recommend-slider" ref="recommendSlider" v-if="recommends.length">
          <slider>
            <div class="slider-item" v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImg" alt="slider">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-disc">
          <h2 class="list-title">热门歌单推荐</h2>
          <ul class="disc-list-wrap">
            <li class="list-item" v-for="item in discList">
              <div class="icon">
                <img :src="item.imgurl" alt="img">
              </div>
              <div class="text">
                <h3 class="title ellipse-1-line">{{item.creator.name}}</h3>
                <p class="description ellipse-2-line">
                  {{item.dissname}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  export default {
    data () {
      return {
        recommends: [],
        discList: []
      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImg () {
        if (!this.checkLoad) {
          this.checkLoad = true
          this.$refs.scroll.refresh()
        }
      }
    },
    components: {
      Slider,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .wrap
    width: 100%
    position: fixed
    top: 88px
    bottom: 0
    .scroll-content
      height: 100%
      overflow: hidden
      .slider-item a
        display: block
        width: 100%
        img
          width: 100%
      .disc-list-wrap
        .list-item
          display: flex
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            width: 60px
            padding-right: 20px
            flex: 0 0 60px
            img
              width: 60px
              height: 60px
          .text
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .title
              color: $color-text
              margin-bottom: 10px
            .description
              color: $color-text-d

</style>

