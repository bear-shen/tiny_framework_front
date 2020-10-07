
<!--
Hinter
Props:
    data      string                               文本显示的字符串
    show      array                                查询结果中需要显示在列表上的文本，如果不输入的话就全部输出
    query     function(string) :Promise<{list:[]}> 查询方法，传入字符串，返回
    callback  function(itemData) :void             查询完成的回调方法
-->
<template>
    <input type="text" v-model="data"
           v-on:keyup="htQuery()"
           v-on:focus="htQuery()"
    >
    <ul v-if="active"
        class="float_hinter">
        <li
                v-for="(item,index) in list"
                v-on:click.stop="htCallback(item)"
        >{{makeName(item)}}
        </li>
    </ul>
</template>

<style lang="scss">
    .float_hinter {
        list-style: none;
        padding: 10px 0;
        background-color: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: $fontSize*2;
        z-index: 90;

        li {
            width: 300px;
            line-height: $fontSize*1.5;
            padding: 0 10px;

            &:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }
        }
    }
</style>

<script>
    import store from "../store";

    export default {
        name         : "Hinter",
        props        : [
            'data',
            'query',
            'show',
            'callback',
        ],
        data         : function () {
            return {
                list  : [],
                active: 0,
            }
        },
        watch        : {},
        created      : function () {
        },
        mounted      : function () {
            console.info('Hinter.vue mount');
            document.getElementById('app').addEventListener('click', this.searchClear);
        },
        beforeDestroy: function () {
            document.getElementById('app').removeEventListener('click', this.searchClear)
        },
        methods      : {
            makeName   : function (item) {
                let target = [];
                if (!this.show) this.show = Object.getOwnPropertyNames(item);
                for (let i1 = 0; i1 < this.show.length; i1++) {
                    target.push(this.item[this.show[i1]]);
                }
                target = target.join(': ');
                return target;
            },
            htQuery    : function () {
                console.info('Hinter.vue query');
                if (!this.data.length) return;
                if (!this.query) return;
                this.active = 1;
                this.query(data).then(this.fillData);
            },
            htCallback : function () {
                console.info('Hinter.vue query');
                if (!this.data.length) return;
                if (!this.callback) return;
                this.callback();
                this.searchClear();
            },
            fillData   : function (resolveData) {
                this.list = resolveData.list;
            },
            searchClear: function () {
                this.active = 0;
                this.list   = [];
            }
        }
    }
</script>