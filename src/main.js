// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Row, Radio, Col, Slider, Input, Switch, InputNumber} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.use(Row)
Vue.use(Radio)
Vue.use(Col)
Vue.use(Slider)
Vue.use(Input)
Vue.use(Switch)
Vue.use(InputNumber)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
