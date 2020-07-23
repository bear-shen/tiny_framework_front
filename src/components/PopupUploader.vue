<template>
    <div class="uploader">
        <div class="dragWindow" ref="dragWindow">
            <ul class="dragList" ref="dragList">
                <li v-for="file in fileList">
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

    /**
     * UploaderLib.js 里的分片功能正在考虑要不要去掉，想想都觉得烦。。。
     * 而且这么个功能本质上属于卵用没有，你又没做断点续传。。。
     * 但是做都做了。。。
     *
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
                fileList: fileList
            };
        },
        mounted  : function () {
            console.info(`popup uploader: mounted`);
            console.info(this.$refs);
        },
        created  : function () {
            console.info(`popup uploader: created`);
        },
        destroyed: function () {
            console.info(`popup uploader: destroyed`);
        },
        methods  : {
            cancel: function () {
                console.info(`popup uploader: cancel`);
            },
            upload: function () {
                console.info(`popup uploader: upload`);
            },
        },
    }
</script>
