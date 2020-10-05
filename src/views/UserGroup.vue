<template>
    <div class="userGroup">
        <ul class="groupList">
            <li v-for="item in list" class="groupMain">
                <template v-if="editId===item.id">

                </template>
                <template v-else>
                        <table>
                            <tr><th>ID</th><td>
                                <span>{{item.id}}</span>
                                <span class="sysIcon sysIcon_edit"></span>
                            </td></tr>
                            <tr><th>Name</th><td>{{item.name}}</td></tr>
                            <tr><th>Desc</th><td>{{item.description}}</td></tr>
                            <tr><th>Status</th><td>{{item.status?'On':'Off'}}</td></tr>
                            <tr><th>Admin</th><td>{{item.control_admin?'Y':'N'}}</td></tr>
                            <tr><th>User</th><td>
                                <table class="subTable">
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                    <tr v-for="user in item.user">
                                        <td>{{user.id}}</td>
                                        <td>{{user.name}}</td>
                                        <td>{{user.status?'On':'Off'}}</td>
                                        <td>{{user.time_update}}</td>
                                    </tr>
                                </table>
                            </td></tr>
                            <tr><th>Auth</th><td>
                                <table class="subTable">
                                    <tr>
                                        <th>DirId</th>
                                        <th>Path</th>
                                        <th>Access</th>
                                        <th>Modify</th>
                                        <th>Delete</th>
                                    </tr>
                                    <tr v-for="dir in item.control_dir">
                                        <td>{{dir.dir_id}}</td>
                                        <td>{{dir.path}}</td>
                                        <td>{{dir.access?'Allow':'Deny'}}</td>
                                        <td>{{dir.modify?'Allow':'Deny'}}</td>
                                        <td>{{dir.delete?'Allow':'Deny'}}</td>
                                    </tr>
                                </table>
                            </td></tr>
                            <tr><th>Time</th><td>{{item.time_update}}<br>{{item.time_create}}</td></tr>
                        </table>
                </template>
            </li>
            <li class="groupMain">
                <template v-if="editMode===1 && editId===0">
                    <div class="groupMain editMode">
                        <span class="">ID:0</span>
                        <input type="text" v-model="newGroup.name">
                        <input type="text" v-model="newGroup.sort">
                        <!--<span class="">{{group.sort}}</span>-->
                        <!--<span class="">{{group.time_create}}</span>-->
                        <!--<span class="">{{group.time_update}}</span>-->
                        <span class="operator">
                        <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                        <span class="sysIcon sysIcon_edit" v-on:click="saveGroup(newGroup.id)"></span>
                        </span>
                    </div>
                    <textarea class="groupAlt" v-model="newGroup.alt"></textarea>
                    <textarea class="groupDescription" v-model="newGroup.description"></textarea>
                </template>
                <template v-else>
                    <div class="sysIcon sysIcon_plus-square-o addBtn" v-on:click="modGroup(0)"></div>
                </template>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
    .userGroup {
        .groupList {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .groupMain{
            margin: $fontSize*0.5;
            min-width: 45%;
        }
        .groupMain>table{
            width: 100%;
        }
        tr:nth-child(2n){
            background-color: rgba(0,0,0,0.2);
        }
        tr{
            line-height: $fontSize*2;
        }
        td,th{
            padding: 0 $fontSize*1;
        }
        th{
            white-space: nowrap;
        }
        .subTable {
            width: 100%;
            tr:nth-child(2n){
                background-color: rgba(255,255,255,0.1);
            }
        }
        @media(max-width: 1350px){
            .groupMain{
                margin: $fontSize*0.5;
                min-width: 90%;
            }
            font-size: $fontSize*1;
        }
        font-size: $fontSize*1.2;
    }
</style>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'
    import Helper     from "../lib/Helper";

    export default {
        name      : 'UserGroup',
        components: {},
        store     : store,
        watch     : {
            $route: function (to, from) {
                console.info(`UserGroup: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.fillQuery(router.currentRoute.query);
                this.query(this.queryData, this.page).then(this.fillData);
            },
        },
        data      : function () {
            return {
                queryData: {
                    name: '',
                },
                // page: 1,
                editId   : 0,//targetId
                list     : [],
                newGroup : {
                    name       : '',
                    sort       : '',
                    alt        : '',
                    description: '',
                },
            }
        },
        computed  : {},
        created   : function () {
            console.info('UserGroup.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, 1).then(this.fillData);
        },
        mounted   : function () {
            console.info('UserGroup.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
            store.commit('closePagination');
        },
        updated   : function () {
            console.info('UserGroup.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            /**
             * 查询方法，返回的 promise
             * */
            query    : function (query, page) {
                console.info('UserGroup: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        id           : 1,
                        name         : 'admin',
                        description  : 'admin group',
                        status       : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 1, delete: 1, path: 'root',},
                            {dir_id: 1, access: 1, modify: 1, delete: 1, path: 'root/hentai',},
                            {dir_id: 9, access: 1, modify: 0, delete: 0, path: 'root/doujinshi',},
                        ],
                        control_admin: 1,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'administrator', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                            {id: 0, name: '', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                            {id: 0, name: '', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                            {id: 0, name: '', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                    {
                        id           : 999,
                        name         : 'guest',
                        description  : 'guest group',
                        status       : 1,
                        sort         : 1,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '1919-08-10 11:45:14',
                        time_update  : '1919-08-10 11:45:14',
                        user         : [
                            {id: 0, name: 'guest', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                        ],
                    },
                ];
                //
                return new Promise((resolve, reject) => {
                    console.debug({list});
                    return resolve({list, query});
                });
            },
            /**
             * 写入参数
             * */
            fillQuery: function (query) {
                console.info('list: fillQuery');
                // console.warn(query);
                let queryNames = Object.getOwnPropertyNames(query);
                for (let i1 = 0; i1 < queryNames.length; i1++) {
                    let name = queryNames[i1];
                    if (name === 'page') {
                        this.page = query[name];
                    } else {
                        this.queryData[name] = query[name];
                    }
                }
            },
            /**
             * 填充数据， this.query 的配套方法
             * 拆开写是为了方便 query 方法注入到外部以便共用
             * */
            fillData : function (resolveData) {
                console.info('UserGroup: fillData');
                this.list = resolveData.list;
                this.fillQuery(resolveData.query);
            },
            goto     : function (type, targetId) {
                console.info(`list: goto ${type} ${targetId}`);
                let query = {};
                switch (type) {
                    //tag 查询当前目录下的 tag
                    case 'tag':
                        query.tag = targetId;
                        break;
                }
                let targetRoute = {path: '/', query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
            },
        },
    }
</script>
