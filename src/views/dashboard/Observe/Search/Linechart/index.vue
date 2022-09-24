<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <svg t="1660190049946" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2408" width="16" height="16">
        <path
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          p-id="2409" fill="#8a8a8a"></path>
        <path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="2410" fill="#8a8a8a"></path>
        <path d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" p-id="2411"
          fill="#8a8a8a"></path>
      </svg>
    </div>
    <div class="number">
      <span>12321</span>
      <span>17.1%</span>
      <svg t="1660191800008" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2511" width="16" height="16">
        <path d="M325.456471 862.280661" p-id="2512" fill="#d81e06"></path>
        <path d="M882.057788 862.280661" p-id="2513" fill="#d81e06"></path>
        <path d="M236.028491 877.160382" p-id="2514" fill="#d81e06"></path>
        <path d="M960.132455 877.160382" p-id="2515" fill="#d81e06"></path>
        <path d="M63.683483 788.736998" p-id="2516" fill="#d81e06"></path>
        <path d="M958.469023 788.736998" p-id="2517" fill="#d81e06"></path>
        <path d="M64.77753 858.792098" p-id="2518" fill="#d81e06"></path>
        <path
          d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z"
          p-id="2519" fill="#d81e06"></path>
        <path d="M959.523505 858.792098" p-id="2520" fill="#d81e06"></path>
      </svg>
      <svg t="1660191895683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="3497" width="16" height="16">
        <path d="M325.456471 862.280661" p-id="3498" fill="#1afa29"></path>
        <path d="M882.057788 862.280661" p-id="3499" fill="#1afa29"></path>
        <path d="M236.028491 877.160382" p-id="3500" fill="#1afa29"></path>
        <path d="M960.132455 877.160382" p-id="3501" fill="#1afa29"></path>
        <path d="M63.683483 788.736998" p-id="3502" fill="#1afa29"></path>
        <path d="M958.469023 788.736998" p-id="3503" fill="#1afa29"></path>
        <path d="M64.77753 858.792098" p-id="3504" fill="#1afa29"></path>
        <path
          d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z"
          p-id="3505" fill="#1afa29"></path>
        <path d="M959.523505 858.792098" p-id="3506" fill="#1afa29"></path>
      </svg>
    </div>
    <div class="footer">
      <div class="chart" ref="chart"></div>
    </div>
  </div>
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
    let linechart = echarts.init(this.$refs.chart)
    linechart.setOption({
      xAxis: {
        show: false, //隐藏坐标轴
        type: 'category'  //均分
      },
      yAxis: {
        show: false
      },
      series: {
        type: 'line',
        data: [5, 52, 46, 96, 55, 44, 79, 55, 95, 45,],
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
  },
}
</script> 

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }
}

.number {
  margin: 10px 0;

  span {
    margin-right: 30px;
  }
}

.footer {
  width: 100%;
  height: 50px;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>