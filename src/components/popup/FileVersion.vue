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
                    <button type="button" class="btn btn-dark sysIcon sysIcon_download" v-on:click="download(index)">
                        download
                    </button>
                    <button type="button" class="btn btn-dark sysIcon sysIcon_link" v-on:click="setCurrent(index)">
                        set current
                    </button>
                </div>
            </li>
        </ul>
        <div class="btnClose" v-on:click="close">
            <span class="sysIcon sysIcon_close"></span>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .fileVersion {
        position: relative;
        width: 100%;
        height: 100%;

        ul {
            width: 95%;
            height: calc(95% - #{$fontSize*4});
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin: $fontSize*2 0;
            overflow: auto;

            @include smallScroll;

            li {
                $liMaxWidth: 500px;
                width: $liMaxWidth;
                list-style: none;

                .content {
                    display: flex;
                    min-height: $liMaxWidth*0.5;
                    margin-top: $fontSize;
                    margin-bottom: $fontSize;

                    .cover {
                        height: $liMaxWidth*0.5;
                        width: $liMaxWidth*0.5;
                        position: relative;

                        text-align: center;

                        .ct_icon,
                        .ct_cover {
                            max-width: calc(#{$liMaxWidth} * 0.5);
                            max-height: calc(#{$liMaxWidth} * 0.5);
                            margin-left: auto;
                            margin-right: auto;
                            display: block;
                        }

                        .ct_icon {
                            z-index: 1;
                            font-size: $liMaxWidth*0.4;
                            line-height: $liMaxWidth*0.5;
                            text-align: center;
                        }

                        .ct_cover {
                            z-index: 2;
                        }
                    }

                    .meta {
                        width: 50%;

                        div {
                            white-space: normal;
                            word-break: break-all;
                        }
                    }
                }

                .operate {
                    text-align: center;

                    button {
                        margin: 0 $fontSize*1;
                    }
                }
            }
        }

        .btnClose {
            position: absolute;
            top: 2%;
            right: 1.5%;
            background-color: rgba(0, 0, 0, 0.25);
            width: $fontSize*2;
            height: $fontSize*2;
            line-height: $fontSize*2;
            text-align: center;
            border-radius: $fontSize;
            color: white;
            //text-shadow: black 0 0 5px;
        }
    }
</style>

<script>
    import GenFuncLib from "../../lib/GenFuncLib";
    import Helper     from "../../lib/Helper";
    import router     from "../../router";

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
            download  : function (itemIndex) {
            },
            /**
             * @todo api file_ver_mod
             * */
            setCurrent: function (itemIndex) {
            },
            /**
             * @todo api file_ver
             * */
            query     : function (itemId) {
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
                            //
                            is_current : 0,
                        });
                    targetList.push(
                        {
                            id         : '0',
                            raw        : '/sample/cover.jpg',
                            normal     : '/sample/cover.jpg',
                            cover      : '',
                            cover_id   : '1',
                            title      : 'this is title this is title this is title this is title this is title',
                            description: 'this is description',
                            size       : '996 KB',
                            hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                            type       : 'image',
                            favourite  : '1',
                            time_create: '1919-08-10 11:45:14',
                            time_update: '1919-08-10 11:45:14',
                            //
                            is_current : 0,
                        });
                }
                return new Promise((resolve, reject) => {
                    return resolve(
                        {
                            list: targetList,
                        });
                });
            },
            fillData  : function (resolveData) {
                console.info('popup FileDetail: fillData');
                this.list = resolveData.list;
            },
            close     : function () {
                console.info(`popup FileDetail: close`);
                this.$parent.hide();
            },
        },
    }
</script>
