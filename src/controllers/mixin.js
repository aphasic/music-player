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
    _changePlayList (sequenceList, mode) {
      if (mode !== playmode.random) {
        this.setPlayList(sequenceList)
        return true
      }
      let playList = shuffle(sequenceList)
      this.setPlayList(playList)
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
