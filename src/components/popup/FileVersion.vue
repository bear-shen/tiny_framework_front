<template>
    <div class="fileVersion">
        <ul>
            <li v-for="(item,index) in list">
                <div class="ct_alpha">
                    <span v-if="!item.cover" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
                    <img v-else class="ct_cover" :src="item.cover" :alt="item.title">
                </div>
                <div class="ct_meta">
                    <div class="ct_type">{{item.type}}</div>
                    <div class="ct_title">{{item.title}}</div>
                    <div class="ct_description">{{item.description}}</div>
                    <div class="ct_size">{{item.size}}</div>
                    <div class="ct_hash">{{item.hash}}</div>
                    <div class="ct_time_create">{{item.time_create}}</div>
                    <div class="ct_time_update">{{item.time_update}}</div>
                </div>
                <div class="ct_operate">
                    <button type="button" class="sysIcon sysIcon_download" v-on:click="download(index)">&nbsp;down</button>
                    <button v-if="item.is_current" type="button" class="sysIcon sysIcon_link" v-on:click="setCurrent(index)">&nbsp;current</button>
                    <button type="button" class="sysIcon sysIcon_link" v-on:click="deleteNode(index)">&nbsp;delete</button>
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
    #popup .fileVersion {
        position: relative;
        width: 100%;
        height: 100%;
        ul {
            width: 95%;
            height: calc(100% - #{$fontSize*4});
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin: $fontSize auto;
            overflow: auto;
            @include smallScroll;
            .ct_alpha {
                $hWithPad: map_get($sizeConf, list_detail_image_thumb_h) - $fontSize*1;
                height: $hWithPad;
                line-height: $hWithPad;
                text-align: center;
                span, img {
                    display: inline-block;
                    max-width: 100%;
                    max-height: 100%;
                    font-size: $hWithPad*0.75;
                    vertical-align: middle;
                }
            }
            .ct_alpha {}
            .ct_meta {
                div, label, input, textarea {
                    display: block;
                    width: 100%;
                    white-space: normal;
                    word-break: break-all;
                    padding: $fontSize*0.25 0;
                }
                input, textarea {
                }
            }
            .ct_alpha, .ct_meta {
                padding: $fontSize*0.5;
            }
            li {
                width: 25%;
                .ct_alpha {
                    width: calc(33.33% - #{$fontSize});
                }
                .ct_meta {
                    width: calc(66.66% - #{$fontSize});
                }
            }
            @media (max-width: $narrowWidth) {
                li {
                    width: 33%;
                    .ct_alpha {
                        width: calc(33.33% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(66.66% - #{$fontSize});
                    }
                }
            }
            @media (max-width: $tabletWidth) {
                li {
                    width: 50%;
                    .ct_alpha {
                        width: calc(33.33% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(66.66% - #{$fontSize});
                    }
                }
            }
            @media (max-width: $mobileWidth) {
                li {
                    & > div {
                        display: block;
                        vertical-align: top;
                    }
                }
                li {
                    width: 100%;
                    .ct_alpha, .ct_meta, .ct_tag {
                        width: calc(100% - #{$fontSize});
                    }
                }
            }
        }
        .btnClose {
            position: absolute;
            top: 2%;
            right: 1.5%;
            background-color: map_get($colors, popup_bk_2);
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
            deleteNode: function (itemIndex) {
                if (this.list.length > 1)
                    this.list.splice(itemIndex, 1);
            },
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
                            is_current : 1,
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
