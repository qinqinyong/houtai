<template>
  <!-- 添加sku -->
  <div>
    <el-form :model="skuForm" label-width="100px">

      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuForm.price" placeholder="SKU价格" type="number"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuForm.weight" placeholder="SKU重量" type="number"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input v-model="skuForm.skuDesc" placeholder="SKU规格描述" type="textarea" rows="3"></el-input>
      </el-form-item>

      <!-- 平台属性是在item里面又放置的行内form -->
      <el-form-item label="平台属性">
        <el-form label-width="100px" :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrList" :key='attr.id'>
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList" :key='attrValue.id'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 收集skuAttrValueList有效数据 把属性值id和属性id拼在一起，数据挂在属性上，好整理数据
      {
          //   valueId: 0,
          //   valueName: "string"
       }
       -->

      <!-- 销售属性也是在item里面放置的form -->
      <el-form-item label="销售属性">
        <el-form label-width="100px" :inline="true">
          <el-form-item :label="spuSaleAttr.saleAttrName" v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key='spuSaleAttr.id'>
            <el-select v-model="spuSaleAttr.saleAttrIdAttrValueId" placeholder="请选择">
              <el-option :label="spuSaleAttrValue.saleAttrValueName" :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="(spuSaleAttrValue, index) in spuSaleAttr.spuSaleAttrValueList" :key='spuSaleAttrValue.id'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="spuImageList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope='{row,$index}'>
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>

          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope='{row,$index}'>
              <el-button v-if="row.isDefault === '0'" type="primary" size="mini"  @click="setDefault(row)">设为默认</el-button>
              <el-tag v-else type="success" >默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel" >取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Sku',
  data() {
    return {
      skuForm: {
        // 父组件传递过来
        category3Id: '',  
        tmId: '', 
        spuId:'',  //这个id是告诉后台给哪个spu添加sku

        //v-model收集
        price: '',  
        weight: "", 
        skuDesc: '',
        skuName: '',

        skuDefaultImg: '',  //通过代码选择时收集

        skuAttrValueList: [//平台属性
          // {平台属性
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string"
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [//销售属性
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      },

      spu: {},
      checkImgList: [], //收集选中的图片

      // 保存初始化数据
      spuSaleAttrList: [],//对应销售属性
      spuImageList: [],
      attrList: [], //平台属性
    }
  },
  methods: {
    // 初始化请求获取数据
    async initAddSkuFormDate(row, category1Id, category2Id) {
      this.spu = row //先保存传递过来的spu,后期要用

      // 获取指定SPU的id对应的销售属性列表
      const promise1 = this.$API.sku.getSpuSaleAttrList(row.id)
      //  获取指定SPU的id对应的图片列表
      const promise2 = this.$API.sku.getSpuImageList(row.id)
      // 根据选中三级分类后获取平台属性列表
      const promise3 = this.$API.attr.getList(category1Id, category2Id, row.category3Id)
      const result = await Promise.all([promise1, promise2, promise3])
      this.spuSaleAttrList = result[0].data
      this.attrList = result[2].data

      //为了收集选中的默认图片，我们需要给每个图片加上isDefault属性 
      let spuImageList = result[1].data
      spuImageList.forEach(item => { item.isDefault = '0' });
      this.spuImageList = spuImageList

    },

    // 收集图片的回调
    handleSelectionChange(val) {
      //收集图片列表到选中的图片数组当中
      this.checkImgList = val;
    },
    // 设置按钮为默认的回调
    setDefault(row) {
      //利用排他思想
      this.spuImageList.forEach(item => {
        item.isDefault = '0'
      });
      row.isDefault = '1'
      // 随后就保存skuDefaultImg数据
      this.skuForm.skuDefaultImg = row.imgUrl
    },

    // 保存
    async save() {
      // 1.获取参数
      let { skuForm, spu, checkImgList, spuSaleAttrList, attrList } = this
      // 整理参数  1)父组件传递的数据
      skuForm.category3Id = spu.category3Id
      skuForm.tmId = spu.tmId
      skuForm.spuId = spu.id
      //  2)整理图片数据
      // {
      //     要求                   现状
      //   imgName: "string",    imgName
      //   imgUrl: "string",     imgUrl
      //   isDefault: "string",  isDefault
      //   spuImgId: 0           spuid
      // }
      skuForm.skuImageList = checkImgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.spuImgId
        }
      });

      //  3)整理 平台属性 数据skuForm.skuAttrValueList
      // {
      //   attrId: 0,
      //   valueId: 0,
      // }
      // 当前已经收集的是attr.attrIdValueId
      skuForm.skuAttrValueList = attrList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          let [attrId, valueId] = item.attrIdValueId.split(':')
          let obj = {
            attrId,
            valueId
          }
          prev.push(obj)
        }
        return prev
      }, [])
      
      //  4)整理 销售属性 数据skuForm.skuSaleAttrValueList
      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAttrValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdAttrValueId.split(':')
          let obj = {
            saleAttrId,
            saleAttrValueId
          }
          prev.push(obj)
        }
        return prev
      }, [])
       
      // 发请求
      try {
        await this.$API.sku.addUpdate(skuForm)
        // 提示
        this.$message.success('保存sku成功')
        // 返回列表页
        this.$emit('update:visible', false)
        // 清空data
        this.resetData()
      } catch (error) {
        this.$message.error('保存sku失败')
      }
 
    },

    // 取消的回调
    cancel(){
      // 回到列表页
      this.$emit('update:visible', false)
       // 清空data
      this.resetData()
    },
    
    // 重置数据
    resetData() {
      this.skuForm = {
        category3Id: '',  
        tmId:'',
        spuId:'',  
        price:'',  
        weight:"",
        skuDesc:'',
        skuName:'',
        skuDefaultImg:'',
        skuAttrValueList:[],
        skuImageList:[],
        skuSaleAttrValueList:[],
      },
      this.spu= {},
      this.checkImgList= [],
      this.spuSaleAttrList= [],
      this.spuImageList= [],
      this.attrList=[]
    }
  
  }
}
</script>

<style lang="scss" scoped>
</style>
