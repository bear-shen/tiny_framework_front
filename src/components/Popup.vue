<template>
    <div id="popup" v-if="isShow" :style="{opacity:isTransparent?0:1}" >
        <template v-if="type==='form'">
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
        <template v-else-if="type==='loader'">
            <svg class="popup_loader square" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="width+'px'" :height="width+'px'">
                <polygon v-for="offset in offsets" :points="offset"></polygon>
                <!--<polygon v-for="offset in offsets" points="0,224.5139883 309.0169944,449.0279766 1000,224.5139883 309.0169944,0"></polygon>-->
            </svg>
        </template>
        <template v-else-if="type==='modal'">
        </template>
        <template v-else-if="type==='uploader'">
        </template>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写
    #popup {
        //background-color: rgba(0, 0, 0, 0.25);
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: $footerHeight;
        z-index: 4000;
        background-image: url(/img/bg.png);
        backdrop-filter: blur(2px);
        opacity: 0;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }

        display: flex;
        align-items: center;
        justify-content: center;

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

        .popup_loader{
            svg.square {
                $width: 300px;
                $angle: 4;
                $speed: 1;
                $colorList: (
                        #023E73,
                        #023059,
                        #024873,
                        #023859,
                        #0D0D0D
                );
                animation: rotate #{$angle}s cubic-bezier(0, 0, 1, 1) infinite;
                //width: 20vw;
                //height: 20vw;
                position: relative;
                margin-left: auto;
                margin-right: auto;
                margin-top: calc(50vh - #{$width/2} - #{$footerHeight});
                display: block;

                polygon {
                    position: absolute;
                    width: 50%;
                    height: 50%;
                    transform-origin: $width*0.5 $width*0.5;
                    //opacity: 0.5;
                    //transform: scale(0.2);
                    //fill: rgba(255, 255, 255, 0.2);
                    @for $i from 1 through $angle {
                        @keyframes subAnim_#{$i} {
                            0% {
                                transform: scale(1) rotate(#{(($i - 1)*360/$angle)-90}deg);
                                //opacity: 0.5;
                            }
                            #{percentage(1/$angle)} {
                                transform: scale(0.5) rotate(#{(($i - 1)*360/$angle)-90}deg);
                                //opacity: 1;
                            }
                            #{percentage(2/$angle)} {
                                transform: scale(1) rotate(#{(($i - 1)*360/$angle)-90}deg);
                                //opacity: 0.5;
                            }
                            100% {
                                transform: scale(1) rotate(#{(($i - 1)*360/$angle)-90}deg);
                                //opacity: 0.5;
                            }
                        }
                        &:nth-child(#{$i}) {
                            transform: rotate(#{(($i - 1)*360/$angle)-90}deg);
                            //fill: hsla($i*360/$angle, 80%, 50%, 1);
                            fill: nth($colorList, $i);
                            animation: subAnim_#{$i} #{$angle/$speed}s cubic-bezier(0, 0, 1, 1) infinite;
                            animation-delay: #{($angle - $i - 2)/$speed}s;
                        }
                    }
                }
            }
        }
    }

    @media(max-width: 767px) {
        #popup {
            top: 0;

            .popup_form {
                max-height: calc(100vh - #{$footerHeight*0.75} * 2);
                overflow-y: auto;
            }
        }
    }
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
        props  : ['info'],
        watch  : {
            info: function (to, from) {
                console.info(`popup: info watched`);
                let data = Object.assign(
                    {
                        type    : 'form',
                        data    : {},
                        template: {},
                        success : function () {},
                        cancel  : function () {},
                        error   : function () {},
                    }, to);
                //
                switch (this.type) {
                    case 'form':
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
                        break;
                    case 'loader':
                    case 'modal':
                    case 'uploader':
                    default:
                        break;
                }
                //
                this.type             = data.type;
                this.data             = data.data;
                this.template         = data.template;
                //
                this.callback.success = data.success;
                this.callback.cancel  = data.cancel;
                this.callback.error   = data.error;
                //
                this.show();
                console.info(this);
            }
        },
        data   : function () {
            return {
                type         : 'form',
                //
                data         : {},
                template     : {},
                //
                isShow       : false,
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
        created: function () {
        },
        methods: {
            show  : function () {
                switch (this.type) {
                    case 'form':
                        break;
                    case 'loader':
                        break;
                    case 'modal':
                        break;
                    case 'uploader':
                        break;
                }
                //***************************************
                this.isShow = true;
                //做个延迟不然特效不会出来……
                setTimeout(() => {
                    this.isTransparent = false;
                }, 10);
            },
            hide  : function () {
                //清空数据
                this.data          = {};
                this.template      = {};
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
                let data = {};
                for (let k in this.data) {
                    data[k] = this.data[k].data;
                }
                this.callback.cancel(data);
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
            empty : function () {
            },
        }
    }
</script>