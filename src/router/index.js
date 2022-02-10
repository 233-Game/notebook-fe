import { createRouter, createWebHistory } from 'vue-router'
// 首页
import Login from '@/views/user/Login'
import Index from '../views/user/Index'
import User from '../../common/user'
import ERROR from '@/views/user/Page404'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/index',
    redirect: '/index/note',
    name: 'Index',
    component: Index,
    children: [
      {
        path: 'note',
        name: 'Note',
        component: () => import('@/views/mainPanel/Note'),
      },
      {
        path: 'addNote',
        name: 'addNote',
        component: () => import('@/views/mainPanel/AddNote.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/404',
    name: 'Page404',
    component: ERROR,
  },
  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  //判断路由是否是login
  if (to.fullPath !== '/login' && !User.token) {
    router.push('/login')
  } else {
    next()
  }
})

export default router
