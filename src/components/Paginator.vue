<template>
    <ul id="paginator" class="nav navbar-nav navbar-right">
        <li>
            <a href="javascript:void(0)" v-on:click="prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li v-for="offset in pageOffsets" :class="{active:page==offset}" v-on:click="reset(offset)"><a href="javascript:void(0)">{{offset}}</a></li>
        <!--<li c0.lass="disabled"><a href="javascript:void(0)">3</a></li>-->
        <li>
            <a href="javascript:void(0)" v-on:click="next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</template>

<script>
    /**
     * @var page
     * @method reset                (page) 重置分页
     * @method switcher             (page) (internal)
     * @method switcherCallback     (page) 用于替换
     * @method prev
     * @method next
     * */
    export default {
        name   : "Paginator",
        // el     : '#paginator',
        data   : function () {
            return {
                page       : 1,
                pageOffsets: [
                    1, 2, 3, 4, 5,
                ],
            };
        },
        created: function () {
        },
        methods: {
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
            //用于注入外部switcher方法的方法
            //到这里只更新路由，具体的获取数据等路由更新了以后自己去监听
            switcher  : function () {
                console.info('switcher');
            },
            reset     : function (page) {
                console.info('reset');
                this.page = page ? Number.parseInt(page) : 1;
                this.pagination();
                this.switcher();
            },
            prev      : function () {
                console.info('prev');
                this.page -= 1;
                this.pagination();
                this.switcher();
            },
            next      : function () {
                console.info('next');
                this.page += 1;
                this.pagination();
                this.switcher();
            },
        }
    }
</script>

<style scoped>

</style>