<template>
    <ul id="paginator" class="nav navbar-nav navbar-right">
        <li>
            <a href="javascript:void(0)" v-on:click="prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li v-for="offset in pageOffsets" :class="{active:page===offset}" v-on:click="goto(offset)"><a href="javascript:void(0)">{{offset}}</a></li>
        <!--<li c0.lass="disabled"><a href="javascript:void(0)">3</a></li>-->
        <li>
            <a href="javascript:void(0)" v-on:click="next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</template>

<script>
    import store  from '../store';
    import router from '../router';

    /**
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
        data    : function () {
            return {
                pageOffsets: [
                    1, 2, 3, 4, 5,
                ],
            };
        },
        created : function () {
        },
        computed: {
            page: function () {
                console.info('paginator: param:page computed');
                return this.$store.state.page;
            }
        },
        methods : {
            /** @private 生成新的分页 */
            pagination: function () {
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
                console.info('switcher');
                let path  = router.currentRoute.path;
                let param = router.currentRoute.params;
                let page  = this.page;
                router.push({path: path, query: Object.assign(param, {page: page})});
            },
            goto      : function (page) {
                console.info('reset');
                this.$store.commit('setPage', page ? page : 1);
                this.pagination();
                this.switch();
            },
            prev      : function () {
                console.info('prev');
                this.$store.commit('setPage', this.page - 1);
                this.pagination();
                this.switch();
            },
            next      : function () {
                console.info('next');
                this.$store.commit('setPage', this.page + 1);
                this.pagination();
                this.switch();
            },
        }
    }
</script>

<style scoped>

</style>