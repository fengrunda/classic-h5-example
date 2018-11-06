<template>
  <div id="qrcode-wrapper">
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'qrcode',
  props: {
    size: {
      type: Number,
      default: 200,
      validator: function (value) {
        return value >= 0
      }
    },
    level: {
      type: String,
      default: 'H'
    },
    colorDark: {
      type: String,
      default: '#000'
    },
    colorLight: {
      type: String,
      default: '#fff'
    },
    value: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      watcher: '',
      qrcode: ''
    }
  },
  computed: {},
  methods: {},
  created () {
    // console.log('qrcode created')
  },
  mounted () {
    // console.log('qrcode mounted')
    this.qrcode = new QRCode(document.getElementById('qrcode-wrapper'), {
      text: this.value,
      width: this.size,
      height: this.size,
      colorDark: this.colorDark,
      colorLight: this.colorLight,
      correctLevel: QRCode.CorrectLevel[this.level]
    })
    this.watcher = this.$watch(
      function () {
        return this.value
      },
      function (newVal, oldVal) {
        // 做点什么
        // console.log(newVal)
        this.qrcode.makeCode(newVal)
      }
    )
  },
  destroyed () {
    // console.log('qrcode destroyed')
    this.watcher()
  },
  components: {
  }
}

</script>
