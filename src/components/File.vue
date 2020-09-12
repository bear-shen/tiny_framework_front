<template>
    <li :data-id="item.id" :class="[item.tag.length?'hasTag':'noTag']">
        <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'directory':'file',item.id)">
            <span v-if="!item.cover || listType==='text'" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
            <img v-if="item.cover && listType!=='text'" class="ct_cover" :src="item.cover" alt="">
        </div>
        <div class="ct_meta">
            <template v-if="editMetaId===item.id">
                <div class="ct_title">
                    <label>title:<br>
                        <input type="text" v-model="item.title">
                    </label>
                </div>
                <div class="ct_description">
                    <label>description:<br>
                        <textarea v-model="item.description"></textarea>
                    </label>
                </div>
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
                <div v-if="item.cover"
                     :class="['btn', 'btn-dark', {'active':dir.cover_id===item.id}]"
                     v-on:click="setCover(item.id)"
                ><span class="sysIcon sysIcon_edit"></span>&nbsp;cover
                </div>

                <template v-if="editMetaId===item.id">
                    <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveMeta(item.id)">
                        <span class="sysIcon sysIcon_save"></span>&nbsp;info
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark']" v-on:click="editMeta(item.id)">
                        <span class="sysIcon sysIcon_edit"></span>&nbsp;info
                    </div>
                </template>

                <template v-if="editTagId===item.id">
                    <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveTag(item.id)">
                        <span class="sysIcon sysIcon_save"></span>&nbsp;tag
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark']" v-on:click="editTag(item.id)">
                        <span class="sysIcon sysIcon_edit"></span>&nbsp;tag
                    </div>
                </template>
                <template v-if="item.favourite">
                    <div :class="['btn', 'btn-dark']" v-on:click="favourite(item.id)">
                        <span class="sysIcon sysIcon_heart-o"></span>&nbsp;fav
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark','is_favourite']" v-on:click="favourite(item.id)">
                        <span class="sysIcon sysIcon_heart-o"></span>&nbsp;unfav
                    </div>
                </template>
                <div :class="['btn', 'btn-dark']" v-on:click="deleteFile(item.id)">
                    <span class="sysIcon sysIcon_delete"></span>&nbsp;delete
                </div>
            </div>
        </div>
        <template v-if="editTagId===item.id">
            <div class="ct_tag">
                <dl v-for="group in item.tag" :data-id="group.id">
                    <dt>{{group.name}}:</dt>
                    <dd v-for="tag in group.sub" :data-id="tag.id" class="btn btn-dark" v-on:click="delTag(item.id,tag.id)">
                        {{tag.name}}
                        <span class="sysIcon sysIcon_delete"></span>
                    </dd>
                </dl>
                <dl>
                    <dt>add:</dt>
                    <dd><input
                            type="text" v-model="addTagTxt"
                            placeholder="input tag and choose"
                    >
                        <ul v-if="showTagSelector" class="ct_tag_hinter">
                            <li v-for="tag in tagSelector" v-on:click.stop="addTag(item.id,tag.id)">{{tag.group_name}}:{{tag.name}}</li>
                        </ul>
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
</style>

