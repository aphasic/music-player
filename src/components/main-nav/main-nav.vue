<template>
  <ul class="h-horizon-list-wrap nav-wrap">
    <li class="list-item">
      <router-link tag="a" class="link" to="/recommend"><span>推荐</span></router-link>
    </li>
    <li class="list-item">
      <router-link tag="a" class="link" to="/singer"><span>歌手</span></router-link>
    </li>
    <li class="list-item">
      <router-link tag="a" class="link" to="/disc"><span>精选歌单</span></router-link>
    </li>
    <li class="list-item">
      <router-link tag="a" class="link" to="/rank"><span>排行</span></router-link>
    </li>
    <li class="list-item">
      <router-link tag="a" class="link" to="/search"><span>搜索</span></router-link>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .nav-wrap
    display: flex
    .list-item
      height: 44px
      flex: 1
      text-align: center
      font-size: $font-size-medium
      .link
        display: block
        width: 100%
        height: 100%
        color: $color-text-l
        line-height: 44px
        span
          padding-bottom: 5px;
        &.router-link-active
          color: $color-theme
          span
            border-bottom: 2px solid $color-theme
</style>
