import Vue from 'vue'
import Loading from '../src/components/Loading.vue'
import { Progress } from 'muse-ui'
Vue.use(Progress)
export default new Vue({
  components: {
    Loading
  },
  template: '<Loading />'
})
