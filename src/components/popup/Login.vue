<template>
    <div class="login">
        <table>
            <tr>
                <th colspan="2">Login</th>
            </tr>
            <tr>
                <td>Name / Email :</td>
                <td><input type="text" class="login_name" v-model="name"></td>
            </tr>
            <tr>
                <td>Password :</td>
                <td><input type="password" class="login_pass" v-model="pass"></td>
            </tr>
            <tr>
                <td>Captcha :</td>
                <td class="captchaRow">
                    <img :src="`${captchaUrl}?${captchaStamp}`" class="login_captcha_img" v-on:click="refreshCaptcha">
                    <input type="text" class="login_captcha" v-model="captcha">
                </td>
            </tr>
            <tr>
                <th colspan="2">
                    <span>{{responseErr}}</span>
                    <button type="button" class="btn btn-primary" v-on:click="register">Register</button>
                    <button type="button" class="btn btn-success" v-on:click="login">Login</button>
                </th>
            </tr>
        </table>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写
    #popup .login {
        z-index: 2;
        max-width: 80vw;
        min-width: 25vw;
        background-color: map_get($colors, popup_bk);
        padding: $fontSize*0.5;
        position: relative;
        table {
            width: 100%;
            height: 100%;
            tr:first-child {
                > * {
                    padding-bottom: $fontSize*0.5;
                }
                th {
                    text-align: center;
                    font-size: $fontSize;
                    line-height: $fontSize*2;
                }
            }
            th {
                text-align: center;
                font-size: $fontSize;
                font-weight: normal;
            }
            td {
                text-align: left;
                * {
                    width: -webkit-fill-available;
                    vertical-align: bottom;
                }
            }
            tr:last-child th {
                text-align: right;
                line-height: $fontSize;
                font-size: $fontSize;
                white-space: nowrap;
                padding-top: $fontSize*0.5;
                span {
                    font-size: $fontSize;
                    max-width: 50vw;
                    white-space: normal;
                    word-break: break-all;
                    display: inline-block;
                }
            }
            .captchaRow {
                display: flex;
                .login_captcha_img {
                    background-color: brown;
                    height: $fontSize*2;
                    width: auto;
                    cursor: pointer;
                }
                .login_captcha_img,
                .login_captcha {
                }
            }
        }
        button {
            margin-left: $fontSize*0.5;
        }
        @media (max-width: $mobileWidth) {
            width: 90vw;
            max-width: 90vw;
            table,tr{
                display: block;
            }
            td,th{
                display: block;
                &:first-child{
                    line-height: $fontSize*2;
                }
            }
        }
    }
</style>

<script>
    import helper from '../../lib/Helper';
    import config from '../../config';
    import store  from '../../store';

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
        name     : "PopupLogin",
        // el     : '#popup',
        props    : ['info'],
        watch    : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`popup login: info watched`);
                console.info(to);
            }
        },
        data     : function () {
            return {
                name        : '',
                pass        : '',
                captcha     : '',
                captchaUrl  : '',
                captchaStamp: (new Date()) * 1,
                responseErr : '',
            }
        },
        created  : function () {
            console.info(`popup login: created`);
            this.captchaUrl = config.api('captcha');
        },
        destroyed: function () {
        },
        methods  : {
            refreshCaptcha: function () {
                this.captchaStamp = (new Date()) * 1
            },
            register      : function () {
                // this.callback.submit();
                return store.commit('popup', {
                    type: 'register',
                    info: {}
                });
            },
            /**
             * @api user/login
             * */
            login         : function () {
                // this.callback.submit();
                // this.$parent.hide();
                helper.query(
                    'user_login',
                    {
                        name   : this.name,
                        pass   : this.pass,
                        captcha: this.captcha,
                    }
                ).then((data) => {
                    console.info(data);
                    this.$parent.hide();
                }).catch((data) => {
                    this.responseErr = data;
                });
            },
        }
    }
</script>