/**
 * Created by HHH on 2017/10/25.
 */
import * as types from 'store/mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_PLAYER_CREATED] (state, flag) {
    state.isPlayerCreated = flag
  },
  [types.SET_PLAYER_STATE] (state, flag) {
    state.player.isPlaying = flag
  },
  [types.SET_PLAYER_FULLPAGE] (state, flag) {
    state.player.isFullpage = flag
  },
  [types.SET_PLAYER_PLAYLIST] (state, list) {
    state.player.playList = list
  },
  [types.SET_PLAYE_SEQUENCELIST] (state, list) {
    state.player.sequenceList = list
  },
  [types.SET_PLAYER_PLAYMODE] (state, mode) {
    state.player.playMode = mode
  },
  [types.SET_PLAYER_CURRENT] (state, index) {
    state.player.currentIndex = index
  }
}
export default mutations
