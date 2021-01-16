<!--
item 当前的文件数据
dir 当前文件夹数据
listType 列表类型，实际上没什么用
from 来自对象 {list|favourite|recycle}
-->
<template>
    <li :data-id="item.id" :class="[item.tag.length?'hasTag':'noTag']">
        <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'directory':'file',item.id)">
            <span v-if="!item.cover" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
            <img v-else class="ct_cover" :src="item.cover" :alt="item.title">
        </div>
        <div class="ct_meta">
            <template v-if="editMetaFlag">
                <label class="ct_title">title:<br>
                    <input type="text" v-model="item.title">
                </label>
                <label class="ct_description">description:<br>
                    <textarea v-model="item.description"></textarea>
                </label>
            </template>
            <template v-else>
                <div class="ct_type">{{item.type}}</div>
                <div class="ct_title">{{item.title}}</div>
                <div class="ct_description">{{item.description}}</div>
                <div class="ct_size">{{item.size}}</div>
                <div class="ct_hash">{{item.hash}}</div>
                <div class="ct_time_create">{{item.time_create}}</div>
                <div class="ct_time_update">{{item.time_update}}</div>
            </template>
            <div class="ct_operate">
                <button v-if="from==='list'" v-on:click="setCover()" :class="['sysIcon', 'sysIcon_picture',{'active':dir && dir.cover_id===item.id}]">&nbsp;cover</button>

                <template v-if="['list','favourite'].indexOf(from)!==-1">
                    <button v-if="editMetaFlag" v-on:click="saveMeta()" class="sysIcon sysIcon_save active">&nbsp;info</button>
                    <button v-else v-on:click="editMeta()" class="sysIcon sysIcon_edit">&nbsp;info</button>

                    <button v-if="editTagFlag" v-on:click="saveTag()" class="sysIcon sysIcon_save active">&nbsp;tag</button>
                    <button v-else v-on:click="editTag()" class="sysIcon sysIcon_tag-o">&nbsp;tag</button>

                    <button v-if="item.favourite" v-on:click="favourite()" class="sysIcon sysIcon_heart-o active">&nbsp;favourite</button>
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
        </div>
        <template v-if="editTagFlag">
            <div class="ct_tag">
                <dl v-for="group in item.tag" :data-id="group.id">
                    <dt>{{group.name}}:</dt>
                    <dd v-for="tag in group.sub" :data-id="tag.id" class="btn btn-dark" v-on:click="delTag(tag.id)">
                        {{tag.name}}
                        <span class="sysIcon sysIcon_delete"></span>
                    </dd>
                </dl>
                <dl>
                    <dt>add:</dt>
                    <dd>
                        <Hinter
                                :show="['group_name','name']"
                                :query="hinterQuery"
                                :callback="hinterCallback.bind(this)"
                        />
                    </dd>
                </dl>
            </div>
        </template>
        <template v-else>
            <div v-if="item.tag.length" class="ct_tag">
                <dl v-for="group in item.tag" :data-id="group.id">
                    <dt>{{group.name}}:</dt>
                    <dd
                            v-for="tag in group.sub"
                            :data-id="tag.id"
                            class="btn btn-dark"
                            v-on:click="goto('tag',tag.id)"
                    >
                        {{tag.name}}
                    </dd>
                </dl>
            </div>
        </template>
    </li>
</template>

