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
                <button type="button" class="btn btn-dark sysIcon sysIcon_listType_text"></button>
                <button type="button" class="btn btn-dark sysIcon sysIcon_listType_detail"></button>
                <button type="button" class="btn btn-dark sysIcon sysIcon_listType_img"></button>
            </div>
        </div>
        <div class="listContent">
            <ul>
                <li v-for="item in list" :data-id="item.id">
                    <div class="ct_alpha">
                        <span :class="['listIcon','listIcon_file_'+item.alpha]"></span>
                        <img class="ct_cover" :src="item.cover" alt="">
                    </div>
                    <div class="ct_title">{{item.title}}</div>
                    <div class="ct_description">{{item.description}}</div>
                    <div class="ct_size">{{item.size}}</div>
                    <div class="ct_hash">{{item.hash}}</div>
                    <div class="ct_type">{{item.type}}</div>
                    <div class="ct_time_create">{{item.time_create}}</div>
                    <div class="ct_time_update">{{item.time_update}}</div>
                    <div class="ct_tag">
                        <dl v-for="group in item.tag" :data-id="group.id">
                            <dt>{{group.name}}:</dt>
                            <dd v-for="tag in group.sub" :data-id="tag.id">{{tag.name}}</dd>
                        </dl>
                    </div>
                </li>
            </ul>
        </div>
        <div class="listUploadAplha">
        </div>
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
    }

    @media (max-width: 1199px) {
        .listHeader {
            flex-wrap: wrap;
            white-space: normal;
            height: $fontSize*4.5;

            input[type="text"] {
                width: calc(100vw - #{$fontSize *2 *7});
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
                console.info(`home: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.currentRoute = router.currentRoute;
                this.query();
            },
            page  : function (to, from) {
                console.info('home: param:page compute watched');
            }
        },
        data      : function () {
            let listData = [
                {
                    id         : '0',
                    cover      : '/img/cover.jpg',
                    alpha      : 'binary',
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
                }
            ];
            for (let i = 0; i < 10; i++) {
                listData.push(listData[0]);
            }
            return {
                param: {},
                // page: 1,
                list : listData,
            }
        },
        /*watch  : {
         page: function () {
         console.info('home: param:page computed');
         return this.$store.state.pageSet;
         }
         },*/
        computed  : {
            page: {
                get: function () {
                    console.info('home: param:page get');
                    return this.$store.state.page;
                },
                set: function (val) {
                    console.info('home: param:page set');
                    this.$store.commit('setPage', val);
                },
            }
        },
        created   : function () {
            console.info('Home.vue create');
            // console.info(this);
            // console.info(GenFunc);
            // console.info(UploaderLib);
            // this.page = this.$store.state.pageSet;
        },
        mounted   : function () {
            console.info('Home.vue mount');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        updated   : function () {
            console.info('Home.vue update');
            // console.info(this);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            query: function () {
                console.info('home: query');
            }
        },
    }
</script>
