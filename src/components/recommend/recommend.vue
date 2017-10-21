<template>
  <div>
    <div class="recommend-slider" ref="recommendSlider" v-if="recommends.length">
      <slider>
        <div class="slider-item" v-for="item in recommends">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="slider">
          </a>
        </div>
      </slider>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  export default {
    data () {
      return {
        recommends: []
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
            console.log(this.recommends)
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data)
          }
        })
      }
    },
    components: {
      Slider
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slider-item a
    display: block
    width: 100%
    img
      width: 100%
</style>

