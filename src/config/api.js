export default {
  user: {
    getUserInfo: { // 获取用户信息
      url: '/api/community/getMyUserInfoForActivity',
      method: 'POST'
    }
  },
  base: {
    getWeChatInfo: { // 获取微信配置
      url: '/api/community/weixin/getWXJsConfig',
      method: 'POST'
    }
  },
  activity: {
    getActivityInfo: { // 获取活动信息
      url: '/api/community/getActivityInfo',
      method: 'POST'
    }
  }
}
