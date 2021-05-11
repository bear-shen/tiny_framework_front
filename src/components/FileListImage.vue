<!--
item 当前的文件数据
dir 当前文件夹数据
from 来自对象 {list|favourite|recycle}
-->
<template>
    <li :data-id="item.id" :class="[]">
        <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'folder':'file',item.id)">
            <span v-if="!item.cover" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
            <img v-else class="ct_cover" :src="item.cover" :alt="item.title">
        </div>
        <div v-if="!editMetaFlag" class="ct_title">{{ item.name }}</div>
        <div v-else class="ct_title"><input type="text" v-model="item.name"></div>
        <div class="ct_operate">
            <template v-if="['list','favourite'].indexOf(from)!==-1">
                <button v-if="editMetaFlag" v-on:click="saveMeta()" class="sysIcon sysIcon_save active"></button>
                <button v-else v-on:click="editMeta()" class="sysIcon sysIcon_edit"></button>

                <button v-if="item.status==2" v-on:click="favourite()" class="sysIcon sysIcon_heart-o active"></button>
                <button v-else v-on:click="favourite()" class="sysIcon sysIcon_heart-o"></button>

                <button v-if="item.type!=='folder'" v-on:click="fileVersion()" class="sysIcon sysIcon_stack"></button>
                <button v-on:click="deleteFile()" class="sysIcon sysIcon_delete"></button>
            </template>
            <template v-if="from==='recycle'">
                <button v-on:click="recoverFile()" class="sysIcon sysIcon_sync"></button>
                <button v-on:click="deleteForever()" class="sysIcon sysIcon_delete"></button>
            </template>
            <button v-on:click="moveFile()" class="sysIcon sysIcon_swap"></button>
        </div>
    </li>
</template>

