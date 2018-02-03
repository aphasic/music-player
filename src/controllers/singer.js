export default class Singer {
  constructor ({id, name, mid, imgurl}) {
    this.id = id
    this.name = name
    this.mid = mid
    this.imgurl = imgurl
  }
}
export function createSinger (singerData) {
  return new Singer({
    id: singerData.Fsinger_id,
    name: singerData.Fsinger_name,
    mid: singerData.Fsinger_mid,
    imgurl: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerData.Fsinger_mid}.jpg?max_age=2592000`
  })
}
