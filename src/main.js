// 导入Vue框架
import Vue from 'vue'
// 导入主视图文件
import App from './App'
// 导入路由文件
import { router } from './router'
// 导入状态管理器
import store from './store'

// 导入element组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局svg-icon组件
// 导入介绍组件的组件
import SvgIcon from '@/components/SvgIcon'
import ComIntro from '@/components/ComIntro'
import CodingTip from '@/components/CodingTip'
// 导入中英互译组件
import i18n from './lang'
// 导入点击波浪组件
import Wave from '@/directive/wave/index'
import Exclude from '@/directive/exclude/index'
import Clipboard from '@/directive/clipboard/index'
import EventBus from '@/utils/eventBus'

// 导入Cookie
import Cookie from 'js-cookie'

// 注册全局svg-icon组件
Vue.component('svg-icon', SvgIcon)
// 注册全局介绍组件的组件
Vue.component('com-intro', ComIntro)
// 待开发组件提示
Vue.component('coding-tip', CodingTip)
Vue.config.productionTip = false
Vue.prototype.$bus = EventBus

// 使用element-ui
// Vue.use(ElementUi)
Vue.use(ElementUI, { size: 'mini' })
// 使用v-wave 波浪效果
Vue.use(Wave)
Vue.use(Exclude)
Vue.use(Clipboard)

// 注册全局的自定义指令-检查是否有操作权限
Vue.directive('check-opt', {
  inserted: function (el, binding, vnode) {
    // if (binding.expression === "'admin:btn:add'") {
    //   console.log('拥有登录按钮权限')
    //   console.log('el=' + el.parentNode)
    //   el.parentNode.removeChild(el)
    // }
    const permissionsStr = Cookie.get('permissions')
    if (permissionsStr) {
      let hasPermission = false
      const permissions = JSON.parse(permissionsStr)
      if (permissions && permissions.length > 0) {
        for (let i = 0; i < permissions.length; i++) {
          // console.log('权限编码: ' + permissions[i].permissionCode)
          if (binding.expression === ('\'' + permissions[i].permissionCode + '\'')) {
            hasPermission = true
            break
          }
        }
      }
      if (!hasPermission) {
        el.parentNode.removeChild(el)
      }
    }
  }
})

// add baidu count
if (process.env.NODE_ENV === 'production') {
  let hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?0b2c26b40000cc8d4a441a66a12bc772'
  let s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
}

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
