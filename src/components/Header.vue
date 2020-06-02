<template>
    <div id="header" class="nav nav-tabs navbar-fixed-top hidden-xs">
        <div class="container">
            <div class="navbar-brand">{{title}}</div>
            <ul class="nav navbar-nav ">
                <li v-for="(href,name) in list" :class="{active:name===current}"><a :href="href">{{name}}</a></li>
            </ul>
            <div class="navbar-text navbar-right">{{time}}</div>
        </div>
    </div>
</template>

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