<style lang="scss">
    .listContent {
        &.listType_detail {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
            /* */
            li {
                white-space: nowrap;
                & > div {
                    display: inline-block;
                    vertical-align: top;
                }
                .ct_alpha {
                    $hWithPad: map_get($sizeConf, list_detail_image_thumb_h) - $fontSize*1;
                    height: $hWithPad;
                    line-height: $hWithPad;
                    text-align: center;
                    span, img {
                        display: inline-block;
                        max-width: 100%;
                        max-height: 100%;
                        font-size: $hWithPad*0.75;
                        vertical-align: middle;
                    }
                }
                .ct_alpha {}
                .ct_meta {
                    div {
                        width: 100%;
                        white-space: normal;
                        word-break: break-all;
                        padding: $fontSize*0.25 0;
                    }
                }
                .ct_tag {
                    dl {
                        word-break: break-all;
                        white-space: normal;
                        line-height: $fontSize*1.5;
                    }
                    dt {
                        display: inline-block;
                    }
                    dd {
                        display: inline-block;
                        color: darken(map_get($colors, tag_font), 20);
                        padding-left: $fontSize*0.5;
                        &:hover{
                            color: map_get($colors, tag_font_active);
                        }
                    }
                }
                .ct_alpha, .ct_meta, .ct_tag {
                    padding: $fontSize*0.5;
                }
            }
            li.hasTag {
                width: 50%;
                .ct_alpha {
                    width: calc(16.66% - #{$fontSize});
                }
                .ct_meta {
                    width: calc(33.33% - #{$fontSize});
                }
                .ct_tag {
                    width: calc(50% - #{$fontSize});
                }
            }
            li.noTag {
                width: 25%;
                .ct_alpha {
                    width: calc(33.33% - #{$fontSize});
                }
                .ct_meta {
                    width: calc(66.66% - #{$fontSize});
                }
            }
            @media (max-width: $narrowWidth) {
                li.hasTag {
                    width: 100%;
                    .ct_alpha {
                        width: calc(20% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(30% - #{$fontSize});
                    }
                    .ct_tag {
                        width: calc(50% - #{$fontSize});
                    }
                }
                li.noTag {
                    width: 33%;
                    .ct_alpha {
                        width: calc(33.33% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(66.66% - #{$fontSize});
                    }
                }
            }
            @media (max-width: $tabletWidth) {
                li.hasTag {
                    width: 100%;
                    .ct_alpha {
                        width: calc(20% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(30% - #{$fontSize});
                    }
                    .ct_tag {
                        width: calc(50% - #{$fontSize});
                    }
                }
                li.noTag {
                    width: 50%;
                    .ct_alpha {
                        width: calc(33.33% - #{$fontSize});
                    }
                    .ct_meta {
                        width: calc(66.66% - #{$fontSize});
                    }
                }
            }
            @media (max-width: $mobileWidth) {
                li{
                    & > div {
                        display: block;
                        vertical-align: top;
                    }
                }
                li.hasTag,li.noTag {
                    width: 100%;
                    .ct_alpha,.ct_meta,.ct_tag {
                        width: calc(100% - #{$fontSize});
                    }
                }
            }
        }
        &.listType_image {
            li {
            }
        }
        &.listType_text {
            li {
            }
        }
    }
</style>

<script>
    import store  from '../store';
    import Hinter from "./Hinter";

    export default {
        name         : "File",
        components   : {Hinter},
        // el     : '#msg',
        store        : store,
        //dir是可选的，从收藏夹进入不传入dir
        props        : [
            'item',
            'dir',
            'listType',
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
            /**
             * @todo api file_mod
             * */
            saveMeta      : function () {
                console.info('list: saveMeta');
                this.editMetaFlag = 0;
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
                for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                    if (this.item.id !== this.item.id) continue;
                    this.$parent.list.splice(i1, 1);
                }
            },
            /**
             * @todo api file_recover @use $parent
             * */
            recoverFile   : function () {
                console.info('list: recoverFile');
                for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                    if (this.item.id !== this.item.id) continue;
                    this.$parent.list.splice(i1, 1);
                }
            },
            /**
             * @todo api file_delete_forever @use $parent
             * */
            deleteForever : function () {
                console.info('list: deleteForever');
                for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                    if (this.item.id !== this.item.id) continue;
                    this.$parent.list.splice(i1, 1);
                }
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
                            console.info(`moveFile to ${JSON.stringify(dirItem)}`)
                        },
                    }
                });
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
                let tagIndex = -1;
                for (let i1 = 0; i1 < this.item.tag[groupIndex].sub.length; i1++) {
                    if (this.item.tag[groupIndex].sub[i1].id != target.id) continue;
                    tagIndex = i1;
                }
                if (tagIndex !== -1) {
                    console.warn('tag duplicated');
                    return;
                }
                this.item.tag[groupIndex].sub.push(
                    {id: target.id, name: target.name,}
                );
            },
        }
    }
</script>