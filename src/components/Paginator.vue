<template>
    <ul id="paginator" v-if="usePagination">
        <li>
            <a href="javascript:void(0)" v-on:click="prev"> &laquo; </a>
        </li>
        <li v-for="offset in pageOffsets" :class="{active:getPage()===offset}" v-on:click="goto(offset)">
            <a href="javascript:void(0)">{{offset}}</a>
        </li>
        <!--<li c0.lass="disabled"><a href="javascript:void(0)">3</a></li>-->
        <li>
            <a href="javascript:void(0)" v-on:click="next"> &raquo; </a>
        </li>
    </ul>
</template>

<style lang="scss">
    #paginator {
        height: $footerHeight;
        margin-right: $fontSize;
        li {
            display: inline-block;
            text-align: center;
        }
        a {
            display: block;
            font-size: $fontSize;
            padding: 0 $fontSize;
            line-height: $footerHeight;
            height: $footerHeight;
        }
        li:hover, .active {
            background-color: map_get($colors, nav_active);
        }
    }
    @media(max-width: $tabletWidth) {
        #paginator {
            margin-right: 0;
            li {
            }
            a {
            }
        }
    }
    @media(max-width: $mobileWidth) {
        #paginator {
            li {
            }
            a {
            }
        }
    }
</style>

<script>
    import store   from '../store';
    import router  from '../router';
    import Helper  from '../lib/Helper';
    import GenFunc from '../lib/GenFuncLib';

    /**
     * 分页通过监听路由的修改来自己实现自动切换
     * 这边只实现通过点击分页的分页
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
            //route 看起来不能监听到翻页
            $route: function (to, from) {
                console.info(`paginator: route to ${router.currentRoute.name}`);
                this.pagination();
            },
        },
        data    : function () {
            return {
                pageOffsets  : [
                    1, 2, 3, 4, 5,
                ],
                usePagination: true,
            };
        },
        created : function () {
            //专门写一个回调函数是为了对应事件无法获取的情况
            this.$store.commit('registerPaginator', this);
            //首次回调时使用的是请求里得到的page，列表加载早于分页加载
            //之后的回调则使用内部函数了
            this.pagination();
        },
        computed: {},
        methods : {
            /**
             *  computed 的不更新，可能是 set 方法收不到消息的原因
             *  这样写不够原生，性能影响不详
             *  先不做缓存，就这样
             *  */
            getPage   : function () {
                console.info('paginator: param:page get');
                let query = router.currentRoute.query;
                return query.page ? parseInt(query.page) : 1;
            },
            /** @private 生成新的分页 */
            pagination: function () {
                console.info('paginator: go pagination, page:' + this.getPage());
                console.debug(router);
                console.debug(router.currentRoute.query);
                //生成页数
                let start        = Math.max(this.getPage() - 2, 1);
                let end          = start + 4;
                let targetOffset = [];
                for (let i1 = start; i1 <= end; i1++) {
                    targetOffset.push(i1);
                }
                this.pageOffsets = targetOffset;
            },
            /** @private 切换分页 */
            switch    : function (page) {
                console.info(`paginator: switcher ${page}`);
                let path      = router.currentRoute.path;
                let query     = GenFunc.copyObject(router.currentRoute.query);
                let routeData = {path: path, query: Object.assign(query, {page: page})};
                if (Helper.isSameRoute({path, query: router.currentRoute.query}, routeData)) {
                    console.info('is same route, pass');
                    return;
                }
                // console.info(routeData);
                router.push(routeData);
            },
            goto      : function (page) {
                console.info(`paginator: goto ${page}`);
                this.switch(page ? page : 1);
            },
            prev      : function () {
                console.info('paginator: prev');
                this.switch(this.getPage() - 1);
            },
            next      : function () {
                console.info('paginator: next');
                this.switch(this.getPage() + 1);
            },
        }
    }
</script>

<style scoped>

</style>