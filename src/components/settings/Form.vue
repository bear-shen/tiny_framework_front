<template>
    <table class="content form">
        <tr v-for="sub in item.data">
            <th :title="sub.description">{{sub.name}}</th>
            <td>
                <template v-if="edit===false">
                    {{sub.value}}
                </template>
                <template v-else-if="sub.type==='text'">
                    <input type="text" v-model="sub.value"/>
                </template>
                <template v-else-if="sub.type==='textarea'">
                    <textarea v-model="sub.value"></textarea>
                </template>
                <template v-else-if="sub.type==='select'">
                    <select v-model="sub.value">
                        <option v-for="(optV,optK) in sub.extra" :value="optK">{{optV}}</option>
                    </select>
                </template>
                <template v-else-if="sub.type==='radio'">
                    <template v-for="(optV,optK) in sub.extra">
                        <label>
                            {{optV}} :
                            <input type="radio" v-model="sub.value" :value="optK">
                        </label>
                    </template>
                </template>
                <template v-else-if="sub.type==='checkbox'">
                    <template v-for="(optV,optK) in sub.extra">
                        <label>
                            {{optV}} :
                            <input type="checkbox" v-model="sub.value" :value="optK">
                        </label>
                    </template>
                </template>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <button :class="['btn','btn-dark','sysIcon','sysIcon_save']" v-if="edit" v-on:click="submit"> Submit</button>
                <button :class="['btn','btn-dark','sysIcon','sysIcon_edit']" v-else v-on:click="modify"> Modify</button>
            </td>
        </tr>
    </table>
</template>

<style lang="scss">
    .content.form {
        th, label {
            font-weight: normal;
        }

        tr > * {
            line-height: $fontSize*1.25;
            padding-bottom: $fontSize*0.5;
        }

        tr:last-child {
            td {
                padding-top: $fontSize*0.5;
                text-align: center;
            }

            button {
                width: 90%;
            }
        }

        label {
            margin-right: $fontSize;
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
        name     : "Form",
        // el     : '#popup',
        props    : ['detail'],
        watch    : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`popup confirm: info watched`);
                console.info(to);
            }
        },
        data     : function () {
            return {
                edit: false,
                item: {},
            }
        },
        created  : function () {
            console.info(`popup confirm: created`);
            this.item = this.detail;
        },
        destroyed: function () {
            this.item = {};
        },
        methods  : {
            modify: function () {
                this.edit = true;
            },
            /**
             * @todo api config_set
             * */
            submit: function () {
                this.edit = false;
            },
            cancel: function () {
            },
        }
    }
</script>