<!--
移动/复制 文件用表单
-->
<template>
        <div class="list">
            <div class="name">
                <span
                        class="sysIcon sysIcon_plus-square-o"
                        v-on:click="expand()"
                ></span>
                <span>{{item.title}}</span>
            </div>
            <template v-for="sub in item.sub">
                <PopupFileListSub :item="sub"/>
            </template>
        </div>
</template>

<style lang="scss">
    .popup_file_list{
        .list{
            margin-left: 2*$fontSize;
        }
        .name{
            span:first-child{

            }
            span:last-child{
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
        props    : ['item'],
        watch    : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`PopupFileListSub: info watched`);
                console.info(to);
            }
        },
        data     : function () {
            return {
            }
        },
        created  : function () {
            console.info(`PopupFileListSub: created`);
            //
            console.info(this.item.id);
            console.info(this.item.title);
        },
        destroyed: function () {
        },
        methods  : {
            expand: function () {
                console.info(`PopupFileListSub: expand`);
                this.query(this.item.id).then((data) => {
                    console.info(`PopupFileListSub: expand callback`);
                    console.warn(data);
                    //
                    for (let i1 = 0; i1 < data.list.length; i1++) {
                        let item = Object.assign(
                            {
                                sub_size: -1,
                                sub     : [],
                            }, data.list[i1]);
                        console.info(item);
                        this.item.sub.push(item);
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