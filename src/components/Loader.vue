<template>
    <div id="loader" v-if="isShow" :style="{opacity:isTransparent?0:1}">

    </div>
</template>

<style lang="scss">
    #loader {
        //background-color: rgba(0, 0, 0, 0.25);
        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }

    #loader {
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
    }

    @media(max-width: 767px) {
        #loader {
            top: $footerHeight*0.75;
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
        name: "Loader",
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