/**
 * Created by HHH on 2017/10/26.
 */
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor ({id, mid, singer, name, url, desc, albumname, image, duration, songtype}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.url = url
    this.desc = desc
    this.albumname = albumname
    this.image = image
    this.duration = duration
    this.songtype = songtype
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid, this.songtype).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          let err = '没有歌词'
          reject(err)
        }
      })
    })
  }
}

export function createSong (songData) {
  return new Song({
    id: songData.songid,
    mid: songData.songmid,
    singer: songData.singer,
    name: songData.songname,
    url: `http://ws.stream.qqmusic.qq.com/${songData.songid}.m4a?fromtag=46`,
    desc: songData.albumdesc,
    albumname: songData.albumname,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${songData.albummid}.jpg?max_age=2592000`,
    duration: songData.interval,
    songtype: songData.songtype
  })
}
