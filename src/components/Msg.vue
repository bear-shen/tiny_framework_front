<template>
    <ul id="msg" class="nav navbar-nav ">
        <li v-for="(item,k) in list" :class="[
            'glyphicon'
            ,{'btn-success' :item.type=='success'}  ,{'glyphicon-ok'           :item.type=='success'}
            ,{'btn-primary' :item.type=='info'}     ,{'glyphicon-info-sign'    :item.type=='info'}
            ,{'btn-danger'  :item.type=='error'}    ,{'glyphicon-remove-sign'  :item.type=='error'}
            ,{'btn-warning' :item.type=='notice'}   ,{'glyphicon-alert'        :item.type=='notice'}
            ,{'hiding'      :item.hide}
            ]" v-on:click.self.stop="showDetail(k)">
            <div :class="[
                'hinter'
                ,{'btn-success' :item.type=='success'}
                ,{'btn-primary' :item.type=='info'}
                ,{'btn-danger'  :item.type=='error'}
                ,{'btn-warning' :item.type=='notice'}
                ,{'btn-warning' :item.type=='notice'}
                ,{'hide' :!item.detail}
                ]">{{item.msg}}
            </div>
        </li>
    </ul>
</template>

<style lang="scss">
    #msg {
        font-size: 0;
        height: $footerHeight;
        margin-bottom: 0;
        width: 75%;
        white-space: nowrap;

        justify-content: flex-start;
        flex-direction: row;

        li {
            display: inline-block;
            font-size: initial;
            height: $footerHeight;
            line-height: $footerHeight;
            width: 5%;
            text-align: center;
            position: relative;
            transition: width 0s, height 0s;

            .hinter {
                /*display: none;*/
                position: absolute;
                z-index: 40;
                left: 0;
                bottom: $footerHeight;
                line-height: $footerHeight*0.5;
                height: $footerHeight*0.5;
                font-size: $footerHeight*0.25;
                white-space: nowrap;
                padding: 0 5px;
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
    }

    @media(max-width: 767px) {
        #msg {
            width: 90%;
            text-align: center;
            /*margin-right: auto;*/
            /*margin-left: auto;*/

            height: $footerHeight*0.4;
            margin: 0 auto $footerHeight*0.1;

            li {
                height: $footerHeight*0.4;
                font-size: 0;

                .hinter {
                    bottom: $footerHeight*0.4;
                    line-height: $footerHeight*0.6;
                    height: $footerHeight*0.6;
                    font-size: $footerHeight*0.6*0.5;
                }
            }
        }
    }
</style>

<script>
    import router from "../router";

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
        props  : ['msg'],
        data   : function () {
            return {
                list       : [
                    {
                        type  : 'info',
                        msg   : 'success',
                        hide  : false,
                        detail: false,
                    },
                ],
                gcTimer    : 0,
                detailTimer: 0,
            }
        },
        watch  : {
            msg: function (to, from) {
                console.info(`msg: msg watched`);
                this.push(to.data, to.type);
            }
        },
        created: function () {
            if(this.msg){
                this.push(this.msg.data,this.msg.type)
            }
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
                for (let i1 = 0; i1 < this.list.length; i1++) {
                    this.list[i1].detail = false;
                }
                clearInterval(this.detailTimer);
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