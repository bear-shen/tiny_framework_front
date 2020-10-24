<template>
    <div class="Settings">
        <div v-for="item in list" :class="['item',`cls_${item.type}`]">
            <div v-if="item.name" :title="item.description" class="title">{{item.name}}</div>
            <template v-if="item.type==='text'">
                <div class="content" v-html="item.data.value"></div>
            </template>
            <template v-else-if="item.type==='form'">
                <Form :detail="item"/>
            </template>
            <template v-else-if="['ec_line','ec_time','ec_pie'].indexOf(item.type)!==-1">
                <Chart :detail="item"/>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
    .Settings {
        /*display: grid;*/
        /*justify-content: space-between;*/
        padding-top: $fontSize;
        /*grid-template-columns: 33% 33% 33%;*/
        column-count: 3;

        .item {
            display: block;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: $fontSize*0.5;
            padding: 0 $fontSize;
            margin-bottom: $fontSize;
            overflow: auto;
            width: 100%;
            break-inside: avoid;
            @include smallScroll;

            > * {
                width: 100%;

                &:first-child {
                    margin-top: $fontSize;
                }

                &:last-child {
                    margin-bottom: $fontSize;
                }
            }

            .title {
                text-align: center;
                font-size: $fontSize*1.2;
                margin-bottom: $fontSize*0.5;
            }

            .content {
                font-size: $fontSize*1;
            }
        }

        @media(max-width: 1199px) {
            column-count: 2;
        }

        @media(max-width: 767px) {
            column-count: 1;
        }
    }
</style>

<script>
    // @ is an alias to /src
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'
    import Helper     from "../lib/Helper";
    import Hinter     from "../components/Hinter";
    import Form       from "../components/settings/Form";
    import Chart      from "../components/settings/Chart";

    export default {
        name         : 'Settings',
        components   : {Chart, Form, Hinter},
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
                queryData: {
                    name: '',
                },
                //
                list     : [],
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
             * @todo api config_get
             * 查询方法，返回的 promise
             * */
            query    : function (query, page) {
                console.info('Settings: query');
                query    = Object.assign(query, {page: typeof page === 'undefined' ? 1 : page})
                //
                let list = [
                    {
                        name       : 'text dev',
                        description: 'this is text dev',
                        type       : 'text',
                        data       : {value: 'test'},
                    },
                    {
                        name       : 'text dev',
                        description: 'this is text dev',
                        type       : 'text',
                        data       : {value: 'test'},
                    },
                    {
                        name       : 'text dev',
                        description: 'this is text dev',
                        type       : 'text',
                        data       : {value: 'test'},
                    },
                    {
                        name       : 'form dev',
                        description: 'this is form dev',
                        type       : 'form',
                        data       : [
                            {
                                name       : 'input dev',
                                description: 'this is input dev',
                                type       : 'text',
                                value      : 'test',
                                extra      : [],
                            },
                            {
                                name       : 'textarea dev',
                                description: 'this is textarea dev',
                                type       : 'textarea',
                                value      : 'textarea test',
                                extra      : [],
                            },
                            {
                                name       : 'select dev',
                                description: 'this is select dev',
                                type       : 'select',
                                value      : 'val2',
                                extra      : {
                                    'val1': 'test', 'val2': 'test1', 'val3': 'test2',
                                }
                            },
                            {
                                name       : 'radio dev',
                                description: 'this is radio dev',
                                type       : 'radio',
                                value      : 'val2',
                                extra      : {
                                    'val1': 'test', 'val2': 'test1', 'val3': 'test2',
                                }
                            },
                            {
                                name       : 'checkbox dev',
                                description: 'this is checkbox dev',
                                type       : 'checkbox',
                                value      : ['val2'],
                                extra      : {
                                    'val1': 'test', 'val2': 'test1', 'val3': 'test2',
                                }
                            },
                        ],
                    },
                    // charts------------------
                    /**
                     * @see https://echarts.apache.org/examples/zh/editor.html?c=line-stack&theme=dark
                     option = {
    title: {text: '折线图堆叠'},
    tooltip: {trigger: 'axis'},
    legend: {data: ['邮件7营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {type: 'value'},
    series: [{
            name: '邮件7营销',
            type: 'line',
            stack: '总量',//堆积图用的，这边暂时不用
            data: [120, 132, 101, 134, 90, 230, 210]
        },]
};*/
                    {
                        name       : 'line dev',
                        description: 'this is line dev',
                        type       : 'ec_line',
                        data       : [
                            {
                                name: 'dev 1',
                                // stack:'stack', //堆积图用的，这边暂时不用
                                data: {c1: 1, c2: 2, c3: 3,},
                            },
                            {
                                name: 'dev 2',
                                // stack:'stack', //堆积图用的，这边暂时不用
                                data: {c1: 4, c2: 8, c3: 1,},
                            },
                        ],
                    }, {
                        /**
                         * @see https://echarts.apache.org/examples/zh/editor.html?c=pie-simple&theme=dark
                         option = {
    title: {
        text: '某站点用户访问来源',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['55%','85%'],
            center: ['50%', '60%'],
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
            ],
        },
    ]
};
                         */
                        name       : 'pie dev',
                        description: 'this is pie dev',
                        type       : 'ec_pie',
                        data       : [
                            {
                                name: 'series name',
                                data: [
                                    {
                                        name : 'a2',
                                        value: 10,
                                    },
                                    {
                                        name : 'a1',
                                        value: 20,
                                    },
                                ],
                            },
                            {
                                name: 'series name',
                                data: [
                                    {
                                        name : 'a4',
                                        value: 10,
                                    },
                                    {
                                        name : 'a5',
                                        value: 20,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        /**
                         * @see https://echarts.apache.org/examples/zh/editor.html?c=dynamic-data2&theme=dark
                         option = {
    title: {text: '动态数据 + 时间坐标轴'},
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return params.value[0] + ' : ' + params.value[1];
        },
        axisPointer: {animation: false}
    },
    xAxis: {type: 'time',},
    yAxis: {type: 'value',},
    series: [{
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: [{name:Date(),value:[Date(),value]}]
    }]
};*/
                        name       : 'time dev',
                        description: 'this is time dev',
                        type       : 'ec_time',
                        data       : [
                            {
                                name: 'series 1',
                                data: [
                                    {
                                        date : '2020-01-01',
                                        value: 12,
                                    },
                                    {
                                        date : '2020-01-31',
                                        value: 13,
                                    },
                                    {
                                        date : '2020-03-01',
                                        value: 5,
                                    },
                                ],
                            },
                            {
                                name: 'series 2',
                                data: [
                                    {
                                        date : '2020-01-15',
                                        value: 6,
                                    },
                                    {
                                        date : '2020-01-18',
                                        value: 8,
                                    },
                                    {
                                        date : '2020-02-15',
                                        value: 1,
                                    },
                                ],
                            },
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
                console.info('Settings: fillData');
                console.info(resolveData.list);
                this.list = resolveData.list;
                this.fillQuery(resolveData.query);
            },
            goto     : function (type, targetId) {
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
