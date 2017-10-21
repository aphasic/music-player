<template>
  <div id="app">
    <main-header></main-header>
    <main-nav></main-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import MainHeader from 'components/main-header/main-header.vue'
  import MainNav from 'components/main-nav/main-nav.vue'
  export default {
    components: {
      MainHeader,
      MainNav
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
</style>
