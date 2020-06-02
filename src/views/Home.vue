<template>
    <div class="home">
        <div>in homo.vue</div>
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import store      from "../store";
    import router     from "../router";

    export default {
        name      : 'Home',
        components: {
            HelloWorld
        },
        store     : store,
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
                    return this.$store.state.pageSet;
                },
                set: function (val) {
                    console.info('home: param:page set');
                    this.$store.commit('setPage', val);
                },
            }
        },
        created   : function () {
            console.info(this.$store);
            console.info(this.page);
            // this.page = this.$store.state.pageSet;
        },
        methods   : {
            query: function () {

            }
        },
    }
</script>
