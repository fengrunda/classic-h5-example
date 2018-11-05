export const apiActions = {
  getUserInfo: { // 获取用户信息
    url: '/api/community/getMyUserInfoForActivity',
    method: 'POST'
  },
  getWeChatConfigInfo: { // 获取微信配置
    url: '/api/openstore/getJsConfig',
    method: 'POST'
  }
}
