<template>
    <div id="popup" v-if="isShow" :style="{opacity:isTransparent?0:1}" v-on:click="hide">
        <div v-on:click.stop>
            <table>
                <tr>
                    <th colspan="2">editor</th>
                </tr>
                <tr v-for="(val,key) in data">
                    <td>{{key}}</td>
                    <td>
                        <template v-if="key.indexOf('_')==0">
                            {{data[key].data}}
                        </template>
                        <template v-else-if="!data[key].editable">
                            {{data[key].data}}
                        </template>
                        <template v-else-if="data[key].type=='text'">
                            <input type="text" v-model="data[key].data">
                        </template>
                        <template v-else-if="data[key].type=='datetime'">
                            <input type="datetime-local" v-model="data[key].data">
                        </template>
                        <template v-else-if="data[key].type=='textarea'">
                            <textarea v-model="data[key].data"></textarea>
                        </template>
                        <template v-else-if="data[key].type=='checkbox'">
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
    </div>
</template>

<style scoped>

</style>

<script>
    /**
     * @var isShow          (internal)
     * @var isTransparent   (internal)
     * @var data            (internal)
     * @var callback        (internal)
     * @method show     (data, template, success, cancel, error)
     * @method hide     ()
     * @method reset    ()
     * @method submit   ()
     *
     * show -> data {name:value}
     * show -> template {name:{type:('text'|'datetime'),default:'',editable:(true|false)}}
     * */
    export default {
        name   : "Popup",
        // el     : '#popup',
        data   : function () {
            return {
                isShow       : false,
                isTransparent: false,
                data         : {},
                callback     : {
                    success: function () {
                    },
                    cancel : function () {
                    },
                    error  : function () {
                    },
                },
            }
        },
        created: function () {
        },
        methods: {
            show  : function (data, template, success, cancel, error) {
                //这里统一复制会产生引用，所以逐一写，实现复制
                for (let k in template) {
                    //如果key带有下划线，就作为特殊参数处理（checkbox或者radio的选项）
                    if (k.indexOf('_') === 0) continue;
                    // {type: 'text', default: '0', editable: true,};
                    let curData  = data[k] ? data[k] : template[k].default;
                    this.data[k] = {
                        data    : curData,
                        type    : template[k].type,
                        default : template[k].default,
                        editable: template[k].editable,
                        options : template['_' + k] ? template['_' + k] : [],
                        before  : curData,
                    };
                }
                if (success)
                    this.callback.success = success;
                if (cancel)
                    this.callback.cancel = cancel;
                if (error)
                    this.callback.error = error;
                //***************************************
                this.isShow = true;
                //做个延迟不然特效不会出来……
                setTimeout(() => {
                    this.isTransparent = false;
                }, 10);
                loader.hide();
            },
            hide  : function () {
                //清空数据
                this.data          = {};
                this.callback      = {
                    success: function () {
                    },
                    cancel : function () {
                    },
                    error  : function () {
                    },
                };
                this.isTransparent = true;
                setTimeout(() => {
                    this.isShow = false;
                }, 500);
            },
            reset : function () {
                this.callback.cancel(this.data);
                this.hide();
            },
            submit: function () {
                let data = {};
                for (let k in this.data) {
                    data[k] = this.data[k].data;
                }
                this.callback.success(data);
                this.hide();
            },
        }
    }
</script>