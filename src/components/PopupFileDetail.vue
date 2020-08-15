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
            <div class="contentDetail">
                <div class="contentMain">
                    <div class="contentIndex">
                        {{currentIndex+1}} / {{list.length}}
                    </div>
                    <div class="contentCover" v-on:click="toggleDetail">
                        <span v-if="!current.cover" :class="['ct_icon','listIcon','listIcon_file_'+current.type]"></span>
                        <img v-if="current.cover" class="ct_cover" :src="current.cover" :alt="current.title">
                    </div>
                    <div class="contentTxt">
                        <div class="contentTitle" v-on:click="toggleDetail">{{current.title}}</div>
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
                                v-on:click.stop="goto('tag',tag.id)"
                        >
                            {{tag.name}}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        <template v-if="!loading">
            <div class="naviBtn naviLeft" v-on:click="prev">
                <span class="sysIcon sysIcon_arrowleft"></span>
            </div>
            <div class="naviBtn naviRight" v-on:click="next">
                <span class="sysIcon sysIcon_arrowright"></span>
            </div>
        </template>
        <template v-else>
            <div class="naviBtn naviLeft">
                <span class="sysIcon sysIcon_sync"></span>
            </div>
            <div class="naviBtn naviRight">
                <span class="sysIcon sysIcon_sync"></span>
            </div>
        </template>
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
                padding: 20px;

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
                    @include smallScroll;
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
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        max-width: 60vw;
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
                padding-bottom: $footerHeight;

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
                        margin-left: 20px;
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

                @include smallScroll;
            }
        }
    }
</style>

<script>
    import Helper     from "../lib/Helper";
    import router     from "../router";

    /**
     * 文件详细页
     * 已知两个问题，
     * 历史版本不知道摆哪
     * 文件计数的体验不大好，要做好需要传文件夹的文件总数和对应位置然后想怎么处理文件数组
     * */

    export default {
        name     : 'PopupFileDetail',
        props    : ['info'],
        data     : function () {
            return {
                detailOn    : false,
                loading     : false,
                //
                currentIndex: 0,
                current     : {},
                list        : [],
                //
                query       : false,
                param       : {},
                page        : 1,
            };
        },
        created  : function () {
            console.info(`popup FileDetail: created`);
            console.info(this.info.list)
            let info = {};
            Object.assign(info, {
                list   : [],
                current: 0,
                query  : false,
                param  : {},
                page   : 1,
            });
            Object.assign(info, this.info);
            console.debug(info.list);
            let current = info.list[info.current];
            if (!info.list[info.current]) current = info.list[0];
            //
            this.current      = current;
            this.currentIndex = info.current;
            this.list         = info.list;
            //
            this.query        = info.query;
            this.param        = info.param;
            this.page         = info.page;
            console.info(info.list);
            console.info(current);
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
                this.loading = true;
                console.info(`popup FileDetail: next`);
                if (this.list.length - 1 <= this.currentIndex) {
                    if (!this.query) {
                        console.info(`popup FileDetail: next: query not defined`);
                        this.loading = false;
                        return false;
                    }
                    //查询后写入下一组
                    this.query(this.param, this.page + 1).then((resolveData) => {
                        this.fillParam(resolveData.param);
                        for (let i1 = 0; i1 < resolveData.list.length; i1++) {
                            this.list.push(resolveData.list[i1]);
                        }
                        if (this.list.length - 1 <= this.currentIndex) {
                            this.loading = false;
                            console.info(`popup FileDetail: next: query success, but nothing`);
                            return false;
                        }
                        this.currentIndex += 1;
                        this.current = this.list[this.currentIndex];
                        this.loading = false;
                        console.info(`popup FileDetail: next: query success, go next`);
                        return true;
                    });
                    console.info(`popup FileDetail: next: querying`);
                    return true;
                }
                this.currentIndex += 1;
                this.current = this.list[this.currentIndex];
                this.loading = false;
                console.info(`popup FileDetail: next: success`);
                return true;
            },
            prev        : function () {
                this.loading = true;
                console.info(`popup FileDetail: prev`);
                console.debug(this.page);
                if (this.currentIndex <= 0) {
                    if (!this.query || this.page <= 1) {
                        console.info(`popup FileDetail: prev: query not defined or no pages`);
                        this.loading = false;
                        return false;
                    }
                    //查询后写入下一组
                    this.query(this.param, this.page - 1).then((resolveData) => {
                        this.fillParam(resolveData.param);
                        for (let i1 = resolveData.list.length - 1; i1 >= 0; i1--) {
                            this.list.unshift(resolveData.list[i1]);
                            this.currentIndex += 1;
                        }
                        if (this.currentIndex <= 0) {
                            this.loading = false;
                            console.info(`popup FileDetail: prev: query success, but nothing`);
                            return false;
                        }
                        this.currentIndex -= 1;
                        this.current = this.list[this.currentIndex];
                        this.loading = false;
                        console.info(`popup FileDetail: prev: query success, go prev`);
                        return true;
                    });
                    console.info(`popup FileDetail: prev: querying`);
                    return true;
                }
                this.currentIndex -= 1;
                this.current = this.list[this.currentIndex];
                this.loading = false;
                console.info(`popup FileDetail: prev: success`);
                return true;
            },
            /**
             * 写入参数
             * */
            fillParam   : function (param) {
                console.info('popup FileDetail: fillParam');
                // console.warn(param);
                for (let key in param) {
                    if (!param.hasOwnProperty(key)) continue;
                    if (key === 'page') {
                        this.page = param[key];
                        continue;
                    }
                    this.param[key] = param[key];
                }
            },
            fillData    : function (resolveData) {
                console.info('popup FileDetail: fillData');
                this.list = resolveData.list;
                this.fillParam(resolveData.param);
            },
            toggleDetail: function () {
                console.info(`popup FileDetail: showDetail`);
                this.detailOn = !this.detailOn;
            },
            goto        : function (type, targetId) {
                console.info(`popup FileDetail: goto`);
                let query = {
                    from   : 0,
                    tag    : 0,
                    keyword: '',
                };
                switch (type) {
                    //tag 查询当前目录下的 tag
                    case 'tag':
                        query.from = this.current.id;
                        query.tag  = targetId;
                        break;
                }
                let targetRoute = {path: '/', query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
                this.close();
            },
        },
    }
</script>
