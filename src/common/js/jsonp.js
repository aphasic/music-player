/**
 * Created by HHH on 2017/10/20.
 */
import originJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  let params = getParams(data)
  url += (url.indexOf('?') < 0 ? '?' : '&') + params
  console.log(url)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
function getParams (data) {
  let params = ''
  for (let key in data) {
    let value = data[key] === undefined ? '' : data[key]
    params += `&${key}=${encodeURIComponent(value)}`
  }
  return params.substring(1)
}
