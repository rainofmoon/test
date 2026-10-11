import { createRouter,createWebHistory } from "vue-router"
import MusicHall from "../views/MusicHall.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MusicHall,
    },
    {
      path:'/mymusic',
      name:'mymusic',
      component:() => import("../views/Mymusic.vue")
    },
    {
      path:'/musiclist',
      name:'musiclist',
      component:() => import("../views/MusicList.vue")
    },
    {
      path:'/player',
      name:'player',
      component:() => import("../views/Player.vue")
    },
    {
      path:'/search',
      name:'search',
      component:() => import("../views/Search.vue")
    },
    {
      path:'/login',
      name:'login',
      component:() => import("../views/login.vue")
    }
    
  ],
})

export default router
