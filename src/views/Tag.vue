<template>
    <div class="tagGroup">
        <ul class="groupList">
            <li v-for="(group,groupIndex) in list">
                <template v-if="editMode===1 && groupIndex===editIndex">
                    <div class="groupMain editMode">
                        <span class="">ID:{{group.id}}</span>
                        <input type="text" v-model="group.name" placeholder="group name">
                        <input type="text" v-model="group.sort" placeholder="group sort">
                        <!--<span class="">{{group.sort}}</span>-->
                        <!--<span class="">{{group.time_create}}</span>-->
                        <!--<span class="">{{group.time_update}}</span>-->
                        <span class="operator">
                        <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                        <span class="sysIcon sysIcon_save" v-on:click="saveGroup()"></span>
                        </span>
                    </div>
                    <textarea class="groupAlt" v-model="group.alt" placeholder="group alt name"></textarea>
                    <textarea class="groupDescription" v-model="group.description" placeholder="group description"></textarea>
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
                        <span class="sysIcon sysIcon_delete" v-on:click="delGroup(groupIndex)"></span>
                        <span class="sysIcon sysIcon_edit" v-on:click="modGroup(groupIndex)"></span>
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
                    <li v-for="(tag,tagIndex) in group.child">
                        <template v-if="editMode===2 && `${groupIndex}-${tagIndex}`===editIndex">
                            <div class="tagMain editMode">
                                <!--<span class="">ID:{{tag.id}}</span>-->
                                <input type="text" v-model="tag.name" placeholder="tag name">
                                <!--<span class=""><input v-model="tag.sort"></span>-->
                                <span class="sysIcon sysIcon_save" v-on:click="saveTag()"></span>
                            </div>
                            <textarea class="tagAlt" v-model="tag.alt" placeholder="tag alt name"></textarea>
                            <textarea class="tagDescription" v-model="tag.description" placeholder="tag description"></textarea>
                        </template>
                        <template v-else>
                            <div class="tagMain">
                                <!--<span class="">ID:{{tag.id}}. {{tag.name}}</span>-->
                                <span class="" v-on:click="goto('tag',tagIndex)">{{tag.name}}</span>
                                <!--<span class="">{{tag.sort}}</span>-->
                                <!--<span class="">{{tag.time_create}}<br>{{tag.time_update}}</span>-->
                                <span class="operator">
                                <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                                <span class="sysIcon sysIcon_delete" v-on:click="delTag(groupIndex,tagIndex)"></span>
                                <span class="sysIcon sysIcon_edit" v-on:click="modTag(groupIndex,tagIndex)"></span>
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
                        <div class="sysIcon sysIcon_plus-square-o addBtn" v-on:click="modTag(groupIndex,-1)"></div>
                    </li>
                </ul>
            </li>
            <li>
                <div class="sysIcon sysIcon_plus-square-o addBtn" v-on:click="modGroup(-1)"></div>
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
    import store   from "../store";
    import router  from "../router";
    import GenFunc from '../lib/GenFuncLib'
    import Helper  from "../lib/Helper";

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
                queryData: {
                    name: '',
                },
                // page: 1,
                editMode : 0,//0 none 1 group 2 tag
                editIndex: -1,//targetId
                list     : [],
            }
        },
        computed  : {},
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
             * @todo api tag_get
             * 查询方法，返回的 promise
             * */
            query    : function (query, page) {
                console.info('Tag: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [];
                for (let i = 0; i < Math.floor(Math.random() * 7); i++) {
                    list.push(
                        {
                            id         : 1,
                            name       : 'group1',
                            alt        : 'group1,group1,group1',
                            description: 'this is group 1',
                            sort       : 1,
                            time_create: '1919-08-10 11:45:14',
                            time_update: '1919-08-10 11:45:14',
                            child      : [],
                        });
                }
                for (let i = 0; i < list.length; i++) {
                    let sub = [];
                    for (let j = 0; j < Math.floor(Math.random() * 7); j++) {
                        sub.push(
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
                        );
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
                console.info('Tag: fillData');
                this.list = resolveData.list;
                this.fillQuery(resolveData.query);
            },
            //
            modGroup : function (groupIndex) {
                switch (this.editMode) {
                    case 1:
                        this.saveGroup();
                        break;
                    case 2:
                        this.saveTag();
                        break;
                }
                this.editMode = 1;
                if (groupIndex === -1) {
                    this.list.push(
                        {
                            id         : 0,
                            name       : '',
                            alt        : '',
                            description: '',
                            sort       : 1,
                            time_create: '',
                            time_update: '',
                            child      : [],
                        }
                    )
                    groupIndex = this.list.length - 1;
                }
                this.editIndex = groupIndex;
            },
            /**
             * @todo api tag_group_mod
             * */
            saveGroup: function () {
                this.editMode  = 0;
                this.editIndex = 0;
            },
            /**
             * @todo api tag_group_del
             * */
            delGroup : function (groupIndex) {
                this.list.splice(groupIndex, 1);
            },
            //
            modTag   : function (groupIndex, tagIndex) {
                switch (this.editMode) {
                    case 1:
                        this.saveGroup();
                        break;
                    case 2:
                        this.saveTag();
                        break;
                }
                if (!this.list[groupIndex]) return;
                this.editMode = 2;
                if (tagIndex === -1) {
                    this.list[groupIndex].child.push(
                        {
                            id         : 0,
                            group_id   : this.list[groupIndex].id,
                            name       : '',
                            alt        : '',
                            description: '',
                            sort       : 1,
                            time_create: '',
                            time_update: '',
                        });
                    tagIndex = this.list[groupIndex].child.length - 1;
                }
                this.editIndex = `${groupIndex}-${tagIndex}`;
            },
            /**
             * @todo api tag_mod
             * */
            saveTag  : function () {
                this.editMode  = 0;
                this.editIndex = 0;
            },
            /**
             * @todo api tag_del
             * */
            delTag   : function (groupIndex, tagIndex) {
            },
            //
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
