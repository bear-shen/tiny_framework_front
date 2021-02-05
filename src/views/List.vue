<!--
几种列表使用不不同的vue文件导入
但是没想好操作怎么合并，现在是复制过去的
-->
<template>
    <div class="list">
        <div class="listHeader">
            <ul class="headerGroup breadcrumb">
                <li v-for="bread in navi" v-on:click="goto(bread.type,bread.id)">
                    {{bread.name}}
                </li>
            </ul>
            <div class="headerGroup search">
                <input type="text" placeholder="search" v-model="queryData.keyword">
                <button type="button" class="sysIcon sysIcon_search" v-on:click="goto('search',0)"></button>
            </div>
            <div class="headerGroup sort">
                <select v-model="queryData.sort">
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
            <div class="headerGroup operate">
                <button type="button" class="sysIcon sysIcon_addfile" v-on:click="addFile"></button>
                <button type="button" class="sysIcon sysIcon_addfolder" v-on:click="addFolder"></button>
            </div>
            <div class="headerGroup layout">
                <button type="button" :class="['sysIcon','sysIcon_listType_text',{active:listType==='text'}]" v-on:click="changeListType('text')"></button>
                <button type="button" :class="['sysIcon','sysIcon_listType_detail',{active:listType==='detail'}]" v-on:click="changeListType('detail')"></button>
                <button type="button" :class="['sysIcon','sysIcon_listType_img',{active:listType==='image'}]" v-on:click="changeListType('image')"></button>
            </div>
        </div>
        <ul :class="['listContent','listType_'+listType]">
            <file-list-detail
                    v-if="listType==='detail'" v-for="(item,index) in list"
                    :key="index" :item="item" :dir="dir" :from="'list'"
            ></file-list-detail>
            <file-list-text
                    v-if="listType==='text'" v-for="(item,index) in list"
                    :key="index" :item="item" :dir="dir" :from="'list'"
            ></file-list-text>
            <file-list-image
                    v-if="listType==='image'" v-for="(item,index) in list"
                    :key="index" :item="item" :dir="dir" :from="'list'"
            ></file-list-image>
        </ul>
        <!--        <file-detail v-bind:file-detail="detail"/>-->
        <!--        <div class="listUploadAplha">-->
        <!--        </div>-->

    </div>
</template>

<style lang="scss">
    input[type="text"] {
    }
    #content.list {
        .listHeader {
            .breadcrumb {
                white-space: nowrap;
                background-color: map_get($colors, header_bread_bk);
                width: 50vw;
                overflow: hidden;
                text-overflow: ellipsis;
                li {
                    padding-left: $fontSize;
                    &::before {
                        content: '>';
                        display: inline-block;
                        padding-right: $fontSize;
                    }
                }
            }
            .search {}
            .sort {}
            .operate {}
            .layout {}
            input {
                width: $fontSize*10;
            }
            select {
                width: $fontSize*5;
            }
        }
        .listContent {}
        @media (max-width: $tabletWidth) {
            .listHeader {
                .headerGroup {
                    > * {
                    }
                }
                .breadcrumb {
                    width: calc(100% - #{$fontSize*13.25});
                }
                .search {
                    margin-right: 0;
                }
                .sort {}
                .operate {}
                .layout {}
            }
            .listContent {}
        }
        @media (max-width: $mobileWidth) {
            .listHeader {
                .headerGroup {
                    > * {
                    }
                }
                .breadcrumb {
                    width: 100%;
                    margin-right: 0;
                }
                .search {
                    margin-right: $fontSize*0.25;
                }
                .sort {}
                .operate {}
                .layout {}
            }
            .listContent {}
        }
    }
</style>

