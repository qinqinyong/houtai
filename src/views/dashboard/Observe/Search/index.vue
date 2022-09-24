<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more "></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item >双皮奶</el-dropdown-item>
            <el-dropdown-item >蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>   
      
      <!-- 中间折线图 -->
        <el-row :gutter="5">
        <el-col :span="12">
          <Linechart ></Linechart>
        </el-col>
        <el-col :span="12">
          <Linechart></Linechart>
        </el-col>
      </el-row>

        <!-- 表格 -->
        <el-table  border stripe>
          <el-table-column 
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column 
            prop="prop"
            label="搜索关键字"
            width="width">
          </el-table-column>
          <el-table-column 
            prop="prop"
               sortable 
            label="用户数"
            width="width">
          </el-table-column>
          <el-table-column 
            prop="prop"
               sortable 
            label="周涨幅"
            width="width">
          </el-table-column>
        </el-table>
        
          <!-- 分页  @size-change="sizeChange"
            @current-change="currentChange"-->
          <el-pagination
          style="text-align:center ;"
            :current-page="page"
            :page-sizes="[10,15,16]"
            :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="total" 
            :pager-count="7">
          </el-pagination>
          
    </el-card>
  </div>
</template>

<script>

import Linechart from '@/views/dashboard/Observe/Search/Linechart'
export default {
  name: '',
  data() {
    return {
      page:1,
      total:100,
      limit:5
    }
  },
  components: {
    Linechart
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  
}

</style>