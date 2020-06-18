import Vue       from 'vue'
import VueRouter from 'vue-router'
import Home      from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        name: 'List', title: 'List',
        icon: 'list', path: '/', component: Home, props: true,
    },
    {
        name: 'TagGroup', title: 'TagGroup',
        icon: 'tag_group', path: '/tag_group', component: Home, props: true,
    },
    {
        name: 'Tag', title: 'Tag',
        icon: 'tag', path: '/tag', component: Home, props: true,
    },
    {
        name: 'Favourite', title: 'Favourite',
        icon: 'favourite', path: '/favourite', component: Home, props: true,
    },
    {
        name: 'UserGroup', title: 'UserGroup',
        icon: 'user_group', path: '/user_group', component: Home, props: true,
    },
    {
        name: 'User', title: 'User',
        icon: 'user', path: '/user', component: Home, props: true,
    },
    {
        name: 'Settings', title: 'Settings',
        icon: 'settings', path: '/settings', component: Home, props: true,
    },
    {
        name: 'Recycle', title: 'Recycle',
        icon: 'recycle', path: '/recycle', component: Home, props: true,
    },
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
