import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import allFileCopy from '../views/allFileCopy.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/allFileCopy',
    name: 'allFileCopy',
    component: index
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
