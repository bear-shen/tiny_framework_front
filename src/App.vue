<template>
    <div id="app">
        <Header/>
        <div id="body" :class="[{foldNav:foldNav}]">
            <ul id="nav">
                <li class="toggler" v-on:click="toggler">
                    <a href="javascript:void(0)" title="toggle"><span class="sysIcon sysIcon_swap"></span></a>
                </li>
                <li v-for="r in routes" :class="{active:currentRoute.path===r.path}">
                    <router-link :to="r.path" :title="r.title">
                        <span :class="['sysIcon',r.icon,]"></span>
                        <span :class="['txt']">{{r.title}}</span>
                    </router-link>
                </li>
            </ul>
            <!--<div id="content" class=" col-lg-11">
                <form id="contentForm">
                    <label>Name:<input type="text" name="name" value=""></label>
                </form>
                <div id="contentList"></div>
            </div>-->
            <router-view id="content" class=" col-lg-11"></router-view>
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
        padding-top: $headerHeight + $headerPad;
        padding-bottom: $footerHeight+ $footerPad;
        min-height: calc(100vh);
        margin: 0;
        background-color: map_get($colors, bk);
        color: map_get($colors, font);
        font-size: $fontSize;
        line-height: $fontSize;
        @include smallScroll;
    }
    * {
        list-style: none;
        margin: 0;
        padding: 0;
        font-style: inherit;
        text-decoration: inherit;
        color: inherit;
        line-height: inherit;
    }
    #app {
        #body {
            position: relative;
            display: flex;
            > * {}
            #nav {
                position: fixed;
                left: 0;
                top: $headerHeight;
                width: $navWidth;
                padding: $fontSize 0;
                height: calc(100vh - #{$headerHeight+$footerHeight+$fontSize*2});
                background-color: map_get($colors, nav_bk);
                z-index: $layoutIndex;
                a {
                    padding: 0 $fontSize;
                    display: block;
                    height: $fontSize*2;
                    line-height: $fontSize*2;
                }
                li:hover, li.active {
                    background-color: map_get($colors, nav_active);
                }
                .txt {
                    padding-left: $fontSize*0.5;
                }
            }
            #content {
                margin-left: $navWidth;
            }
        }
        #body.foldNav {
            #nav {
                width: $navFoldWidth;
                li {
                    padding: 0;
                    text-align: center;
                }
                .txt {
                    display: none;
                }
            }
            #content {
                margin-left: $navFoldWidth;
            }
        }
        #footer {}
    }
    @media (max-width: $tabletWidth) {
        body {
            padding-top: $headerHeight*2+$headerPad;
            padding-bottom: $footerHeight+$footerPad;
        }
        #app {
            #body {
                position: relative;
                display: block;
                > * {}
                #nav {
                    padding: 0;
                    height: $headerHeight;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    overflow-x: auto;
                    overflow-y: hidden;
                    @include smallScroll;
                    .toggler, .sysIcon {
                        display: none;
                    }
                    a {
                        height: $headerHeight;
                        line-height: $headerHeight;
                    }
                    .txt {
                        padding-left: 0;
                    }
                }
                #content {
                    margin-left: auto;
                    margin-right: auto;
                }
            }
            #footer {}
        }
    }
    @media (max-width: $mobileWidth) {
        body {
            padding-top: $headerHeight+$headerPad;
            padding-bottom: $footerHeight+$footerPad;
        }
        #app {
            #body {
                position: relative;
                display: block;
                > * {}
                #nav {
                    display: block;
                    top: 0;
                    white-space: nowrap;
                    li{
                        display: inline-block;
                    }
                }
            }
            #footer {}
        }
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
                foldNav     : false,
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
            toggler: function () {
                this.foldNav = !this.foldNav;
            },
        },
    }
</script>