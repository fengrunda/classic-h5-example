const co = require('co')

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
        co(function * () {
          for (let i = 0; !window.RFBridge; i++) {
            // var now = Date.now();
            if (i >= times) {
              throw new Error('注入超时')
            }
            yield function (cb) {
              setTimeout(cb, delay)
            }
          }
        }).then(data => {
          commit('SET_IS_APP', true)
          resolve('注入成功')
        }).catch(reason => {
          commit('SET_IS_APP', false)
          reject(reason)
        })
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
