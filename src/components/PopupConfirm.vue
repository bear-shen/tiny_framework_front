<template>
    <div v-on:click.stop="empty" class="popup_confirm">
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
                    <button type="button" class="btn btn-warning" v-on:click="callback.cancel">close</button>
                    <button type="button" class="btn btn-success" v-on:click="callback.submit">submit</button>
                </th>
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写

    .popup_confirm {
        z-index: 2;
        position: relative;
        max-width: 90vw;
        min-width: 25vw;
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
                text-align: center;
                font-size: 1.5em;
                font-weight: normal;
            }

            td {
                text-align: left;
                padding-left: 1vw;

                * {
                    width: 100%;
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
        .popup_confirm {
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
                    submit: function () {},
                    cancel: function () {},
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
            this.callback.submit = () => {};
            this.callback.cancel = () => {};
        },
        methods  : {}
    }
</script>