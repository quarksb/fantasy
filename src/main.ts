// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from "vue";
import App from "./App.vue";
import {
  Row,
  Radio,
  Col,
  Slider,
  Input,
  Switch,
  InputNumber,
} from "ant-design-vue";
import HelloWorld from './components/Index.vue'
import LotusComponent from './components/lotus.vue'
import TextComponent from './components/text/index.vue'
import HeartFlowers from './components/heartFlowers.vue'
import Collision from './components/collision.vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import "ant-design-vue/dist/antd.less";


/* eslint-disable no-new */
const app = createApp(App);
app.config.productionTip = false;
app.use(Row);
app.use(Radio);
app.use(Col);
app.use(Slider);
app.use(Input);
app.use(Switch);
app.use(InputNumber);

const router = createRouter({
  history: createWebHashHistory(),
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

app.use(router);
app.mount('#app');