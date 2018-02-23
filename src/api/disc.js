/**
 * Created by HHH on 2018/2/1.
 */
import {commonParams} from './config'
import axios from 'axios'

// 获取推荐歌单列表, 从第 sin 个到底 ein 个（包括 sin 和 ein)
export function getDiscList (sin, ein, sortId) {
  const url = 'api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: sin,
    ein: ein,
    sortId: sortId,
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

// 获取歌单详情
export function getDiscDetail (dissid) {
  const url = 'api/getDiscDetail'
  const data = Object.assign({}, commonParams, {
    g_tk: '5381',
    platform: 'h5',
    needNewCode: 1,
    new_format: 1,
    pic: 500,
    disstid: dissid,
    type: 1,
    utf8: 1,
    onlysong: 0,
    picmid: 1,
    nosign: 1,
    _: '1519367593982'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    console.log(err)
  })
}
