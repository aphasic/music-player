/**
 * Created by HHH on 2017/10/25.
 */
import * as types from 'store/mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}
export default mutations
