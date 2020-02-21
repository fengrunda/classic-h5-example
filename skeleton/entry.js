import Vue from 'vue'
import LoadingComponent from '../src/components/Loading.vue'
import { Loading } from 'vant'
Vue.use(Loading)
export default new Vue({
  components: {
    Loading: LoadingComponent
  },
  template: '<Loading />'
})
