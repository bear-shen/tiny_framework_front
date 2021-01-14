<template>
    <ul id="msg">
        <li v-for="(item,k) in list" :class="[
            'msgBtn',
            `msgBtn_${item.type}`  ,
            {'hiding'      :item.hide},
            ]" v-on:click.self.stop="showDetail(k)">
            <div v-if="item.detail">{{item.msg}}</div>
        </li>
    </ul>
</template>

<style lang="scss">
    #msg {
        font-size: 0;
        height: $footerHeight;
        margin-bottom: 0;
        white-space: nowrap;
        li {
            display: inline-block;
            height: $footerHeight;
            line-height: $footerHeight;
            width: $fontSize;
            position: relative;
            transition: width 0s, height 0s;
            div {
                /*display: none;*/
                position: absolute;
                z-index: $layoutIndex+1;
                left: 0;
                bottom: $footerHeight;
                line-height: $fontSize;
                /*height: $fontSize*1.5;*/
                font-size: $fontSize;
                /*white-space: nowrap;*/
                padding: $fontSize/2;
                max-width: 20vw;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            &.hide {
                display: none;
            }
            &.hiding {
                transition: width 1s, height 1s;
                width: 0;
                font-size: 0;
            }
        }
        .msgBtn {
            background-color: map_get($msgColors, notice);
        }
        @each $type, $color in $msgColors {
            .msgBtn_#{$type} {
                background-color: $color;
                div {
                    background-color: $color;
                }
            }
        }
    }
    @media(max-width: $tabletWidth) {
        #msg {
            position: absolute;
            bottom: $footerHeight;
            text-align: center;
            height: $footerPad*0.5;
            width: 100%;
            li {
                vertical-align: top;
                display: inline-block;
                /*bottom: $footerPad*1.5;*/
                height: $footerPad*0.5;
                line-height: $footerPad*0.5;
                div {
                    max-width: 80vw;
                    bottom: $footerPad*0.4;
                }
            }
        }
    }
</style>

<script>
    import router from "../router";
    import store  from '../store'

    /**
     * @var list        (internal)
     * @var detailTimer (internal)
     * @method push         (data, type) type in ['success','info','error','notice']
     * @method showDetail   (index)
     * @method hideAll      ()
     * */
    export default {
        name   : "Msg",
        // el     : '#msg',
        data   : function () {
            return {
                list       : [
                    {
                        type  : 'success',
                        msg   : 'success',
                        hide  : false,
                        detail: false,
                    },
                    {
                        type  : 'info',
                        msg   : 'info',
                        hide  : false,
                        detail: false,
                    },
                    {
                        type  : 'notice',
                        msg   : 'notice',
                        hide  : false,
                        detail: false,
                    },
                    {
                        type  : 'warn',
                        msg   : 'warn',
                        hide  : false,
                        detail: false,
                    },
                    {
                        type  : 'error',
                        msg   : 'error',
                        hide  : false,
                        detail: false,
                    },
                ],
                gcTimer    : 0,
                detailTimer: 0,
            }
        },
        watch  : {},
        created: function () {
            store.commit('registerMsgDOM', this);
        },
        methods: {
            push      : function (data, type) {
                // console.info('pushing');
                switch (type) {
                    case 'success':
                    case 'info':
                    case 'error':
                    case 'notice':
                        break;
                    default:
                        type = 'info';
                        break;
                }
                if (this.list.length >= 16) {
                    for (let i1 = 0; i1 < this.list.length - 16; i1++) {
                        this.list[i1].hide   = true;
                        this.list[i1].detail = false;
                    }
                }
                let target = {
                    type  : type,
                    msg   : data /*+ (new Date()) * 1*/,
                    hide  : false,
                    detail: false,
                };
                this.list.push(target);
                console.info(target);
                //停止操作2秒后才会回收数据，主要是为了特效
                if (this.gcTimer) window.clearInterval(this.gcTimer);
                this.gcTimer = window.setTimeout(() => {
                    if (this.list.length >= 20) {
                        this.list.splice(0, this.list.length - 20);
                    }
                }, 2000);
            },
            showDetail: function (index) {
                clearInterval(this.detailTimer);
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    this.list[i1].detail = false;
                }
                //
                let curItem      = this.list[index];
                curItem.detail   = true;
                //
                this.detailTimer = setTimeout(() => {
                    curItem.detail = false;
                }, 5 * 1000);
            },
            hideAll   : function () {
                // console.info('hide');
                // $('#msg li div').stop(true, true).fadeOut(200);
            }
        }
    }
</script>