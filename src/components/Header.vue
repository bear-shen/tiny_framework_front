<template>
    <div id="header">
        <div id="headerBrand">{{title}}</div>
        <ul id="headerNav">
            <li v-for="(href,name) in list" :class="{active:name===current}">
                <a :href="href">{{name}}</a>
            </li>
        </ul>
        <div class="headerRight">{{time}}</div>
    </div>
</template>
<style lang="scss">
    #header {
        display: flex;
        height: $headerHeight;
        line-height: $headerHeight;
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        padding: 0 $fontSize*2;
        width: calc(100% - #{$fontSize*4});
        background-color: map_get($colors, bar_bk);
        z-index: $layoutIndex;
        //box-shadow: 0px 0px 10px white;
        > * {
            height: 100%;
        }
        #headerNav {
            white-space: nowrap;
            max-width: 80%;
            @include smallScroll;
            overflow-y: hidden;
            li {
                display: inline-block;
                line-height: $headerHeight;
                height: 100%;
                a {
                    padding: 0 $fontSize;
                    display: block;
                    height: 100%;
                }
            }
            li:hover, li.active {
                background-color: map_get($colors, bar_active);
            }
        }
    }
    @media (max-width: $tabletWidth) {
        #header {
            justify-content: center;
            > div {
                display: none;
            }
        }
    }
    @media (max-width: $mobileWidth) {
        #header {
            display: none;
        }
    }
</style>

<script>
    /**
     * @var list
     * @var current
     * @var title
     * @var time
     * @var timer (internal)
     * */
    export default {
        name   : "Header",
        // el     : '#header',
        data   : function () {
            return {
                list   : {
                    'Toshokan'  : 'javascript:void(0)',
                    'Nas'       : 'javascript:void(0)',
                    'Router'    : 'javascript:void(0)',
                    'Hypervisor': 'javascript:void(0)',
                    // 'Router': 'javascript:void(0)',
                    // 'Github': 'javascript:void(0)',
                },
                current: 'Toshokan',
                title  : 'Hentai',
                time   : '',
                timer  : 0,
            };
        },
        created: function () {
            this.timer = setInterval(() => {
                let date = new Date();
                let arr  = {
                    y: date.getFullYear(),
                    m: date.getMonth() + 1,
                    d: date.getDate(),
                    h: date.getHours(),
                    i: date.getMinutes(),
                    s: date.getSeconds(),
                };
                for (let k in arr) {
                    if (arr[k] < 10) arr[k] = '0' + arr[k];
                    arr[k] = arr[k].toString();
                }
                this.time = `${arr.y}-${arr.m}-${arr.d} ${arr.h}:${arr.i}:${arr.s}`
            }, 500);
        },
        methods: {}
    }
</script>

<style scoped>

</style>