<template>
    <div id="app">
        <Header/>
        <div id="body" :class="['container-fluid']">
            <div id="" :class="['row',{showTitle:showTitle}]">
                <div :class="['col-lg-1','nav-col']">
                    <ul id="leftNavi" :class="['nav','nav-pills','nav-stacked']">
                        <li class="toggler" v-on:click="toggler">
                            <a href="javascript:void(0)" title="toggle"><span class="sysIcon sysIcon_swap"></span></a>
                        </li>
                        <li v-for="r in routes" :class="{active:currentRoute.path===r.path}">
                            <router-link :to="r.path" :title="r.title">
                                <span :class="['navTxt']">{{r.title}}</span>
                                <span :class="['navIcon','sysIcon',r.icon,]"></span>
                            </router-link>
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

        li {
            width: 100%;
        }

        > li > a {
            padding: 10px 15px 10px 0;
            text-align: right;
        }

        .toggler {
            /* background-color: black; */
            text-align: right;
        }

        .navIcon {
            padding-left: 0.5em;
        }

        > li > a:hover, > li > a:focus {
            background-color: rgba(0, 0, 0, 0.25);
            color: #00aaff;
        }

        .navTxt {
            display: none;
        }
    }

    @media(min-width: 1200px) {
        $iconSize: 40px;
        .col-lg-1.nav-col {
            flex-basis: $iconSize;
        }

        #leftNavi.nav {
            width: $iconSize;
        }

        #content.col-lg-11 {
            //vw对滚动条支持不好，所以%
            width: calc(100% - #{$iconSize});
            flex: 0 0 calc(100% - #{$iconSize});
            max-width: calc(100% - #{$iconSize});
        }

        .showTitle {
            .col-lg-1.nav-col {
                flex-basis: 8.333333%;
            }

            #leftNavi.nav {
                width: 8.333333%;
            }

            #leftNavi.nav .navTxt {
                display: inline;
            }

            #content.col-lg-11.col-lg-11 {
                width: 91.66666667%;
                flex: 0 0 91.66666667%;
                max-width: 91.66666667%;
            }
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
        .col-lg-11#content {
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
            .navIcon {
                padding-left: 0;
            }

            .navTxt {
                display: none;
            }

            .toggler {
                display: none;
            }

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
        .showTitle #leftNavi.nav .navTxt {
            display: none;
        }
    }

    @media(max-width: 767px) {
        body {
            padding-top: $footerHeight;
            padding-bottom: $footerHeight*1.5;
        }
        #leftNavi.nav {
            top: 0;
            overflow-x: auto;
            overflow-y: hidden;
        }
        #footer {
            height: $footerHeight*1.5;

        }
    }

    #content {
    }


    /*
     *  @see https://www.cnblogs.com/amylis_chen/p/11995324.html
     *  @see https://www.cnblogs.com/ertingbo/p/7151566.html
     */


    html {
        @include smallScroll;
    }

    .pointer{
        cursor: pointer;
    }
</style>
<script>
    import router from "./router";
    import store  from "./store";


    import Header    from "./components/Header";
    import Msg       from "./components/Msg";
    import Paginator from "./components/Paginator";
    import Popup     from "./components/Popup";

    console.log('Hello world');

    export default {
        components: {
            Header   : Header,
            Msg      : Msg,
            Paginator: Paginator,
            Popup    : Popup
        },
        data      : function () {
            return {
                showTitle   : true,
                routes      : [],
                currentRoute: {},
            };
        },
        store     : store,
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
        created   : function () {
            console.info('app created');
            // console.info(router);
            // console.info(router.options.routes);
            this.routes       = router.options.routes;
            this.currentRoute = router.currentRoute;
            // globalDbg         = router;
            globalDbg         = this;
        },
        methods   : {
            toggler     : function () {
                this.showTitle = !this.showTitle;
            },
        },
    }
</script>