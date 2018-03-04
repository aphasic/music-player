import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playmode} from 'controllers/player'
import {shuffle} from 'common/js/util'

export const playerMixin = {
  computed: {
    ...mapGetters([
      'player',
      'currentSong'
    ])
  },
  methods: {
    // 更新 mode
    // 更新 顺序列表
    // 同时自动更新 播放列表和 currentSong 的 index
    _changePlayList (sequenceList, mode) {
      let playList = sequenceList
      let currentSong = sequenceList[this.player.currentIndex]
      if (this.player.sequenceList !== sequenceList) {
        this.setCurrentIndex(0)
        this.setSequenceList(sequenceList)
      }
      if (this.player.playMode !== mode) {
        this.setPlayMode(mode)
        if (this.player.playList.length) {
          currentSong = this.player.playList[this.player.currentIndex]
        }
      }
      if (mode === playmode.random) {
        playList = shuffle(sequenceList)
      }
      this.setPlayList(playList)
      this.setCurrentIndex(playList.indexOf(currentSong))
    },
    ...mapMutations({
      setFullPage: 'SET_PLAYER_FULLPAGE',
      setIsCreated: 'SET_PLAYER_CREATED',
      setPlayMode: 'SET_PLAYER_PLAYMODE',
      setPlayList: 'SET_PLAYER_PLAYLIST',
      setSequenceList: 'SET_PLAYE_SEQUENCELIST',
      setCurrentIndex: 'SET_PLAYER_CURRENT',
      setPlayingState: 'SET_PLAYER_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const playerCreatedMixin = {
  computed: {
    ...mapGetters([
      'isPlayerCreated'
    ])
  },
  mounted () {
    this.onPlayerCreated(this.isPlayerCreated)
  },
  activated () {
    this.onPlayerCreated(this.isPlayerCreated)
  },
  watch: {
    isPlayerCreated (newState) {
      this.onPlayerCreated(newState)
    }
  },
  methods: {
    onPlayerCreated () {
      throw new Error('component must implement onPlayerCreated method')
    }
  }
}
