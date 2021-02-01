<!--
移动/复制 文件用表单
-->
<template>
    <div class="file_list">
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
    #popup .file_list {
        z-index: 2;
        /*max-height: 80%;*/
        /*min-height: 40%;*/
        /*max-height: 50vh;*/
        max-width: 80vw;
        min-width: 40vw;
        background-color: map_get($colors, popup_bk);
        padding: $fontSize*0.5;
        position: relative;
        .title {
            text-align: center;
            height: $fontSize;
            line-height: $fontSize;
            font-size: $fontSize;
        }
        .search {
            padding: $fontSize*0.5 0;
            input {
                width: -webkit-fill-available;
                height: $fontSize*1.5;
                line-height: $fontSize*1.5;
                font-size: $fontSize;
                padding: 0 $fontSize*0.25;
            }
        }
        .list_content {
            overflow: auto;
            @include smallScroll;
            max-height: 50vh;
            min-height: 30vh;
        }
        .list_operate {
            text-align: right;
            height: $fontSize*2;
            margin-top: $fontSize*0.5;
            /*position: absolute;*/
            /*bottom: $fontSize*0.5;*/
            /*right: $fontSize*0.5;*/
            button {
                margin-left: $fontSize*0.5;
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
                    id   : 0,
                    title: 'root',
                    type : 'folder',
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
                this.info.submit(curItem, currentRoute);
            },
            empty : function () {
            },
        }
    }
</script>