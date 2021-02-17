<template>
    <div class="userGroup">
        <ul class="groupList">
            <li v-for="(item,groupIndex) in list" class="groupMain">
                <table>
                    <tr>
                        <th>ID</th>
                        <td class="idRow">
                            <span>{{ item.id }}</span>
                            <div>
                                <span class="sysIcon sysIcon_edit" v-if="!item.editing" v-on:click="modGroup(groupIndex)"></span>
                                <span class="sysIcon sysIcon_save" v-else v-on:click="saveGroup(groupIndex)"></span>
                                &nbsp;
                                <span class="sysIcon sysIcon_delete" v-on:click="delGroup(groupIndex)"></span>
                            </div>
                        </td>
                    </tr>
                    <template v-if="item.editing">
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
                            <td :class="[item.status==1?'positive':'negative']">
                                <input type="radio" :value="1" v-model="item.status" :id="`ug_${item.id}_status_0`">
                                <label :for="`ug_${item.id}_status_0`">On</label>
                                <input type="radio" :value="0" v-model="item.status" :id="`ug_${item.id}_status_1`">
                                <label :for="`ug_${item.id}_status_1`">Off</label>
                            </td>
                        </tr>
                        <tr>
                            <th>Admin</th>
                            <td :class="[item.admin==1?'positive':'negative']">
                                <input type="radio" :value="1" v-model="item.admin" :id="`ug_${item.id}_admin_0`">
                                <label :for="`ug_${item.id}_admin_0`">Yey</label>
                                <input type="radio" :value="0" v-model="item.admin" :id="`ug_${item.id}_admin_1`">
                                <label :for="`ug_${item.id}_admin_1`">Nay</label>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <th>Name</th>
                            <td>{{ item.name }}</td>
                        </tr>
                        <tr>
                            <th>Desc</th>
                            <td>{{ item.description }}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td :class="[item.status==1?'positive':'negative']">{{ item.status == 1 ? 'On' : 'Off' }}</td>
                        </tr>
                        <tr>
                            <th>Admin</th>
                            <td :class="[item.admin==1?'positive':'negative']">{{ item.admin == 1 ? 'Y' : 'N' }}</td>
                        </tr>
                    </template>
                    <tr>
                        <th>
                            Auth
                            <span class="sysIcon sysIcon_edit" v-if="!item.editingAuth" v-on:click="modAuthGroup(groupIndex)"></span>
                            <span class="sysIcon sysIcon_save" v-else v-on:click="saveAuthGroup(groupIndex)"></span>
                        </th>
                        <td>
                            <table class="subTable" v-if="!item.editingAuth">
                                <tr>
                                    <th>DirId</th>
                                    <th>Path</th>
                                    <th>Access</th>
                                    <th>Modify</th>
                                    <th>Delete</th>
                                </tr>
                                <tr v-for="dir in item.control_dir">
                                    <td>{{ dir.id_node }}</td>
                                    <td>{{ dir.path }}</td>
                                    <td :class="[dir.access==1?'positive':'negative']">{{ dir.access == 1 ? 'Allow' : 'Deny' }}</td>
                                    <td :class="[dir.modify==1?'positive':'negative']">{{ dir.modify == 1 ? 'Allow' : 'Deny' }}</td>
                                    <td :class="[dir.delete==1?'positive':'negative']">{{ dir.delete == 1 ? 'Allow' : 'Deny' }}</td>
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
                                            :data="dir.id_node"
                                            :show="['id_node','path']"
                                            :query="hinterQuery"
                                            :callback="hinterCallback.bind(this,groupIndex,dirIndex)"
                                        />
                                    </td>
                                    <td>{{ dir.path }}</td>
                                    <td :class="{positive:dir.access,negative:!dir.access,}">
                                        <input type="checkbox" v-model="dir.access" :id="`ug_${item.id}_${dir.id_node}_access`">
                                        <label :for="`ug_${item.id}_${dir.id_node}_access`">{{ dir.access ? 'On' : 'Off' }}</label>
                                    </td>
                                    <td :class="{positive:dir.modify,negative:!dir.modify,}">
                                        <input type="checkbox" v-model="dir.modify" :id="`ug_${item.id}_${dir.id_node}_modify`">
                                        <label :for="`ug_${item.id}_${dir.id_node}_modify`">{{ dir.modify ? 'On' : 'Off' }}</label>
                                    </td>
                                    <td :class="{positive:dir.delete,negative:!dir.delete,}">
                                        <input type="checkbox" v-model="dir.delete" :id="`ug_${item.id}_${dir.id_node}_delete`">
                                        <label :for="`ug_${item.id}_${dir.id_node}_delete`">{{ dir.delete ? 'On' : 'Off' }}</label>
                                    </td>
                                    <td class="sysIcon sysIcon_delete" v-on:click="delAuth(groupIndex,dirIndex)"></td>
                                </tr>
                                <tr>
                                    <td colspan="6" class="sysIcon sysIcon_plus-square-o addRow" v-on:click="addAuth(groupIndex)"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <td>{{ item.time_update }} &emsp;&emsp;&emsp; {{ item.time_create }}</td>
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
                                    <td class="pointer" v-on:click="goto('user',user.id)">{{ user.id }}</td>
                                    <td class="pointer" v-on:click="goto('user',user.id)">{{ user.name }}</td>
                                    <td :class="[user.status==1?'positive':'negative']">{{ user.status == 1 ? 'On' : 'Off' }}</td>
                                    <td>{{ user.time_update }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </li>
            <li class="groupMain sysIcon sysIcon_plus-square-o addGroup" v-on:click="modGroup(-1)">
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
        flex-wrap: wrap;
        justify-content: space-between;
        column-count: 2;
    }
    .groupMain {
        margin: $fontSize*0.5;
        break-inside: avoid;
        tr {
            break-inside: avoid;
        }
    }
    .groupMain > table {
        width: 100%;
    }
    tr:nth-child(2n) {
        background-color: rgba(0, 0, 0, 0.2);
    }
    td, th {
        padding: 0 $fontSize*1;
        line-height: $fontSize*2;
        height: $fontSize*2;
        > * {
            vertical-align: top;
        }
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
    .positive {
        background-color: map_get($colors, positive);
    }
    .negative {
        background-color: map_get($colors, negative);
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
            }
            &:nth-child(2) {
                width: $fontSize*15;
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
    input {
        width: calc(100% - #{$fontSize*2});
        padding: 0 $fontSize*1;
        line-height: 2*$fontSize;
        height: 2*$fontSize;
    }
    .float_hinter {
        background-color: rgba(0, 0, 0, 0.8);
    }
    .addGroup {
        text-align: left;
        font-size: $fontSize*2;
        height: $fontSize*2;
        line-height: $fontSize*2;
    }
    @media(max-width: $narrowWidth) {
        .groupList {
            column-count: 1;
        }
    }
}
</style>

<script>
// @ is an alias to /src
import store   from "../store";
import router  from "../router";
import GenFunc from '../lib/GenFuncLib'
import Helper  from "../lib/Helper";
import Hinter  from "../components/Hinter";
import helper  from "../lib/Helper";

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
            queryData: {
                name: '',
            },
            // page: 1,
            editGroup     : 0,
            editGroupIndex: -1,
            //
            editAuth          : 0,
            editAuthGroupIndex: -1,
            editAuthIndex     : -1,
            //
            list: [],
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
        modGroup: function (groupIndex) {
            console.info('UserGroup: modGroup')
            if (groupIndex == -1) {
                this.list.push(
                    {
                        id         : 0,
                        name       : '',
                        description: '',
                        status     : 0,
                        control_dir: [
                            {id_node: 0, access: 1, modify: 0, delete: 0, path: 'root',},
                        ],
                        admin      : 0,
                        time_create: '',
                        time_update: '',
                        user       : [],
                        editing    : 1,
                        editingAuth: 1,
                    });
            } else {
                this.list[groupIndex].editing = 1;
                this.list.splice(groupIndex, 1, this.list[groupIndex]);
            }
        },
        /**
         * @todo api user_group_mod
         * */
        saveGroup: function (groupIndex) {
            return new Promise((resolve, reject) => {
                helper.query(
                    'user_group_mod',
                    {
                        id         : this.list[groupIndex].id,
                        name       : this.list[groupIndex].name,
                        description: this.list[groupIndex].description,
                        admin      : this.list[groupIndex].admin,
                        status     : this.list[groupIndex].status,
                    }
                ).then((data) => {
                    console.info(data);
                    this.list[groupIndex].id      = data;
                    this.list[groupIndex].editing = 0;
                    this.list.splice(groupIndex, 1, this.list[groupIndex]);
                    return resolve();
                }).catch((data) => {
                    console.info(data);
                });
            });
        },
        /**
         * @todo api user_group_del
         * */
        delGroup: function (groupIndex) {
            return new Promise((resolve, reject) => {
                helper.query(
                    'user_group_del',
                    {
                        id: this.list[groupIndex].id,
                    }
                ).then((data) => {
                    console.info(data);
                    this.list.splice(groupIndex, 1);
                    return resolve();
                }).catch((data) => {
                    console.info(data);
                });
            });
        },
        // ---------------------------------
        modAuthGroup: function (groupIndex) {
            console.info('UserGroup: modAuthGroup');
            this.list[groupIndex].editingAuth = 1;
            this.list.splice(groupIndex, 1, this.list[groupIndex]);
        },
        /**
         * @todo api user_group_auth
         * */
        saveAuthGroup: function (groupIndex) {
            return new Promise((resolve, reject) => {
                helper.query(
                    'user_group_auth',
                    {
                        id  : this.list[groupIndex].id,
                        list: this.list[groupIndex].control_dir,
                    }
                ).then((data) => {
                    console.info(data);
                    this.list[groupIndex].control_dir = data;
                    this.list[groupIndex].editingAuth = 0;
                    this.list.splice(groupIndex, 1, this.list[groupIndex]);
                    return resolve();
                }).catch((data) => {
                    console.info(data);
                });
            });
        },
        addAuth      : function (groupIndex) {
            console.info('UserGroup: addAuth');
            this.list[groupIndex]
                .control_dir.push(
                {
                    id_node: '',
                    path   : '',
                    access : 1,
                    modify : 1,
                    delete : 1,
                })
            ;
            this.list[groupIndex].editingAuth = 1;
            this.list.splice(groupIndex, 1, this.list[groupIndex]);
        },
        delAuth      : function (groupIndex, dirIndex) {
            console.info(`UserGroup: delAuth ${groupIndex} ${dirIndex}`)
            this.list[groupIndex]
                .control_dir.splice(dirIndex, 1)
            ;
            this.list.splice(groupIndex, 1, this.list[groupIndex]);
        },
        /**
         * @todo api file_list
         * */
        hinterQuery   : function (searchTxt) {
            console.debug(`UserGroup: hinterQuery ${searchTxt}`);
            //
            return new Promise((resolve, reject) => {
                return resolve(
                    {
                        list: [
                            {id_node: 4, path: '/root/tentacles',},
                            {id_node: 2, path: '/root/dilf',},
                            {id_node: 3, path: '/root/rape',},
                            {id_node: 1, path: '/root/netorare',},
                        ],
                    });
            });
        },
        hinterCallback: function (groupIndex, dirIndex, target) {
            console.debug(`UserGroup: hinterCallback ${groupIndex} ${dirIndex}`);
            console.debug(target);
            this.list[groupIndex].control_dir[dirIndex]
                .id_node = target.id_node;
            this.list[groupIndex].control_dir[dirIndex]
                .path    = target.path;
        },
        // ---------------------------------
        /**
         * @todo api user_group_get
         * 查询方法，返回的 promise
         * */
        query: function (query, page) {
            console.info('UserGroup: query');
            query = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page});

            return new Promise((resolve, reject) => {
                helper.query(
                    'user_group_list',
                    query
                ).then((data) => {
                    console.info(data);
                    return resolve({list: data, query});
                }).catch((data) => {
                    console.info(data);
                });
            });
            /*
             return ;
             //
             let list = [
             {
             id           : 1,
             name         : 'admin',
             description  : 'admin group',
             status       : 1,
             control_dir  : [
             {id_node: 0, access: 1, modify: 1, delete: 1, path: 'root',},
             {id_node: 1, access: 1, modify: 1, delete: 1, path: 'root/hentai',},
             {id_node: 9, access: 1, modify: 0, delete: 0, path: 'root/doujinshi',},
             ],
             admin: 1,
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
             {id_node: 0, access: 1, modify: 0, delete: 0, path: 'root',},
             ],
             admin: 0,
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
             });*/
        },
        /**
         * 写入参数
         * */
        fillQuery: function (query) {
            console.info('list: fillQuery');
            // console.warn(query);
            if (!query) query = {};
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
        fillData: function (resolveData) {
            console.info('UserGroup: fillData');
            console.info(resolveData.list);
            this.list = resolveData.list;
            this.fillQuery(resolveData.query);
        },
        goto    : function (type, targetId) {
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
