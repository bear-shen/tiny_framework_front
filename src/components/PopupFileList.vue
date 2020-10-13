<!--
移动/复制 文件用表单
-->
<template>
    <div class="popup_file_list">
        <div class="list_content">
            <popup-file-list-sub
                    :item="root"
                    :submit="submit"
                    :from="[]"
            />
        </div>
        <div class="list_operate">
            <button type="button" class="btn btn-warning" v-on:click="reset">close</button>
            <button type="button" class="btn btn-success" v-on:click="submit">submit</button>
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

            button {
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
                    route   : [],
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
            reset : function () {
                this.$parent.hide();
            },
            submit: function (current, curItem) {
                this.$parent.hide();
                console.info(current);
                console.info(curItem);
            },
            empty : function () {
            },
        }
    }
</script>