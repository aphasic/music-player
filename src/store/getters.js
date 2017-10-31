/**
 * Created by HHH on 2017/10/25.
 */
export const singer = state => state.singer
export const player = state => state.player
export const currentSong = state => state.player.playList[state.player.currentIndex]
export const isPlayerCreated = state => state.isPlayerCreated
