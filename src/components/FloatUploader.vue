<template>
    <div :class="['float_uploader',{open:open}]">
        <div v-on:click="toggle" class="toggleWindow">
            <span class="sysIcon sysIcon_addfile"></span>
            &emsp;
            toggle upload window
        </div>
        <div
            :class="['dragWindow',{dragging:dragging},]"
            ref="dragWindow"
        >
            <!--这边用table排版不会排。。。先这样吧-->
            <ul class="dragList" ref="dragList">
                <li v-for="(file,i) in fileList" :class="[file.status]">
                    <p>{{ file.name }}</p>
                    <p>{{ file.size }}</p>
                    <p v-if="file.status =='uploading'">{{ file.speed }}</p>
                    <p v-else-if="file.status==='waiting'" v-on:click="delFile(i)" class="delBtn">[x]</p>
                    <p v-else>{{ file.status }}</p>
                    <div class="statusBar" :style="{width:`${file.process*100}%`}"></div>
                </li>
                <li>
                    <label>drag file/archive here or click ...<input type="file" multiple ref="dragInput"></label>
                    <!--                    <button>upload</button>-->
                </li>
            </ul>

            <!--            <input class="dragInput" ref="dragInput">-->
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.float_uploader {
    z-index: 2;
    position: fixed;
    width: 25vw;
    min-width: $fontSize*25;
    margin: 0 auto;
    background: map-get($colors, nav_bk);
    padding: 0 $fontSize 0;
    bottom: $footerHeight;
    right: 0;
    .toggleWindow {
        height: $fontSize*2;
        line-height: $fontSize*2;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .dragWindow {
        display: none;
        height: 0;
    }
}
@media (max-width: $tabletWidth) {
    .float_uploader {
        width: calc(100vw - #{$fontSize} * 2);
        min-width: auto;
    }
}
@media (max-width: $mobileWidth) {
    .float_uploader {
    }
}
.float_uploader.open {
    .dragWindow {
        display: block;
        overflow-y: auto;
        height: 50vh;
        @include smallScroll;
        input {
            display: none;
        }
        label {
            font-weight: normal;
            margin-bottom: 0;
            width: 100%;
            height: 100%;
        }
        &.dragging {
            background: map-get($colors, nav_active);
        }
        .delBtn {
            pointer-events: all;
        }
    }
}
.dragList {
    list-style: none;
    padding: 0;
    pointer-events: none;
    overflow-x: hidden;
    li {
        line-height: $fontSize*2;
        height: $fontSize*2;
        padding: 0 $fontSize*0.5;
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    li:nth-child(2n - 1) {
        background: map-get($colors, nav_active);
    }
    li:first-child, li:last-child {
        pointer-events: all;
    }
    p {
        display: inline-block;
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
        min-width: $fontSize*5;
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


</style>

<script>
import config     from '../config';
import GenFuncLib from '../lib/GenFuncLib';
import helper     from "../lib/Helper";
import GenFunc    from "../lib/GenFuncLib";

/**
 * UploaderLib.js 里的分片功能正在考虑要不要去掉，想想都觉得烦。。。
 * 而且这么个功能本质上属于卵用没有，你又没做断点续传。。。
 * 但是做都做了。。。
 *
 * status:
 * uploaded  uploading  failed  waiting
 * */

export default {
    name     : 'FloatUploader',
    props    : ['dirId'],
    data     : function () {
        let fileList = [
            /*{
             name   : 'test.tst',
             size   : '100 Kb',
             token   : 'qweqweqweqw',
             bin    : false,
             process: 1,
             status : 'uploaded',
             },
             {
             name   : 'test.tst',
             size   : '100 Kb',
             token   : 'qweqweqweqw',
             bin    : false,
             process: 0.8,
             status : 'uploading',
             },
             {
             name   : 'test.tst',
             size   : '100 Kb',
             token   : 'qweqweqweqw',
             bin    : false,
             process: 0.2,
             status : 'failed',
             },
             {
             name   : 'test.tst',
             size   : '100 Kb',
             token   : 'qweqweqweqw',
             bin    : false,
             process: 0,
             status : 'waiting',
             },*/
        ];

        return {
            fileList        : [],
            open            : false,
            dragging        : false,
            queueSize       : 5,
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
        console.info(`float uploader: created`);
        console.info(this.$refs);
    },
    destroyed: function () {
        console.info(`float uploader: destroyed`);
        this.removePrevent();
    },
    updated  : function () {
        // this.$refs.dragWindow.scrollTop =
        //     this.$refs.dragWindow.scrollHeight - this.$refs.dragWindow.clientHeight;
    },
    mounted  : function () {
        console.info(`float uploader: mounted`);
        this.callPrevent();
        console.info(this.$refs);
        this.$refs.dragWindow.addEventListener('dragenter', this.onDragEnter);
        this.$refs.dragWindow.addEventListener('dragleave', this.onDragLeave);
        this.$refs.dragWindow.addEventListener('drop', this.onDragDrop);
        this.$refs.dragWindow.addEventListener('paste', this.onDragPaste);
        this.$refs.dragInput.addEventListener('change', this.onInputChange);
        /*this.$refs.dragList.addEventListener('dragenter', (e)=>{
         e.stopPropagation();0
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
        cancel       : function () {
            console.info(`float uploader: cancel`);
            this.$parent.hide();
        },
        queueAvail   : function () {
            // console.info(`check queue`);
            let inQueue = 0;
            for (let i1 = 0; i1 < this.fileList.length; i1++) {
                if (this.fileList[i1].status == 'uploading') inQueue += 1;
            }
            // console.info('queue:', inQueue);
            return inQueue < this.queueSize;
        },
        nextQueue    : function () {
            for (let i1 = 0; i1 < this.fileList.length; i1++) {
                if (this.fileList[i1].status != 'waiting') continue;
                this.uploadPartial(this.dirId, this.fileList[i1]);
                break;
            }
        },
        uploadPartial: async function (dirId, file) {
            if (!this.queueAvail()) {
                return;
            }
            // console.warn('set uploading');
            file.status     = "uploading"
            file.processT   = new Date();
            let chunkLength = 25 * 1000 * 1000;
            let mark        = {part: '___PART___', end: '___END____',};
            let chunkSize   = Math.ceil(file.bin.size / chunkLength);
            let processed   = 0;
            let total       = file.bin.size;

            //
            for (let i1 = 0; i1 < chunkSize; i1++) {
                let subBlob = file.bin.slice(i1 * chunkLength, (i1 + 1) * chunkLength);
                // console.info(subBlob);
                // continue;
                let isLast   = i1 === (chunkSize - 1);
                let subFile  = new File([subBlob], `${file.name}${isLast ? mark.end : mark.part}`);
                //
                let formData = new FormData();
                formData.append('token', file.token);
                formData.append('dir', dirId);
                formData.append('file', subFile);
                // console.info(file, subBlob, subFile, subFile.name, subFile.size, i1 * chunkLength, chunkLength);
                // continue;
                //
                try {
                    await helper.query(
                        'file_upload_partial',
                        formData,
                        {
                            progress: (e) => {
                                if (!e.lengthComputable) return;
                                // console.info(file.process, processed, e.loaded, total, subFile.size);
                                let processT  = new Date();
                                let processD  = processed + e.loaded;
                                file.process  = processD / total;
                                file.speed    = GenFunc.kmgt(
                                    (processD - file.processD) / (processT - file.processT) * 1000,
                                    2
                                ) + '/s';
                                file.processT = processT;
                                file.processD = processD;
                                // console.info(e)
                                // let beforeScroll = this.$refs.dragWindow.scrollTop;
                                this.fileList.splice(0, 0);
                                // this.$refs.dragWindow.scrollTop = beforeScroll;
                            }
                        }
                    );
                } catch (e) {
                    file.status = "failed"
                    break;
                }
                processed += subFile.size;
            }
            file.status = "uploaded"
            this.nextQueue();
        },
        uploadProcess: function (dirId, file) {
            return new Promise(
                (resolve, reject) => {
                    let formData = new FormData();
                    formData.append('dir', dirId);
                    formData.append('file', file.bin);
                    file.status = "uploading"
                    helper.query(
                        'file_upload',
                        formData,
                        {
                            progress: (e) => {
                                if (!e.lengthComputable) return;
                                file.process = e.loaded / e.total;
                                console.info(file.process)
                                // console.info(e)
                                this.fileList.splice(0, 0)
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
            console.info(`float uploader: onDragEnter`);
            console.info(e);
            this.dragging = true;
        },
        onDragLeave  : function (e) {
            console.info(`float uploader: onDragLeave`);
            console.info(e);
            this.dragging = false;
        },
        onDragDrop   : async function (e) {
            console.info(`float uploader: onDragDrop`);
            console.info(e);
            this.dragging = false;
            let fileList  = e.dataTransfer.files;
            for (let i1 = 0; i1 < fileList.length; i1++) {
                await this.addFile(fileList[i1]);
            }
        },
        onDragPaste  : function (e) {
            console.info(`float uploader: onDragPaste`);
            console.info(e);
        },
        onInputChange: async function (e) {
            console.info(`float uploader: onInputChange`);
            let fileList = e.target.files;
            for (let i1 = 0; i1 < fileList.length; i1++) {
                await this.addFile(fileList[i1]);
            }
        },
        //
        delFile  : function (index) {
            console.info(`float uploader: delFile ${index}`);
            this.fileList.splice(index, 1);
        },
        addFile  : async function (file) {
            console.info(`float uploader: addFile`);
            try {
                await this.checkFile(file);
                let fileInfo = {
                    name    : file.name,
                    size    : GenFuncLib.kmgt(file.size, 2),
                    token   : GenFunc.randStr(32),
                    bin     : file,
                    process : 0,
                    status  : 'waiting',
                    processT: 0,
                    processD: 0,
                    speed   : '0 K/s',
                };
                console.info(fileInfo);
                this.fileList.push(fileInfo);
                //这边不加await，调用之后函数内自行执行下一个
                this.uploadPartial(this.dirId, fileInfo);
            } catch (e) {
                console.warn(e);
            }
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
        toggle       : function () {
            console.info('toggle');
            this.open = !this.open;
        }
    },
}
</script>
