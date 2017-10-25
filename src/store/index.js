/**
 * Created by HHH on 2017/10/25.
 */
import * as actions from 'store/actions'
import * as getters from 'store/getters'
import mutations from 'store/mutations'
import state from 'store/state'
import createLogger from 'vuex/dist/logger'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
