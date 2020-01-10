import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  {
    path: '/404',
    component: () => import('../views/404'),
    hidden: true
  },
  {
    path: '/login',
    component:()=> import('../views/login')
  },
  {
    path: '/',
    redirect:'/home',
    component:()=> import('../views/home'),
    children:[
      {
        path:'home',
        component:()=> import('../views/home')
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
