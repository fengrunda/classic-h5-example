import Vue from 'vue'
import Vuex from 'vuex'
import { getUrlParams } from '@/config/utils.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urlParams: getUrlParams(location.href) || {},
    accessToken: '',
    connectTokenFail: false,
    platform: 'H5', // H5,APP,WX,MINIPROGRAM
    isWeixin: navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1,
    user: {
      phone: '',
      nickname: ''
    },
    bgm: {
      el: document.getElementById('bgm'),
      autoPlay: localStorage.getItem('autoPlay') ? (parseInt(localStorage.getItem('autoPlay')) > 0) : true,
      // autoPlay: true,
      isPause: true
    }
  },
  mutations: {
    UPDATE_ACCESS_TOKEN (state, accessToken = '') {
      state.accessToken = accessToken
    },
    UPDATE_CONNECT_TOKEN_FAIL (state, connectTokenFail = true) {
      state.connectTokenFail = connectTokenFail
    },
    UPDATE_PLATFORM (state, platform) {
      state.platform = platform
    },
    UPDATE_USER (state, userInfo = {}) {
      state.user = Object.assign(...Object.keys(state.user).map(key => Object.assign({ [key]: userInfo[key] || state.user[key] })))
    },
    UPDATE_BGM_AUTO_PLAY (state, autoPlay = true) {
      state.bgm.autoPlay = autoPlay
      localStorage.setItem('autoPlay', autoPlay ? 1 : 0)
    },
    UPDATE_BGM_IS_PAUSE (state, isPause = true) {
      state.bgm.isPause = isPause
    }
  },
  actions: {

  },
  modules: {
  }
})
