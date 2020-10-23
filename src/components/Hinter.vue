<!--
Hinter
Props:
    data      string                               文本显示的字符串
    show      array                                查询结果中需要显示在列表上的文本，如果不输入的话就全部输出
    query     function(string) :Promise<{list:[]}> 查询方法，传入字符串，返回
    callback  function(itemData) :void             查询完成的回调方法
-->
<template>
    <div class="hinter_div" v-on:click.stop>
        <input type="text" v-model="htData"
               v-on:keyup="htQuery()"
               v-on:focus="htQuery()"
        >
        <ul v-if="active"
            class="float_hinter">
            <li v-if="loading">loading...</li>
            <li
                    v-for="(item,index) in list"
                    v-on:click.stop="htCallback(item)"
            >{{makeName(item)}}
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
    .hinter_div{
        position: relative;
    }
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
                list   : [],
                active : 0,
                loading : 0,
                htData : '',
                htShow : [],
                //对传入值是否为空做一个判断，如果传入为undefined则回调完成后自动清空数组
                empData: false,
            }
        },
        watch        : {
            data: function (from, to) {
                console.debug(`Hinter.vue: data modify watched ${from} ${to}`);
                this.htData = this.data;
            }
        },
        created      : function () {
            let td=this.data;
            if (typeof td==='undefined') {
                this.empData = true;
                td='';
            }
            this.htData = td;
            this.htShow = this.show;
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
                if (!this.htShow) this.htShow = Object.getOwnPropertyNames(item);
                for (let i1 = 0; i1 < this.htShow.length; i1++) {
                    target.push(item[this.htShow[i1]]);
                }
                target = target.join(': ');
                return target;
            },
            htQuery    : function () {
                console.info('Hinter.vue htQuery');
                if (!this.htData.length) return;
                if (!this.query) return;
                this.active = 1;
                this.loading=1;
                this.query(this.htData).then(this.fillData);
            },
            htCallback : function (item) {
                console.info('Hinter.vue htCallback');
                if (!this.htData.length) return;
                if (!this.callback) return;
                this.callback(item);
                this.searchClear();
                if(this.empData)this.htData='';
            },
            fillData   : function (resolveData) {
                this.loading=0;
                this.list = resolveData.list;
            },
            searchClear: function () {
                console.info('Hinter.vue searchClear');
                this.active = 0;
                this.list   = [];
            }
        }
    }
</script>