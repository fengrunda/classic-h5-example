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
    // 获取活动信息
    // try {
    //   await store.dispatch('getActivityInfo', { params: { activityId: to.query.activityId } })
    // } catch (e) {
    //   // const msg = e.message || e
    //   // router.app.$toast.error(msg)
    //   console.log(e)
    // }
    // 判断是否微信
    const loading = router.app.$loading()
    try { loading.instance.$el.parentElement._isLoading = false } catch (e) { }
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
      // 跨域获取token 并设置到store
      try {
        await store.dispatch('connectToken')
      } catch (e) {
        // const msg = e.message || e
        // router.app.$toast.error(msg)
        console.log(e)
      }
    } else {
      // 设置收藏
      store.dispatch('collectActivityApp', { activityId: to.query.activityId, type: 1 })
    }
    // 获取用户信息
    try {
      await store.dispatch('getUserInfo', { accessToken: store.state.userInfo.accessToken })
    } catch (e) {
      try { await store.dispatch('setAccessToken', '') } catch (e) { console.log(e) }
      // const msg = e.message || e
      // router.app.$toast.error(msg)
      console.log(e)
    }
    if (store.state.browser.versions.weChat) {
      // 接入微信
      try {
        const wxInfo = await store.dispatch('getWeChatInfo', { params: { url: window.location.href } })
        const initWxShareParams = { debug: false, appId: wxInfo.data.appId, timestamp: wxInfo.data.timestamp, nonceStr: wxInfo.data.nonceStr, signature: wxInfo.data.signature }
        await store.dispatch('initWxShare', initWxShareParams)
        const shareParams = { icon: '', title: '', desc: '', descTimeline: '', link: '' }
        store.dispatch('changeWxShare', shareParams)
      } catch (e) {
        const msg = e.message || e
        router.app.$toast.error(msg)
      }
    }
    // TODO 根据信息跳转 next({ name: 'home', query: to.query })
    console.log('next')
    next()
    loading.close()
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
// 解决原生键盘导致页面错位
const DOMRectArr = []
/**
 * 聚焦事件
 */
Vue.prototype.$handleInputFocus = e => {
  DOMRectArr.push(e.target.getBoundingClientRect()) // 计数器加一（本事例的计数标识为对象位置，非必要）
}
/**
 * 失焦事件
 */
Vue.prototype.$handleInputBlur = e => {
  DOMRectArr.shift() // 移除计数标识
  // const boundingClientRect = DOMRectArr.shift() // 移除计数标识，并获取对象位置
  const timer = setTimeout(() => { // 延迟判断，以防切换下一个输入框时触发滚动
    clearTimeout(timer)
    if (DOMRectArr.length === 0) { // 最后一个输入框失焦时触发滚动
      window.scrollTo(0, 1) // 滚回顶部
      // window.scrollTo(0, window.scrollY + boundingClientRect.y) // 滚到当前元素位置（未经测试）
    }
  }, 0)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
