<template>
    <svg class="popup_loader square" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="width+'px'" :height="width+'px'">
        <polygon v-for="offset in offsets" :points="offset"></polygon>
        <!--<polygon v-for="offset in offsets" points="0,224.5139883 309.0169944,449.0279766 1000,224.5139883 309.0169944,0"></polygon>-->
    </svg>
</template>

<style lang="scss">
    svg.square.popup_loader {
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

        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        animation: rotate #{$angle}s cubic-bezier(0, 0, 1, 1) infinite;
        //width: 20vw;
        //height: 20vw;
        position: relative;
        margin-left: auto;
        margin-right: auto;
        margin-top: calc(#{$footerHeight});
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
</style>

<script>
    /**
     * @var isShow          (internal)
     * @var isTransparent   (internal)
     * @var angle           (internal)
     * @var width           (internal)
     * @var rRatio          (internal)
     * @var inScale         (internal)
     * @var offsets         (internal)
     * @method show         () 显示遮罩
     * @method hide         () 隐藏遮罩
     * @method createStar   (internal)
     * */
    export default {
        name   : "PopupLoader",
        // el     : '#loader',
        data   : function () {
            return {
                isShow       : false,
                isTransparent: true,
                angle        : 4,
                width        : 300,
                rRatio       : 0.5,//外半径
                inScale      : 0.6,//内半径（参考）
                offsets      : [],
            }
        },
        created: function () {
            this.createStar(this.width, this.angle, this.rRatio, this.inScale);
        },
        methods: {
            show      : function () {
                this.isShow = true;
                //做个延迟不然特效不会出来……
                setTimeout(() => {
                    this.isTransparent = false;
                }, 10);
                popup.hide();
            },
            hide      : function () {
                this.isTransparent = true;
                setTimeout(() => {
                    this.isShow = false;
                }, 500);
            },
            createStar: function (width, angle, rRatio, inScale) {
                this.offsets = [];
                let deg      = 360 / angle;
                let rad      = deg / 180 * Math.PI;
                let r        = width * inScale;
                let vX       = r * Math.tan(rad / 4)
                    / (Math.tan(rad / 4) + Math.tan(rad / 2));
                let vY       = r * Math.tan(rad / 4) * Math.tan(rad / 2)
                    / (Math.tan(rad / 4) + Math.tan(rad / 2));
                // console.info(deg);
                // console.info(vX);
                // console.info(vY);
                let mid = width / 2;
                for (let ang = 0; ang < angle; ang++) {
                    let ol  = {
                        x0: mid,
                        y0: mid,
                        x1: mid + vX,
                        y1: mid - vY,
                        x2: mid + width * rRatio,
                        y2: mid,
                        x3: mid + vX,
                        y3: mid + vY,
                    };
                    let str = `${ol.x0},${ol.y0} ${ol.x1},${ol.y1} ${ol.x2},${ol.y2} ${ol.x3},${ol.y3}`;
                    this.offsets.push(str);
                }
            },
        }
    };
</script>