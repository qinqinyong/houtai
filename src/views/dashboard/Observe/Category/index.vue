<template>
  <div>
    <el-card>
      <div class="head">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="线下"></el-radio-button>
        </el-radio-group>
      </div>

      <div class="footer">
        <div class="chart" ref="chart"></div>
      </div>
    </el-card>

  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  data() {
    return {
      value: '线上',
    }
  },
  mounted() {
    let piechart = echarts.init(this.$refs.chart)
    piechart.setOption({
      title:{
        text:'视频',
        subtext:1048,
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outsize' //在外圈面指示
          },
          labelLine: { //指示线
            show: true
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: '音乐' },
            { value: 580, name: '邮件' },
            { value: 484, name: '关键字' },
            { value: 300, name: '新闻' }
          ],
          
        }
      ]
    })

    // 绑定事件
    piechart.on('mouseover', (params)=>{
      // 从params中取出参数
      const {value,name} =params.data
      piechart.setOption({
        title:{
          text:name,
          subtext:value
        }
      })

    });
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.footer {
  width: 100%;
  height: 300px;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>