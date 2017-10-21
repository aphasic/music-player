/**
 * Created by HHH on 2017/10/20.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList () {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  let data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: 'https://c.y.qq.com/',
      timeout: 1000,
      headers: {
        referer: 'https://y.qq.com/',
        host: 'y.qq.com'
      }
    })
    instance.get(url, data).then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
