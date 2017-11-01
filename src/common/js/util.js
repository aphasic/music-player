/**
 * Created by HHH on 2017/10/30.
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
// 将传入的秒数转换成 XX（分）:XX（秒） 的形式
export function normalizeTime (interval) {
  let minute = Math.floor(interval / 60)
  let second = Math.floor(interval % 60)
  minute = minute.toString().padStart(2, '00')
  second = second.toString().padStart(2, '00')
  return `${minute}:${second}`
}
