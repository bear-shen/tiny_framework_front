<template>
    <div class="fileDetail">
        <div :class="['content',{showDetail:detailOn},{noDetail:!detailOn}]">
            <div class="contentBody">
                <template v-if="current.type==='image'">
                    <img :src="current.normal" :alt="current.title"/>
                </template>
                <template v-else-if="current.type==='binary'">
                    <span v-if="!current.cover" :class="['ct_icon','listIcon','listIcon_file_'+current.type]"></span>
                    <img v-if="current.cover" class="ct_cover" :src="current.cover" :alt="current.title">
                </template>
                <template v-else-if="current.type==='text'">
                    <textarea disabled v-model="current.raw"></textarea>
                </template>
                <template v-else-if="current.type==='video'">
                    <video :src="current.normal" controls></video>
                </template>
                <template v-else-if="current.type==='audio'">
                    <audio :src="current.normal" controls></audio>
                </template>
            </div>
            <div class="contentDetail" v-on:click="toggleDetail">
                <div class="contentMain">
                    <div class="contentIndex">
                        {{currentIndex+1}} / {{list.length}}
                    </div>
                    <div class="contentCover">
                        <span v-if="!current.cover" :class="['ct_icon','listIcon','listIcon_file_'+current.type]"></span>
                        <img v-if="current.cover" class="ct_cover" :src="current.cover" :alt="current.title">
                    </div>
                    <div class="contentTxt">
                        <div class="contentTitle">{{current.title}}</div>
                        <div class="contentDescription">{{current.description}}</div>
                    </div>
                </div>
                <div class="contentMeta">
                    <div class="contentTimeCreate">{{current.time_create}}</div>
                    <div class="contentTimeUpdate">{{current.time_update}}</div>
                    <div class="contentHash">{{current.hash}}</div>
                    <div class="contentSize">{{current.size}}</div>
                    <div class="contenDownload"><a :href="current.raw">download</a></div>
                </div>
                <div class="contentTags">
                    <dl v-for="group in current.tag" :data-id="group.id">
                        <dt>{{group.name}}:</dt>
                        <dd
                                v-for="tag in group.sub"
                                :data-id="tag.id"
                                class="btn btn-dark"
                                v-on:click="goto('tag',tag.id)"
                        >
                            {{tag.name}}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="naviBtn naviLeft" v-on:click="prev">
            <span class="sysIcon sysIcon_arrowleft"></span>
        </div>
        <div class="naviBtn naviRight" v-on:click="next">
            <span class="sysIcon sysIcon_arrowright"></span>
        </div>
        <div class="btnClose" v-on:click="close">
            <span class="sysIcon sysIcon_close"></span>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .fileDetail {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;

        .btnClose {
            position: absolute;
            top: 2.5%;
            right: 7.5%;
            background-color: rgba(0, 0, 0, 0.25);
            width: $fontSize*2;
            height: $fontSize*2;
            line-height: $fontSize*2;
            text-align: center;
            border-radius: $fontSize;
        }

        .naviBtn {
            width: 5%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.25);
            line-height: 90vh;
            text-align: center;

            &.naviLeft { order: 1 }

            &.naviRight { order: 3 }
        }

        .content {
            width: 90%;
            order: 2;

            .contentBody {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                align-content: center;

                > * {
                    max-width: 100%;
                    //max-height: calc(100vh - #{$footerHeight} * 3 - 40px);
                    max-height: 100%;
                    //
                    display: block;
                    text-align: center;
                }

                > textarea {
                    width: 90%;
                    height: 90%;
                    text-align: left;
                }
            }
        }

        .content.noDetail {

            .contentBody {
                text-align: center;
                padding: 20px;
                height: calc(100vh - #{$footerHeight} * 3);

                > .ct_icon {
                    font-size: calc((100vh - #{$footerHeight} * 3 - 40px) * 0.5);
                }
            }

            .contentDetail {
                height: $footerHeight*2;

                .contentMain {
                    display: flex;
                    justify-content: space-around;

                    .contentIndex, .contentTitle {
                        padding-right: $fontSize*1.25;
                        padding-left: $fontSize*1.25;
                        line-height: $footerHeight*2;
                        font-size: $fontSize*1.25;
                    }

                    .contentCover, .contentDescription {
                        display: none;
                    }
                }

                .contentMeta {
                    display: none;
                }

                .contentTags {
                    display: none;
                }
            }
        }

        .content.showDetail {
            $contentBodyHeight: 60vh;

            .contentBody {
                height: $contentBodyHeight;
                padding: 10px;

                > * {
                }

                > .ct_icon {
                    font-size: calc(#{$contentBodyHeight} * 0.5);
                }

                > textarea {
                }
            }

            .contentDetail {
                height: calc(100vh - #{$footerHeight} - #{$contentBodyHeight});
                overflow-y: auto;

                .contentMain {
                    display: flex;

                    .contentIndex {
                        display: none;
                    }

                    .contentCover {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        align-content: center;
                        line-height: 100px;
                        height: 100px;
                        width: 100px;

                        > img {
                            max-height: 100px;
                            max-width: 100px;
                        }

                        text-align: center;

                        > span {
                            font-size: 80px;
                        }
                    }

                    .contentTxt {
                    }

                    //
                    .contentTitle {
                        font-size: $fontSize*1.5;
                    }

                    .contentDescription {
                        font-size: $fontSize;
                        color: rgba(255, 255, 255, 0.6666);
                    }
                }

                .contentMeta {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;

                    > div {
                        min-width: 40%;
                        line-height: $fontSize*1.5;
                        text-align: center;
                    }

                    .contentTimeCreate {
                    }

                    .contentTimeUpdate {
                    }

                    .contentSize {
                    }

                    .contentHash {
                    }

                    .contenDownload {
                    }
                }

                .contentTags {
                    display: block;

                    dl {
                        display: block;
                        margin-bottom: 0;
                        position: relative;
                    }

                    dt {
                        display: inline-block;
                        margin-bottom: 5px;
                        line-height: $fontSize;
                    }

                    dd {
                        position: relative;
                        padding: 3px 5px;
                        margin-left: 5px;
                        margin-top: 5px;
                    }
                }

                &::-webkit-scrollbar-track {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                &::-webkit-scrollbar {
                    width: 5px;
                    background-color: rgba(0, 0, 0, 0);
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgba(127, 127, 127, 0.5);
                    border-radius: 3px;
                }
            }
        }
    }
</style>

<script>
    import config     from '../config';
    import GenFuncLib from '../lib/GenFuncLib';
    import Helper     from "../lib/Helper";
    import router     from "../router";

    /**
     * UploaderLib.js 里的分片功能正在考虑要不要去掉，想想都觉得烦。。。
     * 而且这么个功能本质上属于卵用没有，你又没做断点续传。。。
     * 但是做都做了。。。
     *
     * status:
     * uploaded  uploading  failed  waiting
     * */

    export default {
        name     : 'PopupFileDetail',
        props    : ['info'],
        data     : function () {
            return {
                detailOn    : false,
                currentIndex: 0,
                current     : {},
                list        : [],
            };
        },
        created  : function () {
            console.info(`popup FileDetail: created`);
            let current = false;
            for (let i1 = 0; i1 < this.info.list.length; i1++) {
                current = this.info.list[this.info.current];
            }
            if (!current) current = this.info.list[0];
            //
            this.current      = current;
            this.currentIndex = this.info.current;
            this.list         = this.info.list;
        },
        destroyed: function () {
            console.info(`popup FileDetail: destroyed`);
        },
        mounted  : function () {
            console.info(`popup FileDetail: mounted`);
        },
        methods  : {
            close       : function () {
                console.info(`popup FileDetail: close`);
                this.$parent.hide();
            },
            next        : function () {
                console.info(`popup FileDetail: next`);
                if (this.list.length - 1 <= this.currentIndex) return false;
                this.currentIndex += 1;
                this.current = this.list[this.currentIndex];
            },
            prev        : function () {
                console.info(`popup FileDetail: prev`);
                if (this.currentIndex <= 0) return false;
                this.currentIndex -= 1;
                this.current = this.list[this.currentIndex];
            },
            toggleDetail: function () {
                console.info(`popup FileDetail: showDetail`);
                this.detailOn = !this.detailOn;
            },
            goto        : function (type, targetId) {
                console.info(`popup FileDetail: goto`);
                let query = {
                    directory: 0,
                    tag      : 0,
                    keyword  : '',
                };
                switch (type) {
                    //点文件夹，跳转文件夹
                    case 'directory':
                        query.directory = targetId;
                        break;
                    //tag 查询当前目录下的 tag
                    case 'tag':
                        query.directory = this.detail.id;
                        query.tag       = targetId;
                        break;
                    //search 查询当前目录下的 txt
                    case 'search':
                        query.directory = this.detail.id;
                        query.keyword   = this.searchTxt;
                        break;
                    //file 显示详情
                    case 'file':
                        return this.goDetail(targetId);
                        break;
                }
                let targetRoute = {path: '/', query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
            },
        },
    }
</script>
