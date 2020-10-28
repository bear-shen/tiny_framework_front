<!--
移动/复制 文件用表单
-->
<template>
    <div class="popup_file_list">
        <div class="title">{{title}}</div>
        <div class="search"><input type="text" v-model="search"/></div>
        <div class="list_content">
            <popup-file-list-sub
                    :item="root"
                    :submit="submit"
                    :from="[]"
                    :query_word="search"
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
        background-color: hsla(0, 0%, 25%, 0.75);
        padding: $fontSize;
        position: relative;

        .title {
            text-align: center;
            height: $fontSize*1.5;
            line-height: $fontSize*1.5;
            font-size: $fontSize*1.2;
        }

        .search {
            padding: $fontSize*0.5 0;
            input {
                width: 100%;
                height: $fontSize*2;
                line-height: $fontSize*2;
                font-size: $fontSize*1.2;
                padding: 0 $fontSize*0.5;
            }
        }

        .list_content {
            overflow: auto;
            @include smallScroll;
            height: calc(50vh - #{$fontSize*9.5});
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
    import PopupFileListSub from "./FileListSub";

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
                title : 'Title',
                search: '',
                root  : {
                    id      : 0,
                    title   : 'root',
                    type    : 'folder',
                 },
            }
        },
        created   : function () {
            console.info(`popup form: created`);
            let data   = Object.assign(
                {
                    title : 'title',
                    submit: () => {
                    },
                    cancel: () => {
                    },
                }, this.info);
            //
            this.title = data.title;
            //
            console.info(this);
        },
        destroyed : function () {
        },
        methods   : {
            reset : function () {
                this.$parent.hide();
                this.info.cancel();
            },
            submit: function (curItem, currentRoute) {
                this.$parent.hide();
                console.info(currentRoute);
                console.info(curItem);
                this.info.submit(curItem,currentRoute);
            },
            empty : function () {
            },
        }
    }
</script>