<template>
    <div class="uploader">
        <div
            :class="['dragWindow',{dragging:dragging}]"
            ref="dragWindow"
        >

            <ul class="dragList" ref="dragList">
                <li v-for="(file,i) in fileList" :class="[file.status]">
                    <p>{{ file.name }}</p>
                    <p>{{ file.size }}</p>
                    <p>{{ file.status }}</p>
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
            <button type="button" :class="['btn','btn-success',{disabled:uploading}]" v-on:click="upload">{{ uploading ? 'uploading' : 'upload' }}</button>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#popup .uploader {
    z-index: 2;
    position: relative;
    width: 50vw;
    height: 50vh;
    margin: 0 auto;
    background: rgba(100, 100, 100, 0.5);
    padding: $fontSize;
    .dragWindow {
        height: calc(50vh - #{$fontSize} * 2);
        overflow-y: auto;
        @include smallScroll;
        .dragList {
            list-style: none;
            padding: 0;
            pointer-events: none;
            li {
                line-height: $fontSize*2;
                height: $fontSize*2;
                padding: 0 $fontSize*0.5;
                display: flex;
                justify-content: space-between;
                position: relative;
            }
            input {
                display: none;
            }
            li:nth-child(2n - 1) {
                background: map_get($colors, popup_bk_2);
            }
            li:last-child {
                pointer-events: all;
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
                min-width: 50%;
            }
            p:nth-child(2),
            p:nth-child(3) {
                width: 20%;
            }
            .statusBar {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
                height: 100%;
                background: map_get($colors, positive);
            }
            .failed .statusBar {
                background: map_get($colors, negative);
            }
        }
        label {
            font-weight: normal;
            margin-bottom: 0;
            width: 100%;
            height: 100%;
        }
        &.dragging {
            background: map_get($colors, popup_bk_active);
        }
        .delBtn {
            pointer-events: all;
        }
    }
    .btnList {
        /*display: flex;*/
        height: $fontSize*2;
        font-size: $fontSize;
        /*justify-content: flex-end;*/
        margin-top: $fontSize*0.5;
        text-align: right;
        button {
            line-height: $fontSize*2;
            height: $fontSize*2;
            padding: 0 $fontSize;
            margin-left: $fontSize*0.5;
        }
    }
}

</style>

<script>
import config     from '../../config';
import GenFuncLib from '../../lib/GenFuncLib';
import helper     from "../../lib/Helper";

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
            /*{
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
             },*/
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
    updated  : function () {
        this.$refs.dragWindow.scrollTop =
            this.$refs.dragWindow.scrollHeight - this.$refs.dragWindow.clientHeight;
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
        /*this.$refs.dragList.addEventListener('dragenter', (e)=>{
         e.stopPropagation();
         e.preventDefault();
         });
         this.$refs.dragList.addEventListener('dragleave', (e)=>{
         e.stopPropagation();
         e.preventDefault();
         });
         this.$refs.dragList.addEventListener('drop', (e)=>{
         e.stopPropagation();
         e.preventDefault();
         });
         this.$refs.dragList.addEventListener('paste', (e)=>{
         e.stopPropagation();
         e.preventDefault();
         });*/
    },
    methods  : {
        cancel: function () {
            console.info(`popup uploader: cancel`);
            this.$parent.hide();
        },
        /**
         * @todo api file_upload
         * */
        upload       : async function () {
            console.info(`popup uploader: upload`);
            /* dev
             if (this.uploading) return;
             console.info(this.info);
             console.info(this.fileList);
             this.uploading  = true;
             let hasUploader = false;*/
            let hasUploader = false;
            //
            for (let i1 = 0; i1 < this.fileList.length; i1++) {
                if (this.fileList[i1].status !== 'uploading') continue;
                hasUploader = true;
            }
            if (hasUploader) return;
            this.uploading = true;
            for (let i1 = 0; i1 < this.fileList.length; i1++) {
                if (this.fileList[i1].status !== "waiting") continue;
                console.info(this.info)
                console.info(this.fileList[i1])
                await this.uploadProcess(this.info.dir_id, this.fileList[i1]);
            }
            this.uploading = false;
        },
        uploadProcess: function (dirId, file) {
            return new Promise(
                (resolve, reject) => {
                    file.status = "uploading"
                    helper.query(
                        'file_upload',
                        {
                            dir : dirId,
                            file: file.bin,
                        },
                        {
                            progress: (e) => {
                                // console.info(e)
                                this.fileList.splice(0, 0)
                                if (!e.lengthComputable) return;
                                file.process = e.loaded / e.total
                                console.info(file.process)
                            }
                        }
                    ).then((data) => {
                        console.warn(data);
                        file.status = "uploaded"
                        return resolve();
                    }).catch((e) => {
                        console.warn(e);
                        file.status = "failed"
                        return resolve();
                    });
                }
            )
        },
        //
        onDragEnter  : function (e) {
            console.info(`popup uploader: onDragEnter`);
            console.info(e);
            this.dragging = true;
        },
        onDragLeave  : function (e) {
            console.info(`popup uploader: onDragLeave`);
            console.info(e);
            this.dragging = false;
        },
        onDragDrop   : function (e) {
            console.info(`popup uploader: onDragDrop`);
            console.info(e);
            this.dragging = false;
            let fileList  = e.dataTransfer.files;
            for (let i1 = 0; i1 < fileList.length; i1++) {
                this.addFile(fileList[i1]);
            }
        },
        onDragPaste  : function (e) {
            console.info(`popup uploader: onDragPaste`);
            console.info(e);
        },
        onInputChange: function (e) {
            console.info(`popup uploader: onInputChange`);
            let fileList = e.target.files;
            for (let i1 = 0; i1 < fileList.length; i1++) {
                this.addFile(fileList[i1]);
            }
        },
        //
        delFile  : function (index) {
            console.info(`popup uploader: delFile ${index}`);
            this.fileList.splice(index, 1);
        },
        addFile  : function (file) {
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
        checkFile: function (file) {
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
        preventEvent: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        ,
        callPrevent: function () {
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
