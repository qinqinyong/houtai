<template>
    <!-- 容器 -->
    <div class="chart" ref="chart"></div>
</template>

<script>

import echarts from 'echarts'
export default {
    name: '',
    data() {
        return {

        }
    },
    mounted() {
        // 初始化echarts实例
        let lineChart = echarts.init(this.$refs.chart)
        // 配置数据
        lineChart.setOption({
            xAxis: {
                show: false, //隐藏坐标轴
                type: 'category'  //均分

            },
            yAxis: {
                show: false
            },
            series: {
                type: 'line',
                data: [5,52, 46, 96, 55, 44, 79, 55, 95, 45,],
                //消除拐点
                itemStyle: {
                    opacity: 0,
                },
                // 设置线色
                lineStyle: {
                    color: 'pink'
                },
                // 填充
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'pink' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'white' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }

            },
            grid: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0

            }
        })
    }

}
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>