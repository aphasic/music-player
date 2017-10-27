/**
 * Created by HHH on 2017/10/23.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'api/config'

export function getSingerList () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let data = {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  let params = Object.assign({}, data, commonParams)
  return jsonp(url, params, options)
}
export function getSingerDetail (id) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let data = {
    singerid: id,
    g_tk: 5381,
    uin: 0,
    platform: 'h5Page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 80,
    begin: 0,
    _: '1508979735162'
  }
  let params = Object.assign({}, data, commonParams)
  return jsonp(url, params, options)
}
