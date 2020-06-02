// import GenFunc from './GenFuncLib.js';

/**
 * @param data Object
 *
 * {
     *      dragArea        : DOM            : 拖拽的 DOM
     *      sourceInput     : DOM            : 上传文件的 input
     *      sizeLimit       : int            : 上传文件的尺寸上限
     *      chunkSize       : int            : 自动分割上传文件的大小， 0 不分割
     *      refreshFileList : function(){}   : 添加文件时自动触发的函数
     *      uploadUrl       : string         : 上传的地址
     *      partSignal      : string         : 拆分的标志
     *      endSignal       : string         : 结束标志
     *      extraData       : Object({})     : post时发送的额外数据
     *      uploadOneTime   : int            : 每次请求上传的文件数
     *      uploadProgress  : function(){}   : 上传过程中触发的函数
     *      tokenSize       : int            : 分割上传文件的 token 长度
     *      onComplete      : function(){}   : 上传结束后触发的函数
     * }
 * */
const Uploader = function (data) {
    this.data     = Object.assign(
        {
            dragArea       : null,  //拖拽用的目标label
            sourceInput    : null,  //文件写入的input
            sizeLimit      : 1024 * 1024 * 1024 * 20,//文件尺寸上限
            chunkSize      : 1024 * 1024 * 20,  //大于xx后分割文件上传,0不分割
            //更新文件列表的函数
            refreshFileList: () => {
                let targetStr = '';
                for (let i1 = 0; i1 < this.public.fileList.length; i1++) {
                    let cur = this.public.fileList[i1];
                    targetStr += `<li>${cur.name}</li>`;
                }
                document.getElementById('files').innerHTML = targetStr;
            },
            // upload processor -----------------
            /**
             * send .part
             *      receive partial token
             * send .part + token
             * send .part + token
             * send .part + token
             * send .end
             * end
             * */
            uploadUrl      : '',
            partSignal     : '__PART__',
            endSignal      : '__END__',
            extraData      : {},//POST时附加的额外数据
            uploadOneTime  : 5,//一次请求上传的文件数
            //上传时的 onprogress 事件
            uploadProgress : (e, fileList) => {
                /**
                 * fileList as
                 * {
                     *      relFile       : '',
                     *      relIndex      : '',
                     *      chunkIndex    : '',
                     *      chunkSize     : '',
                     * }
                 * */
                console.info('on process');
                console.info(e);
                console.info(fileList);
            },
            tokenSize      : 16,
            onComplete     : () => {
                console.info('complete');
            },
            //
        }, data);
    //内部数据
    this.internal = {
        // default event -----------------
        preventEventList: [
            'drag',
            'dragleave',
            'dragenter',
            'dragover',
            'drop',
        ],
        preventEvent    : (e) => {
            e.preventDefault();
            e.stopPropagation();
        },
        callPrevent     : () => {
            for (let ia = 0; ia < this.internal.preventEventList.length; ia++) {
                console.debug('has prevent event:' + this.internal.preventEventList[ia]);
                document.addEventListener(
                    this.internal.preventEventList[ia], this.internal.preventEvent)
            }
        },
        removePrevent   : () => {
            for (let ia = 0; ia < this.internal.preventEventList.length; ia++) {
                console.debug('has prevent event:' + this.internal.preventEventList[ia]);
                document.removeEventListener(
                    this.internal.preventEventList[ia], this.internal.preventEvent)
            }
        },
        // file uploader -----------------
        uploadFileQueue : [],
        fillQueue       : () => {
            //写入队列
            for (let i1 = 0; i1 < this.public.fileList.length; i1++) {
                // console.info('here');
                let current = this.public.fileList[i1];
                console.info(current);
                if (!this.data.chunkSize || current.size < this.data.chunkSize) {
                    //文件长度不大或者不需要拆分，就不拆分
                    console.info('no chunk');
                    this.internal.uploadFileQueue.push(
                        {
                            relFile  : this.public.fileList[i1],
                            relIndex : i1,
                            file     : current,
                            chunkSize: 1,
                        });
                } else {
                    //如果需要拆分的话，在文件名上写入拆分标志+token
                    let chunkSize = Math.ceil(current.size / this.data.chunkSize);
                    console.info(`chunk ${chunkSize}`);
                    //
                    $token = GenFunc.randStr(this.data.tokenSize);
                    //
                    for (let i2 = 0; i2 < chunkSize; i2++) {
                        let subFileData = current.slice(
                            i2 * this.data.chunkSize,
                            (i2 + 1) * this.data.chunkSize,
                        );
                        //
                        let fName       = current.name;
                        if (i2 < chunkSize - 1) fName += this.data.partSignal + $token;
                        else fName += this.data.endSignal + $token;
                        //
                        let subFile = new File([subFileData], fName);
                        this.internal.uploadFileQueue.push(
                            {
                                relFile   : this.public.fileList[i1],
                                relIndex  : i1,
                                file      : subFile,
                                chunkIndex: i2,
                                chunkSize : chunkSize,
                            });
                    }
                }
            }
        },
        uploadWalker    : () => {
            // console.info('here');
            let fileList     = {};
            let fileInfoList = {};
            for (let i1 = 0; i1 < this.data.uploadOneTime || i1 < 1; i1++) {
                // console.info('here');
                let index = '0000000' + i1;
                index     = index.substr(-7);
                let cur   = this.internal.uploadFileQueue.shift();
                // console.info(cur);
                if (!cur) break;
                fileList['upd_file_' + index]     = cur.file;
                fileInfoList['upd_file_' + index] = {
                    relFile   : cur.relFile,
                    relIndex  : cur.relIndex,
                    chunkIndex: cur.chunkIndex,
                    chunkSize : cur.chunkSize,
                };
            }
            console.warn('fileList:');
            console.info(fileList);
            let query = new Promise((resolve, reject) => {
                console.warn('fileList on promise:');
                console.info(fileList);
                let target = {};
                let xhr    = GenFunc.sendAjaxV3(
                    {
                        path            : this.data.uploadUrl,
                        post            : Object.assign(target, this.data.extraData, fileList),
                        success         : (result, status) => {
                            return resolve(result, status);
                        },
                        error           : (result, status) => {
                            return reject(result, status);
                        },
                        onUploadProgress: (e) => {
                            if (!this.data.uploadProgress) return;
                            this.data.uploadProgress(e, fileInfoList);
                        },
                    });
            });
            query.then((result, status) => {
                console.info(result);
                // console.info(status);
                if (!this.internal.uploadFileQueue.length) {
                    if (this.data.onComplete) return this.data.onComplete();
                    return;
                }
                this.internal.uploadWalker();
            }).catch((result, status) => {
                console.warn(result);
                console.info(status);
            });
        },
    };
    //类型
    this.public   = {
        fileList : [],    //文件列表 [File]
        // file processor -----------------
        addFile  : (file) => {
            //之前的文件列表长度
            let preLength = this.public.fileList.length;
            //如果导入的是一个数组，遍历，如果是文件，做成数组去遍历
            if (file.length === undefined) file = [file];
            //对文件计数
            let fCount = 0;
            for (let i1 = 0; i1 < file.length; i1++) {
                this.public.checkFile(file[i1])
                    .then(() => {
                        this.public.fileList.push(file[i1]);
                        this.data.refreshFileList();
                        if (++fCount === file.length) {
                            // 表单只能获取，无法回写
                            // this.data.sourceInput.files = this.public.fileList;
                        }
                    })
                    .catch((info) => {
                        console.error(info);
                        if (++fCount === file.length) {
                            // this.data.sourceInput.files = this.public.fileList;
                        }
                    });
            }
            //这里因为用了异步函数，所以下面的步骤全没有用了
            // if (preLength === this.public.fileList.length) return false;
            // this.data.refreshFileList();
            return true;
        },
        checkFile: (file) => {
            /**
             * @see https://segmentfault.com/a/1190000013298317
             * */
            return new Promise((resolve, reject) => {
                // console.info(file);
                if (file.type) { return resolve();}
                if (!file.size) { return reject('empty file not allowed'); }
                try {
                    let fileReader = new FileReader();
                    fileReader.addEventListener('load', function (e) {
                        resolve();
                    }, false);

                    fileReader.addEventListener('error', function (e) {
                        reject('file unreadable');
                    }, false);
                    fileReader.readAsDataURL(file.slice(0, 16));
                } catch (e) {
                    return reject(`error:${e.toString()}`);
                }
            });
        },
        delFile  : (fileIndex) => {
            let preLength = this.public.fileList.length;
            //
            this.public.fileList.splice(fileIndex, 1);
            //
            if (preLength === this.public.fileList.length) return false;
            this.data.refreshFileList();
            return true;
        },
        // file uploader -----------------
        upload   : () => {
            this.internal.fillQueue();
            this.internal.uploadWalker();
        },
    };
    this.internal.callPrevent();
    // this.internal.removePrevent();
    //
    if (this.data.dragArea) {
        this.data.dragArea.addEventListener('dragenter', (e) => {
            // console.debug('dragenter');
            // console.debug(e);
        });
        this.data.dragArea.addEventListener('dragleave', (e) => {
            // console.debug('dragleave');
            // console.debug(e);
        });
        this.data.dragArea.addEventListener('drop', (e) => {
            console.debug('drop');
            // console.debug(e);
            // console.debug(e.dataTransfer.files);
            //话说不清楚这个是否会存在到别的数据。。。
            this.public.addFile(e.dataTransfer.files);
        });
        this.data.dragArea.addEventListener('paste', (e) => {
            console.debug('paste');
            // console.debug(e);
            // console.debug(e.clipboardData.files);
            this.public.addFile(e.clipboardData.files);
        });
    }
    //
    if (this.data.sourceInput) {
        this.data.sourceInput.addEventListener('change', (e) => {
            this.data.fileList = [];
            this.public.addFile(this.data.sourceInput.files);
        });
    }
};
export {Uploader as default};
