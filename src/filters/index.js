/**
 * 金额格式化
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
 * @param {*} amount
 * @param {String} style 格式化时使用的样式 decimal currency percent
 * @param {String} currency 在货币格式化中使用的货币符号 CNY USD EUR
 */
const amountFormatter = (amount = 0, style = 'currency', currency = 'CNY') => {
  let amountNum = parseFloat(amount)
  amountNum = amountNum >= 0 ? amountNum : 0
  return amountNum.toLocaleString('zh', { minimumFractionDigits: 2, maximumFractionDigits: 8, style, currency })
}
export default {
  amountFormatter
}
