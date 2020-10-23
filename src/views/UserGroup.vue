<template>
    <div class="userGroup">
        <ul class="groupList">
            <li v-for="(item,groupIndex) in list" class="groupMain">
                <table>
                    <tr>
                        <th>ID</th>
                        <td class="idRow">
                            <span>{{item.id}}</span>
                            <div>
                            <span class="sysIcon sysIcon_edit" v-if="groupIndex!==editGroupIndex" v-on:click="modGroup(groupIndex)"></span>
                            <span class="sysIcon sysIcon_save" v-else v-on:click="saveGroup(groupIndex)"></span>
                                &nbsp;
                            <span class="sysIcon sysIcon_delete" v-on:click="delGroup(groupIndex)"></span>
                            </div>
                        </td>
                    </tr>
                    <template v-if="editGroupIndex===groupIndex">
                        <tr>
                            <th>Name</th>
                            <td><input type="text" v-model="item.name"></td>
                        </tr>
                        <tr>
                            <th>Desc</th>
                            <td><input type="text" v-model="item.description"></td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td :class="{positive:item.status,negative:!item.status,}">
                                <input type="radio" :value="1" v-model="item.status" :id="`ug_${item.id}_status_0`">
                                <label :for="`ug_${item.id}_status_0`">On</label>
                                <input type="radio" :value="0" v-model="item.status" :id="`ug_${item.id}_status_1`">
                                <label :for="`ug_${item.id}_status_1`">Off</label>
                            </td>
                        </tr>
                        <tr>
                            <th>Admin</th>
                            <td :class="{positive:item.control_admin,negative:!item.control_admin,}">
                                <input type="radio" :value="1" v-model="item.control_admin" :id="`ug_${item.id}_admin_0`">
                                <label :for="`ug_${item.id}_admin_0`">Yey</label>
                                <input type="radio" :value="0" v-model="item.control_admin" :id="`ug_${item.id}_admin_1`">
                                <label :for="`ug_${item.id}_admin_1`">Nay</label>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <th>Name</th>
                            <td>{{item.name}}</td>
                        </tr>
                        <tr>
                            <th>Desc</th>
                            <td>{{item.description}}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td :class="{positive:item.status,negative:!item.status,}">{{item.status?'On':'Off'}}</td>
                        </tr>
                        <tr>
                            <th>Admin</th>
                            <td :class="{positive:item.status,negative:!item.status,}">{{item.control_admin?'Y':'N'}}</td>
                        </tr>
                    </template>
                    <tr>
                        <th>
                            Auth
                            <span class="sysIcon sysIcon_edit" v-if="editAuthGroupIndex!==groupIndex" v-on:click="modAuthGroup(groupIndex)"></span>
                            <span class="sysIcon sysIcon_save" v-else v-on:click="saveAuthGroup(item.id)"></span>
                        </th>
                        <td>
                            <table class="subTable" v-if="editAuthGroupIndex!==groupIndex">
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
                                        <Hinter
                                                :data="dir.dir_id"
                                                :show="['dir_id','path']"
                                                :query="hinterQuery"
                                                :callback="hinterCallback.bind(this,groupIndex,dirIndex)"
                                        />
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
                                    <td class="sysIcon sysIcon_delete" v-on:click="delAuth(groupIndex,dirIndex)"></td>
                                </tr>
                                <tr>
                                    <td colspan="6" class="sysIcon sysIcon_plus-square-o addRow" v-on:click="addAuth()"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <td>{{item.time_update}}<br>{{item.time_create}}</td>
                    </tr>
                    <tr class="userRow">
                        <th class="pointer" v-on:click="goto('user_group',item.id)">User</th>
                        <td>
                            <table class="subTable">
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                                <tr v-for="user in item.user">
                                    <td class="pointer" v-on:click="goto('user',user.id)">{{user.id}}</td>
                                    <td class="pointer" v-on:click="goto('user',user.id)">{{user.name}}</td>
                                    <td :class="{positive:user.status,negative:!user.status,}">{{user.status?'On':'Off'}}</td>
                                    <td>{{user.time_update}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </li>
            <li class="groupMain sysIcon sysIcon_plus-square-o addGroup" v-on:click="addGroup()">
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
            justify-content: space-between;
        }

        .groupMain {
            margin: $fontSize*0.5;
            width: 45%;
        }

        .groupMain > table {
            width: 100%;
        }

        tr:nth-child(2n) {
            background-color: rgba(0, 0, 0, 0.2);
        }

        tr {
            line-height: $fontSize*2;
        }

        td, th {
            padding: 0 $fontSize*1;
        }

        th {
            white-space: nowrap;
        }

        .subTable {
            width: 100%;

            tr:nth-child(2n) {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }

        .idRow {
            display: flex;
            justify-content: space-between;
        }

        @media(max-width: 1500px) {
            .groupMain {
                margin: $fontSize*0.5;
                width: 100%;
            }
            font-size: $fontSize*1;
        }
        @media(max-width: 700px) {
            .userRow {
                .subTable td, .subTable th {
                    &:nth-child(4) {
                        display: none;
                    }
                }
            }
        }
        font-size: $fontSize*1.2;

        .positive {
            background-color: rgba(0, 160, 255, 0.2);
        }

        .negative {
            background-color: rgba(255, 40, 40, 0.2);
        }

        .subTable {
            &.editing {
                th, td {
                    padding: 0;
                }
            }

            td {
                position: relative;

                &:nth-child(1) {
                    width: $fontSize*3;

                    input {
                        width: 100%;
                    }
                }

                &:nth-child(2) {
                    width: $fontSize*15;

                    input {
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

            .addRow {
                font-size: $fontSize*1.5;
            }
        }

        input[type='checkbox'], input[type='radio'] {
            display: none;

            + label {
                display: inline-block;
                width: max-content;
                /*background-image: linear-gradient(0deg, hsla(250, 30%, 30%, 1) 0%, rgb(25, 25, 25) 100%);*/
                background-color: rgba(0, 0, 0, 0.2);
                font-size: 1.25*$fontSize;
                padding: 0.25em 0.5*$fontSize;
                line-height: 1.25*$fontSize;
                margin: 0.25*$fontSize;
                //border-radius: 0.5*$fontSize;
            }

            &:checked {
                + label {
                    //background-image: linear-gradient(0deg, rgba(100, 100, 100, 1) 0%, rgba(150, 150, 150, 1) 100%);
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }

        .float_hinter {
            background-color: rgba(0, 0, 0, 0.8);
        }

        .addGroup {
            text-align: left;
            font-size: $fontSize*2;
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
    import Hinter     from "../components/Hinter";

    export default {
        name         : 'UserGroup',
        components   : {Hinter},
        store        : store,
        watch        : {
            $route: function (to, from) {
                console.info(`UserGroup: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.fillQuery(router.currentRoute.query);
                this.query(this.queryData, this.page).then(this.fillData);
            },
        },
        data         : function () {
            return {
                queryData         : {
                    name: '',
                },
                // page: 1,
                editGroup         : 0,
                editGroupIndex    : -1,
                //
                editAuth          : 0,
                editAuthGroupIndex: -1,
                editAuthIndex     : -1,
                //
                list              : [],
            }
        },
        computed     : {},
        created      : function () {
            console.info('UserGroup.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, 1).then(this.fillData);
        },
        mounted      : function () {
            console.info('UserGroup.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
            store.commit('closePagination');
        },
        beforeDestroy: function () {
        },
        updated      : function () {
            console.warn('UserGroup.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods      : {
            addGroup      : function () {
                console.info('UserGroup: modGroup')
                this.list.push(
                    {
                        id           : 0,
                        name         : '',
                        description  : '',
                        status       : 0,
                        control_dir  : [
                            {dir_id: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        control_admin: 0,
                        time_create  : '',
                        time_update  : '',
                        user         : [],
                    });
                this.editGroupIndex = -1;
                this.editGroup      = 1;
            },
            modGroup      : function (groupIndex) {
                console.info('UserGroup: modGroup')
                this.saveGroup();
                this.editGroupIndex = groupIndex;
                this.editGroup      = 1;
            },
            /**
             * @todo api
             * */
            saveGroup     : function () {
                this.editGroupIndex = -1;
                this.editGroup      = 0;
            },
            /**
             * @todo api
             * */
            delGroup      : function (groupIndex) {
                this.editGroup          = 0;
                this.editGroupIndex     = -1;
                this.editAuth           = 0;
                this.editAuthGroupIndex = -1;
                this.editAuthIndex      = -1;
                this.list.splice(groupIndex, 1);
            },
            // ---------------------------------
            modAuthGroup  : function (groupId) {
                console.info('UserGroup: modAuthGroup');
                this.saveAuthGroup();
                this.editAuthGroupIndex = groupId;
                this.editAuth           = 1;
            },
            /**
             * @todo api
             * */
            saveAuthGroup : function () {
                this.editAuthGroupIndex = -1;
                this.editAuth           = 0;
                this.editAuthIndex      = -1;
            },
            addAuth       : function (index) {
                console.info('UserGroup: addAuth');
                this.list[this.editAuthGroupIndex]
                    .control_dir.push(
                    {
                        dir_id: '',
                        path  : '',
                        access: 1,
                        modify: 1,
                        delete: 1,
                    })
                ;
            },
            setAuth       : function (groupIndex, dirIndex, selectIndex) {
                console.info('UserGroup: setAuth');
                let current                                        = this.selector[selectIndex];
                this.list[groupIndex].control_dir[dirIndex].dir_id = current.dir_id;
                this.list[groupIndex].control_dir[dirIndex].path   = current.path;
            },
            delAuth       : function (groupIndex, dirIndex) {
                console.info(`UserGroup: delAuth ${groupIndex} ${dirIndex}`)
                this.list[groupIndex]
                    .control_dir.splice(dirIndex, 1)
                ;
            },
            /**
             * @todo api
             * */
            hinterQuery   : function (searchTxt) {
                console.debug(`UserGroup: hinterQuery ${searchTxt}`);
                //
                return new Promise((resolve, reject) => {
                    return resolve(
                        {
                            list: [
                                {dir_id: 4, path: '/root/tentacles',},
                                {dir_id: 2, path: '/root/dilf',},
                                {dir_id: 3, path: '/root/rape',},
                                {dir_id: 1, path: '/root/netorare',},
                            ],
                        });
                });
            },
            hinterCallback: function (groupIndex, dirIndex, target) {
                console.debug(`UserGroup: hinterCallback ${groupIndex} ${dirIndex}`);
                console.debug(target);
                this.list[groupIndex].control_dir[dirIndex]
                    .dir_id = target.dir_id;
                this.list[groupIndex].control_dir[dirIndex]
                    .path   = target.path;
            },
            // ---------------------------------
            /**
             * @todo api
             * 查询方法，返回的 promise
             * */
            query         : function (query, page) {
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
            fillQuery     : function (query) {
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
            fillData      : function (resolveData) {
                console.info('UserGroup: fillData');
                console.info(resolveData.list);
                this.list = resolveData.list;
                this.fillQuery(resolveData.query);
            },
            goto          : function (type, targetId) {
                console.info(`list: goto ${type} ${targetId}`);
                let query = {};
                let path  = '/';
                switch (type) {
                    //tag 查询当前目录下的 tag
                    case 'user_group':
                        query.group_id = targetId;
                        path           = '/user';
                        break;
                    case 'user':
                        query.uid = targetId;
                        path      = '/user';
                        break;
                }
                let targetRoute = {path: path, query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
            },
        },
    }
</script>
