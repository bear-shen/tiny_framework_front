<template>
    <ul id="paginator" class="nav navbar-nav navbar-right">
        <li>
            <a href="javascript:void(0)" v-on:click="prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li v-for="offset in pageOffsets" :class="{active:page===offset}" v-on:click="goto(offset)">
            <a href="javascript:void(0)">{{offset}}</a>
        </li>
        <!--<li c0.lass="disabled"><a href="javascript:void(0)">3</a></li>-->
        <li>
            <a href="javascript:void(0)" v-on:click="next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</template>

<style lang="scss">
    #paginator {
        height: $footerHeight;
        width: 25%;
        margin-right: 0;
        font-size: 0;

        li {
            width: percentage(1/7);
            display: inline-block;
            height: $footerHeight;
            text-align: center;
        }

        a {
            font-size: $footerHeight/4;
            padding-left: 0;
            padding-right: 0;
            padding-top: 0;
            padding-bottom: 0;
            line-height: $footerHeight;
        }
    }

    @media(max-width: 767px) {
        #paginator {
            width: 90%;
            text-align: center;
            margin-right: auto;
            margin-left: auto;

            margin-top: 0;
            white-space: nowrap;
            height: $footerHeight;

            li {
            }

            a {
                line-height: $footerHeight;
                padding: 0;
                font-size: $footerHeight/2;
            }
        }
    }
</style>

<script>
    import store  from '../store';
    import router from '../router';
    import Helper from '../lib/Helper';

    /**
     * 除去点击分页以后分页自行切换的部分
     * 分页通过监听路由的修改来自己实现自动切换
     *
     * @var page
     * @method goto                 (page) 重置分页
     * @method prev
     * @method next
     * @method pagination           () (internal)
     * @method pagination           () (internal)
     * */
    export default {
        name    : "Paginator",
        store   : store,
        // el     : '#paginator',
        watch   : {
            $route: function (to, from) {
                console.info(`paginator: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                // console.info(this.page);
                if (!Helper.isSameRoute(from, to)) {
                    console.info('paginator: page modified');
                    this.page = 1;
                    this.pagination();
                }
            },
            page  : function (to, from) {
                console.info('paginator: param:page compute watched');
            }
        },
        data    : function () {
            return {
                pageOffsets: [
                    1, 2, 3, 4, 5,
                ],
            };
        },
        created : function () {
            //专门写一个回调函数是为了对应事件无法获取的情况
            this.$store.commit('setPaginatorCallback', this.callback);
            //首次回调时使用的是请求里得到的page，列表加载早于分页加载
            //之后的回调则使用内部函数了
            this.pagination();
        },
        computed: {
            page: {
                get: function () {
                    console.info('paginator: param:page get');
                    return this.$store.state.page;
                },
                set: function (val) {
                    console.info('paginator: param:page set');
                    this.$store.commit('setPage', val);
                },
            }
        },
        methods : {
            /** @private 生成新的分页 */
            pagination: function () {
                console.info('paginator: go pagination, page:' + this.page);
                //生成页数
                let start        = Math.max(this.page - 2, 1);
                let end          = start + 4;
                let targetOffset = [];
                for (let i1 = start; i1 <= end; i1++) {
                    targetOffset.push(i1);
                }
                this.pageOffsets = targetOffset;
            },
            /** @private 切换分页 */
            switch    : function () {
                console.info('paginator: switcher');
                let path  = router.currentRoute.path;
                let param = router.currentRoute.params;
                let page  = this.page;
                router.push(
                    {path: path, query: Object.assign(param, {page: page})},
                    () => {
                        this.pagination();
                    }
                );
            },
            goto      : function (page) {
                console.info('paginator: reset');
                this.$store.commit('setPage', page ? page : 1);
                this.switch();
            },
            prev      : function () {
                console.info('paginator: prev');
                this.$store.commit('setPage', this.page - 1);
                this.switch();
            },
            next      : function () {
                console.info('paginator: next');
                this.$store.commit('setPage', this.page + 1);
                this.switch();
            },
            callback  : function (page) {
                console.info('paginator: callback');
                this.page = page;
                this.pagination();
            }
        }
    }
</script>

<style scoped>

</style>