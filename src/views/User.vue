<template>
    <div class="User">
        <div class="listHeader">
            <label class="headerGroup">
                UserName :
                <input type="text" placeholder="search" v-model="queryData.name">
            </label>
            <label class="headerGroup">
                GroupName :
                <input type="text" placeholder="search" v-model="queryData.group">
            </label>
            <button class="headerGroup sysIcon sysIcon_search" type="button" v-on:click="goto('user')"></button>
        </div>
        <table class="userList">
            <tr>
                <th>Id</th>
                <th>Group</th>
                <th>Name</th>
                <th>Email</th>
                <th>Desc</th>
                <th>Status</th>
                <th>Time</th>
                <th>Edit</th>
            </tr>
            <tr v-for="(user,userIndex) in list" class="">
                <template v-if="user.editing">
                    <td>{{ user.id }}</td>
                    <td>
                        <Hinter
                            :data="user.group.name"
                            :show="['id','name']"
                            :query="hinterQuery"
                            :callback="hinterCallback.bind(this,userIndex)"
                        />
                    </td>
                    <td><input type="text" v-model="user.name"></td>
                    <td><input type="text" v-model="user.mail"></td>
                    <td><input type="text" v-model="user.description"></td>
                    <td :class="[user.status*1?'positive':'negative']">
                        <input type="radio" :value="1" v-model="user.status" :id="`us_${user.id}_admin_0`">
                        <label :for="`us_${user.id}_admin_0`">Enable</label>
                        <input type="radio" :value="0" v-model="user.status" :id="`us_${user.id}_admin_1`">
                        <label :for="`us_${user.id}_admin_1`">Disable</label>
                    </td>
                    <td>
                        {{ user.time_update }}
                        <br>
                        {{ user.time_create }}
                    </td>
                    <td class="sysIcon sysIcon_save pointer" v-on:click="saveUser(userIndex)"></td>
                </template>
                <template v-else>
                    <td>{{ user.id }}</td>
                    <td>{{ user.group.id }} : {{ user.group.name }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.mail }}</td>
                    <td>{{ user.description }}</td>
                    <td :class="[user.status*1?'positive':'negative']">
                        {{ user.status * 1 ? 'Enable' : 'Disable' }}
                    </td>
                    <td>
                        {{ user.time_update }}
                        <br>
                        {{ user.time_create }}
                    </td>
                    <td class="sysIcon sysIcon_edit pointer" v-on:click="modUser(userIndex)"></td>
                </template>
            </tr>
            <tr class="">
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
#content.User {
    .userList {
        width: 100%;
        td, th {
            &:last-child {
                padding-right: $fontSize;
            }
            &:first-child {
                padding-left: $fontSize;
            }
            padding: 0 $fontSize*0.5;
        }
        tr:nth-child(2n) {
            background-color: map_get($colors, list_bk_2);
        }
        th {
            line-height: $fontSize*1.5;
        }
    }
    .positive {
        background-color: map_get($colors, positive);
    }
    .negative {
        background-color: map_get($colors, negative);
    }
    .float_hinter {
        background-color: rgba(0, 0, 0, 0.8);
    }
}
</style>

<script>
// @ is an alias to /src
import store   from "../store";
import router  from "../router";
import GenFunc from '../lib/GenFuncLib'
import helper  from "../lib/Helper";
import Hinter  from "../components/Hinter";

export default {
    name         : 'User',
    components   : {Hinter},
    store        : store,
    watch        : {
        $route: function (to, from) {
            console.info(`User: route to ${router.currentRoute.name}`);
            // console.info(to);
            // console.info(from);
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, this.page).then(this.fillData);
        },
    },
    data         : function () {
        return {
            queryData: {
                name : '',
                group: '',
            },
            page     : 1,
            // editUser     : 0,
            // editUserIndex: -1,
            //
            list: [],
        }
    },
    computed     : {},
    created      : function () {
        console.info('User.vue create');
        // console.info(this);
        // console.info(GenFunc);
        // console.info(UploaderLib);
        // this.page = this.$store.state.pageSet;
        this.fillQuery(router.currentRoute.query);
        this.query(this.queryData, 1).then(this.fillData);
    },
    mounted      : function () {
        console.info('User.vue mount');
        // console.info(this);
        // this.page = this.$store.state.pageSet;
        store.commit('usePagination');
        document.getElementById('app').addEventListener('click', this.searchClear);
    },
    beforeDestroy: function () {
        document.getElementById('app').removeEventListener('click', this.searchClear)
    },
    updated      : function () {
        console.warn('User.vue update');
        // console.info(this);
        // this.page = this.$store.state.pageSet;
    },
    methods      : {
        modUser: function (userIndex) {
            console.info('User: modUser');
            this.list[userIndex].editing = 1;
            this.list.splice(userIndex, 1, this.list[userIndex]);
        },
        /**
         * @todo api user_mod
         * */
        saveUser: function (userIndex) {
            console.info('User: saveUser');
            console.info(this.list);
            return new Promise(((resolve, reject) => {
                helper.query(
                    'user_mod',
                    {
                        id         : this.list[userIndex].id,
                        name       : this.list[userIndex].name,
                        group_id   : this.list[userIndex].group.id,
                        mail       : this.list[userIndex].mail,
                        description: this.list[userIndex].description,
                        status     : this.list[userIndex].status,
                    }
                ).then((data) => {
                    this.list[userIndex].editing = 0;
                    this.list.splice(userIndex, 1, this.list[userIndex]);
                    return resolve();
                });
            }));
        },
        /**
         * @todo api user_group_get
         * */
        hinterQuery   : function (searchTxt) {
            console.debug(`User: hinterQuery ${searchTxt}`);
            //
            return new Promise((resolve, reject) => {
                helper.query(
                    'user_group_list',
                    {
                        name : searchTxt,
                        short: 1,
                    }
                ).then((data) => {
                    return resolve({list: data});
                });
                /*return resolve(
                 {
                 list: [
                 {id: 4, name: 'administrator', description: 'this is description', admin: 1},
                 {id: 2, name: 'hentai', description: 'this is description', admin: 0},
                 {id: 3, name: 'little pony', description: 'this is description', admin: 0},
                 {id: 1, name: 'cthulhu', description: 'this is description', admin: 0},
                 ],
                 });*/
            });
        },
        hinterCallback: function (userIndex, target) {
            console.debug(`User: hinterCallback`);
            this.list[userIndex].group.id          = target.id;
            this.list[userIndex].group.name        = target.name;
            this.list[userIndex].group.description = target.description;
            this.list[userIndex].group.admin       = target.admin;
            this.list.splice(userIndex, 1, this.list[userIndex]);
        },
        // ---------------------------------
        /**
         * @api user_list
         * 查询方法，返回的 promise
         * */
        query: function (query, page) {
            console.info('User: query');
            query = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
            //
            return new Promise(((resolve, reject) => {
                helper.query(
                    'user_list',
                    query
                ).then((data) => {
                    // console.info(data);
                    // console.info(data.data);
                    return resolve({list: data.data, query: data.query});
                });
            }));
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
            console.info('User: fillData');
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
                    query = GenFunc.copyObject(this.queryData);
                    path  = '/user';
                    break;
            }
            let targetRoute = {path: path, query: Object.assign(query, {page: 1})};
            if (helper.isSameRoute(targetRoute, router.currentRoute)) {
                console.debug(`isSameRoute`);
                return false;
            }
            router.push(targetRoute);
        },
    },
}
</script>
