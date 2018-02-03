import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'router/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from 'store/index'

import 'common/stylus/index.styl'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})

Vue.use(VueLazyload, {
  error: require('common/image/default.png'),
  loading: require('common/image/loading.gif')
})

// 将 Number转为 String , 过万时以万为单位
Vue.filter('toThousand', function (num) {
  let str = num.toString()
  let len = str.length
  if (len > 4) {
    return `${str.substring(0, len - 4)}万`
  }
  return str
})
