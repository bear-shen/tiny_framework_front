<template>
    <div class="Settings">
    </div>
</template>

<style lang="scss">
    .Settings {
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
        name         : 'Settings',
        components   : {Hinter},
        store        : store,
        watch        : {
            $route: function (to, from) {
                console.info(`Settings: route to ${router.currentRoute.name}`);
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
                //
                list         : [],
            }
        },
        computed     : {},
        created      : function () {
            console.info('Settings.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, 1).then(this.fillData);
        },
        mounted      : function () {
            console.info('Settings.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
            store.commit('closePagination');
            document.getElementById('app').addEventListener('click', this.searchClear);
        },
        beforeDestroy: function () {
            document.getElementById('app').removeEventListener('click', this.searchClear)
        },
        updated      : function () {
            console.warn('Settings.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods      : {
            // ---------------------------------
            /**
             * 查询方法，返回的 promise
             * */
            query         : function (query, page) {
                console.info('Settings: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        name:'input dev',
                        description:'this is input dev',
                        size:1,
                        type:'input',
                        data:{value:'test'},
                    },
                    {
                        name:'select dev',
                        description:'this is select dev',
                        size:1,
                        type:'select',
                        data:{
                            value:'test',
                            options:{
                                'val1':'test','val2':'test1','val3':'test2',
                            },
                        },
                    },
                    {
                        name:'radio dev',
                        description:'this is radio dev',
                        size:1,
                        type:'radio',
                        data:{
                            value:'test',
                            options: {
                                'val1':'test','val2':'test1','val3':'test2',
                            },
                        },
                    },
                    {
                        name:'textarea dev',
                        description:'this is textarea dev',
                        size:1,
                        type:'textarea',
                        data:{
                            value:'test',
                        },
                    },
                    {
                        name:'checkbox dev',
                        description:'this is checkbox dev',
                        size:1,
                        type:'checkbox',
                        data:{
                            value:['test1'],
                            options: {
                                'val1':'test','val2':'test1','val3':'test2',
                            },
                        },
                    },
                    // charts------------------
                    {
                        name:'checkbox dev',
                        description:'this is checkbox dev',
                        size:1,
                        type:'checkbox',
                        data:{
                            value:['test1'],
                            options: {
                                'val1':'test','val2':'test1','val3':'test2',
                            },
                        },
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
                console.info('Settings: fillData');
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
