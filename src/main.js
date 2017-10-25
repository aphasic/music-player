import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'router/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})

Vue.use(VueLazyload, {
  error: require('common/image/default.png'),
  loading: require('common/image/loading.gif')
})
