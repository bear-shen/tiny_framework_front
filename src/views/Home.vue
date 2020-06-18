<template>
    <div class="home">
        <div>in homo.vue</div>
        <img alt="Vue logo" src="../assets/logo.png">
        <button v-on:click="query()">goto page 1</button>
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";
    import GenFunc from '../lib/GenFuncLib'
    import Uploader from '../lib/Uploader'

    export default {
        name      : 'Home',
        components: {
            HelloWorld
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
            page: function (to, from) {
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
            console.info(this);
            console.info(GenFunc);
            console.info(Uploader);
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
