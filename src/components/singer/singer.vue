<template>
  <div>
    <listview :listData="singerList"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {Singer} from 'common/js/class'
  import Listview from 'base/listview/listview'

  const HOT_NAME = '热门'
  const HOT_NUM = 10
  export default {
    data () {
      return {
        singerList: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list)
          }
        })
      },
      // 将原始返回的 json 数组格式化并排序
      _normalizeSinger (resList) {
        // singerObj 以分类名( A 到 Z 或‘hot')为键，对应数据为 值
        let singerObj = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        resList.forEach((item, index) => {
          // 前10个为热门推荐
          if (index < HOT_NUM) {
            singerObj['hot'].items.push(new Singer({name: item.Fsinger_name, id: item.Fsinger_mid}))
          }
          // 此后以item.Findex为title
          let key = item.Findex
          if (singerObj[key] === undefined) {
            singerObj[key] = {
              title: key,
              items: []
            }
          }
          let singer = new Singer({name: item.Fsinger_name, id: item.Fsinger_mid})
          singerObj[key].items.push(singer)
        })
        // 将singerObj转换成数组，先将热门之外的像push,先排序
        let resArr = []
        for (let key in singerObj) {
          if (singerObj[key].title !== HOT_NAME && singerObj[key].title.match(/[a-zA-Z]/)) {
            resArr.push(singerObj[key])
          }
        }
        resArr.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // 将热门添加到数组头
        resArr.unshift(singerObj['hot'])
        return resArr
      }
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

</style>

