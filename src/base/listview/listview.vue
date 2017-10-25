<template>
  <div id="listview_container">
    <div class="list-fixed-group" v-if="currentIndex>=0 && currentIndex<listData.length">
      <h2 class="list-group-title">{{listData[currentIndex].title}}</h2>
    </div>
    <ul class="nav-list-wrap" @touchstart="onNavTouchstart" @touchmove="onNavTouchmove">
      <li class="list-item" v-for="(item, index) in listData" :class="{'active': anchorIndex === index}" :data-index="index">
        {{item.title.substring(0,1)}}
      </li>
    </ul>
    <scroll class="scroll-content" :data="listData" :listenScroll="listenScroll" :probe-type="probeType" @onscroll="onscroll" ref="scroll">
      <div>
        <ul class="main-list-wrap">
          <li class="list-group" v-for="item in listData" ref="listGroup">
            <h2 class="list-group-title">{{item.title}}</h2>
            <ul>
              <li class="list-group-item" v-for="member in item.items" @click="selectItem(member)">
                <div class="media-middle">
                  <div class="icon">
                    <img v-lazy="member.imgurl" alt="member-img">
                  </div>
                  <div class="text">
                    {{member.name}}
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <loading v-if="!listData.length"></loading>
    </scroll>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/base"
  #listview_container
    height: 100%
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-fixed-group
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: 2
    .nav-list-wrap
      position: absolute
      top: 50%
      right: 0
      transform: translateY(-50%)
      z-index: 30
      .list-item
        padding: 3px
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color: $color-theme
    .scroll-content
      height: 100%
      overflow: hidden
      .main-list-wrap
        .list-group
          .list-group-item
            margin: 20px 0 20px 30px
            .media-middle
              .icon
                width: 50px
                height: 50px
                flex: 0 0 50px
                border-radius: 50%
                overflow: hidden
</style>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getAttr} from 'common/js/dom'
  import Loading from 'base/loading/loading'

  const LIST_MARGIN = 20
  const SCROLL_TIME = 1000   // 滚动到某位置时的过渡时间
  const ANCHOR_HEIGHT = 18   // 右侧滑动nav区块一每个li 的高度
  export default {
    name: 'listview',
    props: {
      listData: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        listenScroll: true,
        probeType: 3,
        currentIndex: 0,      // 当前高亮的字母区块，listData 的 index
        anchorIndex: 0        // 当前高亮的nav区块，nav 的index
      }
    },
    created () {
      this.listHeight = []
      this.touch = {
        y: 0,
        touchIndex: 0         // 右侧滑动时的滑动相关量
      }
    },
    methods: {
      // 左侧滑动时，根据滚动区块高度和滚动位置计算并改变 this.currentIndex
      onscroll (pos) {
        let posY = pos.y
        let len = this.listHeight.length
        for (let i = 0; i < len - 1; i++) {
          if (posY > 0) {
            this.currentIndex = -1
            this.anchorIndex = 0
            return
          } else if (-this.listHeight[i] >= posY && (-this.listHeight[i + 1]) < posY) {
            this.currentIndex = i
            this.anchorIndex = this.currentIndex
            return
          }
        }
        this.currentIndex = len - 1
        this.anchorIndex = this.currentIndex
      },
      // 右侧滚动或点击时，改写 this.currentIndex
      onNavTouchstart (event) {
        let firstTouch = event.touches[0]
        let _index = parseInt(getAttr(event.target, 'index'))
        this.touch.y = firstTouch.pageY
        this.touch.touchIndex = _index
        this._scrollTo(_index)
      },
      onNavTouchmove (event) {
        let firstTouch = event.touches[0]
        let _index = parseInt(getAttr(event.target, 'index'))
        let y = firstTouch.pageY
        _index += parseInt((y - this.touch.y) / ANCHOR_HEIGHT)
        this._scrollTo(_index)
      },
      // 计算每个字母区块滚动的高度，即其之前所有元素的高度
      selectItem (item) {
        this.$emit('selectItem', item)
      },
      _calculateHeight () {
        let _height = 0
        let lists = this.$refs.listGroup
        lists.forEach((item, index) => {
          this.listHeight.push(_height)
          // 内尺寸 + 20px 的下边距(由其子元素产生的margin)
          _height += item.clientHeight + LIST_MARGIN
        })
      },
      _scrollTo (index) {
        let lists = this.$refs.listGroup
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 1) {
          index = this.listHeight.length - 1
        }
        if (this.currentIndex !== index) {
          this.currentIndex = index
          this.anchorIndex = this.currentIndex
        }
        this.$refs.scroll.scrollToElement(lists[index], SCROLL_TIME)
      }
    },
    components: {
      Scroll,
      Loading
    },
    watch: {
      listData () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      }
    }
  }
</script>
