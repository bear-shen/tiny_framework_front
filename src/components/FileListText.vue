<!--
item 当前的文件数据
dir 当前文件夹数据
from 来自对象 {list|favourite|recycle}
-->
<template>
    <li :data-id="item.id">
        <div :class="['ct_icon','listIcon','listIcon_file_'+item.type]" v-on:click="goto(item.type==='folder'?'folder':'file',item.id)"></div>
        <!--        <div class="ct_id">{{item.id}}</div>-->
        <div v-if="!editMetaFlag" class="ct_title" v-on:click="goto(item.type==='folder'?'folder':'file',item.id)">{{ item.name }}</div>
        <label v-else class="ct_title">
            <input type="text" v-model="item.name">
        </label>
        <!--        <div class="ct_description">{{item.description}}</div>-->
        <div class="ct_size">{{ item.size }}</div>
        <div class="ct_time_update">{{ item.time_update }}</div>
        <div class="ct_operate">
            <template v-if="['list','favourite'].indexOf(from)!==-1">
                <button v-if="editMetaFlag" v-on:click="saveMeta()" class="sysIcon sysIcon_save active">&nbsp;rename</button>
                <button v-else v-on:click="editMeta()" class="sysIcon sysIcon_edit">&nbsp;rename</button>

                <button v-if="item.status==2" v-on:click="favourite()" class="sysIcon sysIcon_heart-o active">&nbsp;favourite</button>
                <button v-else v-on:click="favourite()" class="sysIcon sysIcon_heart-o">&nbsp;favourite</button>

                <button v-if="item.type!=='folder'" v-on:click="fileVersion()" class="sysIcon sysIcon_stack">&nbsp;version</button>

                <button v-on:click="deleteFile()" class="sysIcon sysIcon_delete">&nbsp;delete</button>
            </template>
            <template v-if="from==='recycle'">
                <button v-on:click="recoverFile()" class="sysIcon sysIcon_sync">&nbsp;recover</button>
                <button v-on:click="deleteForever()" class="sysIcon sysIcon_delete">&nbsp;delete forever</button>
            </template>
            <button v-on:click="moveFile()" class="sysIcon sysIcon_swap">&nbsp;move</button>
        </div>
    </li>
</template>

<style lang="scss">
.listContent.listType_text {
    display: table;
    width: 100%;
    li {
        display: table-row;
        > div {
            vertical-align: top;
            display: table-cell;
            padding: 0 $fontSize;
            line-height: $fontSize*2;
            height: $fontSize*2;
            button {
                /*
                height: $fontSize*1.2;*/
                line-height: $fontSize;
                padding: $fontSize*0.25;
                margin: 0 $fontSize*0.25;
            }
        }
        &:nth-child(2n) {
            background-color: map_get($colors, list_bk_2);
        }
    }
    .ct_icon {
        font-size: $fontSize*1.75;
    }
    .ct_operate, .ct_time_update {
        width: 5%;
        white-space: nowrap;
    }
    @media (max-width: $narrowWidth) {
        display: block;
        li {
            display: flex;
            flex-wrap: wrap;
            > div {
                display: block;
                height: fit-content;
            }
        }
        .ct_operate, .ct_time_update {
            width: fit-content;
            white-space: nowrap;
        }
    }
    @media (max-width: $tabletWidth) {
    }
    @media (max-width: $mobileWidth) {
        .ct_operate {
            white-space: normal;
        }
    }
}
</style>

<script>
import store  from '../store';
import Hinter from "./Hinter";
import helper from "../lib/Helper";

export default {
    name      : "FileListText",
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
                if (this.item.id !== this.$parent.list[i1].id) continue;
                this.$parent.list.splice(i1, 1);
                // console.info(i1,this.$parent.list[i1]);
                // break;
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
            return new Promise((resolve, reject) => {
                let tagIdList = [];
                for (let i1 = 0; i1 < this.item.tag.length; i1++) {
                    let group = this.item.tag[i1];
                    for (let i2 = 0; i2 < group.sub.length; i2++) {
                        tagIdList.push(group.sub[i2].id);
                    }
                }
                helper.query(
                    'file_tag_associate',
                    {id: this.item.id, tag: tagIdList}
                ).then((data) => {
                    // console.info(data);
            this.editTagFlag = 0;
                });
            });
        },
        /**
         * @todo api tag_get
         * */
        hinterQuery   : function (searchTxt) {
            console.debug(`User: hinterQuery ${searchTxt}`);
            return new Promise((resolve, reject) => {
                helper.query(
                    'tag_get',
                    {name: searchTxt,}
                ).then((data) => {
                    console.info(data)
                    let targetList = [];
                    for (let i1 = 0; i1 < data.length; i1++) {
                        targetList.push(
                            {
                                id        : data[i1].id,
                                name      : data[i1].name,
                                group_id  : data[i1].group.id,
                                group_name: data[i1].group.name,
                            });
                    }
                return resolve(
                    {
                            list: targetList,
                        });
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