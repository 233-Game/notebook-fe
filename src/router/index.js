import { createRouter, createWebHistory } from 'vue-router'
// 首页
import Login from '@/views/user/Login'
import Index from '../views/user/Index'

const routes = [
  {
    path: '/',
    redirect: '/index',
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
