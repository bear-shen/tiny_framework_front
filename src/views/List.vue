<!--
这里还是有些毛病的，
现在的想法是文件夹和文件都具有同样的属性
点击文件则进入不同的处理环节
点击文件夹则进入文件夹

关键是文件夹和文件的数据怎么整合，
要么就功能全部做在列表上，详情页什么都不做

-->
<template>
    <div class="list">
        <div class="listHeader">
            <ul class="listHeaderBread breadcrumb">
                <li class="breadcrumb-item" v-for="bread in navi" v-on:click="goto(bread.type,bread.id)">{{bread.name}}</li>
            </ul>
            <div class="listHeaderSearch">
                <input type="text" placeholder="search" v-model="searchTxt">
                <button type="button" class="btn btn-dark sysIcon sysIcon_search" v-on:click="goto('search',0)"></button>
            </div>
            <div class="listHeaderOperates">
                <button type="button" class="btn btn-dark sysIcon sysIcon_addfile" v-on:click="addFile"></button>
                <button type="button" class="btn btn-dark sysIcon sysIcon_addfolder" v-on:click="addFolder"></button>
            </div>
            <div class="listHeaderSort">
                <select v-model="sort">
                    <option value="id_asc">id ↑</option>
                    <option value="id_desc">id ↓</option>
                    <option value="name_asc">name ↑</option>
                    <option value="name_desc">name ↓</option>
                    <option value="crt_asc">crt time ↑</option>
                    <option value="crt_desc">crt time ↓</option>
                    <option value="upd_asc">upd time ↑</option>
                    <option value="upd_desc">upd time ↓</option>
                </select>
            </div>
            <div class="listHeaderLayout">
                <button type="button" :class="['btn','btn-dark','sysIcon','sysIcon_listType_text',{active:listTypeLocal==='text'}]" v-on:click="changeListType('text')"></button>
                <button type="button" :class="['btn','btn-dark','sysIcon','sysIcon_listType_detail',{active:listTypeLocal==='detail'}]" v-on:click="changeListType('detail')"></button>
                <button type="button" :class="['btn','btn-dark','sysIcon','sysIcon_listType_img',{active:listTypeLocal==='img'}]" v-on:click="changeListType('img')"></button>
            </div>
        </div>
        <div :class="['listContent','listType_'+listTypeLocal]">
            <ul>
                <li v-for="item in list" :data-id="item.id" :class="[item.tag.length?'hasTag':'noTag']">
                    <div class="ct_alpha" v-on:click="goto(item.type==='folder'?'directory':'file',item.id)">
                        <span v-if="!item.cover || listTypeLocal==='text'" :class="['ct_icon','listIcon','listIcon_file_'+item.type]"></span>
                        <img v-if="item.cover && listTypeLocal!=='text'" class="ct_cover" :src="item.cover" alt="">
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
                                    <span class="sysIcon sysIcon_heart-o"></span>&nbsp;fave
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
            </ul>
        </div>
        <!--        <file-detail v-bind:file-detail="detail"/>-->
        <!--        <div class="listUploadAplha">-->
        <!--        </div>-->

    </div>
</template>

