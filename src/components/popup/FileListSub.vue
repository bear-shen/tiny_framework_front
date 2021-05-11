<!--
移动/复制 文件用表单
-->
<template>
    <div class="list">
        <div :class="['name',{select:select.id==item.id}]" :style="{paddingLeft:`${depth}em`}">
            <span v-if="expanded"
                  class="sysIcon sysIcon_minus-square-o"
                  v-on:click="fold()"
            ></span>
            <span v-else
                  class="sysIcon sysIcon_plus-square-o"
                  v-on:click="expand()"
            ></span>
            <span v-on:click="inheritCallback">{{ item.name }}</span>
        </div>
        <template v-if="loading">
            <div class="list">loading...</div>
        </template>
        <template v-else-if="expanded">
            <template v-for="subItem in sub" v-if="subItem.is_file=='0'">
                <popup-file-list-sub
                    :item="subItem"
                    :depth="depth+1"
                    :select="select"
                    :callback="callback"
                    :query="query"
                />
            </template>
        </template>
    </div>
</template>

<style lang="scss">
#popup .list_content {
    font-size: $fontSize;
    line-height: $fontSize*1.5;
    .list {
        //margin-left: 2*$fontSize;
    }
    .name {
        white-space: nowrap;
        &:hover, &.select {
            background-color: rgba(0, 0, 0, 0.5);
            transition: background-color 0.2s;
        }
        transition: background-color 0.2s;
        span {
            display: inline-block;
        }
        span:first-child {
        }
        span:last-child {
            margin-left: $fontSize;
        }
    }
}
</style>

<script>
/**
 * */
export default {
    name: "PopupFileListSub",
    // el     : '#popup',
    props    : [
        //当前数据 {}
        'item',
        'depth',
        'select',
        'callback',
        'query',
    ],
    watch    : {},
    data     : function () {
        return {
            loading : false,
            expanded: false,
            sub_size: -1,
            sub     : [],
        }
    },
    created  : function () {
        console.info(`PopupFileListSub: created`);
        // this.currentRoute = this.from.concat([this.item.id]);
    },
    destroyed: function () {
    },
    methods  : {
        expand         : function () {
            console.info(`PopupFileListSub: expand`);
            this.loading = true;
            if (this.sub_size !== -1) {
                this.expanded = true;
                this.loading  = false;
                return;
            }
            this.query(
                this.item.id,
                'folder'
            ).then((data) => {
                console.info(`PopupFileListSub: expand callback`);
                this.sub_size = data.length;
                this.sub      = data;
                // console.info(this.sub)
                // console.info(this.sub_size)
                /*for (let i1 = 0; i1 < data.length; i1++) {
                 let item = Object.assign({}, data[i1]);
                 // console.info(item);
                 this.sub.push(item);
                 }*/
                this.expanded = true;
                this.loading  = false;
                //
            });
        },
        fold           : function () {
            this.expanded = false;
            // this.sub_hide = this.sub;
            // this.sub      = [];
        },
        inheritCallback: function () {
            console.warn(this.select);
            this.select.id   = this.item.id;
            this.select.name = this.item.name;
            this.select.type = 'folder';
            this.callback(this.item);
        }
    }
}
</script>