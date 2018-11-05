import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Alert,
  Button,
  Dialog,
  Divider,
  Grid,
  Icon,
  Progress,
  Snackbar,
  TextField,
  theme
} from 'muse-ui'
import Loading from 'muse-ui-loading'
import Toast from 'muse-ui-toast'
import Helpers from 'muse-ui/lib/Helpers'
import Message from 'muse-ui-message'
// 组件
Vue.use(Alert)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Divider)
Vue.use(Grid)
Vue.use(Icon)
Vue.use(Progress)
Vue.use(Snackbar)
Vue.use(TextField)
// 插件
Vue.use(Helpers)
Vue.use(Loading)
Vue.use(Toast)
Vue.use(Message, { width: '75%' })
theme.add('zizai', {
  primary: '#41a3ff',
  // secondary: '#ff4081',
  success: '#44c288',
  warning: '#edc65b',
  info: '#60ace6',
  error: '#ff2f47'
}, 'light')

theme.use('zizai')

Vue.config.productionTip = false

let isFirstVisit = true
router.beforeEach(async (to, from, next) => {
  // 统计代码
  if (to.path) {
    try {
      // eslint-disable-next-line no-undef
      _hmt.push(['_trackPageview', location.pathname + '#' + to.fullPath])
    } catch (e) { }
  }
  // 首次进入页面执行
  if (isFirstVisit) {
    isFirstVisit = false
    // TODO 获取活动信息
    // 判断是否微信
    if (!store.state.browser.versions.weChat) {
      try {
        await store.dispatch('onSdkReady')
        // app
        await store.dispatch('getUserInfoApp') // accessToken 设置到store
      } catch (e) {
        // h5
        console.log(e.message)
      }
    }
    if (!store.state.sdk.isApp) {
      // TODO 跨域获取token 并设置到store
    } else {
      // TODO 设置收藏
      store.dispatch('collectActivityApp', { activityId: to.query.activityId, type: 1 })
    }
    // 获取用户信息
    try {
      await store.dispatch('getUserInfo', { accessToken: store.state.userInfo.accessToken })
    } catch (e) {
      // const msg = e.message || e
      // router.app.$toast.error(msg)
      console.log(e)
    }
    if (store.state.browser.versions.weChat) {
      // 接入微信
      try {
        const wxInfo = await store.dispatch('getWeChatConfigInfo', { url: window.location.href })
        const initWxShareParams = { debug: false, appId: wxInfo.appId, timestamp: wxInfo.appId, nonceStr: wxInfo.appId, signature: wxInfo.appId }
        await store.dispatch('initWxShare', initWxShareParams)
        const shareParams = { icon: '', title: '', desc: '', descTimeline: '', link: '' }
        store.dispatch('changeWxShare', shareParams)
      } catch (e) {
        const msg = e.message || e
        router.app.$toast.error(msg)
      }
    }
    // TODO 根据信息跳转 next({ name: 'home', query: to.query })
    next()
    return
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
