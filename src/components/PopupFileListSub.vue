<!--
移动/复制 文件用表单
-->
<template>
    <div class="list">
        <div class="name">
                <span v-if="expanded"
                      class="sysIcon sysIcon_minus-square-o"
                      v-on:click="fold()"
                ></span>
            <span v-else
                  class="sysIcon sysIcon_plus-square-o"
                  v-on:click="expand()"
            ></span>
            <span v-on:click="submit(item,currentRoute)">{{item.title}}</span>
        </div>
        <template v-for="subItem in sub" v-if="subItem.type==='folder'">
            <popup-file-list-sub
                    :item="subItem"
                    :submit="submit"
                    :from="currentRoute"
                    :query="false"
            />
        </template>
    </div>
</template>

<style lang="scss">
    .popup_file_list {
        font-size: $fontSize*1.2;
        .list {
            margin-left: 2*$fontSize;
        }

        .name {
            white-space: nowrap;
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
        name     : "PopupFileListSub",
        // el     : '#popup',
        props    : [
            //当前数据 {}
            'item',
            //提交的回调 function(){}
            'submit',
            //跟踪路径 [0,1,2,3]
            'from',
            //查询语句，只有第一次迭代会输入，后面的迭代写入false
            'query'
        ],
        watch    : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`PopupFileListSub: info watched`);
                console.info(to);
            }
        },
        data     : function () {
            return {
                currentRoute : [],
                expanded: false,
                sub_size: -1,
                sub     : [],
                sub_hide: [],
            }
        },
        created  : function () {
            console.info(`PopupFileListSub: created`);
            //
            // console.info(this.item.id);
            // console.info(this.item.title);
            this.currentRoute = this.from.concat([this.item.id]);
        },
        destroyed: function () {
        },
        methods  : {
            expand: function () {
                console.info(`PopupFileListSub: expand`);
                if (this.sub_size !== -1) {
                    this.expanded      = true;
                    this.sub      = this.sub_hide;
                    this.sub_hide = [];
                    return;
                }
                this.query(this.item.id).then((data) => {
                    console.info(`PopupFileListSub: expand callback`);
                    // console.warn(data);
                    if (this.sub_size !== -1) return;
                    //
                    this.sub_size = data.list.length;
                    for (let i1 = 0; i1 < data.list.length; i1++) {
                        let item = Object.assign({}, data.list[i1]);
                        // console.info(item);
                        this.sub.push(item);
                    }
                    this.expanded = true;
                    //
                });
            },
            fold  : function () {
                this.expanded      = false;
                this.sub_hide = this.sub;
                this.sub      = [];
            },
            query : function (currentId) {
                let listData = [];
                for (let i1 = 0; i1 < Math.floor(Math.random() * 10); i1++) {
                    let type = Math.random() > 0.2 ? 'folder' : 'image';
                    let item = {
                        id   : Math.floor(Math.random() * 1000),
                        title: `name:${type}:${Math.random()}`,
                        type : type,
                    };
                    listData.push(item);
                }
                return new Promise((resolve, reject) => {
                    console.warn({list: listData,});
                    return resolve({list: listData,});
                });
            },
        }
    }
</script>