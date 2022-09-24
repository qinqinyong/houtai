<template>
   <div>
    <el-row :gutter="20">
        <el-col :span="6" >
            <el-card >
                 <Detail title="总销售额" number="￥123706">
                    <template slot="chart">
                        <span>周同比 &nbsp;&nbsp;56.54%&nbsp;&nbsp;<svg t="1660191800008" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2511" width="16" height="16"><path d="M325.456471 862.280661" p-id="2512" fill="#d81e06"></path><path d="M882.057788 862.280661" p-id="2513" fill="#d81e06"></path><path d="M236.028491 877.160382" p-id="2514" fill="#d81e06"></path><path d="M960.132455 877.160382" p-id="2515" fill="#d81e06"></path><path d="M63.683483 788.736998" p-id="2516" fill="#d81e06"></path><path d="M958.469023 788.736998" p-id="2517" fill="#d81e06"></path><path d="M64.77753 858.792098" p-id="2518" fill="#d81e06"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="2519" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="2520" fill="#d81e06"></path></svg></span>
                        <span>日同比 &nbsp;&nbsp;19.79%&nbsp;&nbsp;<svg t="1660191895683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3497" width="16" height="16"><path d="M325.456471 862.280661" p-id="3498" fill="#1afa29"></path><path d="M882.057788 862.280661" p-id="3499" fill="#1afa29"></path><path d="M236.028491 877.160382" p-id="3500" fill="#1afa29"></path><path d="M960.132455 877.160382" p-id="3501" fill="#1afa29"></path><path d="M63.683483 788.736998" p-id="3502" fill="#1afa29"></path><path d="M958.469023 788.736998" p-id="3503" fill="#1afa29"></path><path d="M64.77753 858.792098" p-id="3504" fill="#1afa29"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="3505" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="3506" fill="#1afa29"></path></svg></span>
                    </template>
                    <template slot="footer">
                        <span>日销售额￥&nbsp;&nbsp; 12423</span>
                    </template>
                 </Detail>
            </el-card>
        </el-col>
        <el-col :span="6" >
            <el-card >
                   <Detail title="访问量" number="88465">
                    <template slot="chart">
                      <LineChart></LineChart>
                    </template>
                    <template slot="footer">
                        <span>日访问量&nbsp;&nbsp; 12423</span>
                    </template>
                   </Detail>
            </el-card>
        </el-col>
        <el-col :span="6" >
            <el-card >
                 <Detail title="支付笔数" number="88465">
                    <template slot="chart">
                        <BarChart></BarChart>
                    </template>
                    <template slot="footer">
                        <span>转化率&nbsp;&nbsp;65%</span>
                    </template>
                 </Detail>
            </el-card>
        </el-col>
        <el-col :span="6" >
            <el-card >
                 <Detail title="运营活动效果" number="73%">
                     <template slot="chart">
                       <Progresschart></Progresschart>
                    </template>
                     <template slot="footer">
                        <span>周同比 &nbsp;&nbsp;12%&nbsp;&nbsp;<svg t="1660191800008" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2511" width="16" height="16"><path d="M325.456471 862.280661" p-id="2512" fill="#d81e06"></path><path d="M882.057788 862.280661" p-id="2513" fill="#d81e06"></path><path d="M236.028491 877.160382" p-id="2514" fill="#d81e06"></path><path d="M960.132455 877.160382" p-id="2515" fill="#d81e06"></path><path d="M63.683483 788.736998" p-id="2516" fill="#d81e06"></path><path d="M958.469023 788.736998" p-id="2517" fill="#d81e06"></path><path d="M64.77753 858.792098" p-id="2518" fill="#d81e06"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="2519" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="2520" fill="#d81e06"></path></svg></span>
                        <span>日同比 &nbsp;&nbsp;11%&nbsp;&nbsp;<svg t="1660191895683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3497" width="16" height="16"><path d="M325.456471 862.280661" p-id="3498" fill="#1afa29"></path><path d="M882.057788 862.280661" p-id="3499" fill="#1afa29"></path><path d="M236.028491 877.160382" p-id="3500" fill="#1afa29"></path><path d="M960.132455 877.160382" p-id="3501" fill="#1afa29"></path><path d="M63.683483 788.736998" p-id="3502" fill="#1afa29"></path><path d="M958.469023 788.736998" p-id="3503" fill="#1afa29"></path><path d="M64.77753 858.792098" p-id="3504" fill="#1afa29"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="3505" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="3506" fill="#1afa29"></path></svg></span>
                    </template>
                 </Detail>
            </el-card>
        </el-col>
       
    </el-row>
   </div>
</template>

<script>
import Detail  from '@/views/dashboard/Card/Detail'
import LineChart from '@/views/dashboard/Card/LineChart'
import BarChart from '@/views/dashboard/Card/BarChart'
import Progresschart from '@/views/dashboard/Card/Progress'
export default {
  name: 'Card',
  data(){
    return {
     
    }
  },
  components:{
    Detail,
    LineChart,
    BarChart,
    Progresschart
  }
}
</script>

<style lang="scss" scoped>

</style>