/**
 * ajax请求状态类
 */
export default class Toggle {
  constructor () {
    this.isInit = true
    this.isLoading = false
    this.isEmpty = false
    this.isFail = false
    this.isSuccess = false
  }
  setInit () {
    this.isInit = true
    this.isLoading = false
    this.isEmpty = false
    this.isFail = false
    this.isSuccess = false
  }
  setLoading () {
    this.isInit = false
    this.isLoading = true
    this.isEmpty = false
    this.isFail = false
    this.isSuccess = false
  }
  setFail () {
    this.isInit = false
    this.isLoading = false
    this.isEmpty = false
    this.isFail = true
    this.isSuccess = false
  }
  setEmpty () {
    this.isInit = false
    this.isLoading = false
    this.isEmpty = true
    this.isFail = false
    this.isSuccess = false
  }
  setSuccess () {
    this.isInit = false
    this.isLoading = false
    this.isEmpty = false
    this.isFail = false
    this.isSuccess = true
  }
}
