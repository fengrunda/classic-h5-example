<template>
  <div class="loading">
    <van-loading size="50" color="#41a3ff"/>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {}
  },
  computed: {},
  methods: {},
  created () {},
  mounted () {},
  components: {
    // helloWorld
  }
}
</script>
<style scoped lang="less">
@import "../assets/less/lib-base.less";
@import "../assets/less/lib-mixins.less";
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  /deep/ * {
    box-sizing: border-box;
  }
  /deep/ .van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
