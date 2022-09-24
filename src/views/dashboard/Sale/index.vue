import { start } from 'nprogress'
<template>
    <el-card style="margin-top:20px;">
        <div class="card">
            <!-- @tab-click="handleClick" -->
            <!-- 头部左侧 -->
            <el-tabs v-model="activeName" class="left">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visit"></el-tab-pane>
            </el-tabs>
            <!-- 头部右侧 -->
            <div class="right">
                <span @click="setday">今日</span>
                <span @click="setweek">本周</span>
                <span @click="setmonth">本月</span>
                <span @click="setyear">本年</span>
                <!-- 日历 -->
                <el-date-picker v-model="date" class="date" type="daterange" range-separator="-" size='mini'
                    value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>

        <!-- 数据图表 -->
        <el-row :gutter="10">
            <el-col :span="18">
                <div class="chart" ref="chart">5</div>
            </el-col>
            <el-col :span="6">

                <h3>门店{{ title }}排名</h3>
                <ul>
                    <li>
                        <span class="index active">1</span>
                        <span class="trade">肯德基</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index active">2</span>
                        <span class="trade">德克士</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index active">3</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">4</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">5</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">6</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">7</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">8</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">9</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>
                    <li>
                        <span class="index ">10</span>
                        <span class="trade">必胜客</span>
                        <span class="value">12564</span>
                    </li>

                </ul>
            </el-col>
        </el-row>

    </el-card>

</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'  //引入dayjs
import { mapState } from 'vuex'
export default {
    name: '',
    data() {
        return {
            activeName: 'sale',
            myChart: null,
            date: [] //收集日期
        }
    },
    methods: {
        setday() {//本日
            let day = dayjs().format('YYYY-MM-DD')
            this.date = [day, day]
        },
        setweek() {//本周
            let start = dayjs().day(1).format('YYYY-MM-DD')
            let end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start, end]
        },
        setmonth() {//本月
            let start = dayjs().startOf('month').format('YYYY-MM-DD')
            let end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [start, end]
        },
        setyear() {//本年
            let start = dayjs().startOf('year').format('YYYY-MM-DD')
            let end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [start, end]
        }
    },
    mounted() {
        this.myChart = echarts.init(this.$refs.chart)
        this.myChart.setOption({
            title: {
                text: this.title,

            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    color: 'skyblue',
                    data: []
                }
            ]
        }
        )
    },
    computed: {
        // 计算标题
        title() {
            return this.activeName === 'sale' ? '销售额' : '访问量'
        },
        // 获取数据
        ...mapState({
            listState: state => state.home.list
        })
    },
    watch: {
        // 监听title变化
        title() {
            this.myChart.setOption({
                title: {
                    text: this.title + '趋势',
                },
                xAxis: {
                    data: this.title === "销售额"
                        ? this.listState.orderFullYearAxis
                        : this.listState.userFullYearAxis,
                },
                series: [{
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: this.title === "销售额"
                        ? this.listState.orderFullYear
                        : this.listState.userFullYear,
                    color: "skyblue",
                },
                ],
            })
        },
         // 监听数据，一旦受到数据，立即使用，不至于图表没数据展示
        listState() {
            this.myChart.setOption({
                title: {
                    text: this.title,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.listState.orderFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    { 
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        color: 'skyblue',
                        data: this.listState.orderFullYear
                    }
                ]
            }
            )
        }
       


    }
}
</script>

<style lang="scss" scoped>
.card {
    position: relative;
}

.left {
    //使tabs占据整个宽度
    width: 100%;
}

.right {
    position: absolute;
    right: 0;
    top: 0;

    .date {
        margin: 0 15px;
        width: 200px;
    }

    span {
        margin: 0 5px;
    }
}

.chart {
    width: 100%;
    height: 300px;
}

ul {
    padding: 0;
    width: 100%;
    height: 300px;

    li {
        list-style: none;
        height: 8%;
        margin: 5px 0;

        .index {
            float: left;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
        }

        .active {
            background-color: black;
            color: white;
        }

        .value {
            float: right;
        }

        .trade {
            margin-left: 15px;
        }
    }
}
</style>