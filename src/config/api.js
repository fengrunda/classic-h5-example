export const apiActions = {
  getUserInfo: { // 获取用户信息
    url: '/api/community/getMyUserInfoForActivity',
    method: 'POST'
  },
  getWeChatInfo: { // 获取微信配置
    url: '/api/community/weixin/getWXJsConfig',
    method: 'POST'
  },
  getActivityInfo: { // 获取活动信息
    url: '/api/community/getActivityInfo',
    method: 'POST'
  }
}
