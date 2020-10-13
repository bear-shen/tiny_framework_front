<!--
移动/复制 文件用表单
-->
<template>
    <div class="popup_file_list">
        <div class="list_content">
            <popup-file-list-sub :item="root"/>
        </div>
        <div class="list_operate">
            <button type="button" class="btn btn-warning" v-on:click="">close</button>
            <button type="button" class="btn btn-success" v-on:click="">submit</button>
        </div>
    </div>
</template>

<style lang="scss">
    .popup_file_list {
        z-index: 10;
        /*max-height: 80%;*/
        /*min-height: 40%;*/
        height: 50vh;
        max-width: 90%;
        width: 480px;
        background-color: hsla(0, 0%, 0%, 0.5);
        padding: $fontSize;
        position: relative;

        .list_content {
            overflow: auto;
            @include smallScroll;
            height: calc(50vh - #{$fontSize*5});
        }

        .list_operate {
            height: $fontSize*2;
            position: absolute;
            bottom: $fontSize;
            right: $fontSize;
            button{
                margin-left: $fontSize;
            }
        }
    }
</style>

<script>
    import PopupFileListSub from "./PopupFileListSub";

    /**
     * */
    export default {
        name      : "PopupFileList",
        components: {PopupFileListSub},
        // el     : '#popup',
        props     : ['info',],
        watch     : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`popup form: info watched`);
                console.info(to);
            }
        },
        data      : function () {
            return {
                root: {
                    id      : 0,
                    title   : 'root',
                    type    : 'folder',
                    sub_size: -1,
                    sub     : [],
                },
            }
        },
        created   : function () {
            console.info(`popup form: created`);
            let data = Object.assign(
                {
                    title : 'title',
                    submit: () => {
                    },
                    cancel: () => {
                    },
                }, this.info);
            //

            //
            console.info(this);
        },
        destroyed : function () {
        },
        methods   : {
            expand: function (cur) {
                if (!cur) cur = this.list;
                this.query(cur.id).then((list) => {
                    //
                    for (let i1 = 0; i1 < list.length; i1++) {
                        let item = Object.assign(
                            {
                                sub_size: -1,
                                sub     : [],
                            }, list[i1]);
                        cur.push(item);
                    }
                    //
                });
            },
            fold  : function (cur) {
            },
            query : function (currentId) {
                let listData = [];
                for (let i1 = 0; i1 < Math.floor(Math.random() * 10); i1++) {
                    let type = Math.random() > 0.2 ? 'folder' : 'image';
                    let item = {
                        id      : Math.floor(Math.random() * 1000),
                        title   : `name:${type}:${Math.random()}`,
                        type    : type,
                        sub_size: -1,
                        sub     : [],
                    };
                    listData.push(item);
                }
                return new Promise((resolve, reject) => {
                    console.warn({list: listData,});
                    return resolve({list: listData,});
                });
            },
            reset : function () {
                this.$parent.hide();
            },
            submit: function () {
                this.$parent.hide();
            },
            empty : function () {
            },
        }
    }
</script>