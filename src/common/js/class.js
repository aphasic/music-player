/**
 * Created by HHH on 2017/10/23.
 */
export class Singer {
  constructor ({id, name}) {
    this.name = name
    this.id = id
    this.imgurl = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
