<template>
    <div class="uploader">
        <div
                :class="['dragWindow',{dragging:dragging}]"
                ref="dragWindow"
        >

            <ul class="dragList" ref="dragList">
                <li v-for="(file,i) in fileList" :class="[file.status]">
                    <p>{{file.name}}</p>
                    <p>{{file.size}}</p>
                    <p>{{file.status}}</p>
                    <div class="statusBar" :style="{width:`${file.process*100}%`}"></div>
                    <template v-if="file.status==='waiting'">
                        <div v-on:click="delFile(i)" class="delBtn">[x]</div>
                    </template>
                </li>
                <li><label>drag file/archive here or click ...<input type="file" multiple ref="dragInput"></label></li>
            </ul>

            <!--            <input class="dragInput" ref="dragInput">-->
        </div>
        <div class="btnList">
            <button type="button" class="btn btn-warning" v-on:click="cancel">close</button>
            <button type="button" :class="['btn','btn-success',{disabled:uploading}]" v-on:click="upload">upload</button>
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
                /*pointer-events: none;*/

                li {
                    line-height: $fontSize*2;
                    height: $fontSize*2;
                    padding: 0 10px;
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                }

                input {
                    display: none;
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

            label {
                font-weight: normal;
                margin-bottom: 0;
                width: 100%;
                height: 100%;
            }

            &.dragging {
                background: rgba(255, 255, 255, 0.5);
            }

            .delBtn {
                pointer-events: all;
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
    import config     from '../config';
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
                uploading       : false,
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
            this.$refs.dragInput.addEventListener('change', this.onInputChange);
        },
        methods  : {
            cancel       : function () {
                console.info(`popup uploader: cancel`);
                this.$parent.hide();
            },
            /**
             * @todo api
             * */
            upload       : function () {
                console.info(`popup uploader: upload`);
                if (this.uploading) return;
                console.info(this.info.data);
                this.uploading  = true;
                let hasUploader = false;
                for (let i1 = 0; i1 < this.fileList.length; i1++) {
                    if (this.fileList[i1].status !== 'waiting') continue;
                    hasUploader = true;
                }
                if (!hasUploader) {
                    this.uploading = false;
                }
            },
            //
            onDragEnter  : function (e) {
                console.info(`popup uploader: onDragEnter`);
                this.dragging = true;
            },
            onDragLeave  : function (e) {
                console.info(`popup uploader: onDragLeave`);
                //path中含有dragWindow，不拖拽
                for (let i1 = 0; i1 < e.path.length; i1++) {
                    if (e.path[i1].className.indexOf('dragWindow') === -1) continue;
                    return;
                }
                this.dragging = false;
            },
            onDragDrop   : function (e) {
                console.info(`popup uploader: onDragDrop`);
                this.dragging = false;
                console.info(e);
                let fileList = e.dataTransfer.files;
                for (let i1 = 0; i1 < fileList.length; i1++) {
                    this.addFile(fileList[i1]);
                }
            },
            onDragPaste  : function (e) {
                console.info(`popup uploader: onDragPaste`);
            },
            onInputChange: function (e) {
                console.info(`popup uploader: onInputChange`);
                let fileList = e.target.files;
                for (let i1 = 0; i1 < fileList.length; i1++) {
                    this.addFile(fileList[i1]);
                }
            },
            //
            delFile      : function (index) {
                console.info(`popup uploader: delFile ${index}`);
                this.fileList.splice(index, 1);
            },
            addFile      : function (file) {
                console.info(`popup uploader: addFile`);
                console.info(file);
                this.checkFile(file).then(() => {
                    this.fileList.push(
                        {
                            name   : file.name,
                            size   : GenFuncLib.kmgt(file.size, 2),
                            bin    : file,
                            process: 0,
                            status : 'waiting',
                        });
                }).catch((msg) => {
                    console.warn(msg);
                });
            },
            checkFile    : function (file) {
                /**
                 * @see https://segmentfault.com/a/1190000013298317
                 * 仅支持文件上传，文件夹上传没支持
                 * */
                return new Promise(
                    (resolve, reject) => {
                        // console.info(file);
                        if (file.type) { return resolve();}
                        if (!file.size) { return reject('checkFile: empty file not allowed'); }
                        try {
                            let fileReader = new FileReader();
                            fileReader.addEventListener('load', function (e) {
                                resolve();
                            }, false);

                            fileReader.addEventListener('error', function (e) {
                                reject('checkFile: file unreadable');
                            }, false);
                            fileReader.readAsDataURL(file.slice(0, 16));
                        } catch (e) {
                            return reject(`checkFile: error:${e.toString()}`);
                        }
                    }
                );
            },
            //
            preventEvent : function (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            ,
            callPrevent  : function () {
                // console.info(this);
                // console.info(this.preventEventList);
                for (let ia = 0; ia < this.preventEventList.length; ia++) {
                    console.debug('set prevent event:' + this.preventEventList[ia]);
                    document.addEventListener(this.preventEventList[ia], this.preventEvent)
                }
            }
            ,
            removePrevent: function () {
                for (let ia = 0; ia < this.preventEventList.length; ia++) {
                    console.debug('cls prevent event:' + this.preventEventList[ia]);
                    document.removeEventListener(
                        this.preventEventList[ia], this.preventEvent)
                }
            }
            ,
        },
    }
</script>
