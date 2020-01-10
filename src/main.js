import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueLazyLoad from 'vue-lazyload'
import '../static/css/reset.css'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' ,zIndex: 30000})
Vue.use(VueLazyLoad)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
