// import * as types from './mutation-types'
export default {
  'SET_API_TOGGLE_INIT' (state, { apiAction }) {
    state.api[apiAction].toggle.setInit()
  },
  'SET_API_TOGGLE_LOADING' (state, { apiAction }) {
    state.api[apiAction].toggle.setLoading()
  },
  'SET_API_TOGGLE_SUCCESS' (state, { apiAction }) {
    state.api[apiAction].toggle.setSuccess()
  },
  'SET_API_TOGGLE_FAIL' (state, { apiAction }) {
    state.api[apiAction].toggle.setFail()
  },
  'SET_API_TOGGLE_EMPTY' (state, { apiAction }) {
    state.api[apiAction].toggle.setEmpty()
  },
  'SET_API_DATA' (state, { apiAction, data }) {
    state.api[apiAction].data = data
  },
  'SET_SDK_DATA' (state, obj) {
    state.sdk = Object.assign({}, state.sdk, obj)
  },
  'SET_USER_INFO' (state, obj) {
    state.userInfo = Object.assign({}, state.userInfo, obj)
  },
  'SET_DIALOG_VISIBLE' (state, { name, visible }) {
    state.dialog[name] = visible
  },
  'SET_SCROLL' (state, { x, y }) {
    state.scroll.x = x
    state.scroll.y = y
  },
  'SET_URL_PARAMS' (state, obj) {
    state.urlParams = Object.assign({}, state.urlParams, obj)
  }
}
