<template>
    <div class="sample">
        <div>in Sample.vue</div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'

    export default {
        name      : 'Sample',
        components: {},
        store     : store,
        watch     : {
            $route: function (to, from) {
                console.info(`Sample: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.fillParam(router.currentRoute.query);
                this.query(this.param, this.page).then(this.fillData);
            },
            page  : function (to, from) {
                console.info('Sample: param:page compute watched');
            }
        },
        data      : function () {
            return {
                param: {},
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
                    console.info('Sample: param:page get');
                    return this.$store.state.page;
                },
                set: function (val) {
                    console.info('Sample: param:page set');
                    this.$store.commit('setPage', val);
                },
            }
        },
        created   : function () {
            console.info('Sample.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillParam(router.currentRoute.query);
            this.query(this.param, this.page).then(this.fillData);
        },
        mounted   : function () {
            console.info('Sample.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        updated   : function () {
            console.info('Sample.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            /**
             * 查询方法，返回的 promise
             * */
            query    : function (param, page) {
                console.info('Sample: query');
                param    = Object.assign(param, {page: typeof page === 'undefined' ? 1 : page})
                //
                let data = [];
                //
                return new Promise((resolve, reject) => {
                    console.debug({data});
                    return resolve({data});
                });
            },
            /**
             * 写入参数
             * 根据自身的 param 字段进行处理，不会记录额外的参数
             * 然后 page 字段另做
             * */
            fillParam: function (param) {
                console.info('Sample: fillParam');
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
                console.info('Sample: fillData');
                this.list = resolveData;
            },
        },
    }
</script>
