import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */



// 常量路由 不需要配置权限，所有人都能看到或操作
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]

// 异步路由  涉及权限的相关路由
export const allAsyncRoutes = [
  // 权限管理
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  
  {// 商品管理相关路由
    path: '/product',
    component: Layout, //首先要展示一级路由组件
    name: 'Product',
    redirect: '/product/trademark/list',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'trademark/list',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/List'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr/list',
        name: 'Attr',
        component: () => import('@/views/product/attr/List'),
        meta: { title: '属性管理' }
      },
      {
        path: 'spu/list',
        name: 'Spu',
        component: () => import('@/views/product/spu/List'),
        meta: { title: 'SPU管理' }
      },
      {
        path: 'sku/list',
        name: 'Sku',
        component: () => import('@/views/product/sku/List'),
        meta: { title: 'SKU管理' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/product/category'),
        meta: { title: '分类管理' }
      },
    ]
  },
  {// 生产管理
    path: '/manage',
    component: Layout, //首先要展示一级路由组件
    name: 'Manage',
    redirect: '/manage/manage1',
    meta: { title: '生产管理', icon: 'el-icon-edit' },
    children: [
      {
        path: 'manage1',
        name: 'Manage1',
        component: () => import('@/views/manage/manage1'),
        meta: { title: '管理1' }
      },
      {
        path: 'manage2',
        name: 'Manage2',
        component: () => import('@/views/manage/manage2'),
        meta: { title: '管理2' }
      }
    ] 
  },

]

// 任意路由  非法路径统一404
// 404 page must be placed at the end !!!
export const anyRoute = { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
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
