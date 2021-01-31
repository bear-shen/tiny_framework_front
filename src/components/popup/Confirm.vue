<template>
    <div class="confirm">
        <table>
            <tr>
                <th colspan="2">confirm</th>
            </tr>
            <tr>
                <th colspan="2">
                    {{data}}
                </th>
            </tr>
            <tr>
                <th colspan="2">
                    <button type="button" class="negative" v-on:click="cancel">close</button>
                    <button v-if="callback.submit" type="button" class="positive" v-on:click="submit">submit</button>
                </th>
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写

    #popup .confirm {
        z-index: 2;
        position: relative;
        max-width: 90vw;
        min-width: 20vw;
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
            }

            th {
                text-align: center;
                font-weight: normal;
                padding-bottom: $fontSize;
            }

            td {
                text-align: left;
                * {
                    width: 100%;
                }
            }

            tr:last-child th {
                text-align: right;
                padding-bottom: 0;
            }
        }
        button{
            margin-left: $fontSize;
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
        name     : "PopupConfirm",
        // el     : '#popup',
        props    : ['info'],
        watch    : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`popup confirm: info watched`);
                console.info(to);
            }
        },
        data     : function () {
            return {
                data    : '',
                callback: {
                    submit: function () {
                    },
                    cancel: function () {
                    },
                },
            }
        },
        created  : function () {
            console.info(`popup confirm: created`);
            let data             = Object.assign(
                {
                    data  : '',
                    submit: false,
                    cancel: false,
                }, this.info);
            //
            this.data            = data.data;
            //
            this.callback.submit = data.submit;
            this.callback.cancel = data.cancel;
            //
            console.info(this);
        },
        destroyed: function () {
            this.data            = {};
            //
            this.callback.submit = false;
            this.callback.cancel = false;
        },
        methods  : {
            submit: function () {
                if(this.callback.submit)this.callback.submit();
                this.$parent.hide();
            },
            cancel: function () {
                if(this.callback.cancel)this.callback.cancel();
                this.$parent.hide();
            },
        }
    }
</script>