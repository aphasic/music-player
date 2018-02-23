import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Disc from 'components/disc/disc'
import DiscDetail from 'components/disc-detail/disc-detail'
import SingerDetail from 'components/singer-detail/singer-detail'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/disc',
      component: Disc,
      children: [
        {
          path: ':id',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
