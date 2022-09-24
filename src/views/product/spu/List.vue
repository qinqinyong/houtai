<template>
  <div>
    <el-card>
      <CategorySelect @getcartgoryId="getcartgoryId" :isShowList="isShowList"></CategorySelect>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div v-show="!isShowSpuform && !isShowSkuform">
        <el-button type="primary" icon="el-icon-plus" @click="addSpuForm">添加SPU</el-button>
        <!-- 列表 -->
        <el-table :data="spuList" border stripe>
          <el-table-column prop="prop" type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope='{row,$index}'>
              <HintButton type="primary" icon="el-icon-plus" size="mini" title="添加SKU" @click="addSkuForm(row)">
              </HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="updateSpuForm(row)">
              </HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看SKU列表"  @click="showSkuList(row)"></HintButton>
              <el-popconfirm :title="`你确定删除${row.spuName}`" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除SPU"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination @size-change="sizeChange" @current-change="getSpuList" style="text-align:center;"
          :current-page="page" :page-sizes="[2, 3, 5]" :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total"
          :total="total" background :pager-count="7">
        </el-pagination>
      </div>

      <!-- 添加或修改spu              .sync双向数据同步  子组件分发this.$emit('update:isShowSpuform', false)  -->
      <Spuform ref="spu" v-show="isShowSpuform" :isShowSpuform.sync="isShowSpuform" @cancelBack="cancelBack"
        @successBack="successBack">
      </Spuform>
      <!-- <SpuForm  ref="spu" v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->

      <!-- 修改sku -->
      <Skuform ref="sku" v-show="isShowSkuform" :visible.sync="isShowSkuform"></Skuform>

      <!-- 查看sku列表详情对话框 -->
      <el-dialog :title="`${spu.spuName}=>SKU列表}`" 
        :before-close="resetSkuList"
        :visible.sync="dialogTableVisible" >
        <el-table :data="skuList" v-loading="loading">
          <el-table-column  property="skuName" label="名称" width="width"></el-table-column>
          <el-table-column  property="price" label="价格(元)" width="width"></el-table-column>
          <el-table-column   property="weight" label="重量(千克)" width="width"></el-table-column>
          <el-table-column   property="address" label="默认图片" width="width">
            <template slot-scope='{row,$index}'>
                <img :src="row.skuDefaultImg"   style="width: 60px; height: 80px"  alt="">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
import Spuform from '@/views/product/components/Spuform'
import Skuform from '@/views/product/components/Skuform'
export default {
  name: 'Spu',
  components: {
    Spuform,
    Skuform
  },
  data() {
    return {
      isShowList: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      total: 0,
      spuList: [],
      isShowSpuform: false,
      isShowSkuform: false,
       //下面数据是给dialog用的
      dialogTableVisible: false, //dialog显示和隐藏的数据
      spu: {},
      skuList: [],
      loading: false,
    }
  },
  methods: {
    getcartgoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
         //选中一级id后，二级和三级要清掉
        this.category2Id = ''
        this.category3Id = ''
        this.categoryList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.categoryList = []
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    // 发请求获取数据
    async getSpuList(pager = 1) {
      this.page = pager
      let { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.spuList = result.data.records
      }
    },

    sizeChange(size) {
      this.limit = size
      this.getSpuList()
    },

    // 点击添加  spu按钮
    addSpuForm() {
      this.isShowSpuform = true
      // 子组件收集数据时需要category3Id  ref通信方式
        //需要发送两个请求 
      this.$refs.spu.initAddSpuFormDate(this.category3Id)
    },

    // 点击修改 spu按钮
    updateSpuForm(row) {
      this.flag = row.id     //加标识
      this.isShowSpuform = true
      this.$refs.spu.initUpdateSpuFormDate(row)
      // console.log(row);
    },

    // 自定义事件
    successBack() {
      // 子组件保存数据成功后,父组件干活  为了判断是修改还是添加
      // 这里设置点击修改按钮时数据加上flag标识，这样判断返回数据中有没有flag就行
      if (this.flag) {
        this.getSpuList(this.page)  //修改的话就停留在当前页
      } else {
        this.getSpuList()
      }
      // 清空flag为下次做准备
      this.flag = null
    },

    // 自定义事件
    cancelBack() {
      // 重置flag
      this.flag = null
    },

    // 删除spu
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id)
        // 提示
        this.$message.success('删除成功')
        // 发请求重新获取列表
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)

      } catch (error) {
        this.$message.error('删除失败')
      }

    },


    // 点击添加sku按钮
    addSkuForm(row) {
      this.isShowSkuform = true
      this.$refs.sku.initAddSkuFormDate(row, this.category1Id, this.category2Id)
    },

    // 展示sku dialog框
    async showSkuList(row){
      this.dialogTableVisible = true
      this.spu = row

      this.loading = true  //发请求前设为true， 有加载转圈的效果
      const result = await this.$API.sku.getListBySpuId(row.id)
      if (result.code === 200) {
        this.skuList = result.data
      }
      this.loading = false //请求结束后设为false
    },

    // 一般关闭dialog之前需要清空相关数据
    resetSkuList(){
      this.skuList = []
      this.dialogTableVisible = false
      this.loading = false
    }

  },
  watch: {
    // 三级分类列表的 禁用
    isShowSpuform(newVal, oldVal) {
      this.isShowList = !newVal
    },
    isShowSkuform(newVal, oldVal) {
      this.isShowList = !newVal
    },
  }
}
</script>

<style lang="scss" scoped>
</style>