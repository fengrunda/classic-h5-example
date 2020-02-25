// 不要在此引用第三方库样式
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { errorFormatter, LoadingInterface, handleInputFocus, handleInputBlur, connectCrossStorage, CROSS_URL } from './config/utils'
import { onSdkReady, updateUserTokenFromApp, initWx } from './config/sdk'
import apiActions from './config/api'
import filters from './filters'
import { Loading, Button, Toast } from 'vant'
import { xhrService } from '@/config/network.js'
import { getSuffix } from '@/config/utils.js'

Toast.allowMultiple()
Vue.use(Toast)
Vue.use(Button)
Vue.use(Loading)
Vue.config.productionTip = false
// Vue.prototype.$toast = ToastInterface
Vue.prototype.$loading = LoadingInterface
Vue.prototype.$errorFormatter = errorFormatter
Vue.prototype.$handleInputFocus = handleInputFocus
Vue.prototype.$handleInputBlur = handleInputBlur

let isFirstVisit = true
router.beforeEach(async (to, from, next) => {
  // 页面切换开始时展示loading
  LoadingInterface.open(`route:${to.name}`)
  if (isFirstVisit) {
    isFirstVisit = false
    if (store.state.bgm.autoPlay) {
      try {
        store.state.bgm.el.play()
        // Toast('bgm paused:' + store.state.bgm.el.paused)
        store.commit('UPDATE_BGM_IS_PAUSE', store.state.bgm.el.paused)
      } catch (error) {
        console.log('bgm play', error)
      }
    }
    // 静态资源预加载 开始
    try {
      const { data: { assets = [] } = {} } = await xhrService({ url: './bundle-stats.json', method: 'GET', baseURL: './' })
      const filterList = assets
        .filter(({ key = '' } = {}) => (getSuffix(key) === '.png' || getSuffix(key) === '.jpg' || getSuffix(key) === '.jepg'))
        .map(({ runs = [] } = {}) => {
          const assetsObj = runs.length > 0 ? runs[0] : {}
          const { name: url = '', value: size = 0 } = assetsObj
          return Object.assign({ url, size })
        })
      await Promise.all(filterList.map(({ url }) => xhrService({ url: './' + url, method: 'GET', baseURL: './' })))
      // console.log('xhrService assets', assets)
      console.log('assets filterList', filterList)
    } catch (error) {
      console.log('xhrService error', error)
    }
    // 静态资源预加载 结束
    let { access_token: accessToken, isMiniProgLogin = '1' } = store.state.urlParams
    let urlToken = accessToken
    let crossStorage = null
    // -----------------------------------------------------------------------------------------------------------------------------------------------------
    let token = ''
    let platForm = 'H5'
    try {
      crossStorage = await connectCrossStorage(CROSS_URL) || null
    } catch (error) {
      store.commit('UPDATE_CONNECT_TOKEN_FAIL')
    }
    if (!store.state.isWeixin) {
      const isApp = await onSdkReady()
      if (isApp) {
        platForm = 'APP'
        try {
          const { accessToken = '' } = await updateUserTokenFromApp() || {}
          token = accessToken
        } catch (error) {
          // Toast('updateUserTokenFromApp', error)
        }
      } else {
        platForm = 'H5'
        if (urlToken) {
          token = urlToken
        } else {
          try {
            token = await crossStorage.get('access_token') || ''
          } catch (error) { }
        }
      }
    } else {
      platForm = 'WX'
      if (urlToken) {
        token = urlToken
      } else {
        try {
          token = await crossStorage.get('access_token') || ''
        } catch (error) { }
      }
      try {
        const { data: { appId, timestamp, nonceStr, signature } } = await apiActions.base.getWeChatInfo({
          params: {
            url: location.href.split('#')[0]
          }
        }) || {}
        await initWx({ appId, timestamp, nonceStr, signature })
        if (store.state.bgm.autoPlay) {
          try {
            store.state.bgm.el.play()
            // Toast('bgm paused:' + store.state.bgm.el.paused)
            store.commit('UPDATE_BGM_IS_PAUSE', store.state.bgm.el.paused)
          } catch (error) {
            console.log('bgm play', error)
          }
        }
      } catch (error) {
        platForm = 'H5'
        // Toast(errorFormatter(error, 'initWx'))
        // debugger;
      }

      if (window.__wxjs_environment === 'miniprogram') {
        platForm = 'MINIPROGRAM'
        if (isMiniProgLogin === '0') {
          token = ''
        } else {
          token = urlToken
        }
      }
    }
    store.commit('UPDATE_PLATFORM', platForm)
    if (token) {
      try {
        const { data: { user: { nickname = '', phone = '' } = {} } = {} } = await apiActions.user.getUserInfo({
          params: {
            access_token: token
          }
        })
        store.commit('UPDATE_USER', { phone, nickname })
      } catch (error) {
        token = ''
      }
    }
    store.commit('UPDATE_ACCESS_TOKEN', token)
    try {
      await crossStorage.set('access_token', token)
    } catch (error) {
      console.log(error)
    }
    if (urlToken) {
      const query = Object.assign(to.query)
      delete query.access_token
      LoadingInterface.close()
      next({
        name: to.name,
        query: query,
        replace: true
      })
      return
    }
  }
  next()
})
router.afterEach(() => {
  // 页面切换结束时关闭loading
  LoadingInterface.close()
})
// 解决重新构建后异步加载的页面报错
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    location.reload()
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
