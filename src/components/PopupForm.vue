<template>
    <div v-on:click.stop="empty" class="popup_form">
        <table>
            <tr>
                <th colspan="2">editor</th>
            </tr>
            <tr v-for="(val,key) in data">
                <td>{{key}}</td>
                <td>
                    <template v-if="key.indexOf('_')===0">
                        {{data[key].data}}
                    </template>
                    <template v-else-if="!data[key].editable">
                        {{data[key].data}}
                    </template>
                    <template v-else-if="data[key].type==='text'">
                        <input type="text" v-model="data[key].data">
                    </template>
                    <template v-else-if="data[key].type==='datetime'">
                        <input type="datetime-local" v-model="data[key].data">
                    </template>
                    <template v-else-if="data[key].type==='textarea'">
                        <textarea v-model="data[key].data"></textarea>
                    </template>
                    <template v-else-if="data[key].type==='checkbox'">
                        <template v-for="option in data[key].options">
                            <input :id="'checkbox_'+key+'_'+option" type="checkbox" :value="option" v-model="data[key].data">
                            <label :for="'checkbox_'+key+'_'+option">{{option}}</label>
                        </template>
                    </template>
                </td>
            </tr>
            <tr>
                <th colspan="2">
                    <button type="button" class="btn btn-warning" v-on:click="reset">close</button>
                    <button type="button" class="btn btn-success" v-on:click="submit">submit</button>
                </th>
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写

    .popup_form {
        z-index: 2;
        position: relative;
        max-width: 90vw;
        min-width: 50vw;
        max-height: calc(100vh - #{$footerHeight} * 2);
        overflow-y: auto;
        margin: 0 auto;
        background: rgba(100, 100, 100, 0.5);
        padding: 1vw;
        border-radius: 1vw;

        table {
            width: 100%;
            height: 100%;

            tr:first-child th {
                text-align: center;
                font-size: 2em;
                line-height: 1em;
            }

            th {
                text-align: right;
            }

            td {
                text-align: left;
                padding-left: 1vw;

                * {
                    width: 100%;
                }

                input[type='checkbox'], input[type='radio'] {
                    display: none;

                    + label {
                        display: inline-block;
                        width: max-content;
                        background-image: linear-gradient(0deg, hsla(250, 30%, 30%, 1) 0%, rgb(25, 25, 25) 100%);
                        font-size: 1.25em;
                        padding: 0.25em 0.5em;
                        line-height: 1.25em;
                        margin: 0.25em;
                        border-radius: 0.5em;
                    }

                    &:checked {
                        + label {
                            background-image: linear-gradient(0deg, rgba(100, 100, 100, 1) 0%, rgba(150, 150, 150, 1) 100%);
                        }
                    }
                }
            }

            tr:last-child th {
                text-align: right;
                line-height: 2em;
                font-size: 2em;
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
    import PopupLoader from "./PopupLoader";

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
        name     : "PopupForm",
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
                data         : {},
                template     : {},
                callback     : {
                    success: function () {
                    },
                    cancel : function () {
                    },
                    error  : function () {
                    },
                },
                //
                isTransparent: false,
            }
        },
        created  : function () {
            console.info(`popup form: created`);
            let data = Object.assign(
                {
                    data    : {},
                    template: {},
                    success : function () {},
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
            this.data             = data.data;
            this.template         = data.template;
            //
            this.callback.success = data.success;
            this.callback.cancel  = data.cancel;
            this.callback.error   = data.error;
            //
            console.info(this);
        },
        destroyed: function () {
            this.data             = {};
            this.template         = {};
            //
            this.callback.success = () => {};
            this.callback.cancel  = () => {};
            this.callback.error   = () => {};
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
                this.callback.success(data);
                this.$parent.hide();
            },
            empty : function () {
            },
        }
    }
</script>