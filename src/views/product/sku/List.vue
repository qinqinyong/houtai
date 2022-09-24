<template>

  <el-card class="sku-list">
    <!-- 表格 -->
    <el-table :data="skuList" border stripe v-loading="loading">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="150">
        <template slot-scope='{row,$index}'>
          <img :src="row.skuDefaultImg" alt="" style="width:100px ;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="100">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="250">
        <template slot-scope='{row,$index}'>
          <HintButton v-if="row.isSale === 0" type="info" icon="el-icon-top" size="mini" title="上架"
            @click="onSale(row.id)">
          </HintButton>
          <HintButton v-if="row.isSale === 1" type="success" icon="el-icon-bottom" size="mini" title="下架"
            @click="cancelSale(row.id)">
          </HintButton>

          <HintButton type="primary" icon="el-icon-edit" size="mini" title="修改" @click="toUpdateSku(row.id)"></HintButton>
          
          <HintButton type="info" icon="el-icon-info" size="mini" title="详情" @click="showSkuInfo(row.id)"></HintButton>
         
          <el-popconfirm :title="`你确定删除${row.skuName}吗?`" @onConfirm="deleteSku(row.id)">
            <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除"></HintButton>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination style="text-align: center;" :current-page="page" :page-sizes="[10, 15, 20]" :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total" :total="total" background :pager-count="7"
      @size-change="sizeChange" @current-change="getSkuList">
    </el-pagination>


    <!-- 详情页抽屉展示 -->
    <el-drawer :visible.sync="isShowSkuInfo" size="50%" :show-close="false" :with-header="false">
      <el-row>
        <!-- 一行放两列 格栅总共为24份 5+16两份足够用了，太多会溢出-->
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right:5px" v-for="value in skuInfo.skuAttrValueList" :key="value.id">
            {{ value.attrId + '-' + value.valueId }}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
 
    </el-drawer>


  </el-card>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      skuList: [], // SKU列表
      loading: false, // 是否正在加载中
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      skuInfo: {},
      isShowSkuInfo: false
    }
  }, 
  mounted() {
    this.getSkuList()
  },
  methods: {

    //  异步获取指定页码的sku列表
    async getSkuList(page = 1) {
      this.page = page
      this.loading = true
      const result = await this.$API.sku.getList(this.page, this.limit)
      this.skuList = result.data.records
      this.total = result.data.total
      this.loading = false
    },
    sizeChange(size) {
      this.limit = size
      this.getSkuList()
    },


    // 对指定SKU进行上架的请求
    async onSale(skuId) {
      await this.$API.sku.onSale(skuId)
      this.$message.success('上架成功!')
      // 重新获列表数据 
      this.getSkuList(this.page)

    },
    // 对指定SKU进行下架的请求
    cancelSale(skuId) {
      this.$API.sku.cancelSale(skuId)
      this.$message.success("下架成功!")
      // 重新获列表数据 
      this.getSkuList(this.page)
    },

    // 修改sku
    toUpdateSku() {
      this.$message.info('正在开发中...')
    },


    // 查看sku详情
    async showSkuInfo(id) {
      this.isShowSkuInfo = true
      const result = await this.$API.sku.get(id)
      this.skuInfo = result.data
    },

    // 删除sku
    async deleteSku(skuId) {
      try {
        await this.$API.sku.remove(skuId)
        this.$message.success('删除SKU成功')
        this.getSkuList(1)
      } catch (error) {
        this.$message({
          message: error.message || '删除SKU失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped> /* 不加scoped, 可以影响子组件 */

// card容器
.sku-list {
  // 格栅行
  .el-row {
    height: 40px;
      // 列
    .el-col {
      line-height: 40px;

      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  // 自定义轮播图样式  高度自带，宽度需自己定义
  .sku-carousel {
    width: 400px;
    border: 1px solid #ccc;

    img {
      width: 400px;
      height: 400px;
    }
  
    // 深度作用选择器
    ::v-deep .el-carousel__indicator {
      // 指示器
      button {
        background-color: gray;
      }
      &.is-active {
        button {
          background-color: skyblue; 
        }
      }
    } 
  }
}
</style> 