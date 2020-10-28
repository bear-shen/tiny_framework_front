<template>
    <div class="fileVersion">
        <ul>
            <li v-for="(item,index) in list">
                <div class="content">
                    <div class="cover">
                        <span v-if="!item.cover" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
                        <img v-if="item.cover" class="ct_cover" :src="item.cover" :alt="item.title">
                    </div>
                    <div class="meta">
                        <div>{{item.hash}}</div>
                        <div>{{item.type}} ({{item.suffix}})</div>
                        <div>{{item.size}}</div>
                        <div>{{item.time_create}}</div>
                        <div>{{item.time_update}}</div>
                    </div>
                </div>
                <div class="operate">
                    <button type="button" class="btn btn-dark sysIcon sysIcon_download">
                        download
                    </button>
                    <button type="button" class="btn btn-dark sysIcon sysIcon_link">
                        set current
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .fileVersion {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>

<script>
    import GenFuncLib from "../../lib/GenFuncLib";
    import Helper     from "../../lib/Helper";
    import router     from "../../router";

    /**
     * 文件详细页
     * 已知两个问题，
     * 历史版本不知道摆哪
     * 文本文件的详情还没有优化，最好做成ajax的，否则数组太大，而且格式没有测
     *
     * 这边暂且做成通过给查询增加某个参数后自行获取所有的文件信息，回传估计会很大但是总之没什么办法
     * 然后因为popup是单层的也不好做加载进度，得看看要不要自己实现一个
     * */
    export default {
        name     : 'PopupFileVersion',
        props    : ['info'],
        data     : function () {
            return {
                list: [],
            };
        },
        created  : function () {
            console.info(`popup FileDetail: created`);
            this.query(this.info.id).then((resolveData) => {
                this.fillData(resolveData);
            });
        },
        destroyed: function () {
            console.info(`popup FileDetail: destroyed`);
        },
        mounted  : function () {
            console.info(`popup FileDetail: mounted`);
        },
        methods  : {
            close   : function () {
                console.info(`popup FileDetail: close`);
                this.$parent.hide();
            },
            query   : function (itemId) {
                let targetList = [];
                for (let i1 = 0; i1 < 20; i1++) {
                    targetList.push(
                        {
                            id         : '0',
                            raw        : '/sample/cover.jpg',
                            normal     : '/sample/cover.jpg',
                            cover      : '/sample/cover.jpg',
                            cover_id   : '1',
                            title      : 'this is title this is title this is title this is title this is title',
                            description: 'this is description',
                            size       : '996 KB',
                            hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                            type       : 'image',
                            favourite  : '1',
                            time_create: '1919-08-10 11:45:14',
                            time_update: '1919-08-10 11:45:14',
                            is_current:0,
                        });
                }
                return new Promise((resolve, reject) => {
                    return resolve(
                        {
                            list: targetList,
                        });
                });
            },
            fillData: function (resolveData) {
                console.info('popup FileDetail: fillData');
                this.list = resolveData.list;
            },
        },
    }
</script>
