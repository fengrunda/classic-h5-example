const modulesSdk = {
  namespaced: true, // 独立命名空间
  state: {
    isApp: false
  },
  actions: {
    /**
     * 判断app sdk是否注入
     */
    onSdkReady ({ commit, dispatch, state }, { times = 5, delay = 100 } = {}) {
      return new Promise((resolve, reject) => {
        let count = times
        const timer = setInterval(() => {
          if (window.RFBridge || count <= 0) {
            clearInterval(timer)
            resolve(!!window.RFBridge)
            commit('SET_IS_APP', !!window.RFBridge)
          }
          count--
        }, delay)
      })
    }
  },
  mutations: {
    SET_DATA (state, obj) {
      state = Object.assign({}, state, obj)
    },
    SET_IS_APP (state, isApp) {
      state.isApp = isApp
    }
  }
}
export default modulesSdk
