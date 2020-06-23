import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/Index'
import LotusComponent from '@/components/LotusComponent'
import TextComponent from '@/components/text'

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
    }
  ]
})
