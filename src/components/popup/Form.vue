<template>
    <div v-on:click.stop="empty" class="form">
        <!--        <table v-on:click="dmp">-->
        <table>
            <tr>
                <th colspan="2">{{ title ? title : 'Editor' }}</th>
            </tr>
            <tr v-for="(val,key) in data">
                <td>{{ key }}</td>
                <td>
                    <template v-if="key.indexOf('_')===0">
                        {{ val.data }}
                    </template>
                    <template v-else-if="!val.editable">
                        {{ val.data }}
                    </template>
                    <template v-else-if="val.type==='text'">
                        <input type="text" v-model="val.data">
                    </template>
                    <template v-else-if="val.type==='datetime'">
                        <input type="datetime-local" v-model="val.data">
                    </template>
                    <template v-else-if="val.type==='textarea'">
                        <textarea v-model="val.data"></textarea>
                    </template>
                    <template v-else-if="val.type==='checkbox'">
                        <template v-for="option in val.options">
                            <input :id="'popup_checkbox_'+key+'_'+option" type="checkbox" v-model="val.data" :value="option">
                            <label :for="'popup_checkbox_'+key+'_'+option">{{ option }}</label>
                        </template>
                    </template>
                    <template v-else-if="val.type==='radio'">
                        <template v-for="option in val.options">
                            <input :id="'popup_radio_'+key+'_'+option" type="radio" v-model="val.data" :value="option">
                            <label :for="'popup_radio_'+key+'_'+option">{{ option }}</label>
                        </template>
                    </template>
                </td>
            </tr>
            <tr>
                <th colspan="2">
                    <button type="button" class="negative" v-on:click="reset">close</button>
                    <button type="button" class="positive" v-on:click="submit">submit</button>
                </th>
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
//和loader相似但是多少有些区别，因此单独写
#popup .form {
    z-index: 2;
    position: relative;
    max-width: 90vw;
    min-width: 50vw;
    max-height: calc(100vh - #{$headerHeight + $footerHeight});
    overflow-y: auto;
    margin: 0 auto;
    background: map_get($colors, popup_bk);
    padding: $fontSize*0.5;
    @include smallScroll();
    /*border-radius: 1vw;*/
    table {
        width: 100%;
        height: 100%;
        tr:first-child th {
            text-align: center;
            line-height: $fontSize;
            padding-bottom: $fontSize;
        }
        th {
            text-align: right;
        }
        td {
            text-align: left;
            padding-bottom: $fontSize*0.5;
            * {
                width: -webkit-fill-available;
            }
            label {
                width: auto;
            }
        }
        tr:last-child th {
            padding-top: $fontSize;
            text-align: right;
            button {
                margin-left: $fontSize;
            }
        }
    }
}
@media(max-width: 767px) {
    .popup_form {
        max-height: calc(100vh - #{$footerHeight*0.75} * 2);
        overflow-y: auto;
    }
}
</style>

<script>
/**
 * @var data            (internal)
 * @var callback        (internal)
 * @method reset    ()
 * @method submit   ()
 *
 * show -> data {name:value}
 * show -> template {name:{type:('text'|'datetime'),default:'',editable:(true|false)}}
 * */
export default {
    name: "PopupForm",
    // el     : '#popup',
    props    : ['info'],
    watch    : {
        //弹层数据处理
        info: function (to, from) {
            console.info(`popup form: info watched`);
            console.info(to);
        }
    },
    data     : function () {
        return {
            title   : '',
            data    : {},
            template: {},
            callback: {
                submit: function () {
                },
                cancel: function () {
                },
                error : function () {
                },
            },
        }
    },
    created  : function () {
        console.info(`popup form: created`);
        let data = Object.assign(
            {
                title   : '',
                data    : {},
                template: {},
                submit  : function () {},
                cancel  : function () {},
                error   : function () {},
            }, this.info);
        //
        //这里统一复制会产生引用，所以逐一写，实现复制
        for (let k in data.template) {
            //如果key带有下划线，就作为特殊参数处理（checkbox或者radio的选项）
            if (!data.template.hasOwnProperty(k)) continue;
            if (k.indexOf('_') === 0) continue;
            // {type: 'text', default: '0', editable: true,};
            let curData  = data.data[k] ? data.data[k] : data.template[k].default;
            data.data[k] = {
                data    : curData,
                type    : data.template[k].type,
                default : data.template[k].default,
                editable: data.template[k].editable,
                options : data.template['_' + k] ? data.template['_' + k] : [],
                before  : curData,
            };
        }
        //
        this.title           = data.title;
        this.data            = data.data;
        this.template        = data.template;
        //
        this.callback.submit = data.submit;
        this.callback.cancel = data.cancel;
        this.callback.error  = data.error;
        //
        console.info(this);
    },
    destroyed: function () {
        this.data            = {};
        this.template        = {};
        //
        this.callback.submit = () => {};
        this.callback.cancel = () => {};
        this.callback.error  = () => {};
    },
    methods  : {
        reset : function () {
            let data = {};
            for (let k in this.data) {
                data[k] = this.data[k].data;
            }
            this.callback.cancel(data);
            this.$parent.hide();
        },
        submit: function () {
            let data = {};
            for (let k in this.data) {
                data[k] = this.data[k].data;
            }
            this.callback.submit(data);
            this.$parent.hide();
        },
        empty : function () {
        },
        dmp   : function () {
            console.info(this);
            console.info(this.data);
            console.info(this.data.checkbox);
        }
    }
}
</script>