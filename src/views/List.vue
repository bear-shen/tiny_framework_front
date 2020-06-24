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
                <input type="text">
            </div>
            <div class="listHeaderOperates">
                <button type="button" class="btn btn-dark sysIcon sysIcon_delete"></button>
                <button type="button" class="btn btn-dark sysIcon sysIcon_addfolder"></button>
            </div>
            <div class="listHeaderLayout">
                <button type="button" class="btn sysIcon sysIcon_listType_text"></button>
                <button type="button" class="btn sysIcon sysIcon_listType_detail"></button>
                <button type="button" class="btn sysIcon sysIcon_listType_img"></button>
            </div>
        </div>
        <div class="listContent">
            <ul>
                <li>
                    <img src="http://" alt="">
                    <div class="listItemBar"></div>
                    <div>title</div>
                    <div>description</div>
                    <div>size</div>
                    <div>hash</div>
                    <div>type</div>
                    <div>time_create</div>
                    <div>time_update</div>
                    <div>
                        <dl>
                            <dt>tag:</dt>
                            <dd>tagA</dd>
                            <dd>tagB</dd>
                            <dd>tagD</dd>
                            <dd>tagC</dd>
                        </dl>
                        <dl>
                            <dt>tag:</dt>
                            <dd>tagA</dd>
                            <dd>tagB</dd>
                            <dd>tagD</dd>
                            <dd>tagC</dd>
                        </dl>
                        <dl>
                            <dt>tag:</dt>
                            <dd>tagA</dd>
                            <dd>tagB</dd>
                            <dd>tagD</dd>
                            <dd>tagC</dd>
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

        &, & * {
            font-size: $fontSize;
            height: $fontSize*2;
            line-height: $fontSize*2;
            padding-left: 0;
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
            margin: 0;
        }

        .listHeaderBread {
            width: 80%;
            padding-left: 1em;
        }

        .listHeaderSearch {
            width: 10%;

            input {
                width: 100%;
                height: 100%;
                line-height: 100%;
            }
        }

        .listHeaderOperates {
            width: 10%;
        }

        .listHeaderLayout {
            width: 10%;
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
            return {
                param: {},
                // page: 1,
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
