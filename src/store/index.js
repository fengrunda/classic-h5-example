import Vue from 'vue'
import Vuex from 'vuex'
// import moduleApi from './moduleApi'
import moduleSdk from './moduleSdk'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urlParams: GetUrlParams(location.search)
  },
  mutations: {

  },
  actions: {

  },
  modules: {
    // api: moduleApi,
    sdk: moduleSdk
  }
})

/**
 * 获取search参数
 * @param {*} url
 * http://aa.com/?ccc=789&ddd=012#/hash1/hash2?aaa=123&bbb=456 =>  {ccc: "789", ddd: "012", aaa: "123", bbb: "456"}
 */
function GetUrlParams (url) {
  const pattern = /(\w+)=(\w+)/ig
  const parames = {}
  url.replace(pattern, function (str, key, value) {
    parames[key] = value
  })
  return parames
}