<script>
    // @ is an alias to /src
    import store          from "../store";
    import router         from "../router";
    import GenFunc        from '../lib/GenFuncLib'
    import Helper         from '../lib/Helper'
    import FileListDetail from "../components/FileListDetail";
    import FileListText   from "../components/FileListText";
    import FileListImage  from "../components/FileListImage";
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
        components   : {FileListImage, FileListText, FileListDetail},
        store        : store,
        watch        : {
            $route          : function (to, from) {
                console.info(`list: route to ${router.currentRoute.name}`);
                this.fillQuery(router.currentRoute.query);
                this.query(this.queryData, this.page).then(this.fillData);
            },
            /*queryData       : function (to, from) {
             console.info(to);
             console.info(from);
             },*/
            'queryData.sort': function (to, from) {
                console.info(`list: queryData.sort moded`);
                this.goto('search');
            },
        },
        data         : function () {
            return {
                queryData: {
                    from   : 0,
                    tag    : 0,
                    keyword: '',
                    sort   : 'id_asc',
                },
                page     : 0,
                //
                listType : this.listTypeLocal,
                // from query
                navi     : [],
                list     : [],
                dir      : {},
                // page: 1,
                //
            }
        },
        /*watch  : {
         page: function () {
         console.info('list: param:page computed');
         return this.$store.state.pageSet;
         }
         },*/
        computed     : {
            listTypeLocal: {
                get: function () {
                    console.info('list: query:listType get');
                    let data = localStorage.getItem('toshokan_framework_var_listType');
                    data     = data ? data : 'text';
                    return data;
                },
                set: function (val) {
                    console.info('list: query:listType set:' + val);
                    localStorage.setItem('toshokan_framework_var_listType', val);
                },
            },
            sortLocal    : {
                get: function () {
                    console.info('list: query:sortLocal get');
                    let data = localStorage.getItem('toshokan_framework_var_list_sort');
                    data     = data ? data : 'id_desc';
                    return data;
                },
                set: function (val) {
                    console.info('list: query:sortLocal set:' + val);
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
            this.listType   = this.listTypeLocal;
            this.query.sort = this.sortLocal;
            this.fillQuery(router.currentRoute.query);
            this.query(this.queryData, this.page).then(this.fillData);
            store.commit(
                'pushMsg',
                {type: 'info', data: 'list props success'}
            );
            globalDbg = this;
        },
        mounted      : function () {
            console.debug('List.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
            store.commit('usePagination');
            this.popupDev();

        },
        beforeDestroy: function () {
        },
        updated      : function () {
            // console.info('List.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;

        },
        methods      : {
            /**
             * @todo api file_list
             * 拆开是为了方便外部调用
             *
             * @return Promise
             *  {
             *      list  :'',
             *      dir   :'',
             *      navi  :'',
             *      query :'',
             *  }
             * @param {{name: string}|{}|{from: number, tag: number, sort: *, keyword: string}} query
             * @param {*} page
             * */
            query         : function (query, page) {
                console.info('list: query');
                console.info(this);
                // console.info(page);
                // console.info(typeof page);
                query = GenFunc.copyObject(query);
                page  = typeof query.page !== 'undefined' ? 1 : query.page;
                query = Object.assign(query, {page})
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
                        tag        : [],
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
                        tag        : [],
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
                        type       : 'folder',
                        favourite  : '1',
                        time_create: '1919-08-10 11:45:14',
                        time_update: '1919-08-10 11:45:14',
                        tag        : [],
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
                    console.warn({list: listData, dir, navi, query});
                    return resolve({list: listData, dir, navi, query});
                });
            },
            /**
             * 写入参数
             * */
            fillQuery     : function (query) {
                console.info('list: fillQuery');
                // console.warn(query);
                let queryNames = Object.getOwnPropertyNames(query);
                for (let i1 = 0; i1 < queryNames.length; i1++) {
                    let name = queryNames[i1];
                    if (name === 'page') {
                        this.page = query[name];
                    } else {
                        this.queryData[name] = query[name];
                    }
                }
            },
            fillData      : function (resolveData) {
                console.info('list: fillData');
                this.list = resolveData.list;
                //detail目前也就一个判断封面的功能，其实可以省掉的
                this.dir  = resolveData.dir;
                //navi 导航
                this.navi = resolveData.navi;
                //这边理论上不用重写,主要是准备到时候把查询字段修正后返回
                this.fillQuery(resolveData.query);
            },
            changeListType: function (listType) {
                console.info('list: changeListType');
                this.listType      = listType;
                this.listTypeLocal = listType;
            },
            //
            goto          : function (type, targetId) {
                console.info(`list: goto ${type} ${targetId}`);
                let query = GenFunc.copyObject(this.queryData);
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
                        query.from = this.dir.id;
                        break;
                    //file 显示详情
                    case 'file':
                        let targetIndex = 0;
                        for (let i1 = 0; i1 < this.list.length; i1++) {
                            if (this.list[i1].id !== targetId) continue;
                            targetIndex = i1;
                            break;
                        }
                        store.commit('popup', {
                            type: 'file',
                            info: {
                                currentId: targetId,
                                query    : this.query,
                                queryData: this.queryData,
                                goto     : this.goto,
                            },
                        });
                        return;
                }
                let targetRoute = {path: '/', query: Object.assign(query, {page: 1})};
                if (Helper.isSameRoute(targetRoute, router.currentRoute)) {
                    console.debug(`isSameRoute`);
                    return false;
                }
                router.push(targetRoute);
            },
            /**
             * @todo api file_mkdir
             * */
            addFolder     : function () {
                console.info('list: addFolder');
                store.commit('popup', {
                    type: 'form',
                    info: {
                        title   : 'addFolder',
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
                    },
                });
                /*this.$parent.showLoader(
                 {type:'loader'}
                 );*/
                // this.$parent.showConfirm();
            },
            addFile       : function () {
                store.commit('popup', {
                    type: 'login',
                    info: {},
                });
                return;
                console.info('list: addFile');
                /*store.commit('popup', {
                 type: 'login',
                 });*/
                store.commit('popup', {
                    type: 'uploader',
                    info: {
                        dir_id: this.dir.id,
                    }
                });
                /*this.$parent.showLoader(
                 {type:'loader'}
                 );*/
                // this.$parent.showConfirm();
            },
            popupDev      : function () {
                console.warn('popupDev');
                let type = 'version';
                switch (type) {
                    case 'form':
                        store.commit('popup', {
                            type: 'form',
                            info: {
                                title   : 'addFolder',
                                data    : {
                                    title      : '',
                                    description: '',
                                    locked     : 'locked',
                                    datetime   : '1919-08-10T11:45:14',
                                    textarea   : 'textarea',
                                    checkbox   : [],
                                    radio      : 'radio',
                                },
                                template: {
                                    title      : {type: 'text', default: '', editable: true,},
                                    description: {type: 'text', default: '', editable: true,},
                                    locked: {type: 'text', default: '', editable: false,},
                                    datetime: {type: 'datetime', default: '', editable: true,},
                                    textarea: {type: 'textarea', default: '', editable: true,},
                                    checkbox: {type: 'checkbox', default: '', editable: true,},
                                    _checkbox: [
                                        'val_1',
                                        'val_2',
                                        'val_3',
                                    ],
                                    radio: {type: 'radio', default: '', editable: true,},
                                    _radio: [
                                        'val_1',
                                        'val_2',
                                        'val_3',
                                    ],
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
                            },
                        });
                        break;
                    case 'loader':
                        store.commit('popup', {
                            type: 'loader',
                        });
                        break;
                    case 'confirm':
                        store.commit('popup', {
                            type: 'confirm',
                            info: {
                                data: 'confirm test',
                            }
                        });
                        break;
                    case 'uploader':
                        store.commit('popup', {
                            type: 'uploader',
                            info: {
                                dir_id: 1,
                            }
                        });
                        break;
                    case 'file':
                        store.commit('popup', {
                            type: 'file',
                            info: {
                                currentId: 1,
                                query    : this.query,
                                queryData: this.queryData,
                            }
                        });
                        break;
                    case 'list':
                        store.commit('popup', {
                            type: 'list',
                            info: {
                                title : 'move to:',
                                submit: (dirItem, dirRoute) => {
                                    console.info(`moveFile to ${JSON.stringify(dirItem)}`);
                                    this.delFromList();
                                },
                            }
                        });
                        break;
                    case 'login':
                        store.commit('popup', {
                            type: 'login',
                            info: {}
                        });
                        break;
                    case 'version':
                        store.commit('popup', {
                            type: 'version',
                            info: {
                                id: 1,
                            }
                        });
                        break;
                    case 'register':
                        store.commit('popup', {
                            type: 'register',
                            info: {}
                        });
                        break;
                    case 'hide':
                        store.commit('popup', {
                            type: 'hide',
                        });
                        break;
                }
            }
        },
    }
</script>
