/**
 * Created by HHH on 2018/2/1.
 */
import {commonParams} from './config'
import axios from 'axios'

// 获取推荐歌单列表, 从第 sin 个到底 ein 个（包括 sin 和 ein)
export function getDiscList (sin, ein) {
  const url = 'api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: sin,
    ein: ein,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
