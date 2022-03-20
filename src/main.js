import Vue from 'vue'
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import store from './boots/store'
import {install} from  './components'
import api from '@/api/index'
//import has from "./btnPermissions.js"

import './icons' //svg
import './permission' //拦截器
import i18n from '@/boots/lang'
//import './assets/font/font.css'//字体

// 指令勿删
import {directive} from './directive'
directive(Vue)

Vue.prototype.api = api;

//外挂图片
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 3000,
  }
})
// Vue.prototype.$load = loading


// if (process.env.NODE_ENV === 'development') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
console.log(process.env)

Vue.use(Element, {
  size: sessionStorage.getItem('size') || 'medium',
  i18n: (key, value) => i18n.t(key, value)
})
install(Vue)
new Vue({
	el: '#app',
	router,
	i18n,
	store,
	render: h => h(App)
})
