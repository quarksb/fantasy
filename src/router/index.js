import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/Index'
import LotusComponent from '@/components/Lotus'
import TextComponent from '@/components/text'
import HeartFlowers from '@/components/heartFlowers'
import Collision from '@/components/collision'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/lotus',
      name: 'lotus',
      component: LotusComponent
    },
    {
      path: '/magicText',
      name: 'magixText',
      component: TextComponent
    },
    {
      path: '/heartFlowers',
      name: 'heartFlowers',
      component: HeartFlowers
    },
    {
      path: '/collision',
      name: 'collision',
      component: Collision
    }
  ]
})
