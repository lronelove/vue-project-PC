import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const NotFound = () => import('../views/NotFound.vue')

Vue.use(Router)

export default new Router({
  routes: [
    { // 当跳转到不正常的页面路径的时候返回404
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
    { // 首页
      path: '/',
      name: 'home',
      component: Home
    },
    { // 关于我们页面
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
