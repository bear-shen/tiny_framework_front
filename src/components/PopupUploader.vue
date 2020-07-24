<template>
    <div class="uploader">
        <div
                :class="['dragWindow',{dragging:dragging}]"
                ref="dragWindow"
        >
            <ul class="dragList" ref="dragList">
                <li v-for="file in fileList" :class="[file.status]">
                    <p>{{file.name}}</p>
                    <p>{{file.size}}</p>
                    <p>{{file.status}}</p>
                    <div class="statusBar" :style="{width:`${file.process*100}%`}"></div>
                </li>
                <li>drag file/archive file here ...</li>
            </ul>
            <!--            <input class="dragInput" ref="dragInput">-->
        </div>
        <div class="btnList">
            <button type="button" class="btn btn-warning" v-on:click="cancel">close</button>
            <button type="button" class="btn btn-success" v-on:click="upload">upload</button>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .uploader {
        z-index: 2;
        position: relative;
        width: 50vw;
        height: 50vh;
        margin: 0 auto;
        background: rgba(100, 100, 100, 0.5);
        padding: 1vw;
        border-radius: 1vw;

        .dragWindow {
            height: calc(50vh - 2vw - #{$fontSize} * 2 - 10px);
            overflow-y: auto;

            .dragList {
                list-style: none;
                padding: 0;
                pointer-events: none;

                li {
                    line-height: $fontSize*2;
                    height: $fontSize*2;
                    padding: 0 10px;
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                }

                li:nth-child(2n) {
                    background: rgba(0, 0, 0, 0.5);
                }

                li:nth-child(2n - 1) {
                    background: rgba(0, 0, 0, 0.25);
                }

                p {
                    display: inline-block;
                    padding: 0;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    z-index: 2;
                }

                p:nth-child(1) {
                    min-width: 30vw;
                }

                p:nth-child(2),
                p:nth-child(3) {
                    width: 10vw;
                }

                .statusBar {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    height: 100%;
                    background: rgba(51, 122, 183, 0.25);
                }

                .failed .statusBar {
                    background: rgba(183, 51, 51, 0.25);
                }

            }

            &.dragging {
                background: rgba(255, 255, 255, 0.5);
            }
        }

        .btnList {
            display: flex;
            height: $fontSize*2;
            font-size: $fontSize;
            justify-content: flex-end;
            margin-top: 10px;

            button {
                line-height: $fontSize*2;
                height: $fontSize*2;
                padding: 0 10px;
                margin-left: 10px;
            }
        }
    }

</style>

<script>
    import config from '../config';
    import GenFuncLib from '../lib/GenFuncLib';

    /**
     * UploaderLib.js 里的分片功能正在考虑要不要去掉，想想都觉得烦。。。
     * 而且这么个功能本质上属于卵用没有，你又没做断点续传。。。
     * 但是做都做了。。。
     *
     * status:
     * uploaded  uploading  failed  waiting
     * */

    export default {
        name     : 'PopupUploader',
        props    : ['info'],
        data     : function () {
            let fileList = [
                {
                    name   : 'test.tst',
                    size   : '100 Kb',
                    bin    : false,
                    process: 1,
                    status : 'uploaded',
                },
                {
                    name   : 'test.tst',
                    size   : '100 Kb',
                    bin    : false,
                    process: 0.8,
                    status : 'uploading',
                },
                {
                    name   : 'test.tst',
                    size   : '100 Kb',
                    bin    : false,
                    process: 0.2,
                    status : 'failed',
                },
                {
                    name   : 'test.tst',
                    size   : '100 Kb',
                    bin    : false,
                    process: 0,
                    status : 'waiting',
                },
            ];
            let len      = fileList.length;
            for (let i = 0; i < len; i++) {
                fileList.push(fileList[i]);
                fileList.push(fileList[i]);
            }
            return {
                fileList        : fileList,
                dragging        : false,
                preventEventList: [
                    'drag',
                    'dragleave',
                    'dragenter',
                    'dragover',
                    'drop',
                ],
            };
        },
        created  : function () {
            console.info(`popup uploader: created`);
            console.info(this.$refs);
        },
        destroyed: function () {
            console.info(`popup uploader: destroyed`);
            this.removePrevent();
        },
        mounted  : function () {
            console.info(`popup uploader: mounted`);
            this.callPrevent();
            console.info(this.$refs);
            this.$refs.dragWindow.addEventListener('dragenter', this.onDragEnter);
            this.$refs.dragWindow.addEventListener('dragleave', this.onDragLeave);
            this.$refs.dragWindow.addEventListener('drop', this.onDragDrop);
            this.$refs.dragWindow.addEventListener('paste', this.onDragPaste);
        },
        methods  : {
            cancel       : function () {
                console.info(`popup uploader: cancel`);
                this.$parent.hide();
            },
            upload       : function () {
                console.info(`popup uploader: upload`);
                for (let i1 = 0; i1 < this.fileList.length; i1++) {

                }
            },
            //
            onDragEnter  : function (e) {
                console.info(`popup uploader: onDragEnter`);
                this.dragging = true;
            },
            onDragLeave  : function (e) {
                console.info(`popup uploader: onDragLeave`);
                this.dragging = false;
            },
            onDragDrop   : function (e) {
                console.info(`popup uploader: onDragDrop`);
                this.dragging = false;
                console.info(e);
                let fileList = e.dataTransfer.files;
                for (let i1 = 0; i1 < fileList.length; i1++) {
                    console.info(fileList[i1]);
                    this.fileList.push(
                        {
                            name   : fileList[i1].name,
                            size   : GenFuncLib.kmgt(fileList[i1].size,2),
                            bin    : fileList[i1],
                            process: 0,
                            status : 'waiting',
                        });
                }
            },
            onDragPaste  : function (e) {
                console.info(`popup uploader: onDragPaste`);
            },
            //
            preventEvent : function (e) {
                e.preventDefault();
                e.stopPropagation();
            },
            callPrevent  : function () {
                // console.info(this);
                // console.info(this.preventEventList);
                for (let ia = 0; ia < this.preventEventList.length; ia++) {
                    console.debug('set prevent event:' + this.preventEventList[ia]);
                    document.addEventListener(this.preventEventList[ia], this.preventEvent)
                }
            },
            removePrevent: function () {
                for (let ia = 0; ia < this.preventEventList.length; ia++) {
                    console.debug('cls prevent event:' + this.preventEventList[ia]);
                    document.removeEventListener(
                        this.preventEventList[ia], this.preventEvent)
                }
            },
        },
    }
</script>
