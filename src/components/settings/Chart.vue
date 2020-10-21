<template>
    <div class="content chart">
        <v-chart :options="options" theme="dark"/>
    </div>
</template>

<style lang="scss">
    .content.chart {
        width: 100%;
        height: $fontSize*14;

        .echarts {
            width: 100%;
            height: 100%;
        }
    }
</style>

<script>
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/pie'

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
        name      : "Chart",
        // el     : '#popup',
        components: {
            'v-chart': ECharts
        },
        props     : ['detail'],
        watch     : {
            //弹层数据处理
            info: function (to, from) {
                console.info(`popup confirm: info watched`);
                console.info(to);
            }
        },
        data      : function () {
            return {
                item   : {},
                options: {},
            }
        },
        created   : function () {
            console.info(`popup confirm: created`);
            this.item    = this.detail;
            this.options = this.format();
        },
        destroyed : function () {
            this.item = [];
        },
        methods   : {
            format: function () {
                let options = {
                    title : {text: this.item.name},
                    grid  : {
                        left        : '2.5%',
                        right       : '2.5%',
                        bottom      : '2.5%',
                        top         : '2.5%',
                        containLabel: true
                    },
                    series: []
                };
                let meta    = {
                    x     : [],
                    legend: [],
                    series: [],
                };
                switch (this.item.type) {
                    case 'ec_line':
                        Object.assign(options, {
                            tooltip: {trigger: 'axis'},
                            legend : {data: []},
                            xAxis  : {
                                type       : 'category',
                                boundaryGap: false,
                                data       : []
                            },
                            yAxis  : {type: 'value'},
                        });
                        for (let i1 = 0; i1 < this.item.data.length; i1++) {
                            let series = this.item.data[i1];
                            // console.warn(series);
                            meta.legend.push(series.name);
                            let arr = [];
                            for (let k in series.data) {
                                if (!series.data.hasOwnProperty(k)) continue;
                                if (i1 === 0) {
                                    meta.x.push(k);
                                }
                                arr.push(series.data[k]);
                            }
                            meta.series.push(
                                {
                                    name: series.name,
                                    type: 'line',
                                    data: arr,
                                });
                        }
                        options.series      = meta.series;
                        options.legend.data = meta.legend;
                        options.xAxis.data  = meta.x;
                        break;
                    case 'ec_time':
                        Object.assign(options, {
                            tooltip: {
                                trigger    : 'axis',
                                formatter  : function (params) {
                                    params   = params[0];
                                    var date = new Date(params.name);
                                    return params.value[0] + ' : ' + params.value[1];
                                },
                                axisPointer: {animation: false}
                            },
                            legend : {data: []},
                            xAxis  : {type: 'time',},
                            yAxis  : {type: 'value',},
                            series : []
                        });
                        for (let i1 = 0; i1 < this.item.data.length; i1++) {
                            let series = this.item.data[i1];
                            meta.legend.push(series.name);
                            let arr = [];
                            for (let i2 = 0; i2 < series.data.length; i2++) {
                                arr.push(
                                    {
                                        name : series.data[i2].date,
                                        value: [
                                            series.data[i2].date,
                                            series.data[i2].value
                                        ],
                                    });
                            }
                            meta.series.push(
                                {
                                    name          : series.name,
                                    type          : 'line',
                                    showSymbol    : false,
                                    hoverAnimation: false,
                                    data          : arr
                                });

                        }

                        options.legend.data = meta.legend;
                        options.series      = meta.series;
                        break;
                    case 'ec_pie':
                        Object.assign(options, {
                            tooltip: {
                                trigger  : 'item',
                                // formatter: '{a} <br/>{b} : {c} ({d}%)'
                                formatter: '{b}: {d}%'
                            },
                            legend : {
                                orient: 'vertical',
                                left  : 'left',
                                data  : []
                            },
                            series : []
                        });
                        for (let i1 = 0; i1 < this.item.data.length; i1++) {
                            let series = this.item.data[i1];
                            // console.warn(series);
                            let arr    = [];
                            console.info(series);
                            for (let i2 = 0; i2 < series.data.length; i2++) {
                                arr.push(series.data[i2]);
                                meta.legend.push(series.data[i2].name);
                            }
                            meta.legend.push();
                            meta.series.push(
                                {
                                    name  : series.name,
                                    type  : 'pie',
                                    //25-75
                                    //25+(50/len)*i
                                    //25+(50/len)*(i+1)
                                    radius: [
                                        `${25 + 50 / this.item.data.length * (i1)}%`,
                                        `${25 + 50 / this.item.data.length * (i1 + 1)}%`
                                    ],
                                    center: ['50%', '50%'],
                                    data  : arr,
                                });
                        }
                        options.series      = meta.series;
                        options.legend.data = meta.legend;
                        break;
                }
                console.info(options);
                return options;
            },
            submit: function () {
            },
            cancel: function () {
            },
        }
    }
</script>