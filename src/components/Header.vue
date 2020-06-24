<template>
    <div id="header" class="nav nav-tabs navbar-fixed-top hidden-xs">
        <div class="container">
            <div class="navbar-brand">{{title}}</div>
            <ul class="nav navbar-nav">
                <li v-for="(href,name) in list" :class="{active:name===current}"><a :href="href">{{name}}</a></li>
            </ul>
            <div class="navbar-text navbar-right">{{time}}</div>
        </div>
    </div>
</template>

<style lang="scss">
    .navbar-text {
        padding-top: 0;
        padding-bottom: 0;
    }

    .navbar-nav {
        flex-direction: row;
    }

    .nav > li > a:hover, .nav > li > a:focus {
        background-color: #202020;
    }

    .nav.navbar-fixed-top {
        background-image: linear-gradient(0deg, #202020 0%, #2f2f2f 100%);
        border: none;
    }

    .nav.navbar-fixed-bottom {
        background-image: linear-gradient(180deg, #202020 0%, #2f2f2f 100%);
        border: none;
    }

    .navbar-nav > li > a {
        color: #ddd;
        text-decoration: none;
        text-shadow: 0 0 0;

        &:hover, &:focus {
            background-color: #999;
            color: #fff;
        }
    }

    .nav .active {
        background-color: #666;
        color: #fff;
    }

    .nav-pills > li > a:focus {
        background-color: rgba(0, 0, 0, 0.25);
        color: #00aaff;
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
                    'Tieba'     : 'javascript:void(0)',
                    'Nas'       : 'javascript:void(0)',
                    'Router'    : 'javascript:void(0)',
                    'Hypervisor': 'javascript:void(0)',
                    // 'Router': 'javascript:void(0)',
                    // 'Github': 'javascript:void(0)',
                },
                current: 'Tieba',
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