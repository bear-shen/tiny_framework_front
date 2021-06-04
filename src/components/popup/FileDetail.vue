<template>
    <div class="fileDetail">
        <div :class="['content',
        {showDetail:detailOn},
        {noDetail:!detailOn},
        current.tag&&current.tag.length?'hasTag':'noTag',
        ]">
            <div class="contentBody" v-on:click="toggleDetail">
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
                    <video v-if="current.alpha" :src="current.normal" controls :poster="current.alpha"></video>
                    <video v-else :src="current.normal" controls></video>
                </template>
                <template v-else-if="current.type==='audio'">
                    <img v-if="current.alpha" class="ct_cover" :src="current.alpha" :alt="current.title">
                    <audio :src="current.normal" controls></audio>
                </template>
            </div>
            <div class="contentDetail">
                <div class="contentCover" v-on:click="toggleDetail">
                    <span v-if="!current.cover" :class="['ct_icon','listIcon','listIcon_file_'+current.type]"></span>
                    <img v-if="current.cover" class="ct_cover" :src="current.cover" :alt="current.name">
                </div>
                <div class="contentMain">
                    <div class="contentTxt">
                        <div class="contentIndex">
                            {{ currentIndex + 1 }} / {{ list.length }}
                        </div>
                        <div class="contentTitle" v-on:click="toggleDetail">{{ current.name }}</div>
                    </div>
                    <div class="contentDescription">{{ current.description }}</div>
                    <div class="contentMeta">
                        <div class="contentTimeCreate">{{ current.time_create }}</div>
                        <div class="contentTimeUpdate">{{ current.time_update }}</div>
                    </div>
                    <div class="contentMeta">
                        <div class="contentHash">{{ current.hash }}</div>
                        <div class="contentSize">{{ current.size }}</div>
                    </div>
                    <div class="contentMeta">
                        <div class="contenDownload"><a :href="current.raw">download</a></div>
                    </div>
                    <div class="contentTags">
                        <dl v-for="group in current.tag" :data-id="group.id">
                            <dt>{{ group.name }}:</dt>
                            <dd
                                v-for="tag in group.sub"
                                :data-id="tag.id"
                                class="btn btn-dark"
                                v-on:click.stop="goto('tag',tag.id)"
                            >
                                {{ tag.name }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <!--        <template v-if="!loading">-->
        <div class="naviBtn naviLeft" v-on:click="prev">
            <span class="sysIcon sysIcon_arrowleft"></span>
        </div>
        <div class="naviBtn naviRight" v-on:click="next">
            <span class="sysIcon sysIcon_arrowright"></span>
        </div>
        <!--        </template>-->
        <!--<template v-else>
            <div class="naviBtn naviLeft">
                <span class="sysIcon sysIcon_sync"></span>
            </div>
            <div class="naviBtn naviRight">
                <span class="sysIcon sysIcon_sync"></span>
            </div>
        </template>-->
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
        color: white;
        //text-shadow: black 0 0 5px;
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
            padding: $fontSize;
            > * {
                max-width: 100%;
                //max-height: calc(100vh - #{$footerHeight} * 3 - 40px);
                max-height: 100%;
                //
                display: block;
                text-align: center;
            }
            > audio {
                position: relative;
                bottom: $fontSize*4;
                height: $fontSize*2;
            }
            > textarea {
                width: 90%;
                height: 90%;
                text-align: left;
                @include smallScroll;
            }
        }
    }
    .content.noDetail {
        .contentBody {
            text-align: center;
            padding: $fontSize;
            height: calc(100vh - #{$footerHeight*2} - #{$fontSize*2});
            > .ct_icon {
                //font-size: calc((100vh - #{$footerHeight} * 3 - 40px) * 0.5);
                font-size: $footerHeight;
            }
        }
        .contentDetail {
            height: $footerHeight;
            .contentCover {
                display: none;
            }
            .contentMain {
                .contentTxt {
                    display: flex;
                    justify-content: space-around;
                    div {
                        padding-right: $fontSize*1.25;
                        padding-left: $fontSize*1.25;
                        line-height: $footerHeight;
                        font-size: $fontSize;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: 60vw;
                    }
                }
                .contentDescription, .contentMeta, .contentTags {
                    display: none;
                }
            }
        }
    }
    $hasTagHeight: 60vh;
    $noTagHeight: 80vh;
    .content.showDetail.hasTag {
        .contentBody {
            height: $hasTagHeight;
        }
        .contentDetail {
            height: calc(100vh - #{$footerHeight} - #{$hasTagHeight} - #{$fontSize*2});
        }
    }
    .content.showDetail.noTag {
        .contentBody {
            height: $noTagHeight;
        }
        .contentDetail {
            height: calc(100vh - #{$footerHeight} - #{$noTagHeight} - #{$fontSize*2});
        }
    }
    .content.showDetail {
        .contentBody {
            > .ct_icon {
                font-size: calc(#{$hasTagHeight} * 0.5);
            }
        }
        .contentDetail {
            overflow-y: auto;
            display: flex;
            > div {
                padding: 0 $fontSize*0.5;
            }
            .contentCover {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                align-content: center;
                line-height: 100px;
                width: 100px;
                height: 100px;
                text-align: center;
                > img {
                    max-width: 100%;
                    max-height: 100%;
                }
                > span {
                    font-size: 80px;
                }
            }
            .contentMain {
                display: flex;
                flex-direction: column;
                line-height: $fontSize*1.25;
                width: 100%;
                .contentTxt {
                    display: flex;
                    justify-content: space-between;
                    div {
                        padding-right: $fontSize*1.25;
                        padding-left: $fontSize*1.25;
                        font-size: $fontSize;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: 60vw;
                    }
                }
                .contentDescription, .contentMeta, .contentTags {
                    //display: none;
                }
                .contentMeta {
                    display: flex;
                    justify-content: space-between;
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
                        //margin-bottom: 5px;
                        line-height: $fontSize;
                    }
                    dd {
                        display: inline-block;
                        position: relative;
                        //padding: 3px 5px;
                        margin-left: $fontSize*0.25;
                        margin-top: $fontSize*0.25;
                    }
                }
            }
            @include smallScroll;
        }
    }
}
</style>

<script>
import GenFuncLib from "../../lib/GenFuncLib";
import Helper     from "../../lib/Helper";
import router     from "../../router";

/**
 * 文件详细页
 * 已知两个问题，
 * 历史版本不知道摆哪
 * 文本文件的详情还没有优化，最好做成ajax的，否则数组太大，而且格式没有测
 *
 * 这边暂且做成通过给查询增加某个参数后自行获取所有的文件信息，回传估计会很大但是总之没什么办法
 * 然后因为popup是单层的也不好做加载进度，得看看要不要自己实现一个
 * */
export default {
    name     : 'PopupFileDetail',
    props    : ['info'],
    data     : function () {
        return {
            detailOn: false,
            // loading     : false,
            //
            currentIndex: 0,
            current     : {},
            list        : [],
            //
            query    : false,
            queryData: {},
            gotoCall : false,
        };
    },
    created  : function () {
        console.info(`popup FileDetail: created`);
        let info          = Object.assign(
            {
                currentId: 0,
                query    : false,
                queryData: {},
                goto     : false,
            }, GenFuncLib.copyObject(this.info));
        this.currentIndex = 0;
        this.query        = info.query;
        this.gotoCall     = info.goto;
        this.queryData    = Object.assign(GenFuncLib.copyObject(info.queryData), {all_file: 1});
        //
        this.query(this.queryData, 1).then((resolveData) => {
            this.fillData(resolveData);
            for (let i1 = 0; i1 < this.list.length; i1++) {
                if (this.list[i1].id != info.currentId) continue;
                this.currentIndex = i1;
                this.current      = this.list[i1];
                break;
            }
        });
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
            // this.loading = true;
            console.info(`popup FileDetail: next`);
            if (this.currentIndex >= this.list.length - 1) return;
            this.currentIndex += 1;
            this.current = this.list[this.currentIndex];
            // this.loading = false;
            console.info(`popup FileDetail: next: success`);
            return true;
        },
        prev        : function () {
            // this.loading = true;
            console.info(`popup FileDetail: prev`);
            // console.debug(this.page);
            if (this.currentIndex <= 0) return;
            this.currentIndex -= 1;
            this.current = this.list[this.currentIndex];
            // this.loading = false;
            console.info(`popup FileDetail: prev: success`);
            return true;
        },
        fillData    : function (resolveData, direction) {
            console.info('popup FileDetail: fillData');
            this.list = resolveData.list;
        },
        toggleDetail: function () {
            console.info(`popup FileDetail: showDetail`);
            this.detailOn = !this.detailOn;
        },
        goto        : function (type, targetId) {
            console.info(`popup FileDetail: goto`);
            console.info(this.gotoCall);
            if (!this.gotoCall) return;
            this.gotoCall(type, targetId);
            this.close();
        },
    },
}
</script>
