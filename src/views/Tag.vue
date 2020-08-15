<template>
    <div class="tagGroup">
        <ul class="groupList">
            <li v-for="group in list">
                <div class="groupMain">
                    <span class="">{{group.id}}</span>
                    <span class="">{{group.name}}</span>
                    <span class="">{{group.sort}}</span>
                    <span class="">{{group.time_create}}</span>
                    <span class="">{{group.time_update}}</span>
                </div>
                <div class="groupDescription">
                    {{group.description}}
                </div>
                <ul class="tagList">
                    <li v-for="tag in group.child">
                        <div class="tagMain">
                            <span class="">{{tag.id}}</span>
                            <span class="">{{tag.name}}</span>
                            <span class="">{{tag.sort}}</span>
                            <span class="">{{tag.time_create}}</span>
                            <span class="">{{tag.time_update}}</span>
                        </div>
                        <div class="tagDescription">
                            {{tag.description}}
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'

    export default {
        name      : 'Tag',
        components: {},
        store     : store,
        watch     : {
            $route: function (to, from) {
                console.info(`Tag: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.fillParam(router.currentRoute.query);
                this.query(this.param, this.page).then(this.fillData);
            },
            page  : function (to, from) {
                console.info('Tag: param:page compute watched');
            }
        },
        data      : function () {
            return {
                param: {
                    name: '',
                },
                // page: 1,
                list : [],
            }
        },
        /*watch  : {
         page: function () {
         console.info('home: param:page computed');
         return this.$store.state.pageSet;
         }
         },*/
        computed  : {
            page: {
                get: function () {
                    console.info('Tag: param:page get');
                    return this.$store.state.page;
                },
                set: function (val) {
                    console.info('Tag: param:page set');
                    this.$store.commit('setPage', val);
                },
            }
        },
        created   : function () {
            console.info('Tag.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillParam(router.currentRoute.query);
            this.query(this.param, this.page).then(this.fillData);
        },
        mounted   : function () {
            console.info('Tag.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        updated   : function () {
            console.info('Tag.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            /**
             * 查询方法，返回的 promise
             * */
            query    : function (param, page) {
                console.info('Tag: query');
                param    = Object.assign(param, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        id         : 1,
                        name       : 'group1',
                        description: 'this is group 1',
                        sort       : 1,
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        child      : [
                            {
                                id         : 1,
                                name       : 'tag1',
                                description: 'this is tag 1',
                                sort       : 1,
                                time_create: '1919-08-10 11:45:14',
                                time_update: '1919-08-10 11:45:14',
                            }
                        ],
                    }
                ];
                for (let i = 0; i < 10; i++) {
                    list[0].child.push(list[0].child[0]);
                }
                for (let i = 0; i < 10; i++) {
                    list.push(list[0]);
                }
                //
                return new Promise((resolve, reject) => {
                    console.debug({list});
                    return resolve({list, param});
                });
            },
            /**
             * 写入参数
             * 根据自身的 param 字段进行处理，不会记录额外的参数
             * 然后 page 字段另做
             * */
            fillParam: function (param) {
                console.info('Tag: fillParam');
                // console.warn(param);
                for (let key in this.param) {
                    if (typeof param[key] === 'undefined') continue;
                    this.param[key] = param[key];
                }
                if (param.page) {
                    this.page = parseInt(param.page);
                }
            },
            /**
             * 填充数据， this.query 的配套方法
             * 拆开写是为了方便 query 方法注入到外部以便共用
             * */
            fillData : function (resolveData) {
                console.info('Tag: fillData');
                this.list = resolveData.list;
                this.fillParam(resolveData.param);
            },
        },
    }
</script>
