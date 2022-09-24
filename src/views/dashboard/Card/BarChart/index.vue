<template>
   <div class="chart" ref="chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  data(){
    return {
     
    }
  },
  mounted(){
    let barchart = echarts.init(this.$refs.chart)
    barchart.setOption({
        xAxis:{
            show:false,
            type: 'category'  //均分
        },
        yAxis:{
             show:false
        },
        series:{
            type:'bar',
            color:'skyblue',
            data:[51,84,55,38,21,81,65,71,54],
        },
         grid: {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            },
        // 提示
        tooltip:{}
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