<template>
    <div class="uploader">
        <div class="dragWindow" ref="dragWindow">
            <ul class="dragList" ref="dragList">
                <li>
                    <p>filename</p>
                    <p>waiting...</p>
                    <p>25Kb</p>
                </li>
            </ul>
            <p>drag file/archive file here</p>
<!--            <input class="dragInput" ref="dragInput">-->
        </div>

        <button type="button" class="btn btn-warning" v-on:click="cancel">close</button>
        <button type="button" class="btn btn-success" v-on:click="upload">upload</button>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .uploader{

    }
    .dragWindow {
        background: white;
        width: 200px;
        height: 200px;
    }
</style>

<script>
    import UploaderLib from '../lib/UploaderLib';
    import config      from '../config';

    export default {
        name     : 'PopupUploader',
        props    : ['info'],
        data     : function () {
            return {
                uploader: null,
            };
        },
        mounted  : function () {
            console.info(this.$refs);
            this.uploader = new UploaderLib(
                {
                    uploadUrl        : config.apiSite + 'file/upload',
                    dragArea         : this.$refs.dragWindow,
                    sourceInput      : this.$refs.dragInput,
                    extraData        : {pid: this.pid},
                    onRefreshFileList: (fileList) => {
                        console.info('uploader: evt: onRefreshFileList');
                        console.info(fileList);
                    },
                    uploadProgress   : (e, fileList) => {
                        console.info('uploader: evt: uploadProgress');
                        console.info(e);
                        console.info(fileList);
                    },
                    onComplete       : () => {
                        console.info('uploader: evt: onComplete');
                    },
                    onDragEnter      : () => {
                        console.info('uploader: evt: onDragEnter');
                    },
                    onDragLeave      : () => {
                        console.info('uploader: evt: onDragLeave');
                    },
                    onDragDrop       : () => {
                        console.info('uploader: evt: onDragDrop');
                    },
                    onDragPaste      : () => {
                        console.info('uploader: evt: onDragPaste');
                    },
                    onInputChange    : () => {
                        console.info('uploader: evt: onInputChange');
                    },
                }
            );
        },
        created  : function () {
            console.info(`popup uploader: created`);
        },
        destroyed: function () {
            this.uploader.public.removePrevent();
        },
        methods  : {
            upload: function () {
                this.uploader.public.upload();
            },
            delete: function (index) {
                this.uploader.public.delFile(index);
            },
        },
    }
</script>
