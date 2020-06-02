import Vue       from 'vue'
import VueRouter from 'vue-router'
import Home      from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {name: 'index1', title: 'index1', path: '/', component: Home, props: true,},
    {name: 'index2', title: 'index2', path: '/index2', component: Home, props: true,},
    {name: 'index3', title: 'index3', path: '/index3', component: Home, props: true,},
    {name: 'index4', title: 'index4', path: '/index4', component: Home, props: true,},
    {name: 'index5', title: 'index5', path: '/index5', component: Home, props: true,},
    {name: 'index6', title: 'index6', path: '/index6', component: Home, props: true,},
    /*{
     path: '/about',
     name: 'About',
     // route level code-splitting
     // this generates a separate chunk (about.[hash].js) for this route
     // which is lazy-loaded when the route is visited.
     component: function () {
     return import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
     }
     }*/
]

const router = new VueRouter(
    {
        routes: routes,
    })

export default router
