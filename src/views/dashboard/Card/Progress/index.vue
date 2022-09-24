<template>
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
        let progresschart = echarts.init(this.$refs.chart)
        progresschart.setOption({
            xAxis: {
                show: false,
                // 最小值与最大值设置
                nin:0,
                max:100
                
            },
            yAxis: {
                show: false,
                type: 'category'  //均分  在y轴分布
            },
            series: {
                type: 'bar',
                color: 'yellowgreen',
                data: [73],
                // 柱状图宽度
                barWidth:10,
                // 设置背景色
                showBackground :true,
                backgroundStyle:{
                    color:'#eee'
                },
                //是否显示标签
                label:{
                    show:true,
                    formatter:'|',  //提示样式  
                    position:'right' //位置
                }
            },
             grid: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            },
            // 提示
            tooltip: {}
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