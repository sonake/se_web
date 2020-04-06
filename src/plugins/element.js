import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.$msg = function (msg) {
  ElementUI.Message(msg)
}
Vue.prototype.$msg.success = function (msg) {
  return ElementUI.Message.success({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$msg.warning = function (msg) {
  return ElementUI.Message.warning({
    message: msg,
    duration: 1000
  })
}
