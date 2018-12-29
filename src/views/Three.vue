<template>
  <div class="three">
    <img ref="img" :src="src" alt class="img">
    <img :src="base64" alt class="img">
    <button @click="handleChooseImage">chooseImg</button>
  </div>
</template>

<script>
// import THREE from 'three'
// console.log(THREE)
// const THREE = require('three')
export default {
  name: 'three',
  data () {
    return {
      src: '',
      base64: ''
    }
  },
  computed: {
  },
  methods: {
    chooseImage () {
      return new Promise((resolve, reject) => {
        window.wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            if (res.localIds.length > 0) {
              // this.src = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              resolve(res.localIds[0])
            } else {
              reject(new Error('没有选择图片'))
            }
          },
          fail: res => {
            reject(new Error('fail'))
          },
          cancel: res => {
            reject(new Error('cancel'))
          }
        })
      })
    },
    getImageLocalData (localId) {
      return new Promise((resolve, reject) => {
        window.wx.getLocalImgData({
          localId,
          success: res => {
            var localData = res.localData // localData是图片的base64数据，可以用img标签显示
            if (this.$store.state.browser.versions.android) {
              localData = 'data:image/jpeg;base64,' + localData
            } else {
              localData = localData.replace('jgp', 'jpeg')// iOS 系统里面得到的数据，类型为 image/jgp,因此需要替换一下
            }
            resolve(localData)
          },
          fail: res => {
            // alert("上传失败，请稍候重试");
            reject(new Error('fail'))
          }
        })
      })
    },
    async handleChooseImage () {
      try {
        const localId = await this.chooseImage()
        // alert(localId)
        const base64 = await this.getImageLocalData(localId)
        // alert(base64)
        this.base64 = base64
        // this.$toast.message({ time: 0, message: base64, position: 'top' })
      } catch (e) {
        let msg = e.message || e
        alert(JSON.stringify(msg))
      }
    }
  },
  created () {
  },
  mounted () {
    // THREE = require('three')
    // console.log(window.wx.chooseImage)
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.img {
  width: 200px;
  height: 200px;
  border: 1px solid #666;
  // &:first-of-type {
  //   visibility: hidden;
  // }
}
.three {
  display: flex;
  // justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  // flex-wrap: wrap;
  // &::before {
  //   content: "";
  //   flex: 1 1 auto;
  //   height: 100%;
  // }
  // &::after {
  //   content: "";
  //   flex: 0 1 auto;
  //   height: 100%;
  //   width: 50px;
  // }
}
</style>
