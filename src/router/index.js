import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import modelerRouter from './modules/flowable-modeler'
import idmRouter from './modules/flowable-idm'
import taskRouter from './modules/flowable-task'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-ROLE_ADMIN-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['ROLE_ADMIN','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hide: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: '首页' }
      }
    ]
  },
  {
    path: '/modelmanage',
    component: Layout,
    redirect: '/modelmanage/filemanage',
    name: 'Modelmanage',
    meta: { title: '模型资源管理', icon: 'dashboard' },
    children: [
      {
        path: 'filemanage',
        component: () => import('@/views/modelmanage/filemanage/index'),
        name: 'modelmanage',
        meta: { title: '文件管理', icon: '文件' }
      },
      {
        path: 'library',
        component: () => import('@/views/modelmanage/library/index'),
        name: 'library',
        meta: { title: '出入库', icon: '上传' }
      }
    ]
  },
  {
    path: '/specification',
    component: Layout,
    redirect: '/specification/table',
    name: 'Specification',
    meta: { title: '标准规范管理', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: '/form/filemanage',
    name: 'Form',
    meta: { title: '  公共算法/服务管理', icon: 'dashboard' },
    children: [
      {
        path: 'filemanage',
        component: () => import('@/views/form/filemanage/index'),
        name: 'form_modelmanage',
        meta: { title: '文件管理', icon: '文件' }
      },
      {
        path: 'library',
        component: () => import('@/views/form/library/index'),
        name: 'form_library',
        meta: { title: '出入库', icon: '上传' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '工具软件管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },
  taskRouter,

  modelerRouter,

  idmRouter
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [
  {
    path: '/controluser',
    component: Layout,
    redirect: '/controluser/user',
    meta: {
      title: '用户管理',
      icon: '管理',
      roles: ['ROLE_ADMIN', 'ROLE_AUDIT']
    },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/controluser/user/index'),
        meta: { title: '用户列表', icon: '用户', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/controluser/department/index'),
        meta: {
          title: '部门管理',
          icon: '部门',
          roles: ['ROLE_AUDIT']
        }
      }
    ]
  },
  {
    path: '/editorRole',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/secretuser/index'),
        name: 'editorRole',
        meta: {
          title: '权限管理',
          icon: 'dashboard',
          roles: ['ROLE_SECURITY']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