<style lang="scss">
.listContent.listType_image {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    /* */
    li {
        white-space: nowrap;
        width: map_get($sizeConf, list_image_body_w);
        height: map_get($sizeConf, list_image_body_h);
        text-align: center;
        position: relative;
        margin: $fontSize*0.5;
        .ct_alpha {
            height: map_get($sizeConf, list_image_body_w);
            line-height: map_get($sizeConf, list_image_body_w);
            text-align: center;
            .ct_icon, .ct_cover {
                display: inline-block;
                max-width: 100%;
                max-height: 100%;
                font-size: map_get($sizeConf, list_image_body_w)*0.75;
                vertical-align: middle;
            }
        }
        .ct_title {
            white-space: normal;
            word-break: break-all;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: $fontSize;
            //
            $availHeight: map_get($sizeConf, list_image_body_h)
                - map_get($sizeConf, list_image_body_w)
                -$fontSize - $fontSize*0.5*2;
            $pad: map_get($sizeConf, list_image_title_pad);
            $lineHeight: ($availHeight - $pad*2)/2;
            //
            line-height: $lineHeight;
            bottom: $fontSize+map_get($sizeConf, btn_padding)*2 + $pad;
            max-height: $lineHeight*2;
            min-height: $lineHeight*1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .ct_operate {
            bottom: 0;
            button {
            }
        }
        .ct_title, .ct_operate {
            position: absolute;
            left: 0;
            width: 100%;
        }
    }
    @media (max-width: $narrowWidth) {
    }
    @media (max-width: $tabletWidth) {
    }
    @media (max-width: $mobileWidth) {
    }
}
</style>

<script>
import store  from '../store';
import Hinter from "./Hinter";
import helper from "../lib/Helper";

export default {
    name      : "FileListImage",
    components: {Hinter},
    // el     : '#msg',
    store: store,
    //dir是可选的，从收藏夹进入不传入dir
    props        : [
        'item',
        'dir',
        'from'
    ],
    data         : function () {
        return {
            editMetaFlag: 0,
            editTagFlag : 0,
        }
    },
    watch        : {},
    created      : function () {
    },
    mounted      : function () {
    },
    beforeDestroy: function () {
    },
    methods      : {
        goto: function (type, targetId) {
            this.$parent.goto(type, targetId);
        },
        //
        editMeta: function () {
            console.info('list: editMeta');
            this.editMetaFlag = 1;

        },
        saveMeta: function () {
            console.info('list: saveMeta');
            return new Promise((resolve, reject) => {
                let query = {
                    id         : this.item.id,
                    name       : this.item.name,
                    description: this.item.description,
                };
                helper.query(
                    'file_mod',
                    query
            ).then((data) => {
                    this.editMetaFlag = 0;
                console.warn(data);
                    return resolve();
                });
            });
        },
        /**
         * */
        setCover: function () {
            console.info('list: setCover');
            return new Promise((resolve, reject) => {
                if (!this.dir) return resolve();
                let query = {
                    id           : this.dir.id,
                    node_cover_id: this.item.id,
                };
                helper.query(
                    'file_cover',
                    query
                ).then((data) => {
                this.dir.cover_id = this.item.id;
                    return resolve();
                });
            });
        },
        /**
         * */
        favourite: function () {
            console.info(`list: favourite ${this.item.id}`);
            return new Promise((resolve, reject) => {
                let query = {
                    id: this.item.id,
                };
                helper.query(
                    'file_favourite',
                    query
                ).then((data) => {
                    this.item.status = this.item.status == '2' ? '1' : '2';
                    return resolve();
                });
            });
        },
        /**
         * */
        deleteFile: function () {
            console.info('list: deleteFile');
            return new Promise((resolve, reject) => {
                let query = {
                    id: this.item.id,
                };
                helper.query(
                    'file_delete',
                    query
                ).then((data) => {
            this.delFromList();
                    return resolve();
                });
            });
        },
        /**
         * */
        recoverFile: function () {
            console.info('list: recoverFile');
            return new Promise((resolve, reject) => {
                let query = {
                    id: this.item.id,
                };
                helper.query(
                    'file_recover',
                    query
                ).then((data) => {
            this.delFromList();
                    return resolve();
                });
            });
        },
        /**
         * */
        deleteForever: function () {
            console.info('list: deleteForever');
            return new Promise((resolve, reject) => {
                let query = {
                    id: this.item.id,
                };
                helper.query(
                    'file_delete_forever',
                    query
                ).then((data) => {
            this.delFromList();
                    return resolve();
                });
            });
        },
        /**
         * */
        moveFile   : function () {
            console.info('list: moveFile');
            return store.commit('popup', {
                type: 'list',
                info: {
                    title : 'move to:',
                    submit: (dirItem) => {
                        console.info(`moveFile to ${JSON.stringify(dirItem)}`);
                        return new Promise((resolve, reject) => {
                            let query = {
                                id       : this.item.id,
                                target_id: dirItem.id,
                            };
                            helper.query(
                                'file_move',
                                query
                            ).then((data) => {
                                console.warn(data);
                        this.delFromList();
                                return resolve();
                            });
                        });
                    },
                }
            });
        },
        delFromList: function () {
            for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                if (this.item.id !== this.item.id) continue;
                this.$parent.list.splice(i1, 1);
            }
        },
        /**
         * */
        fileVersion: function () {
            console.info('list: fileVersion');
            return store.commit('popup', {
                type: 'version',
                info: {
                    id: this.item.id,
                }
            });
        },
        // -------------------------------------------
        /**
         * @todo api tag_del
         * */
        delTag : function (tagId) {
            console.info('list: del tag:' + this.item.id + '\t' + tagId);
            // console.debug(this.item);
            for (let i2 = 0; i2 < this.item.tag.length; i2++) {
                for (let i3 = 0; i3 < this.item.tag[i2].sub.length; i3++) {
                    if (this.item.tag[i2].sub[i3].id !== tagId) continue;
                    console.debug('list: hit tag');
                    // console.debug(this.item.tag[i2].sub);
                    this.item.tag[i2].sub.splice(i3, 1);
                }
            }
        },
        editTag: function () {
            console.info('list: editTag');
            this.editTagFlag = 1;
        },
        /**
         *
         * @todo api tag_apply
         * */
        saveTag: function () {
            console.info('list: saveTag');
            this.editTagFlag = 0;
        },
        /**
         * @todo api tag_get
         * */
        hinterQuery   : function (searchTxt) {
            console.debug(`User: hinterQuery ${searchTxt}`);
            //
            return new Promise((resolve, reject) => {
                return resolve(
                    {
                        list: [
                            {id: 75, name: 'drugs', group_id: 2, group_name: 'male',},
                            {id: 74, name: 'bbm', group_id: 1, group_name: 'male',},
                            {id: 76, name: 'anal', group_id: 3, group_name: 'male',},
                            {id: 77, name: 'yaoi', group_id: 4, group_name: 'male',},
                        ],
                    });
            });
        },
        hinterCallback: function (target) {
            console.debug(`User: hinterCallback ${JSON.stringify(target)}`);
            console.debug(target);
            //获取分组index
            let groupIndex = -1;
            for (let i1 = 0; i1 < this.item.tag.length; i1++) {
                if (this.item.tag[i1].id != target.group_id) continue;
                groupIndex = i1;
            }
            if (groupIndex === -1) {
                this.item.tag.push(
                    {
                        id  : target.group_id,
                        name: target.group_name,
                        sub : [],
                    });
                groupIndex = this.item.tag.length - 1;
            }
            //获取tag index
            let tagIndex = -1;
            for (let i1 = 0; i1 < this.item.tag[groupIndex].sub.length; i1++) {
                if (this.item.tag[groupIndex].sub[i1].id != target.id) continue;
                tagIndex = i1;
            }
            if (tagIndex !== -1) {
                console.warn('tag duplicated');
                return;
            }
            //
            this.item.tag[groupIndex].sub.push(
                {id: target.id, name: target.name,}
            );
        },
    }
}
</script>