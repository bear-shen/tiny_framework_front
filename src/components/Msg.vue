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
                ]">{{item.msg}}
            </div>
        </li>
    </ul>
</template>

<style scoped>

</style>

<script>
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
                        type: 'info',
                        msg : 'success',
                        hide: false,
                    }
                ],
                gcTimer    : 0,
                detailTimer: 0,
            }
        },
        created: function () {
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
                        this.list[i1].hide = true;
                    }
                }
                let target = {
                    type: type,
                    msg : data /*+ (new Date()) * 1*/,
                    hide: false,
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
                // console.info('show');
                let target = $('#msg li').eq(index).children('div');
                target.fadeIn(200, () => {
                    setTimeout(() => {
                        target.fadeOut(200);
                    }, 15000)
                });
            },
            hideAll   : function () {
                // console.info('hide');
                $('#msg li div').stop(true, true).fadeOut(200);
            }
        }
    }
</script>