<style lang="scss">

    .listHeader {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin-bottom: $fontSize*0.5;

        &, & * {
            font-size: $fontSize;
            height: $fontSize*2;
            line-height: $fontSize*2;
            padding-left: 0;
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
            white-space: nowrap;
            vertical-align: top;
        }

        button, input {
            width: $fontSize*2;
            height: $fontSize*2;
            padding-left: 0;
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
        }

        input[type="text"] {
            width: $fontSize * 10;
            border-radius: $fontSize*0.25;
            height: $fontSize*2;
            text-indent: 0.5em;
        }

        .listHeaderBread {
            width: 80%;
            padding-left: 1em;
            padding-top: 0;
            padding-bottom: 0;
            margin-bottom: 0;

            li {
                cursor: pointer;
            }
        }

        .listHeaderSearch, .listHeaderOperates, .listHeaderSort, .listHeaderLayout {
            margin-left: 1em;
        }

        .listHeaderSort {
            option {
                text-align: center;
            }
        }

        .listHeaderLayout button {
        }

        .listHeaderLayout button.active {
        }
    }

    @media (max-width: 1199px) {
        .listHeader {
            flex-wrap: wrap;
            white-space: normal;
            // height: $fontSize*4.5;
            height: auto;
            justify-content: flex-end;

            input[type="text"] {
                //width: calc(100vw - #{$fontSize *2 *7} - 40px);
                width: calc(100% - #{$fontSize*2});
                border-radius: $fontSize*0.25;
                height: $fontSize*2;
                text-indent: 0.5em;
            }

            .listHeaderBread,
            .listHeaderSearch,
            .listHeaderOperates,
            .listHeaderSort,
            .listHeaderLayout {
                width: auto;
            }

            .listHeaderSearch {
                margin-left: 0;
            }

            .listHeaderOperates, .listHeaderSort, .listHeaderLayout {
                margin-left: 8px;
                //margin-right: 8px;
            }

            .listHeaderBread {
                order: 4;
                width: 100%;
                margin-top: 0.5*$fontSize;
            }

            .listHeaderSearch {
                order: 1;
                margin-bottom: 8px;
                width: 100%;
            }

            .listHeaderOperates {
                order: 2;
            }

            .listHeaderSort {
                order: 3;
            }

            .listHeaderLayout {
                order: 3;
            }
        }
    }

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

            padding: 10px 0 10px 0;
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
                width: $liMetaWidth;
                display: block;
            }

            input, textarea {
                width: $liMetaWidth;
            }

            textarea {
                height: $fontSize*6;
            }

            .ct_operate {
                .is_favourite {
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

            .ct_tag_hinter {
                list-style: none;
                padding: 10px 0;
                background-color: rgba(0, 0, 0, 0.3);
                position: absolute;
                top: $fontSize*2;

                li {
                    width: $liMetaWidth - 20px;
                    line-height: $fontSize*1.5;
                    padding: 0 10px;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.3);
                    }
                }
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
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";
    import GenFunc    from '../lib/GenFuncLib'
    import Helper     from '../lib/Helper'
    // import Popup    from '../components/Popup'

    /**
     * fileType:
     * folder
     * image
     * binary
     * text
     * video
     * audio
     *
     * naviType:
     * directory
     * tag
     * search
     * */
    export default {
        name         : 'List',
        components   : {},
        store        : store,
        watch        : {
            $route   : function (to, from) {
                console.info(`list: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                // console.info(router.currentRoute.params);
                this.fillParam(router.currentRoute.query);
                // this.currentRoute = router.currentRoute;
                this.query(this.param, this.page).then(this.fillData);
            },
            page     : function (to, from) {
                console.info('list: param:page compute watched');
            },
            addTagTxt: function (to, from) {
                this.searchTag();
            },
            param    : function (to, from) {
                console.info(to);
                console.info(from);
            }
        },
        data         : function () {
            return {
                param          : {
                    from   : 0,
                    tag    : 0,
                    keyword: '',
                    sort   : this.sort,
                },
                listTypeLocal  : this.listType,
                // from query
                navi           : [],
                list           : [],
                dir            : {},
                // page: 1,
                //
                searchTxt      : '',
                //tag 部分
                editMetaId     : 0,
                editTagId      : 0,
                addTagTxt      : '',
                showTagSelector: false,
                tagSelector    : [],
            }
        },
        /*watch  : {
         page: function () {
         console.info('list: param:page computed');
         return this.$store.state.pageSet;
         }
         },*/
        computed     : {
            page    : {
                get: function () {
                    console.info('list: param:page get');
                    return this.$store.state.page;
                },
                set: function (val) {
                    console.info('list: param:page set');
                    this.$store.commit('setPage', val);
                },
            },
            listType: {
                get: function () {
                    console.info('list: param:listType get');
                    let data = localStorage.getItem('toshokan_framework_var_listType');
                    data     = data ? data : 'text';
                    return data;
                },
                set: function (val) {
                    console.info('list: param:listType set:' + val);
                    localStorage.setItem('toshokan_framework_var_listType', val);
                },
            },
            sort    : {
                get: function () {
                    console.info('list: param:sort get');
                    let data = localStorage.getItem('toshokan_framework_var_list_sort');
                    data     = data ? data : 'id_desc';
                    return data;
                },
                set: function (val) {
                    console.info('list: param:sort set:' + val);
                    localStorage.setItem('toshokan_framework_var_list_sort', val);
                },
            },
        },
        created      : function () {
            console.debug('List.vue create');
            // console.info(this);
            console.info(router.currentRoute);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.listTypeLocal = this.listType;
            this.fillParam(router.currentRoute.query);
            this.query(this.param, this.page).then(this.fillData);
            this.$parent.pushMsg(
                'list props success',
                'info'
            );

            globalDbg = this;
        },
        mounted      : function () {
            console.debug('List.vue mount');
            document.getElementById('app').addEventListener('click', this.searchTagClear);
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        beforeDestroy: function () {
            document.getElementById('app').removeEventListener('click', this.searchTagClear)
        },
        updated      : function () {
            // console.info('List.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods      : {
            /**
             * @todo api
             * @param param object
             * @param page int 分开写是因为 page 是计算参数
             * @return Promise
             *  {
             *      list  :'',
             *      dir   :'',
             *      navi  :'',
             *      param :'',
             *  }
             * */
            query         : function (param, page) {
                console.info('list: query');
                console.info(this);
                // console.info(page);
                // console.info(typeof page);
                param = Object.assign(param, {page: typeof page === 'undefined' ? 1 : page})
                // console.info(Popup);
                // Popup.show();
                let listData = [
                    {
                        id         : '0',
                        raw        : '/sample/cover.jpg',
                        normal     : '/sample/cover.jpg',
                        cover      : '/sample/cover.jpg',
                        cover_id   : '1',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'image',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '1',
                        raw        : '/sample/test.mp3',
                        normal     : '/sample/test.mp3',
                        cover      : '',
                        cover_id   : '1',
                        // alpha      : 'binary',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'audio',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '2',
                        raw        : '/sample/test.mp4',
                        normal     : '/sample/test.mp4',
                        cover      : '',
                        cover_id   : '1',
                        // alpha      : 'binary',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'video',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '3',
                        raw        : '/sample/test.md',
                        normal     : '',
                        cover      : '',
                        cover_id   : '1',
                        // alpha      : 'binary',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'binary',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '4',
                        raw        : '/sample/test.md',
                        normal     : '/sample/test.md',
                        cover      : '',
                        cover_id   : '1',
                        // alpha      : 'binary',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'text',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '5',
                        raw        : '/sample/smp2.jpg',
                        normal     : '/sample/smp2.jpg',
                        cover      : '/sample/smp2.jpg',
                        cover_id   : '1',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'image',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '6',
                        raw        : '/sample/smp1.jpg',
                        normal     : '/sample/smp1.jpg',
                        cover      : '/sample/smp1.jpg',
                        cover_id   : '1',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'image',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                    {
                        id         : '7',
                        raw        : '/sample/smp3.png',
                        normal     : '/sample/smp3.png',
                        cover      : '/sample/smp3.png',
                        cover_id   : '1',
                        title      : 'this is title this is title this is title this is title this is title',
                        description: 'this is description',
                        size       : '996 KB',
                        hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                        type       : 'image',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [
                            {
                                id  : 1,
                                name: 'female',
                                sub : [
                                    {id: 1, name: 'lolicon',},
                                    {id: 2, name: 'rape',},
                                    {id: 3, name: 'netorare',},
                                    {id: 4, name: 'defloration',},
                                    {id: 5, name: 'guro',},
                                    {id: 6, name: 'snuff',},
                                    {id: 7, name: 'drugs',},
                                    {id: 7, name: 'magical girl',},
                                    {id: 7, name: 'sleeping',},
                                    {id: 7, name: 'bunny girl',},
                                    {id: 7, name: 'animal ears',},
                                    {id: 7, name: 'tail',},
                                    {id: 7, name: 'small breast',},
                                    {id: 7, name: 'tiara',},
                                    {id: 7, name: 'pantyhose',},
                                    {id: 7, name: 'vampire',},
                                    {id: 7, name: 'baby',},
                                ],
                            },
                            {
                                id  : 2,
                                name: 'male',
                                sub : [
                                    {id: 4, name: 'tencales',},
                                    {id: 5, name: 'dilf',},
                                    {id: 6, name: 'sole male',},
                                ],
                            },
                            {
                                id  : 3,
                                name: 'misc',
                                sub : [
                                    {id: 4, name: 'full censorship',},
                                    {id: 5, name: 'webtoon',},
                                    {id: 6, name: 'story arc',},
                                ],
                            },
                        ],
                    },
                ];
                for (let i = 0; i < 10; i++) {
                    listData.push(listData[0]);
                }
                let navi = [
                    {
                        id  : 0,
                        name: 'root',
                        type: 'directory',
                    },
                    {
                        id  : 1,
                        name: 'dir a',
                        type: 'directory',
                    },
                    {
                        id  : 2,
                        name: 'dir c',
                        type: 'directory',
                    },
                    {
                        id  : 3,
                        name: 'dir d',
                        type: 'directory',
                    },
                    {
                        id  : 4,
                        name: 'dir d',
                        type: 'tag',
                    },
                    {
                        id  : 0,
                        name: 'dir d',
                        type: 'search',
                    },
                ];
                let dir  = listData[0];
                return new Promise((resolve, reject) => {
                    console.warn({list: listData, dir, navi, param});
                    return resolve({list: listData, dir, navi, param});
                });
            },
            /**
             * 写入参数
             * */
            fillParam     : function (param) {
                console.info('list: fillParam');
                // console.warn(param);
                for (let key in this.param) {
                    if (typeof param[key] === 'undefined') continue;
                    this.param[key] = param[key];
                }
                if (param.page) {
                    this.page = parseInt(param.page);
                }
            },
            fillData      : function (resolveData) {
                console.info('list: fillData');
                this.list = resolveData.list;
                //detail目前也就一个判断封面的功能，其实可以省掉的
                this.dir  = resolveData.dir;
                //navi 导航
                this.navi = resolveData.navi;
                //这边理论上不用重写,但是总之写都写了
                this.fillParam(resolveData.param);
            },
            changeListType: function (listType) {
                console.info('list: changeListType');
                this.listType      = listType;
                this.listTypeLocal = listType;
            },
            //
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
            goto          : function (type, targetId) {
                let query = {
                    from   : 0,
                    tag    : 0,
                    keyword: '',
                };
                switch (type) {
                    //点文件夹，跳转文件夹
                    case 'directory':
                        query.from = targetId;
                        break;
                    //tag 查询当前目录下的 tag
                    case 'tag':
                        query.from = this.dir.id;
                        query.tag  = targetId;
                        break;
                    //search 查询当前目录下的 txt
                    case 'search':
                        query.from    = this.dir.id;
                        query.keyword = this.searchTxt;
                        break;
                    //file 显示详情
                    case 'file':
                        let targetIndex = 0;
                        for (let i1 = 0; i1 < this.list.length; i1++) {
                            if (this.list[i1].id !== targetId) continue;
                            targetIndex = i1;
                            break;
                        }
                        return this.goDetail(targetIndex);
                        break;
                }
                let targetRoute = {path: '/', query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
            },
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
            addFolder     : function () {
                console.info('list: addFolder');
                this.$parent.showForm(
                    {
                        data    : {
                            title      : '',
                            description: '',
                        },
                        template: {
                            title      : {type: 'text', default: '', editable: true,},
                            description: {type: 'text', default: '', editable: true,},
                        },
                        submit  : function (data) {
                            console.info('list: callback: submit');
                            console.info(data);
                        },
                        cancel  : function (data) {
                            console.info('list: callback: cancel');
                            console.info(data);
                        },
                        error   : function (data) {
                            console.info('list: callback: error');
                            console.info(data);
                        },
                    });
                /*this.$parent.showLoader(
                 {type:'loader'}
                 );*/
                // this.$parent.showConfirm();
            },
            /**
             * @todo api
             * */
            addFile       : function () {
                console.info('list: addFile');
                this.$parent.showUploader(
                    {
                        data  : this.dir,
                        submit: function (data) {
                            console.info('list: callback: submit');
                            console.info(data);
                        },
                        cancel: function (data) {
                            console.info('list: callback: cancel');
                            console.info(data);
                        },
                        error : function (data) {
                            console.info('list: callback: error');
                            console.info(data);
                        },
                    });
                /*this.$parent.showLoader(
                 {type:'loader'}
                 );*/
                // this.$parent.showConfirm();
            }

        },
    }
</script>
