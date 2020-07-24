import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
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
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true ,roles: ['admin', 'editor','visitor']}
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/gene',
    name: 'gene',
    component: Layout,
    redirect: '/gene/view',
    meta: { title: 'gene', icon: 'documentation', roles: ['admin', 'editor','visitor'] },
    children: [
      {
        name: 'view',
        path: '/gene/view',
        component: () => import('@/views/gene/view'),
        meta: { title: 'view', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'gene-create',
        path: '/gene/create',
        component: () => import('@/views/gene/create'),
        hidden: false,
        meta: { title: 'create', icon: 'edit', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/article',
    name: 'article',
    component: Layout,
    redirect: '/article/manage',
    meta: { title: 'article', icon: 'documentation', roles: ['admin', 'editor','visitor'] },
    children: [
      {
        name: 'sort-manage',
        path: '/article/sort-manage',
        component: () => import('@/views/article/sort-manage'),
        meta: { title: 'sort-manage', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'article',
        path: '/article/submit',
        component: () => import('@/views/article/submit'),
        hidden: false,
        meta: { title: 'submit', icon: 'edit', roles: ['admin'] }
      },
      {
        name: 'article',
        path: '/article/article-manage',
        component: () => import('@/views/article/article-manage'),
        meta: { title: 'article-manage', icon: 'edit', roles: ['admin'] }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
