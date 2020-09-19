import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Router from 'vue-router'
import store from './store'
import headerNavi from './components/HeaderNavi'
import middle from './components/Middle'
import bottom from './components/Bottom'
import leftSide from './components/LeftSide'
import Blob from './util/Blob.js'
import Export2Excel from './util/Export2Excel.js'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.component("headerNavi-view", headerNavi)
Vue.component("middle-view", middle)
Vue.component("bottom-view", bottom)
Vue.component("leftSide-view", leftSide)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
