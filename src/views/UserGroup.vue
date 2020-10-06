<template>
    <div class="userGroup">
        <ul class="groupList">
            <li v-for="(item,groupIndex) in list" class="groupMain">
                <table>
                    <tr><th>ID</th><td class="idRow">
                        <span>{{item.id}}</span>
                        <span class="sysIcon sysIcon_edit" v-if="editGroupId!==item.id" v-on:click="modGroup(item.id)"></span>
                        <span class="sysIcon sysIcon_save" v-else v-on:click="saveGroup(item.id)"></span>
                    </td></tr>
                    <template v-if="editGroupId===item.id">
                        <tr><th>Name</th><td><input type="text" v-model="item.name"></td></tr>
                        <tr><th>Desc</th><td><input type="text" v-model="item.description"></td></tr>
                        <tr><th>Status</th><td :class="{positive:item.status,negative:!item.status,}">
                            <input type="radio" :value="1" v-model="item.status" :id="`ug_${item.id}_status_0`">
                            <label :for="`ug_${item.id}_status_0`">On</label>
                            <input type="radio" :value="0" v-model="item.status" :id="`ug_${item.id}_status_1`">
                            <label :for="`ug_${item.id}_status_1`">Off</label>
                        </td></tr>
                        <tr><th>Admin</th><td :class="{positive:item.control_admin,negative:!item.control_admin,}">
                            <input type="radio" :value="1" v-model="item.control_admin" :id="`ug_${item.id}_admin_0`">
                            <label :for="`ug_${item.id}_admin_0`">Yey</label>
                            <input type="radio" :value="0" v-model="item.control_admin" :id="`ug_${item.id}_admin_1`">
                            <label :for="`ug_${item.id}_admin_1`">Nay</label>
                        </td></tr>
                    </template>
                    <template v-else>
                        <tr><th>Name</th><td>{{item.name}}</td></tr>
                        <tr><th>Desc</th><td>{{item.description}}</td></tr>
                        <tr><th>Status</th><td :class="{positive:item.status,negative:!item.status,}">{{item.status?'On':'Off'}}</td></tr>
                        <tr><th>Admin</th><td :class="{positive:item.status,negative:!item.status,}">{{item.control_admin?'Y':'N'}}</td></tr>
                    </template>
                    <tr><th>
                        Auth
                        <span class="sysIcon sysIcon_edit" v-if="editAuthId!==item.id" v-on:click="modAuth(item.id)"></span>
                        <span class="sysIcon sysIcon_save" v-else v-on:click="saveAuth(item.id)"></span>
                    </th><td>
                        <table class="subTable" v-if="editAuthId!==item.id">
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
                                <td :class="{positive:dir.access,negative:!dir.access,}">{{dir.access?'Allow':'Deny'}}</td>
                                <td :class="{positive:dir.modify,negative:!dir.modify,}">{{dir.modify?'Allow':'Deny'}}</td>
                                <td :class="{positive:dir.delete,negative:!dir.delete,}">{{dir.delete?'Allow':'Deny'}}</td>
                            </tr>
                        </table>
                        <table class="subTable editing" v-else>
                            <tr>
                                <th>DirId</th>
                                <th>Path</th>
                                <th>Access</th>
                                <th>Modify</th>
                                <th>Delete</th>
                            </tr>
                            <tr v-for="(dir,dirIndex) in item.control_dir">
                                <td>
                                    <input type="text" v-model="dir.dir_id" v-on:keydown="search(groupIndex,dirIndex)">
                                    <ul v-if="selectorGroupIndex===groupIndex && selectorDirIndex===dirIndex" class="float_hinter">
                                        <li
                                                v-for="(selectorItem,selectorIndex) in selector"
                                                v-on:click.stop="addAuth(selectorIndex)"
                                        >{{selectorItem.dir_id}}:{{selectorItem.path}}</li>
                                    </ul>
                                </td>
                                <td>{{dir.path}}</td>
                                <td :class="{positive:dir.access,negative:!dir.access,}">
                                    <input type="checkbox" v-model="dir.access" :id="`ug_${item.id}_${dir.dir_id}_access`">
                                    <label :for="`ug_${item.id}_${dir.dir_id}_access`">{{dir.access?'On':'Off'}}</label>
                                </td>
                                <td :class="{positive:dir.modify,negative:!dir.modify,}">
                                    <input type="checkbox" v-model="dir.modify" :id="`ug_${item.id}_${dir.dir_id}_modify`">
                                    <label :for="`ug_${item.id}_${dir.dir_id}_modify`">{{dir.modify?'On':'Off'}}</label>
                                </td>
                                <td :class="{positive:dir.delete,negative:!dir.delete,}">
                                    <input type="checkbox" v-model="dir.delete" :id="`ug_${item.id}_${dir.dir_id}_delete`">
                                    <label :for="`ug_${item.id}_${dir.dir_id}_delete`">{{dir.delete?'On':'Off'}}</label>
                                </td>
                                <td class="sysIcon sysIcon_delete" v-on:click="delAuth(index)"></td>
                            </tr>
                            <tr>
                                <td colspan="6" class="sysIcon sysIcon_plus-square-o addRow" v-on:click="addAuth()"></td>
                            </tr>
                        </table>
                    </td></tr>
                    <tr><th>Time</th><td>{{item.time_update}}<br>{{item.time_create}}</td></tr>
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
                                <td :class="{positive:user.status,negative:!user.status,}">{{user.status?'On':'Off'}}</td>
                                <td>{{user.time_update}}</td>
                            </tr>
                        </table>
                    </td></tr>
                </table>
            </li>
            <li class="groupMain">
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
        .idRow{
            display: flex;
            justify-content: space-between;
        }
        @media(max-width: 1350px){
            .groupMain{
                margin: $fontSize*0.5;
                min-width: 90%;
            }
            font-size: $fontSize*1;
        }
        font-size: $fontSize*1.2;
        .positive{
            background-color: rgba(0, 160, 255, 0.2);
        }
        .negative{
            background-color: rgba(255, 40, 40, 0.2);
        }

        .subTable {
            &.editing {th,td{
                padding: 0;
            }}
            td {
                position: relative;
                &:nth-child(1){
                    width: $fontSize*3;
                    input{
                        width: 100%;
                    }
                }
                &:nth-child(2){
                    width: $fontSize*15;
                    input{
                        width: 100%;
                    }
                }
                &:nth-child(3),
                &:nth-child(4),
                &:nth-child(5),
                &:nth-child(6) {
                    text-align: center;
                }
            }
            .addRow{
                font-size: $fontSize*1.5;
            }
        }

        input[type='checkbox'], input[type='radio'] {
            display: none;
            + label {
                display: inline-block;
                width: max-content;
                /*background-image: linear-gradient(0deg, hsla(250, 30%, 30%, 1) 0%, rgb(25, 25, 25) 100%);*/
                background-color: rgba(0,0,0,0.2);
                font-size: 1.25*$fontSize;
                padding: 0.25em 0.5*$fontSize;
                line-height: 1.25*$fontSize;
                margin: 0.25*$fontSize;
                //border-radius: 0.5*$fontSize;
            }

            &:checked {
                + label {
                    //background-image: linear-gradient(0deg, rgba(100, 100, 100, 1) 0%, rgba(150, 150, 150, 1) 100%);
                    background-color: rgba(255,255,255,0.2);
                }
            }
        }
        .float_hinter{
            background-color: rgba(0,0,0,0.8);
        }
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
                queryData    : {
                    name: '',
                },
                // page: 1,
                editGroup    : 0,
                editGroupId  : 0,
                //
                editAuth     : 0,
                editAuthId   : 0,
                editAuthIndex: -1,
                //
                selectorGroupIndex : false,
                selectorDirIndex : false,
                selector     : [],
                //
                list         : [],
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
            document.getElementById('app').addEventListener('click', this.searchClear);
        },
        beforeDestroy:function() {
            document.getElementById('app').removeEventListener('click', this.searchClear)
        },
        updated   : function () {
            console.warn('UserGroup.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            modGroup: function (itemId) {
                console.info('UserGroup: modGroup')
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== itemId) continue;
                    this.editGroupId = itemId;
                }
                this.editGroup = 1;
            },
            saveGroup: function () {
                this.editGroupId   = 0;
                this.editGroup = 0;
            },
            modAuth : function (groupId) {
                console.info('UserGroup: modAuth')
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== groupId) continue;
                    this.editAuthId = groupId;
                }
                this.editAuth = 1;
            },
            addAuth : function (index) {
                console.info('UserGroup: addAuth');
                let current=this.selector[index];
                this.list[this.editGroupId]
                .control_dir.push(
                    {
                        dir_id: current?current.dir_id:'',
                        path  : current?current.path:'',
                        access: 1,
                        modify: 1,
                        delete: 1,
                    })
                ;
                this.searchClear();
            },
            delAuth : function (itemIndex) {
                console.info('UserGroup: delAuth')
                this.list[this.editGroupId]
                .control_dir.splice(itemIndex,1)
                ;
            },
            saveAuth : function () {
                this.editAuthId   = 0;
                this.editAuth = 0;
                this.editAuthIndex = -1;
            },
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
                            {id: 0, name: 'hentai', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                            {id: 0, name: 'lolicon', status: 0, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
                            {id: 0, name: 'giorno giovanna', status: 1, time_create: '1919-08-10 11:45:14', time_update: '1919-08-10 11:45:14',},
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
                console.info( resolveData.list);
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
            /**
             * @todo api
             * */
            search     : function (groupIndex,dirIndex) {
                console.debug(`UserGroup: search ${groupIndex} ${dirIndex}`);
                //
                let curDir=this.list[groupIndex].control_dir[dirIndex];
                if (!curDir.dir_id) return;
                //
                this.selectorGroupIndex = groupIndex;
                this.selectorDirIndex = dirIndex;
                this.selector     = [
                    {dir_id: 4, path: '/root/tentacles',},
                    {dir_id: 2, path: '/root/dilf',},
                    {dir_id: 3, path: '/root/rape',},
                    {dir_id: 1, path: '/root/netorare',},
                ];
            },
            /**
             * @todo api
             * */
            searchClear: function () {
                if (!this.selector.length) return false;
                console.debug('UserGroup: searchClear ');
                this.selectorGroupIndex = false;
                this.selectorDirIndex = false;
                this.selector     = [];
            },
        },
    }
</script>
