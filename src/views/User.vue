<template>
    <div class="User">
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
                <template v-if="editUserIndex===userIndex">
                    <td>{{user.id}}</td>
                    <td>
                        <Hinter
                                :data="user.group.name"
                                :show="['id','name']"
                                :query="hinterQuery"
                                :callback="hinterCallback.bind(this,userIndex)"
                        />
                    </td>
                    <td><input type="text" v-model="user.name"></td>
                    <td><input type="text" v-model="user.email"></td>
                    <td><input type="text" v-model="user.description"></td>
                    <td :class="{positive:user.status,negative:!user.status,}">
                        <input type="radio" :value="1" v-model="user.status" :id="`us_${user.id}_admin_0`">
                        <label :for="`us_${user.id}_admin_0`">Enable</label>
                        <input type="radio" :value="0" v-model="user.status" :id="`us_${user.id}_admin_1`">
                        <label :for="`us_${user.id}_admin_1`">Disable</label>
                    </td>
                    <td>
                        {{user.time_update}}
                        <br>
                        {{user.time_create}}
                    </td>
                    <td class="sysIcon sysIcon_save pointer" v-on:click="saveUser()"></td>
                </template>
                <template v-else>
                    <td>{{user.id}}</td>
                    <td>{{user.group.id}} : {{user.group.name}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.description}}</td>
                    <td :class="{positive:user.status,negative:!user.status,}">
                        {{user.status?'Enable':'Disable'}}
                    </td>
                    <td>
                        {{user.time_update}}
                        <br>
                        {{user.time_create}}
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
    .User {
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
                background-color: rgba(0, 0, 0, 0.2);
            }

            th {
                font-size: $fontSize*1.2;
            }
        }

        .positive {
            background-color: rgba(0, 160, 255, 0.2);
        }

        .negative {
            background-color: rgba(255, 40, 40, 0.2);
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
                queryData    : {
                    name: '',
                },
                // page: 1,
                editUser     : 0,
                editUserIndex: -1,
                //
                list         : [],
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
            store.commit('closePagination');
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
            modUser       : function (userIndex) {
                console.info('User: modUser');
                this.editUserIndex = userIndex;
                this.editUser      = 1;
            },
            saveUser      : function () {
                console.info('User: saveUser');
                this.editUserIndex = -1;
                this.editUser      = 0;
            },
            hinterQuery   : function () {
                console.debug(`User: hinterQuery`);
                //
                return new Promise((resolve, reject) => {
                    return resolve(
                        {
                            list: [
                                {id: 4, name: 'administrator', description: 'this is description', admin: 1},
                                {id: 2, name: 'hentai', description: 'this is description', admin: 0},
                                {id: 3, name: 'little pony', description: 'this is description', admin: 0},
                                {id: 1, name: 'cthulhu', description: 'this is description', admin: 0},
                            ],
                        });
                });
            },
            hinterCallback: function (userIndex, target) {
                console.debug(`User: hinterCallback`);
                this.list[userIndex].group.id          = target.id;
                this.list[userIndex].group.name        = target.name;
                this.list[userIndex].group.description = target.description;
                this.list[userIndex].group.admin       = target.admin;
            },
            // ---------------------------------
            /**
             * 查询方法，返回的 promise
             * */
            query         : function (query, page) {
                console.info('User: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        id         : 1,
                        name       : 'admin',
                        email      : 'admin@admin.com',
                        description: 'admin group',
                        group      : {
                            id         : 1,
                            name       : 'admin',
                            description: 'admin description',
                            admin      : 1,
                        },
                        status     : 1,
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                    },
                    {
                        id         : 1,
                        name       : 'admin',
                        email      : 'admin@admin.com',
                        description: 'admin group',
                        group      : {
                            id         : 1,
                            name       : 'admin',
                            description: 'admin description',
                            admin      : 1,
                        },
                        status     : 1,
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                    },
                    {
                        id         : 1,
                        name       : 'admin',
                        email      : 'admin@admin.com',
                        description: 'admin group',
                        group      : {
                            id         : 1,
                            name       : 'admin',
                            description: 'admin description',
                            admin      : 1,
                        },
                        status     : 1,
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
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
                console.info('User: fillData');
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
