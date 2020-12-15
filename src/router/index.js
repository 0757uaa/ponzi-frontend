import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'
import Util from '@/utils/baseSetting'
import routes from './baseConfig'
import otherRoute from './otherRoutes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import errPage from '@/utils/404'
// import i18n from '../lang'
import { Message } from 'element-ui'
import Main from '@/views/Main'

const _import = require('@/router/_import_' + process.env.NODE_ENV)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
export const router = new Router({
  // mode: 'history',
  routes: routes.concat(...otherRoute)
})

NProgress.configure({ showSpinner: false })
/* eslint handle-callback-err: "error" */
router.beforeEach((to, from, next) => {
  NProgress.start()
  // const title = to.meta.title
  // Util.title(i18n.vm.messages[i18n.vm.locale]['route'][title]) // translate zh <=> en
  if (!Cookie.get('user') && to.name !== 'login') {
    next({
      replace: true,
      name: 'login'
    })
  } else if (Cookie.get('user') && to.name === 'login') {
    next({
      name: 'dashboard_index'
    })
  } else {
    /**
    * 这里因为是用的mock.js 返回用户角色
    */
    if ((Cookie.get('user')) && store.getters['user/role'].length === 0) { // 已经登录且角色已经分配
      /** 正式用注释这段就够了，因为后台回返给不同的角色 */
      const localRole = Cookie.get('role')
      store.dispatch('user/GetUserInfoAction', { role: localRole }).then(res => { // 服务端拉去用户role
        store.commit('user/USER_INFO', res) // vuex管理role
        /**
         * 默认首页菜单, 与src/store/state.js中的pageOpenedList变量一致
         */
        let asyncRouterMap = [
          {
            path: '',
            component: 'Main',
            title: 'dashboard',
            icon: 'dashboard',
            redirect: '/dashboard',
            children: [
              {
                path: 'dashboard',
                name: 'dashboard_index',
                meta: '首页',
                component: 'Dashboard/index'
              }
            ]
          }
        ]
        const menus = Cookie.get('menus')
        if (menus) {
          asyncRouterMap = asyncRouterMap.concat(JSON.parse(menus))
        }
        // asyncRouterMap = asyncRouterMap.concat([
        //   {
        //     path: '/icon',
        //     title: 'icons',
        //     name: 'icon',
        //     icon: 'icon',
        //     component: 'Main',
        //     children: [
        //       {
        //         path: 'icon',
        //         name: 'icon_index',
        //         // meta: {
        //         meta: 'icons图标',
        //         // },
        //         component: 'IconPage/index'
        //       }
        //     ]
        //   },
        //   {
        //     path: '/compoents', // 组件库
        //     name: 'compoents',
        //     component: 'Main',
        //     title: 'components',
        //     icon: 'component',
        //     children: [
        //       {
        //         path: 'markdown',
        //         name: 'markdown',
        //         // meta: {
        //         meta: 'markdown',
        //         // access: ['admin']
        //         // },
        //         component: 'ComponentsDemo/markdown'
        //       },
        //       {
        //         path: 'avator-upload',
        //         name: 'avator_upload',
        //         // meta: {
        //         meta: '头像上传',
        //         // },
        //         component: 'ComponentsDemo/avatorUpload'
        //       },
        //       {
        //         path: 'sticky',
        //         name: 'sticky_index',
        //         // meta: {
        //         meta: 'sticky',
        //         // },
        //         component: 'ComponentsDemo/sticky-demo'
        //       },
        //       {
        //         path: 'little',
        //         name: 'little_index',
        //         // meta: {
        //         meta: 'componentMixin',
        //         // },
        //         component: 'ComponentsDemo/little-demo'
        //       },
        //       {
        //         path: 'back-to-top',
        //         name: 'back_to_top',
        //         // meta: {
        //         meta: '返回顶部',
        //         // },
        //         component: 'ComponentsDemo/backToTop'
        //       },
        //       {
        //         path: 'code-edit',
        //         name: 'code-edit',
        //         // meta: {
        //         meta: '代码编辑',
        //         // },
        //         component: 'ComponentsDemo/codeEdit'
        //       },
        //       {
        //         path: 'arrow-select',
        //         name: 'arrow-select',
        //         // meta: {
        //         meta: 'arrowSelect',
        //         // },
        //         component: 'ComponentsDemo/arrowSelect'
        //       },
        //       {
        //         path: 'rich-editor',
        //         name: 'rich-editor',
        //         meta: '富文本',
        //         component: 'ComponentsDemo/richEditor'
        //       }
        //     ]
        //   }
        //   // {
        //   //   path: '/form', // 表单
        //   //   title: 'form',
        //   //   name: 'form',
        //   //   icon: 'form',
        //   //   component: 'Main',
        //   //   children: [
        //   //     {
        //   //       path: 'form-creat',
        //   //       name: 'form_creat',
        //   //       meta: {
        //   //         title: 'createForm'
        //   //       },
        //   //       component: 'FormPage/createForm'
        //   //     },
        //   //     {
        //   //       path: 'form-editor',
        //   //       name: 'form_editor',
        //   //       meta: {
        //   //         title: 'editForm'
        //   //       },
        //   //       component: 'FormPage/editForm'
        //   //     },
        //   //     {
        //   //       path: 'form-update',
        //   //       name: 'form_update',
        //   //       meta: {
        //   //         title: 'listenForm'
        //   //       },
        //   //       component: 'FormPage/formUpdate'
        //   //     }
        //   //   ]
        //   // },
        //   // {
        //   //   path: '/advanced', // 高级路由
        //   //   name: 'advanced',
        //   //   icon: 'example',
        //   //   title: 'highRoute',
        //   //   component: 'Main',
        //   //   children: [
        //   //     {
        //   //       path: 'active',
        //   //       name: 'active_index',
        //   //       meta: {
        //   //         title: 'dynamicRoute'
        //   //       },
        //   //       component: 'RouterPage/index-one'
        //   //     },
        //   //     {
        //   //       path: 'send',
        //   //       name: 'send_index',
        //   //       meta: {
        //   //         title: 'paramRoute'
        //   //       },
        //   //       component: 'RouterPage/index-two'
        //   //     }
        //   //   ]
        //   // },
        //   // {
        //   //   path: '/composite', // 综合实例
        //   //   name: 'composite',
        //   //   icon: 'complex',
        //   //   title: 'composite',
        //   //   component: 'Main',
        //   //   children: [
        //   //     {
        //   //       path: 'article-list',
        //   //       name: 'article_index',
        //   //       meta: {
        //   //         title: 'articleList'
        //   //       },
        //   //       component: 'ArticleManage/ArticleList/index'
        //   //     },
        //   //     {
        //   //       path: 'public-article',
        //   //       name: 'public_index',
        //   //       meta: {
        //   //         title: 'publicArticle'
        //   //       },
        //   //       component: 'ArticleManage/PublicArticle/index'
        //   //     },
        //   //     {
        //   //       path: 'table',
        //   //       name: 'table_index',
        //   //       meta: {
        //   //         title: 'table'
        //   //       },
        //   //       component: 'CompositeDemo/table/index'
        //   //     },
        //   //     {
        //   //       path: 'tab',
        //   //       name: 'tab_index',
        //   //       meta: {
        //   //         title: 'tab'
        //   //       },
        //   //       component: 'CompositeDemo/tab/index'
        //   //     }
        //   //   ]
        //   // },
        //   // {
        //   //   path: '/userinfo',
        //   //   name: 'user',
        //   //   icon: 'user',
        //   //   component: 'Main',
        //   //   title: 'manageInfo',
        //   //   children: [
        //   //     {
        //   //       path: 'userinfo',
        //   //       name: 'user_info',
        //   //       meta: {
        //   //         title: 'userInfo',
        //   //         access: ['admin']
        //   //       },
        //   //       component: 'userInfo/setInfo'
        //   //     },
        //   //     {
        //   //       path: 'editinfo',
        //   //       name: 'edit_info',
        //   //       meta: {
        //   //         title: 'editInfo',
        //   //         access: ['admin']
        //   //       },
        //   //       component: 'userInfo/editInfo'
        //   //     }
        //   //   ]
        //   // },
        //   // {
        //   //   path: '/setting',
        //   //   name: 'set',
        //   //   icon: 'setting',
        //   //   component: 'Main',
        //   //   title: 'setting',
        //   //   children: [
        //   //     {
        //   //       path: 'setting',
        //   //       name: 'setting_index',
        //   //       meta: {
        //   //         title: 'setting',
        //   //         access: ['admin']
        //   //       },
        //   //       component: 'SettingPage/setting'
        //   //     }
        //   //   ]
        //   // },
        //   // {
        //   //   path: '/bug',
        //   //   name: 'bug',
        //   //   icon: 'bug',
        //   //   component: 'Main',
        //   //   title: 'bug',
        //   //   children: [
        //   //     {
        //   //       path: 'bug',
        //   //       name: 'bug_index',
        //   //       meta: {
        //   //         title: 'errorBug',
        //   //         access: ['admin']
        //   //       },
        //   //       component: 'ComponentsDemo/bugPage'
        //   //     }
        //   //   ]
        //   // }
        // ])
        const routers = filterAsyncRouter(asyncRouterMap)
        store.dispatch('permiss/setRoutes', routers) // vuex管理路由
        router.addRoutes(routers) // 动态的添加路由
        router.addRoutes(errPage) // 增加404page
        next({ ...to, replace: true })
      }).catch((err) => {
        if (err) {
          Message.error('网络错误，请重试')
          setTimeout(() => {
            Cookie.remove('user')
            Cookie.remove('role')
            store.commit('clearAllTags')
            store.commit('permiss/RM_ROUTES') // 清空routes for sidebar
            localStorage.removeItem('pageOpenedList')
            setTimeout(() => {
              // 为了修复直接通过vue-router 无刷新退出 导致 Duplicate named routes definition bug
              // 刷新是为了清空 路由源保留的路由状态
              location.reload()
            }, 0)
            NProgress.done()
          }, 2000)
        }
      })
      /** 正式用注释这段就够了，因为后台回返给不同的角色End */
    } else {
      next() // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  Util.opendPage(router.app, to.name, to.params, to.query, to.meta, to.path)
  NProgress.done()
  window.scrollTo(0, 0)
})

function filterAsyncRouter (asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Main') { // Layout组件特殊处理
        route.component = Main
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
