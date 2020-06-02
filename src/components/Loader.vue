<template>
    <div id="loader" v-if="isShow" :style="{opacity:isTransparent?0:1}">
        <svg class="square" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="width+'px'" :height="width+'px'">
            <polygon v-for="offset in offsets" :points="offset"></polygon>
            <!--<polygon v-for="offset in offsets" points="0,224.5139883 309.0169944,449.0279766 1000,224.5139883 309.0169944,0"></polygon>-->
        </svg>
    </div>
</template>

<style scoped>

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