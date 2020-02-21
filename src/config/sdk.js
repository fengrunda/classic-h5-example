import $wx from 'weixin-js-sdk'
const initWx = ({ debug = false, appId, timestamp, nonceStr, signature } = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      $wx.config({
        debug: false,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'onVoicePlayEnd',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ]
      })
      $wx.error(res => {
        reject(res)
      })
      $wx.ready(() => {
        resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}
const setWxShare = ({ icon, link, title, desc, descTimeline } = {}) => {
  const callbackFuns = (title, content) => {
    return {
      success: () => { },
      trigger: () => { },
      complete: () => { }
    }
  }
  const baseShareData = {
    imgUrl: icon,
    link: link,
    title: title,
    desc: desc
  }
  const staticsTitle = 'act-20200117-分享'
  const shareDataFriend = Object.assign({}, baseShareData, callbackFuns(staticsTitle, '分享给朋友'))
  const shareDataTimeline = Object.assign({}, baseShareData, callbackFuns(staticsTitle, '分享朋友圈'), { title: descTimeline })
  const shareDataQQ = Object.assign({}, baseShareData, callbackFuns(staticsTitle, 'qq'))
  const shareDataQZone = Object.assign({}, baseShareData, callbackFuns(staticsTitle, 'QZone'))
  $wx.onMenuShareAppMessage(shareDataFriend)
  $wx.onMenuShareTimeline(shareDataTimeline)
  $wx.onMenuShareQQ(shareDataQQ)
  $wx.onMenuShareQZone(shareDataQZone)
}
const onSdkReady = ({
  times = 5,
  delay = 100
} = {}) => {
  return new Promise((resolve, reject) => {
    let count = times
    const timer = setInterval(() => {
      if (window.RFBridge || count <= 0) {
        clearInterval(timer)
        resolve(!!window.RFBridge)
      }
      count--
    }, delay)
  })
}

const updateUserTokenFromApp = () => {
  return new Promise((resolve, reject) => {
    window.__onGetUserInfoSuccess = (error, { accessToken = '' } = {}) => {
      if (error) {
        reject(error)
      } else {
        resolve({ accessToken })
      }
    }
    try {
      window.RFBridge.RFN_GetUserInfoWithCallbackFunctionName('__onGetUserInfoSuccess')
    } catch (error) {
      reject(new Error(''))
    }
  })
}

const loginInApp = () => {
  // cllback
  return new Promise((resolve, reject) => {
    window.__onLoginSuccess = (error, { accessToken } = {}) => {
      // process.nextTick(() => {
      if (error) {
        // alert(error);
        reject(error)
      } else {
        // 拿 token
        // alert('accessToken:' + accessToken)
        resolve({ accessToken })
      }
      // })
    }
    try {
      window.RFBridge.RFN_LoginWithCallbackFunctionName('__onLoginSuccess')
    } catch (error) {
      reject(new Error(''))
    }
  })
}

const shareAppPage = ({ icon, link, title, desc, descTimeline } = {}) => {
  return new Promise((resolve, reject) => {
    /*
        param1:是否出错 error\null
        param2:状态 'click''success''cancel' 点击，成功，取消
         param3: 渠道 InApp\WeChatFrd\WeChatTimeline\Weibo\QQFrd\CopyLink
    */
    window.__shareCallback = (error, eventName, channel) => {
      process.nextTick(() => {
        if (error) {
          reject(error)
        } else {
          resolve({ eventName, channel })
        }
      })
    }
    try {
      window.RFBridge.RFN_SocialShareWithTitleDescThumbnailLinkWechatTitleCallbackFunctionName(title, desc, icon, link, descTimeline, '__shareCallback')
    } catch (error) {
      reject(new Error(''))
    }
  })
}

const favorAppPage = (activityId) => {
  return new Promise((resolve, reject) => {
    try {
      window.RFBridge.RFN_enableFavorWithIdAndCategory(activityId, '1')
      resolve()
    } catch (error) {
      reject(new Error(''))
    }
  })
}
export {
  onSdkReady,
  updateUserTokenFromApp,
  initWx,
  setWxShare,
  loginInApp,
  shareAppPage,
  favorAppPage
}
