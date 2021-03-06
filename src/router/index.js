import Vue       from 'vue'
import VueRouter from 'vue-router'
import List      from "../views/List";
import Tag       from "../views/Tag";
import Favourite from "../views/Favourite";
import UserGroup from "../views/UserGroup";
import User      from "../views/User";
import Recycle   from "../views/Recycle";
import Settings  from "../views/Settings";

Vue.use(VueRouter)

const routes = [
    {
        name: 'List', title: 'List',
        icon: 'sysIcon_listType_detail', path: '/', component: List, props: true,
    },
    /*{
        name: 'TagGroup', title: 'TagGroup',
        icon: 'sysIcon_tagso', path: '/tag_group', component: TagGroup, props: true,
    },*/
    {
        name: 'Tag', title: 'Tag',
        icon: 'sysIcon_tag-o', path: '/tag', component: Tag, props: true,
    },
    {
        name: 'Favourite', title: 'Favourite',
        icon: 'sysIcon_heart-o', path: '/favourite', component: Favourite, props: true,
    },
    {
        name: 'UserGroup', title: 'UserGroup',
        icon: 'sysIcon_team', path: '/user_group', component: UserGroup, props: true,
    },
    {
        name: 'User', title: 'User',
        icon: 'sysIcon_user', path: '/user', component: User, props: true,
    },
    {
        name: 'Settings', title: 'Settings',
        icon: 'sysIcon_setting', path: '/settings', component: Settings, props: true,
    },
    {
        name: 'Recycle', title: 'Recycle',
        icon: 'sysIcon_delete', path: '/recycle', component: Recycle, props: true,
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
