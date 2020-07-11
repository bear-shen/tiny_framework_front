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
                <li class="breadcrumb-item">root</li>
                <li class="breadcrumb-item">dir a</li>
                <li class="breadcrumb-item">dir b</li>
                <li class="breadcrumb-item">dir c</li>
            </ul>
            <div class="listHeaderSearch">
                <input type="text" placeholder="search">
                <button type="button" class="btn btn-dark sysIcon sysIcon_search"></button>
            </div>
            <div class="listHeaderOperates">
                <button type="button" class="btn btn-dark sysIcon sysIcon_delete"></button>
                <button type="button" class="btn btn-dark sysIcon sysIcon_addfolder"></button>
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
                    <div class="ct_alpha">
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
                                 :class="['btn', 'btn-dark', {'active':detail.cover_id===item.id}]"
                                 v-on:click="setCover(item.id)"
                            ><span class="sysIcon sysIcon_edit"></span>&nbsp;cover
                            </div>

                            <template v-if="editMetaId===item.id">
                                <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveMeta(item.id)">
                                    <span class="sysIcon sysIcon_sync"></span>&nbsp;info
                                </div>
                            </template>
                            <template v-else>
                                <div :class="['btn', 'btn-dark']" v-on:click="editMeta(item.id)">
                                    <span class="sysIcon sysIcon_edit"></span>&nbsp;info
                                </div>
                            </template>

                            <template v-if="editTagId===item.id">
                                <div :class="['btn', 'btn-dark', 'active']" v-on:click="saveTag(item.id)">
                                    <span class="sysIcon sysIcon_sync"></span>&nbsp;tag
                                </div>
                            </template>
                            <template v-else>
                                <div :class="['btn', 'btn-dark']" v-on:click="editTag(item.id)">
                                    <span class="sysIcon sysIcon_edit"></span>&nbsp;tag
                                </div>
                            </template>
                        </div>
                    </div>
                    <template v-if="editTagId===item.id">
                        <div class="ct_tag">
                            <dl v-for="group in item.tag" :data-id="group.id">
                                <dt>{{group.name}}:</dt>
                                <dd v-for="tag in group.sub" :data-id="tag.id" class="btn btn-dark">
                                    {{tag.name}}
                                    <span class="sysIcon sysIcon_delete"></span>
                                </dd>
                            </dl>
                            <dl>
                                <dt>add:</dt>
                                <dd><input type="text" v-model="addTagTxt" placeholder="separate by ,"></dd>
                            </dl>
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="item.tag.length" class="ct_tag">
                            <dl v-for="group in item.tag" :data-id="group.id">
                                <dt>{{group.name}}:</dt>
                                <dd v-for="tag in group.sub" :data-id="tag.id" class="btn btn-dark">
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
        }

        .listHeaderSearch, .listHeaderOperates, .listHeaderLayout {
            margin-left: 1em;
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

            input[type="text"] {
                width: calc(100vw - #{$fontSize *2 *7} - 40px);
                border-radius: $fontSize*0.25;
                height: $fontSize*2;
                text-indent: 0.5em;
            }

            .listHeaderBread,
            .listHeaderSearch,
            .listHeaderOperates,
            .listHeaderLayout {
                width: auto;
            }

            .listHeaderSearch, .listHeaderOperates, .listHeaderLayout {
                margin-left: 0;
            }

            .listHeaderBread {
                order: 4;
                width: 100%;
                margin-top: 0.5*$fontSize;
            }

            .listHeaderSearch {
                order: 1;
            }

            .listHeaderOperates {
                order: 2;
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
            display: table-cell;
            line-height: 2.5 * $listFontSize;
            font-size: $listFontSize;
            vertical-align: middle;
        }

        /*.ct_alpha,*/
        /*.ct_icon,*/
        .ct_cover,
            /*.ct_title,*/
        .ct_description,
            /*.ct_size,*/
            /*.ct_hash,*/
        .ct_type,
        .ct_time_create,
            /*.ct_time_update,*/
        .ct_tag {
            display: none;
        }

        .ct_alpha, .ct_icon {
            width: $listFontSize*2;
            font-size: $listFontSize*2;
        }

        .ct_title {
        }

        .ct_hash {
            width: $listFontSize*20;
        }

        .ct_size {
            width: $listFontSize*5;
        }

        .ct_time_update {
            width: $listFontSize*10;
        }

        @media (max-width: 1199px) {
            .ct_hash,
            .ct_time_update {
                display: none;
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
            height: $liHeight;

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
            }
        }

        .ct_tag {
            min-width: $liMetaWidth;
            overflow: hidden;
            text-overflow: ellipsis;

            dl {
                display: block;
                margin-bottom: 0;
            }

            dt {
                display: inline-block;
                margin-bottom: 5px;
                line-height: $fontSize;
            }

            input {
                width: $liMetaWidth;
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
            > ul{
                flex-direction: column;
            }
            > ul > li {
                flex-direction: column;
            }
            .ct_alpha {
                width: 100%;
                max-width: 100%;
                min-width: 100%;
                .ct_cover{
                    max-width: 100%;
                }
            }
            .ct_meta {
                >div{
                    width: 100%;
                }
            }
            .ct_tag,.ct_meta {
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
    import Uploader   from "../components/Uploader";

    export default {
        name      : 'List',
        components: {
            Uploader,
        },
        store     : store,
        watch     : {
            $route: function (to, from) {
                console.info(`list: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.currentRoute = router.currentRoute;
                this.query();
            },
            page  : function (to, from) {
                console.info('list: param:page compute watched');
            }
        },
        data      : function () {
            let listData = [
                {
                    id         : '0',
                    cover      : '/sample/cover.jpg',
                    cover_id   : '1',
                    // alpha      : 'binary',
                    title      : 'this is title this is title this is title this is title this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'folder',
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
                //

                {
                    id         : '1',
                    cover      : '/sample/smp1.jpg',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'image',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                {
                    id         : '0',
                    cover      : '/sample/smp2.jpg',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                {
                    id         : '0',
                    cover      : '/sample/smp3.png',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                {
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'text',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                {
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                {
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'folder',
                    time_create: '1919-08-10 11:45:14',
                    time_update: '1919-08-10 11:45:14',
                    tag        : [],
                },
                //
                {
                    id         : '0',
                    cover      : '/sample/smp1.jpg',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
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
                    id         : '0',
                    cover      : '/sample/smp2.jpg',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
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
                    id         : '0',
                    cover      : '/sample/smp3.png',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
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
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'text',
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
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'binary',
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
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'video',
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
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'audio',
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
                    id         : '0',
                    cover      : '',
                    // alpha      : 'binary',
                    title      : 'this is title',
                    description: 'this is description',
                    size       : '996 KB',
                    hash       : '4A4A808691495B1370A9C1F7620EEFD0',
                    type       : 'image',
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
            return {
                param        : {},
                // page: 1,
                listTypeLocal: this.listType,
                list         : listData,
                detail       : listData[0],
                editMetaId   : 0,
                editTagId    : 0,
                addTagTxt    : '',
            }
        },
        /*watch  : {
         page: function () {
         console.info('list: param:page computed');
         return this.$store.state.pageSet;
         }
         },*/
        computed  : {
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
        },
        created   : function () {
            console.info('List.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
            this.listTypeLocal = this.listType;
        },
        mounted   : function () {
            console.info('List.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        updated   : function () {
            console.info('List.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            query         : function () {
                console.info('list: query');
            },
            changeListType: function (listType) {
                console.info('list: changeListType');
                this.listType      = listType;
                this.listTypeLocal = listType;
            },
            editMeta      : function (itemId) {
                console.info('list: editMeta');
                this.editMetaId = itemId;
            },
            editTag       : function (itemId) {
                console.info('list: editTag');
                this.editTagId = itemId;
            },
            saveMeta      : function (itemId) {
                console.info('list: saveMeta');
                this.editMetaId = 0;
            },
            saveTag       : function (itemId) {
                console.info('list: saveTag');
                this.editTagId = 0;
            },
            setCover      : function (itemId) {
                console.info('list: setCover');
            },
        },
    }
</script>
