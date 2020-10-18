<template>
    <div class="Settings">
        <div v-for="item in list" :class="['item',`size_${item.size}`,`cls_${item.type}`]">
            <div v-if="item.name" :title="item.description" class="title">{{item.name}}</div>
            <template v-if="item.type==='text'">
                <div class="content" v-html="item.data.value"></div>
            </template>
            <template v-else-if="item.type==='form'">
                <table class="content">
                    <tr v-for="sub in item.data">
                        <th :title="sub.description">{{sub.name}}</th>
                        <td>
                            <template v-if="false"></template>
                            <template v-else-if="sub.type==='text'">
                                <input type="text" v-model="sub.value"/>
                            </template>
                            <template v-else-if="sub.type==='textarea'">
                                <textarea v-model="sub.value"></textarea>
                            </template>
                            <template v-else-if="sub.type==='select'">
                                <select v-model="sub.value">
                                    <option v-for="(optV,optK) in sub.extra" :value="optK">{{optV}}</option>
                                </select>
                            </template>
                            <template v-else-if="sub.type==='radio'">
                                <template v-for="(optV,optK) in sub.extra">
                                    <label>
                                        {{optV}} :
                                        <input type="radio" v-model="sub.value" :value="optK">
                                    </label>
                                </template>
                            </template>
                            <template v-else-if="sub.type==='checkbox'">
                                <template v-for="(optV,optK) in sub.extra">
                                    <label>
                                        {{optV}} :
                                        <input type="checkbox" v-model="sub.value" :value="optK">
                                    </label>
                                </template>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button :class="['btn','btn-dark','sysIcon','sysIcon_save']"></button>
                        </td>
                    </tr>
                </table>

            </template>
            <template v-else-if="item.type==='ec_line'"></template>
            <template v-else-if="item.type==='ec_time'"></template>
            <template v-else-if="item.type==='ec_pie'"></template>
        </div>
    </div>
</template>

<style lang="scss">
    .Settings {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: $fontSize;
        align-content: flex-start;

        .item {
            display: block;
            height: $fontSize*20;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: $fontSize*0.5;
            padding: 0 $fontSize;
            margin-bottom: $fontSize;
            overflow: auto;
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
        }

        .title {
            text-align: center;
            font-size: $fontSize*1.2;
            margin-bottom: $fontSize*0.5;
        }

        .content {
            font-size: $fontSize*1;

            th, label {
                font-weight: normal;
            }

            tr > * {
                line-height: $fontSize*1.25;
                padding-bottom: $fontSize*0.5;
            }

            tr:last-child {
                td {
                    padding-top: $fontSize*0.5;
                    text-align: center;
                }

                button {
                    width: 90%;
                }
            }

            label {
                margin-right: $fontSize;
            }
        }

        .size_1 {
            width: 23.5%;
        }

        .size_2 {
            width: 49%;
        }

        .size_3 {
            width: 74.5%;
        }

        .size_4 {
            width: 100%;
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
                        size       : 1,
                        type       : 'text',
                        data       : {value: 'test'},
                    },
                    {
                        name       : 'form dev',
                        description: 'this is form dev',
                        size       : 2,
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
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },]
};*/
                    {
                        name       : 'line dev',
                        description: 'this is line dev',
                        size       : 1,
                        type       : 'ec_line',
                        data       : {
                            category: ['c1', 'c2', 'c3'],
                            series  : [
                                [1, 2, 3,],
                                [3, 4, 5,],
                                [6, 7, 8,],
                            ],
                        },
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
                        size       : 1,
                        type       : 'ec_time',
                        data       : [
                            {
                                series: 'series name',
                                value : [
                                    {
                                        date : 'a1',
                                        name : (new Date()).toString(),
                                        value: 12,
                                    },
                                    {
                                        date : 'a2',
                                        name : (new Date()).toString(),
                                        value: 13,
                                    },
                                    {
                                        date : 'a3',
                                        name : (new Date()).toString(),
                                        value: 14,
                                    },
                                ],
                            },
                        ],
                    },
                    {
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
                        size       : 1,
                        type       : 'ec_pie',
                        data       : [
                            {
                                series: 'series name',
                                value : [
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