<script>
    export default {
        name   : "File",
        // el     : '#msg',
        props  : ['item', 'dir', 'listType'],
        data   : function () {
            return {
                //tag 部分
                editMetaId     : 0,
                editTagId      : 0,
                addTagTxt      : '',
                showTagSelector: false,
                tagSelector    : [],
            }
        },
        watch  : {},
        created: function () {
        },
        mounted      : function () {
            document.getElementById('app').addEventListener('click', this.searchTagClear);
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        beforeDestroy: function () {
            document.getElementById('app').removeEventListener('click', this.searchTagClear)
        },
        methods: {

            /**
             * @todo api
             * */
            goDetail      : function (targetIndex) {
                console.info('list: goDetail');
                //比正常文件列表多raw和normal字段用于显示大图
                this.$parent.showFileList(
                    {
                        list   : this.list,
                        current: targetIndex,
                        query  : this.query,
                        param  : this.param,
                        page   : this.page
                    });
            },
            //
            editMeta      : function (itemId) {
                console.info('list: editMeta');
                this.editMetaId = itemId;
            },
            /**
             * @todo api
             * */
            searchTag     : function () {
                console.debug('list: searchTag ' + this.addTagTxt);
                if (!this.addTagTxt) return;
                this.showTagSelector = true;
                this.tagSelector     = [
                    {id: 4, group_id: 2, name: 'tentacles', group_name: 'male',},
                    {id: 5, group_id: 2, name: 'dilf', group_name: 'male',},
                    {id: 2, group_id: 1, name: 'rape', group_name: 'female',},
                    {id: 3, group_id: 1, name: 'netorare', group_name: 'female',},
                ];
            },
            /**
             * @todo api
             * */
            delTag        : function (itemId, tagId) {
                console.info('list: del tag:' + itemId + '\t' + tagId);
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== itemId) continue;
                    console.debug('list: hit item');
                    // console.debug(this.list[i1]);
                    for (let i2 = 0; i2 < this.list[i1].tag.length; i2++) {
                        for (let i3 = 0; i3 < this.list[i1].tag[i2].sub.length; i3++) {
                            if (this.list[i1].tag[i2].sub[i3].id !== tagId) continue;
                            console.debug('list: hit tag');
                            // console.debug(this.list[i1].tag[i2].sub);
                            this.list[i1].tag[i2].sub.splice(i3, 1);
                        }
                    }
                }
            },
            /**
             * @todo api
             * */
            addTag        : function (itemId, tagId) {
                console.debug('list: addTag:' + itemId + '\t' + tagId);
                let tag = false;
                for (let i1 = 0; i1 < this.tagSelector.length; i1++) {
                    if (this.tagSelector[i1].id !== tagId) continue;
                    tag = this.tagSelector[i1];
                }
                if (!tag) {
                    console.warn('tag not found');
                    return false;
                }
                //查找 item
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== itemId) continue;
                    console.debug(`item found ${i1}`);
                    console.info(this.list[i1]);
                    let hasGroup = false;
                    let hasTag   = false;
                    //查找 tag group
                    for (let i2 = 0; i2 < this.list[i1].tag.length; i2++) {
                        if (this.list[i1].tag[i2].id !== tag.group_id) continue;
                        console.debug(`group found ${i1} ${i2}`);
                        console.info(this.list[i1].tag[i2]);
                        hasGroup = true;
                        //查找 tag
                        for (let i3 = 0; i3 < this.list[i1].tag[i2].sub.length; i3++) {
                            if (this.list[i1].tag[i2].sub[i3].id !== tag.id) continue;
                            console.debug(`tag found ${i1} ${i2} ${i3}`);
                            console.info(this.list[i1].tag[i2].sub[i3]);
                            hasTag = true;
                            //如果存在 tag ，不写入
                            break;
                        }
                        //无 tag 加 tag
                        if (!hasTag) {
                            this.list[i1].tag[i2].sub.push(
                                {id: tag.id, name: tag.name,}
                            );
                        }
                    }
                    //无 group 加 group
                    if (!hasGroup) {
                        this.list[i1].tag.push(
                            {
                                id  : tag.group_id,
                                name: tag.group_name,
                                sub : [
                                    {id: tag.id, name: tag.name,},
                                ],
                            })
                    }
                    // break;
                }
                this.searchTagClear();
            },
            editTag       : function (itemId) {
                console.info('list: editTag');
                this.editTagId = itemId;
            },
            /**
             * @todo api
             * */
            saveMeta      : function (itemId) {
                console.info('list: saveMeta');
                this.editMetaId = 0;
            },
            /**
             * @todo api
             * */
            saveTag       : function (itemId) {
                console.info('list: saveTag');
                this.editTagId = 0;
            },
            /**
             * @todo api
             * */
            setCover      : function (itemId) {
                console.info('list: setCover');
            },
            /**
             * @todo api
             * */
            favourite     : function (itemId) {
                console.info(`list: favourite ${itemId}`);
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== itemId) continue;
                    this.list[i1].favourite = this.list[i1].favourite ? 0 : 1;
                }
            },
            /**
             * @todo api
             * */
            deleteFile    : function (itemId) {
                console.info('list: deleteFile');
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    if (this.list[i1].id !== itemId) continue;
                    this.list.splice(i1, 1);
                }
            },
            /**
             * @todo api
             * */
            searchTagClear: function () {
                if (!this.showTagSelector) return false;
                console.debug('list: searchTagClear ' + this.addTagTxt);
                this.addTagTxt       = '';
                this.showTagSelector = false;
                this.tagSelector     = [];
            },
        }
    }
</script>