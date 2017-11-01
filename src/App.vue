<template>
  <div id="app" >
    <div id="main_header">
      <main-header></main-header>
      <main-nav></main-nav>
    </div>
    <div id="main_content" ref="mainContent">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <player v-if="isPlayerCreated"></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MainHeader from 'components/main-header/main-header.vue'
  import MainNav from 'components/main-nav/main-nav.vue'
  import Player from 'components/player/player.vue'
  import {playerCreatedMixin} from 'controllers/mixin'
  export default {
    mixins: [playerCreatedMixin],
    components: {
      MainHeader,
      MainNav,
      Player
    },
    methods: {
      onPlayerCreated (flag) {
        if (flag === true) {
          this.$refs.mainContent.style.bottom = '60px'
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
  #app
    height: 100%
    position: relative
  #main_header
    height: 88px
  #main_content
    width: 100%
    position: absolute
    top: 88px
    bottom: 0
</style>
