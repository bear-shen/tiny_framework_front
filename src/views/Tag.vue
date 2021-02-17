<template>
    <div class="tagGroup">
        <ul class="groupList">
            <li v-for="(group,groupIndex) in list">
                <template v-if="group.editing">
                    <div class="groupMain editMode">
                        <span class="">ID:{{ group.id }}</span>
                        <input type="text" class="name" v-model="group.name" placeholder="group name">
                        <input type="text" class="sort" v-model="group.sort" placeholder="group sort">
                        <span class="operator">
                        <span class="sysIcon sysIcon_save" v-on:click="saveGroup(groupIndex)"></span>
                        </span>
                    </div>
                    <textarea class="groupAlt" v-model="group.alt" placeholder="group alt name"></textarea>
                    <textarea class="groupDescription" v-model="group.description" placeholder="group description"></textarea>
                </template>
                <template v-else>
                    <div class="groupMain">
                        <span class="">{{ group.name }}</span>
                        <span class="operator">
                        <span class="sysIcon sysIcon_delete" v-on:click="delGroup(groupIndex)"></span>
                        <span class="sysIcon sysIcon_edit" v-on:click="modGroup(groupIndex)"></span>
                        </span>
                    </div>
                    <div class="groupAlt">{{ group.alt }}</div>
                    <div class="groupDescription">{{ group.description }}</div>
                </template>
                <ul class="tagList">
                    <li v-for="(tag,tagIndex) in group.child">
                        <template v-if="tag.editing">
                            <div class="tagMain editMode">
                                <!--<span class="">ID:{{tag.id}}</span>-->
                                <input type="text" v-model="tag.name" placeholder="tag name">
                                <!--<span class=""><input v-model="tag.sort"></span>-->
                                <span class="sysIcon sysIcon_save" v-on:click="saveTag(groupIndex,tagIndex)"></span>
                            </div>
                            <textarea class="tagAlt" v-model="tag.alt" placeholder="tag alt name"></textarea>
                            <textarea class="tagDescription" v-model="tag.description" placeholder="tag description"></textarea>
                        </template>
                        <template v-else>
                            <div class="tagMain">
                                <!--<span class="">ID:{{tag.id}}. {{tag.name}}</span>-->
                                <span class="" v-on:click="goto('tag',tagIndex)">{{ tag.name }}</span>
                                <!--<span class="">{{tag.sort}}</span>-->
                                <!--<span class="">{{tag.time_create}}<br>{{tag.time_update}}</span>-->
                                <span class="operator">
                                <!--<span class="sysIcon sysIcon_plus-square-o" v-on:click="modGroup(tag.id)"></span>-->
                                <span class="sysIcon sysIcon_delete" v-on:click="delTag(groupIndex,tagIndex)"></span>
                                <span class="sysIcon sysIcon_edit" v-on:click="modTag(groupIndex,tagIndex)"></span>
                                </span>
                            </div>
                            <div class="tagAlt">{{ tag.alt }}</div>
                            <div class="tagDescription">{{ tag.description }}</div>
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
                padding-left: $fontSize*0.5;
            }
        }
    }
    input, textarea {
        line-height: $fontSize;
        width: inherit;
        font-size: $fontSize;
        padding: $fontSize*0.25;
    }
}
.tagGroup {
    .groupList {
        column-count: 3;
        width: 100%;
        color: map_get($colors, sub_font);
        > li {
            break-inside: avoid;
            padding: $fontSize*0.5;
            > div, > textarea {
                display: block;
                min-height: $fontSize*1.5;
                line-height: $fontSize*1.5;
                width: 100%;
            }
            .groupMain {
                justify-content: space-between;
                display: flex;
                width: 100%;
                color: map_get($colors, font);
                > span, > input {
                    display: inline-block;
                }
                input.sort {
                    width: $fontSize*2;
                }
                .operator span {
                    width: $fontSize;
                }
            }
        }
    }
    .tagList {
        padding-left: $fontSize;
        width: calc(100% - #{$fontSize});
        color: map_get($colors, sub_font);
        > li {
            > div, > textarea {
                display: block;
                min-height: $fontSize*1.5;
                line-height: $fontSize*1.5;
                width: 100%;
            }
            .tagMain {
                justify-content: space-between;
                display: flex;
                width: 100%;
                color: map_get($colors, font);
                > span, > input {
                    display: inline-block;
                }
                /*input.sort {
                    width: $fontSize*2;
                }*/
                .operator span {
                    width: $fontSize;
                }
            }
        }
    }
}
@media (max-width: $tabletWidth) {
    .tagGroup {
        .groupList {
            column-count: 2;
        }
    }
}
@media (max-width: $mobileWidth) {
    .tagGroup {
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
import helper  from "../lib/Helper";

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
        query: function (query, page) {
            console.info('Tag: query');
            return new Promise((resolve, reject) => {
                helper.query(
                    'tag_group_list',
                    {}
                ).then((data) => {
                    console.info(data);
                    return resolve({list: data, query: {}});
                }).catch((data) => {
                    console.info(data);
                });
            });
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
                            //sort       : 1,
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
        fillData: function (resolveData) {
            console.info('Tag: fillData');
            this.list = resolveData.list;
            this.fillQuery(resolveData.query);
        },
        //
        modGroup: function (groupIndex) {
            console.info(groupIndex);
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
                        editing    : 1,
                    }
                )
            } else {
                let item     = this.list[groupIndex];
                item.editing = 1;
                this.list.splice(groupIndex, 1, item);
            }
        },
        /**
         * @todo api tag_group_mod
         * */
        saveGroup: function (groupIndex) {
            let item     = this.list[groupIndex];
            item.editing = 0;
            this.list.splice(groupIndex, 1, item);
        },
        /**
         * @todo api tag_group_del
         * */
        delGroup: function (groupIndex) {
            this.list.splice(groupIndex, 1);
        },
        //
        modTag: function (groupIndex, tagIndex) {
            if (!this.list[groupIndex]) return;
            if (tagIndex === -1) {
                this.list[groupIndex].child.push(
                    {
                        id         : 0,
                        group_id   : this.list[groupIndex].id,
                        name       : '',
                        alt        : '',
                        description: '',
                        //sort       : 1,
                        time_create: '',
                        time_update: '',
                        editing    : 1,
                    });
            } else {
                let item     = this.list[groupIndex].child[tagIndex];
                item.editing = 1;
                this.list[groupIndex].child.splice(tagIndex, 1, item);
            }
        },
        /**
         * @todo api tag_mod
         * */
        saveTag: function (groupIndex, tagIndex) {
            let item     = this.list[groupIndex].child[tagIndex];
            item.editing = 0;
            this.list[groupIndex].child.splice(tagIndex, 1, item);
        },
        /**
         * @todo api tag_del
         * */
        delTag: function (groupIndex, tagIndex) {
            if (!this.list[groupIndex]) return;
            this.list[groupIndex].child.splice(tagIndex, 1);
        },
        //
        goto: function (type, targetId) {
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
