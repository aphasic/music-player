<template>
  <div class="container">
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
          <h2 class="h-list-title">热门歌单推荐</h2>
          <ul class="disc-list-wrap">
            <li class="list-item" v-for="item in discList" @click="selectDisc(item)">
              <div class="h-media-middle">
                <div class="icon">
                  <img v-lazy="item.imgurl" alt="img">
                </div>
                <div class="text">
                  <h3 class="title h-ellipse-1-line">{{item.creator.name}}</h3>
                  <p class="description h-ellipse-2-line">
                    {{item.dissname}}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <loading v-if="!discList.length"></loading>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend'
  import {playerCreatedMixin} from 'controllers/mixin'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playerCreatedMixin],
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
      },
      onPlayerCreated (flag) {
        if (flag === true) {
          this.$refs.scroll.refresh()
        }
      },
      selectDisc (disc) {
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
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/base"
  .container
    height: 100%
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
          padding: 0 20px 20px 20px
          .h-media-middle
            .text
              .title
                color: $color-text
                margin-bottom: 10px
              .description
                color: $color-text-d
</style>

