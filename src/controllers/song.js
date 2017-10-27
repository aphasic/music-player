/**
 * Created by HHH on 2017/10/26.
 */
export default class Song {
  constructor ({id, mid, singer, name, url, desc, albumname}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.url = url
    this.desc = desc
    this.albumname = albumname
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
    albumname: songData.albumname
  })
}
