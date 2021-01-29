<!--
item 当前的文件数据
dir 当前文件夹数据
from 来自对象 {list|favourite|recycle}
-->
<template>
    <li :data-id="item.id" :class="[]">
        <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'directory':'file',item.id)">
            <span v-if="!item.cover" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
            <img v-else class="ct_cover" :src="item.cover" :alt="item.title">
        </div>
        <div class="ct_title">{{item.title}}</div>
        <div class="ct_operate">
            <template v-if="['list','favourite'].indexOf(from)!==-1">
                <button v-if="editMetaFlag" v-on:click="saveMeta()" class="sysIcon sysIcon_save active"></button>
                <button v-else v-on:click="editMeta()" class="sysIcon sysIcon_edit"></button>

                <button v-if="item.favourite" v-on:click="favourite()" class="sysIcon sysIcon_heart-o active"></button>
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
                line-height: $fontSize*1.5;
                bottom: $fontSize*2;
                height: $fontSize*3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .ct_operate{
                bottom: 0;
                button{
                }
            }
            .ct_title,.ct_operate {
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

    export default {
        name         : "FileListImage",
        components   : {Hinter},
        // el     : '#msg',
        store        : store,
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
            goto          : function (type, targetId) {
                this.$parent.goto(type, targetId);
            },
            //
            editMeta      : function () {
                console.info('list: editMeta');
                this.editMetaFlag = 1;
            },
            /**
             * @todo api file_mod
             * */
            saveMeta      : function () {
                console.info('list: saveMeta');
                this.editMetaFlag = 0;
                let data          = {
                    title      : this.item.title,
                    description: this.item.description,
                };
            },
            /**
             * @todo api file_cover
             * */
            setCover      : function () {
                console.info('list: setCover');
                if (this.dir)
                    this.dir.cover_id = this.item.id;
            },
            /**
             * @todo api file_favourite
             * */
            favourite     : function () {
                console.info(`list: favourite ${this.item.id}`);
                this.item.favourite = this.item.favourite ? 0 : 1;
            },
            /**
             * @todo api file_delete @use $parent
             * */
            deleteFile    : function () {
                console.info('list: deleteFile');
                this.delFromList();
            },
            /**
             * @todo api file_recover @use $parent
             * */
            recoverFile   : function () {
                console.info('list: recoverFile');
                this.delFromList();
            },
            /**
             * @todo api file_delete_forever @use $parent
             * */
            deleteForever : function () {
                console.info('list: deleteForever');
                this.delFromList();
            },
            /**
             * @todo api file_move
             * */
            moveFile      : function () {
                console.info('list: moveFile');
                return store.commit('popup', {
                    type: 'list',
                    info: {
                        title : 'move to:',
                        submit: (dirItem, dirRoute) => {
                            console.info(`moveFile to ${JSON.stringify(dirItem)}`);
                            this.delFromList();
                        },
                    }
                });
            },
            delFromList   : function () {
                for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                    if (this.item.id !== this.item.id) continue;
                    this.$parent.list.splice(i1, 1);
                }
            },
            /**
             * */
            fileVersion   : function () {
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
            delTag        : function (tagId) {
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
            editTag       : function () {
                console.info('list: editTag');
                this.editTagFlag = 1;
            },
            /**
             * @todo api tag_apply
             * */
            saveTag       : function () {
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