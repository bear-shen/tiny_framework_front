<!--
移动/复制 文件用表单
-->
<template>
    <div class="file_list" :class="[`_${refreshStamp}`]">
        <div class="title">{{ title }}</div>
        <div class="search"><input type="text" v-model="search"/></div>
        <div class="list_content">
            <template v-if="search">
                <popup-file-list-sub
                    v-for="item in searchRoot"
                    :item="item"
                    :depth="1"
                    :select="select"
                    :callback="selectCallback"
                    :query="query"
                />
            </template>
            <template v-else>
                <popup-file-list-sub
                    :item="root"
                    :depth="1"
                    :select="select"
                    :callback="selectCallback"
                    :query="query"
                />
            </template>
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
import helper           from "../../lib/Helper";

/**
 * */
export default {
    name      : "PopupFileList",
    components: {PopupFileListSub},
    // el     : '#popup',
    props    : ['info',],
    watch    : {
        //弹层数据处理
        search: function (to, from) {
            console.info(`popup form: search watched`);
            if (!to) return;
            this.query(to, 'search').then(data => {
                this.searchRoot = data;
            });
        }
    },
    data     : function () {
        return {
            title       : 'Title',
            search      : '',
            searchRoot  : [],
            refreshStamp: new Date() * 1,
            select      : {
                id  : 0,
                name: 'root',
                type: 'folder',
            },
            root        : {
                id  : 0,
                name: 'root',
                type: 'folder',
            },
        }
    },
    created  : function () {
        console.info(`popup form: created`);
        //
        this.title = this.info.title ? this.info.title : this.title;
        //
        console.info(this);
    },
    destroyed: function () {
    },
    methods  : {
        reset         : function () {
            this.$parent.hide();
            if (this.info.cancel)
                this.info.cancel();
        },
        submit        : function () {
            this.$parent.hide();
            if (this.info.submit)
                this.info.submit(this.select);
        },
        selectCallback: function (item) {
            console.info('selectCallback');
            console.info(item);
            this.select.id   = item.id;
            this.select.name = item.name;
            this.select.type = 'folder';
            this.refresh();
        },
        refresh       : function () {
            this.refreshStamp = (new Date()) * 1;
        },
        query         : function (data, type) {
            return new Promise((resolve, reject) => {
                let query = {};
                switch (type) {
                    case 'folder':
                        query = {
                            type     : 'list',
                            method   : 'folder',
                            target   : data,
                            node_only: '1',
                            dir_only : '1',
                        };
                        break;
                    case 'search':
                        query = {
                            type     : 'list',
                            method   : 'keyword',
                            target   : data,
                            node_only: '1',
                            dir_only : '1',
                        };
                        break;
                }
                helper.query(
                    'file_list',
                    query
                ).then((data) => {
                    console.warn(data);
                    return resolve(data);
                });
            });
        },
    }
}
</script>