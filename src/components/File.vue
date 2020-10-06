<template>
    <li :data-id="item.id" :class="[item.tag.length?'hasTag':'noTag']">
        <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'directory':'file',item.id)">
            <span v-if="!item.cover || listType==='text'" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
            <img v-if="item.cover && listType!=='text'" class="ct_cover" :src="item.cover" alt="">
        </div>
        <div class="ct_meta">
            <template v-if="editMetaFlag">
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
                <template v-if="fromList">
                    <div v-if="item.cover"
                         :class="['btn', 'btn-dark', {'active':dir && dir.cover_id===item.id}]"
                         v-on:click="setCover()"
                    ><span class="sysIcon sysIcon_edit"></span>&nbsp;cov
                    </div>
                </template>

                <template v-if="editMetaFlag">
                    <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveMeta()">
                        <span class="sysIcon sysIcon_save"></span>&nbsp;inf
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark']" v-on:click="editMeta()">
                        <span class="sysIcon sysIcon_edit"></span>&nbsp;inf
                    </div>
                </template>

                <template v-if="editTagFlag">
                    <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveTag()">
                        <span class="sysIcon sysIcon_save"></span>&nbsp;tag
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark']" v-on:click="editTag()">
                        <span class="sysIcon sysIcon_edit"></span>&nbsp;tag
                    </div>
                </template>
                <template v-if="item.favourite">
                    <div :class="['btn', 'btn-dark']" v-on:click="favourite()">
                        <span class="sysIcon sysIcon_heart-o"></span>&nbsp;fav
                    </div>
                </template>
                <template v-else>
                    <div :class="['btn', 'btn-dark','active']" v-on:click="favourite()">
                        <span class="sysIcon sysIcon_heart-o"></span>&nbsp;fav
                    </div>
                </template>
                <div :class="['btn', 'btn-dark']" v-on:click="deleteFile()">
                    <span class="sysIcon sysIcon_delete"></span>&nbsp;del
                </div>
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
                    <dd><input
                            type="text" v-model="addTagTxt"
                            placeholder="input tag and choose"
                    >
                        <ul v-if="showTagSelector" class="float_hinter">
                            <li v-for="tag in tagSelector" v-on:click.stop="addTag(tag.id)">{{tag.group_name}}:{{tag.name}}</li>
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
    .listContent {
        > ul {
            width: 100%;
            margin-left: 0;
            padding-left: 0;
            list-style: none;
        }

        > ul > li {
            &:nth-child(2n) {
                background-color: rgba(0, 0, 0, 0.25);
            }
        }

        > ul > li > div {
        }

        .btn {
            margin-left: 5px;
            padding: 5px;
            display: inline-block;
            margin-bottom: 5px;
            line-height: $fontSize;
        }
    }

    .listContent.listType_text {
        $listFontSize: $fontSize*1;

        > ul {
            display: table;
        }

        > ul > li {
            display: table-row;
        }

        > ul > li > div {
            line-height: 2.5 * $listFontSize;
            font-size: $listFontSize;
            vertical-align: middle;
            display: contents;

            > * {
                display: table-cell;
            }
        }

        .ct_alpha {
            text-align: center;

            * {
                padding-right: 10px;
            }
        }

        .ct_meta {
            div {
                /*display: inline-block;*/
            }

            .ct_description,
                /*.ct_time_create,*/
            .ct_hash,
            .ct_operate {
                display: none;
            }
        }

        .ct_tag {
            display: none;
        }

        @media (max-width: 1200px) {
            .ct_meta {
                .ct_time_create {
                    display: none;
                }
            }
        }

        @media (max-width: 800px) {
            .ct_meta {
                .ct_time_update {
                    display: none;
                }
            }
        }

        @media (max-width: 600px) {
            .ct_meta {
                .ct_size {
                    display: none;
                }

                .ct_type {
                    display: none;
                }
            }
        }
    }

    .listContent.listType_img {
        > ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        $liWidth: 12vw;
        $liMinWidth: 120px;
        $liMaxWidth: 180px;
        $liRate: 4/3;

        > ul > li {
            width: $liWidth;
            height: $liWidth*$liRate;
            min-width: $liMinWidth;
            min-height: $liMinWidth*$liRate;
            max-width: $liMaxWidth;
            max-height: $liMaxWidth*$liRate;
            position: relative;
            margin-bottom: 5px;
        }

        > ul > li > div {
        }

        /*.ct_alpha,*/
        /*.ct_icon,*/
        /*.ct_cover,*/
        /*.ct_title,*/
        .ct_description,
        .ct_size,
        .ct_hash,
        .ct_type,
        .ct_time_create,
        .ct_time_update,
        .ct_operate,
        .ct_tag {
            display: none;
        }

        .ct_alpha,
            /*.ct_icon,*/
            /*.ct_cover,*/
        .ct_title {
            width: 100%;
        }

        .ct_title {
            line-height: $fontSize*1.125;
            height: $fontSize*1.125*2;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ct_icon,
        .ct_cover {
            max-width: calc(#{$liMaxWidth} * 0.9);
            max-height: calc(#{$liMaxWidth} * 0.9);
            position: absolute;
            left: 5%;
            top: 15px;
            margin-left: auto;
            margin-right: auto;
            right: 5%;
        }

        .ct_icon {
            z-index: 1;
            font-size: $liMaxWidth*0.6;
            text-align: center;
            width: 90%;
        }

        .ct_cover {
            z-index: 2;
        }

        .ct_title {
            text-align: center;
            position: absolute;
            top: calc(#{$liMaxWidth} * 0.9 + 30px);

        }

        //这俩是根据宽度比例计算的
        @media (max-width: 1499px) {
            .ct_icon,
            .ct_cover {
                top: 10px;
                max-width: calc(#{$liWidth} * 0.9);
                max-height: calc(#{$liWidth} * 0.9);
            }
            .ct_title {
                top: calc(#{$liWidth} * 0.9 + 20px);
            }
            .ct_icon {
                font-size: $liWidth*0.6;
            }
        }

        @media (max-width: 999px) {
            .ct_icon,
            .ct_cover {
                top: 5px;
                max-width: calc(#{$liMinWidth} * 0.9);
                max-height: calc(#{$liMinWidth} * 0.9);
            }
            .ct_title {
                top: calc(#{$liMinWidth} * 0.9 + 10px);
            }
            .ct_icon {
                font-size: $liMinWidth*0.6;
            }
        }

        @media (max-width: 1199px) {
            .ct_icon {
                z-index: 1;
                font-size: 80px;
                text-align: center;
                width: 90%;
            }
        }

    }

    .listContent.listType_detail {
        > ul {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: flex-start;
        }

        $liHeight: 320px;
        $liContentHeight: $liHeight - 20px;
        $liImgRate: 4/3;
        $liImgWidth: $liHeight/$liImgRate;
        $liMetaWidth: $liHeight;

        > ul > li {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            height: $liHeight;

            padding: 10px;
        }

        > ul > li > div {
            margin-right: 10px;
            height: $liHeight - 20px;

            &:last-child {
                margin-right: 0;
            }
        }

        .ct_alpha {
            width: $liImgWidth;
            max-width: $liImgWidth;
            min-width: $liImgWidth;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;

            .ct_icon {
                width: $liImgWidth;
                font-size: $liImgWidth * 0.8;
                line-height: $liImgWidth;
                display: block;
                text-align: center;
            }

            .ct_cover {
                max-width: $liImgWidth - 20px;
                max-height: $liContentHeight - 20px;
            }
        }

        .ct_meta {
            > div {
                width: $liMetaWidth - 20px;
                display: block;
            }

            input, textarea {
                width: $liMetaWidth - 20px;
            }

            textarea {
                height: $fontSize*6;
            }

            .ct_operate {
                .active {
                    color: hsla(333, 70%, 70%, 1);
                }
            }
        }

        .ct_tag {
            min-width: $liMetaWidth;
            /*overflow: hidden;*/
            /*text-overflow: ellipsis;*/

            dl {
                display: block;
                margin-bottom: 0;
                position: relative;
            }

            dt {
                display: inline-block;
                margin-bottom: 5px;
                line-height: $fontSize;
            }

            dd {
                position: relative;
            }

            input {
                width: $liMetaWidth;
                text-indent: 1em;
            }


        }

        //(240+320+320*1.5+20)/0.9166667
        @media (max-width: 1200px) {
            > ul > li {
                flex-wrap: wrap;
                height: auto;
            }
            .ct_tag {
                min-width: $liImgWidth + $liMetaWidth + 10px;
                height: fit-content;
            }
        }
        //(240+320+20)+15*2
        @media (max-width: 610px) {
            > ul {
                flex-direction: column;
            }
            > ul > li {
                flex-direction: column;
            }
            .ct_alpha {
                width: 100%;
                max-width: 100%;
                min-width: 100%;

                .ct_cover {
                    max-width: 100%;
                }
            }
            .ct_meta {
                > div {
                    width: 100%;
                }
            }
            .ct_tag, .ct_meta {
                height: fit-content;
                min-width: auto;
            }
        }
    }
</style>

<script>
    import store from '../store';

    export default {
        name         : "File",
        // el     : '#msg',
        store        : store,
        //dir是可选的，从收藏夹进入不传入dir
        props        : [
            'item',
            'dir',
            'listType',
            'fromList'
        ],
        data         : function () {
            return {
                editMetaFlag   : 0,
                editTagFlag    : 0,
                //tag 部分
                showTagSelector: false,
                tagSelector    : [],
            }
        },
        watch        : {
        },
        created      : function () {
        },
        mounted      : function () {
            document.getElementById('app').addEventListener('click', this.searchTagClear);
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        beforeDestroy: function () {
            document.getElementById('app').removeEventListener('click', this.searchTagClear)
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
             * @todo api
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
             * @todo api
             * */
            saveMeta      : function () {
                console.info('list: saveMeta');
                this.editMetaFlag = 0;
            },
            /**
             * @todo api
             * */
            setCover      : function () {
                console.info('list: setCover');
                if (this.dir)
                    this.dir.cover_id = this.item.id;
            },
            /**
             * @todo api
             * */
            favourite     : function () {
                console.info(`list: favourite ${this.item.id}`);
                this.item.favourite = this.item.favourite ? 0 : 1;
            },
            /**
             * @todo api @use $parent
             * */
            deleteFile    : function () {
                console.info('list: deleteFile');
                for (let i1 = 0; i1 < this.$parent.list.length; i1++) {
                    if (this.item.id !== this.item.id) continue;
                    this.$parent.list.splice(i1, 1);
                }
            },
            // -------------------------------------------
            /**
             * @todo api
             * */
            addTag        : function (tagId) {
                console.debug('list: addTag:' + this.item.id + '\t' + tagId);
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
                console.debug(`item found ${this.item.id}`);
                console.info(this.item);
                let hasGroup = false;
                let hasTag   = false;
                //查找 tag group
                for (let i2 = 0; i2 < this.item.tag.length; i2++) {
                    if (this.item.tag[i2].id !== tag.group_id) continue;
                    console.debug(`group found ${this.item.id} ${i2}`);
                    console.info(this.item.tag[i2]);
                    hasGroup = true;
                    //查找 tag
                    for (let i3 = 0; i3 < this.item.tag[i2].sub.length; i3++) {
                        if (this.item.tag[i2].sub[i3].id !== tag.id) continue;
                        console.debug(`tag found ${this.item.id} ${i2} ${i3}`);
                        console.info(this.item.tag[i2].sub[i3]);
                        hasTag = true;
                        //如果存在 tag ，不写入
                        break;
                    }
                    //无 tag 加 tag
                    if (!hasTag) {
                        this.item.tag[i2].sub.push(
                            {id: tag.id, name: tag.name,}
                        );
                    }
                }
                //无 group 加 group
                if (!hasGroup) {
                    this.item.tag.push(
                        {
                            id  : tag.group_id,
                            name: tag.group_name,
                            sub : [
                                {id: tag.id, name: tag.name,},
                            ],
                        })
                }
                this.searchTagClear();
            },
            editTag       : function () {
                console.info('list: editTag');
                this.editTagFlag = 1;
            },
            /**
             * @todo api
             * */
            saveTag       : function () {
                console.info('list: saveTag');
                this.editTagFlag = 0;
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