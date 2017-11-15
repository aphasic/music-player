<template>
  <div class="slider" ref="slider">
    <div class="slider-items-wrap" ref="sliderItemsWrap" @touchstart="onTouchStart"
         @touchmove="onTouchMove"
         @touchend="onTouchEnd">
      <slot>
      </slot>
    </div>
    <div class="slider-dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots">
      </span>
    </div>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    position: relative
    width: 100%
    height: 100%
    .slider-items-wrap
      position: relative
      width: 100%
      height: 100%
      .slider-item
        position: absolute
        width: 100%
        left: 0
        top: 25px
        bottom: 45px
    .slider-dots
      position: absolute
      text-align: center;
      left: 0
      right: 0
      bottom: 12px
      .dot
        display: inline-block
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        margin: 0 4px
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

<script type="text/ecmascript-6">
//  import {deleteUnit} from 'common/js/util'
  const WIDTH = window.innerWidth
  export default {
    name: 'fadeSlider',
    // 参数说明：left , middle , right 的 index 应当按顺序传入，可以依次是‘ 0，1, 2’ 或 ‘0，1 ，无’ 或 ‘无，0，1’
    props: {
      leftIndex: {
        type: Number,
        default: -1
      },
      middleIndex: {
        type: Number,
        default: -1
      },
      rightIndex: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: -1
      }
    },
    created () {
      this.pages = this._initPages()
      this.currentPageIndex = this.middleIndex
      this.dotsLen = 0
      this.touch = {
        startX: 0,         // 触碰起始位置
        startY: 0,
        moved: false,     // 触摸是否移动，初始化每次触摸的部分数据
        key: '',           // 移动的 page 是 pages 中的哪一页，存储对应键值
        deltaX: 0,          // 移动过程中 X 的增值
        deltaY: 0
      }
    },
    mounted () {
      this._initDots()
      this._initItems()
    },
    methods: {
      _initPages () {
        let pages = {
          left: {
            index: this.leftIndex,        // 左边页面的index
            _left: -WIDTH,               // 记录左边页面（没有移动）时的left值，取值只可能为 -WIDTH 或 1
            minLeft: -WIDTH,             // 记录左边页面 left 值的最小边界
            maxLeft: 0                    // 记录左边页面 left 值的最大边界
          },
          middle: {
            index: this.middleIndex,
            _left: 0,
            minLeft: 0,
            maxLeft: 0
          },
          right: {
            index: this.rightIndex,
            _left: WIDTH,
            minLeft: 0,
            maxLeft: WIDTH
          }
        }
        return pages
      },
      _initDots () {
        let children = this.$refs.sliderItemsWrap.children
        this.dotsLen = children.length
        this.dots = new Array(this.dotsLen)
      },
      // 初始化元素， 根据传进来的index值将元素进行左中右分布，设置left值
      _initItems () {
        let children = this.$refs.sliderItemsWrap.children
        for (let item in this.pages) {
          let index = this.pages[item].index
          if (index !== -1) {
            children[index].style.left = `${this.pages[item]._left}px`
          }
        }
      },
      // 触摸时，根据当前显示的页面和当前触摸的 X 方向增量来计算当前应当随滑动位置而改变位置的页
      // 中间页是始终固定不动的，要移动的一定是左页或右页，设置this.touch.key 记录其键值
      _setMoveItem (deltaX) {
        let key = ''
        for (let item in this.pages) {
          let index = this.pages[item].index
          // 如果当前页就是左页或右页，则需要移动的页就是当前显示的页
          if (index === this.currentPageIndex) {
            key = item
            // 如果当前页是中间页，则分类判断
            if (index === this.middleIndex) {
              key = ''
              // 在左、右页存在的情况下，根据 deltaX 判断需要移动的页
              // 其余的情况记录 key 值为空串
              if (deltaX > 0 && this.leftIndex !== -1) {
                key = 'left'
              } else if (deltaX < 0 && this.rightIndex !== -1) {
                key = 'right'
              }
            }
          }
          this.touch.key = key
        }
      },
      onTouchStart (e) {
        let touch = e.touches[0]
        this.touch.moved = false
        this.touch.direction = 'x'
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      onTouchMove (e) {
        let touch = e.touches[0]
        let deltaX = touch.pageX - this.touch.startX
        let deltaY = touch.pageY - this.touch.startY
        this.touch.deltaX = deltaX
        // 初次move时，设置记录当前应当随着 X 增量而改变位置的元素
        if (!this.touch.moved) {
          // 主要设置 this.touch.key值
          this._setMoveItem(deltaX)
          this.touch.moved = true
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            this.touch.direction = 'y'
            return
          }
        }
        if (this.touch.direction === 'y') {
          return
        }
        // 若 key 值为空串，说明需要移动的页是缺失页，则返回
        if (!this.touch.key) {
          return
        }
        // 移动item
        let moveItem = this.pages[this.touch.key]
        let children = this.$refs.sliderItemsWrap.children
        // offset：如果 deltaX + moveItem._left 在移动页的移动范围之内，则这个值就是新的 left值
        let offset = Math.min(moveItem.maxLeft, Math.max(moveItem.minLeft, deltaX + moveItem._left))
        let percent = Math.abs(offset) / WIDTH
        this.$emit('setOpacity', percent)
        children[moveItem.index].style.left = `${offset}px`
      },
      onTouchEnd () {
        // 如果没有 move , 直接返回
        if (!this.touch.moved) {
          this.touch.moved = false
          return
        }
        // 如果 key 为空串，需要移动的页是缺失页，则不进行移动操作，直接返回
        if (!this.touch.key) {
          return
        }
        if (this.touch.direction === 'y') {
          this.touch.direction = 'x'
          return
        }
        let children = this.$refs.sliderItemsWrap.children
        let moveItem = this.pages[this.touch.key]
        // 稳定时，移动页 left 只能为 minLeft 或 maxLeft, middle的透明度也只能为 0 或 1
        let offset = this.touch.deltaX > 0 ? moveItem.maxLeft : moveItem.minLeft
        let percent = offset === 0 ? 0 : 1
        children[moveItem.index].style.left = `${offset}px`
        this.currentPageIndex = offset === 0 ? moveItem.index : this.middleIndex
        this.$emit('setOpacity', percent)
        moveItem._left = offset
      }
    }
  }
</script>
