<template>
  <transition name="fade">
    <div :class="type" class="message" v-show="show">
      <i class="icon"></i>
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'message',
  props: {
    type: {
      type: String,
      default: 'info'
      // validator: val => ['info', 'success', 'warning', 'error'].includes(val)
      // ['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
    },
    text: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  max-width: 70%;
  max-height: 80%;
  // width: 100%;
  overflow: auto;
  padding: 8px 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  box-sizing: border-box;
  .text {
    width: 100%;
    display: block;
    color: #fff;
    font-size: 14px;
    text-align: center;
    word-break: break-all;
  }
}
</style>
