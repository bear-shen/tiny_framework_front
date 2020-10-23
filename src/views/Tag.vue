<template>
    <div class="tagGroup">
        <ul class="groupList">
            <li v-for="group in list">
                <template v-if="editMode===1 && group.id===editId">
                    <div class="groupMain editMode">
                        <span class="">ID:{{group.id}}</span>
                        <input type="text" v-model="group.name">
                        <input type="text" v-model="group.sort">
                        <!--<span class="">{{group.sort}}</span>-->
                        <!--<span class="">{{group.time_create}}</span>-->
                        <!--<span class="">{{group.time_update}}</span>-->
                        <span class="operator">
                        <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                        <span class="sysIcon sysIcon_save" v-on:click="saveGroup(group.id)"></span>
                        </span>
                    </div>
                    <textarea class="groupAlt" v-model="group.alt"></textarea>
                    <textarea class="groupDescription" v-model="group.description"></textarea>
                </template>
                <template v-else>
                    <div class="groupMain">
                        <!--<span class="">ID:{{group.id}}</span>-->
                        <span class="">{{group.name}}</span>
                        <!--<span class="">{{group.sort}}</span>-->
                        <!--<span class="">{{group.time_create}}</span>-->
                        <!--<span class="">{{group.time_update}}</span>-->
                        <span class="operator">
                        <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                        <span class="sysIcon sysIcon_delete" v-on:click="delGroup(group.id)"></span>
                        <span class="sysIcon sysIcon_edit" v-on:click="modGroup(group.id)"></span>
                        </span>
                    </div>
                    <div class="groupAlt">
                        {{group.alt}}
                    </div>
                    <div class="groupDescription">
                        {{group.description}}
                    </div>
                </template>
                <ul class="tagList">
                    <li v-for="tag in group.child">
                        <template v-if="editMode===2 && tag.id===editId">
                            <div class="tagMain editMode">
                                <!--<span class="">ID:{{tag.id}}</span>-->
                                <input type="text" v-model="tag.name">
                                <!--<span class=""><input v-model="tag.sort"></span>-->
                                <span class="sysIcon sysIcon_save" v-on:click="saveTag(tag.id)"></span>
                            </div>
                            <textarea class="tagAlt" v-model="tag.alt"></textarea>
                            <textarea class="tagDescription" v-model="tag.description"></textarea>
                        </template>
                        <template v-else>
                            <div class="tagMain">
                                <!--<span class="">ID:{{tag.id}}. {{tag.name}}</span>-->
                                <span class="" v-on:click="goto('tag',tag.id)">{{tag.name}}</span>
                                <!--<span class="">{{tag.sort}}</span>-->
                                <!--<span class="">{{tag.time_create}}<br>{{tag.time_update}}</span>-->
                                <span class="operator">
                                <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                                <span class="sysIcon sysIcon_delete" v-on:click="delTag(tag.id)"></span>
                                <span class="sysIcon sysIcon_edit" v-on:click="modTag(tag.id)"></span>
                                </span>
                            </div>
                            <div class="tagAlt">
                                {{tag.alt}}
                            </div>
                            <div class="tagDescription">
                                {{tag.description}}
                            </div>
                        </template>
                    </li>
                    <li>
                        <template v-if="editMode===2 && editId===0">
                            <div class="tagMain editMode">
                                <!--<span class="">ID:{{tag.id}}</span>-->
                                <input type="text" v-model="newTag.name">
                                <!--<span class=""><input v-model="tag.sort"></span>-->
                                <span class="sysIcon sysIcon_save" v-on:click="saveTag(newTag.id)"></span>
                            </div>
                            <textarea class="tagAlt" v-model="newTag.alt"></textarea>
                            <textarea class="tagDescription" v-model="newTag.description"></textarea>
                        </template>
                        <template v-else>
                            <div class="sysIcon sysIcon_plus-square-o addBtn" v-on:click="modTag(0)"></div>
                        </template>
                    </li>
                </ul>
            </li>
            <li>
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
    .tagGroup {
        ul {
            padding: 0;
        }

        li {
            list-style: none;

            .operator {
                span {
                    padding-left: 0.5em;

                    &:hover {
                        color: rgba(255, 255, 255, 0.4);
                    }
                }
            }
        }
    }

    .tagGroup {

        .groupList {
            display: flex;
            flex-wrap: wrap;
            font-size: $fontSize*1.2;
            line-height: $fontSize*1.5;

            > li {
                width: 32%;
                background-color: rgba(0, 0, 0, 0.2);

                &:nth-child(2n) {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                margin: $fontSize*0.5;
                padding: $fontSize*0.5;

                .groupMain {
                    display: flex;
                    justify-content: space-between;
                    vertical-align: middle;
                    align-items: center;
                    white-space: nowrap;
                    height: $fontSize*1.5;
                    line-height: $fontSize*1.5;

                    &.editMode {
                        margin-bottom: $fontSize*0.5;

                        & > * {
                            height: $fontSize*1.5;
                            line-height: $fontSize*1.5;
                        }

                        & > *:nth-child(1) {
                            margin-right: 0.5em;
                        }

                        & > *:nth-child(2) {width: 70%;}

                        & > *:nth-child(3) {width: 20%;}

                        & > *:nth-child(4) {width: 1.5em;}
                    }
                }

                .groupAlt, .groupDescription {
                    color: rgba(100, 100, 100, 1);
                    display: block;
                    width: 100%;
                }

                .groupAlt {}

                .groupDescription {}

                > .addBtn {
                    font-size: $fontSize*5;
                    width: $fontSize*5;
                    height: $fontSize*5;
                    line-height: $fontSize*5;
                    color: rgba(100, 100, 100, 1);
                }
            }
        }

        .tagList {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            background-color: rgba(255, 255, 255, 0.1);
            margin-top: $fontSize*0.25;
            padding: $fontSize*0.25;
            font-size: $fontSize;

            > li {
                background-color: rgba(0, 0, 0, 0.2);
                margin: $fontSize*0.25 0;
                padding: 0 $fontSize*0.5;
                width: 32%;

                .tagMain {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: $fontSize*0.5;

                    * {
                        height: $fontSize*1.5;
                        line-height: $fontSize*1.5;
                    }

                    *:nth-child(1) {
                        margin-right: 0.5em;
                        font-size: $fontSize*0.75;
                        cursor: pointer;
                    }

                    *:nth-child(2) {}

                    input {
                        width: calc(100% - #{$fontSize});
                    }
                }

                .tagAlt, .tagDescription {
                    color: rgba(100, 100, 100, 1);
                    width: 100%;
                }

                .tagAlt {
                }

                .tagDescription {
                }

                > .addBtn {
                    margin: $fontSize*0.5 0;
                    font-size: $fontSize*1.5;
                    width: $fontSize*1.5;
                    height: $fontSize*1.5;
                    line-height: $fontSize*1.5;
                    color: rgba(100, 100, 100, 1);
                }
            }
        }
    }

    @media (max-width: 1600px) {
        .tagGroup {
            .groupList {
                > li {
                    width: 48%;
                }
            }
        }
    }

    @media (max-width: 960px) {
        .tagGroup {
            .groupList {
                > li {
                    width: 96%;
                }
            }
        }
    }
</style>

<script>
    // @ is an alias to /src
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'
    import Helper     from "../lib/Helper";

    export default {
        name      : 'Tag',
        components: {},
        store     : store,
        watch     : {
            $route: function (to, from) {
                console.info(`Tag: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.fillQuery(router.currentRoute.query);
                this.query(this.queryData, this.page).then(this.fillData);
            },
        },
        data      : function () {
            return {
                queryData   : {
                    name: '',
                },
                // page: 1,
                editMode: 0,//0 none 1 group 2 tag
                editId  : 0,//targetId
                list    : [],
                newTag  : {
                    name       : '',
                    sort       : '',
                    alt        : '',
                    description: '',
                },
                newGroup: {
                    name       : '',
                    sort       : '',
                    alt        : '',
                    description: '',
                },
            }
        },
        computed  : {
        },
        created   : function () {
            console.info('Tag.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, 1).then(this.fillData);
        },
        mounted   : function () {
            console.info('Tag.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
            store.commit('closePagination');
        },
        updated   : function () {
            console.info('Tag.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            /**
             * @todo api
             * 查询方法，返回的 promise
             * */
            query    : function (query, page) {
                console.info('Tag: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        id         : 1,
                        name       : 'group1',
                        alt        : 'group1,group1,group1',
                        description: 'this is group 1',
                        sort       : 1,
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        child      : [
                            {
                                id         : 1,
                                group_id   : 1,
                                name       : 'tag1',
                                alt        : 'tag1,tag1,tag1',
                                description: 'this is tag 1',
                                sort       : 1,
                                time_create: '1919-08-10 11:45:14',
                                time_update: '1919-08-10 11:45:14',
                            }
                        ],
                    }
                ];
                for (let i = 0; i < Math.floor(Math.random() * 7); i++) {
                    list.push(list[0]);
                }
                for (let i = 0; i < list.length; i++) {
                    let sub = [];
                    for (let j = 0; j < Math.floor(Math.random() * 7); j++) {
                        sub.push(list[i].child[0]);
                        list[i].child = sub;
                    }
                }
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
            fillData : function (resolveData) {
                console.info('Tag: fillData');
                this.list = resolveData.list;
                this.fillQuery(resolveData.query);
            },
            modGroup : function (id) {
                this.editMode = 1;
                this.editId   = id;
                if (!id) {
                    Object.assign(
                        this.newGroup,
                        {
                            name       : '',
                            sort       : '',
                            alt        : '',
                            description: '',
                        }
                    )
                }
            },
            /**
             * @todo api
             * */
            saveGroup: function (id) {
                this.editMode = 0;
                this.editId   = 0;
            },
            /**
             * @todo api
             * */
            delGroup : function (id) {
            },
            modTag   : function (id) {
                this.editMode = 2;
                this.editId   = id;
                if (!id) {
                    Object.assign(
                        this.newTag,
                        {
                            name       : '',
                            sort       : '',
                            alt        : '',
                            description: '',
                        }
                    )
                }
            },
            /**
             * @todo api
             * */
            saveTag  : function (id) {
                this.editMode = 0;
                this.editId   = 0;
            },
            /**
             * @todo api
             * */
            delTag   : function (id) {
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
