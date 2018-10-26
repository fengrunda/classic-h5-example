import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  // 统计代码
  if (to.path) {
    try {
      // eslint-disable-next-line no-undef
      _hmt.push(['_trackPageview', location.pathname + '#' + to.fullPath])
    } catch (e) { }
  }
  next()
})
// 因为数果在app的webview是靠监听hashchange事件进行页面统计，所以需要主动派发
const evt = document.createEvent('HTMLEvents')
evt.initEvent('hashchange', true, true)
router.afterEach((to, from) => {
  // 主动派发hashchange
  window.dispatchEvent(evt)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
