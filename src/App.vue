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
                        <span :class="['txt']">{{ r.title }}</span>
                    </router-link>
                </li>
            </ul>
            <!--<div id="content" class=" col-lg-11">
                <form id="contentForm">
                    <label>Name:<input type="text" name="name" value=""></label>
                </form>
                <div id="contentList"></div>
            </div>-->
            <router-view id="content"></router-view>
        </div>
        <Footer/>
        <Popup/>
        <div></div>
    </div>
</template>

<style lang="scss">
body {
    padding-top: $headerHeight + $headerPad;
    padding-bottom: $footerHeight+ $footerPad;
    min-height: calc(100vh - #{$headerHeight + $headerPad+ $footerHeight+ $footerPad});
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
    border: none;
    font-style: inherit;
    text-decoration: inherit;
    color: inherit;
    line-height: inherit;
    appearance: none;
    outline: 0
}
table {
    border-collapse: collapse;
}
// ----------------------------------------------------
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
            height: calc(100vh - #{
                $headerHeight+$footerHeight+$fontSize*2
                });
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
            width: calc(100vw - #{$navWidth});
            position: relative;
        }
    }
    @media(min-width: $tabletWidth+1) {
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
                width: calc(100vw - #{$navFoldWidth});
            }
        }
    }
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
                width: 100%;
            }
        }
    }
}
@media (max-width: $mobileWidth) {
    body {
        padding-top: $headerHeight+$headerPad;
        padding-bottom: $footerHeight+$footerPad;
    }
    #app {
        #body {
            > * {}
            #nav {
                display: block;
                top: 0;
                white-space: nowrap;
                text-align: center;
                li {
                    display: inline-block;
                }
                .toggler, .txt {
                    display: none;
                }
                .sysIcon {
                    display: inline-block;
                }
            }
        }
    }
}
// ----------------------------------------------------
.listHeader {
    line-height: $fontSize*2;
    /*height: $fontSize*2;*/
    font-size: $fontSize;
    position: fixed;
    z-index: 2;
    background-color: map_get($colors, bk);
    width: calc(100vw - #{$navWidth});
    .headerGroup {
        white-space: nowrap;
        display: inline-block;
        vertical-align: top;
        height: $fontSize*2;
        line-height: $fontSize*2;
        padding-top: 0;
        padding-bottom: 0;
        > * {
            display: inline-block;
            vertical-align: top;
            padding: $fontSize*0.5;
            line-height: $fontSize;
        }
        margin-right: $fontSize*0.25;
    }
}
.listContent {
    padding: $fontSize*2 0;
}
@media (max-width: $tabletWidth) {
    .listHeader {
        width: 100%;
    }
    .listContent {
        padding: $fontSize*4 0;
    }

}
@media (max-width: $mobileWidth) {
    .listHeader {
    }
}
// ----------------------------------------------------
input, button, select, textarea {
}
button, select {
    background-color: map_get($colors, input_button_bk);
    color: map_get($colors, input_button_font);
    padding: map_get($sizeConf, btn_padding);
    &:hover, &.active, &.disabled {
        background-color: map_get($colors, input_button_bk_active);
        color: map_get($colors, input_button_font_active);
    }
}
input {
    background-color: map_get($colors, input_bk);
    color: map_get($colors, input_font);
    padding: map_get($sizeConf, btn_padding);
    &:hover, &:focus, &.active, &.disabled {
        background-color: map_get($colors, input_bk_active);
        color: map_get($colors, input_font_active);
    }
}
textarea {
    background-color: map_get($colors, input_bk);
    color: map_get($colors, input_font);
    padding: map_get($sizeConf, btn_padding);
    &:hover, &:focus, &.active, &.disabled {
        background-color: map_get($colors, input_bk_active);
        color: map_get($colors, input_font_active);
    }
}
::selection {
    background-color: map_get($colors, selection_bk);
    color: map_get($colors, selection);
}
input[type='checkbox'], input[type='radio'] {
    display: none;
    + label {
        display: inline-block;
        width: max-content;
        /*background-image: linear-gradient(0deg, hsla(250, 30%, 30%, 1) 0%, rgb(25, 25, 25) 100%);*/
        background-color: map_get($colors, checkbox_alpha);
        font-size: $fontSize;
        padding: 0.25*$fontSize 0.5*$fontSize;
        line-height: $fontSize;
        //border-radius: 0.5*$fontSize;
        vertical-align: baseline;
    }
    &:checked {
        + label {
            //background-image: linear-gradient(0deg, rgba(100, 100, 100, 1) 0%, rgba(150, 150, 150, 1) 100%);
            background-color: map_get($colors, checkbox_alpha_active);
        }
    }
}
</style>
<script>
import router from "./router";
import store  from "./store";


import Header from "./components/Header";
import Popup  from "./components/Popup";
import Footer from "./components/Footer";

console.log('Hello world');

export default {
    components: {
        Header: Header,
        Popup : Popup,
        Footer: Footer,
    },
    data      : function () {
        return {
            foldNav     : false,
            routes      : [],
            currentRoute: {},
            floatWindowList:[],
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
        pushFloat:function (){},
    },
}
</script>