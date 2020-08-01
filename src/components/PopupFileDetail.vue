<template>
    <div class="fileDetail">
        <div class="content">
            <template v-else-if="current.type==='image'"></template>
            <template v-else-if="current.type==='binary'"></template>
            <template v-else-if="current.type==='text'"></template>
            <template v-else-if="current.type==='video'"></template>
            <template v-else-if="current.type==='audio'"></template>
        </div>
        <div class="naviBtn naviRight"></div>
        <div class="naviBtn naviLeft"></div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

<script>
    import config     from '../config';
    import GenFuncLib from '../lib/GenFuncLib';

    /**
     * UploaderLib.js 里的分片功能正在考虑要不要去掉，想想都觉得烦。。。
     * 而且这么个功能本质上属于卵用没有，你又没做断点续传。。。
     * 但是做都做了。。。
     *
     * status:
     * uploaded  uploading  failed  waiting
     * */

    export default {
        name     : 'PopupFileDetail',
        props    : ['info'],
        data     : function () {
            return {
                current: {},
                list   : [],
            };
        },
        created  : function () {
            console.info(`popup FileDetail: created`);
            let current = false;
            for (let i1 = 0; i1 < this.info.list.length; i1++) {
                if (this.info.list[i1].id !== this.info.current) continue;
                current = this.info.list[i1];
            }
            if (!current) current = this.info.list[0];
            this.current = current;
            this.list    = this.info.list;
        },
        destroyed: function () {
            console.info(`popup FileDetail: destroyed`);
        },
        mounted  : function () {
            console.info(`popup FileDetail: mounted`);
        },
        methods  : {
            cancel: function () {
                console.info(`popup FileDetail: cancel`);
            },
        },
    }
</script>
