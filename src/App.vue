<template>
    <div id="app">
        <Header/>
        <div id="body" :class="['container-fluid']">
            <div id="" class="row">
                <div class="col-lg-1 nav-col">
                    <ul id="leftNavi" class="nav nav-pills nav-stacked ">
                        <li v-for="r in routes" :class="{active:currentRoute.path===r.path}">
                            <router-link :to="r.path">{{r.title}}</router-link>
                        </li>
                    </ul>
                </div>
                <!--<div id="content" class=" col-lg-11">
                    <form id="contentForm">
                        <label>Name:<input type="text" name="name" value=""></label>
                    </form>
                    <div id="contentList"></div>
                </div>-->
                <router-view id="content" class=" col-lg-11"></router-view>
            </div>
        </div>
        <div id="footer" class="nav navbar-fixed-bottom">
<!--            <div class="">-->
                <Msg/>
                <Paginator/>
<!--            </div>-->
        </div>
        <Loader/>
        <Popup/>
    </div>
</template>

<style lang="scss">


    body {
        padding-top: $footerHeight*1.25;
        padding-bottom: $footerHeight*1.25;
        min-height: calc(100vh /*- #{$footerHeight * 1.25*2}*/
        );
    }

    body > div {
        transition: 0.5s all;
    }

    #body {
        position: relative;
        display: block;
        padding-left: 0;
        padding-right: 0;

        .row {
            margin-right: 0;
            margin-left: 0;
        }
    }

    .col-lg-1 {
        padding-right: 0;
        padding-left: 0;
        white-space: nowrap;
    }

    #leftNavi.nav {
        position: fixed;
        left: 0;
        top: $footerHeight;
        z-index: 20;
        width: percentage(1/12);
        li{
            width: 100%;
        }

        > li > a {
            padding: 10px 15px 10px 0;
            text-align: right;
        }
    }

    #content {
        min-height: 70vh;
        word-break: break-word;
    }


    #footer {
        height: $footerHeight;
        line-height: $footerHeight;
        //#msg,#paginator{
        //  display: inline-block;
        //  white-space: nowrap;
        //}
        background-image: linear-gradient(180deg, #202020 0%, #2f2f2f 100%);
        border: none;

        .nav > li > a:hover, .nav > li > a:focus {
            background-color: #202020;
        }

        .nav.navbar-nav > li > a {
            color: #ddd;
            text-decoration: none;
            text-shadow: 0 0 0;

            &:hover, &:focus {
                background-color: rgba(0, 0, 0, 0.25);
                color: #ddd;
            }
        }

        .active {
            background-color: #666;
            color: #fff;
        }
    }


    @media(max-width: 1199px) {
        body {
            padding-top: $footerHeight*2;
            padding-bottom: $footerHeight*1.5;
        }

        .col-lg-1.nav-col {
            width: 0;
            padding-left: 0;
            padding-right: 0;
            flex-basis: 0;
        }
        .col-lg-11#content{
            width: 100vw;
            max-width: 100vw;
            flex-basis: 100%;
        }

        #leftNavi.nav {
            //position: fixed;
            top: $footerHeight;
            background-image: linear-gradient(0deg, #101010 0%, #202020 100%);
            width: 100vw;

            flex-direction: row;
            flex-wrap: nowrap;
            text-align: center;

            li {
                display: inline-block;

                a {
                    text-align: center;
                    padding: 0 $footerHeight/4;
                    font-size: $footerHeight/4;
                    line-height: $footerHeight*0.75;
                    height: $footerHeight*0.75;
                }
            }
        }
    }

    @media(max-width: 767px) {
        body {
            padding-top: $footerHeight;
            padding-bottom: $footerHeight*1.5;
        }
        #leftNavi.nav {
            top: 0;
            overflow-x: scroll;
            overflow-y: hidden;
        }
        #footer {
            height: $footerHeight*1.5;

        }
    }

    #content {
    }
</style>
<script>
    import Header    from "./components/Header";
    import Loader    from "./components/Loader";
    import Msg       from "./components/Msg";
    import Paginator from "./components/Paginator";
    import Popup     from "./components/Popup";
    import router    from "./router";
    import store     from "./store";

    console.log('Hello world');

    export default {
        components: {Popup, Paginator, Msg, Loader, Header},
        data      : function () {
            return {
                routes      : [],
                currentRoute: {},
                query       : {},
            };
        },
        store   : store,
        watch     : {
            $route: function (to, from) {
                console.info(`app: route to ${router.currentRoute.name}`);
                // console.info(to);
                // console.info(from);
                this.currentRoute = router.currentRoute;
            },
            /*page: function (to, from) {
                console.info('app: param:page compute watched');
            }*/
        },
        /*computed: {
            page: function () {
                console.info('app: param:page computed');
                return this.$store.state.page;
            }
        },*/
        created   : function () {
            console.info('app created');
            // console.info(router);
            // console.info(router.options.routes);
            this.routes       = router.options.routes;
            this.currentRoute = router.currentRoute;
            // globalDbg         = router;

        },
    }
</script>