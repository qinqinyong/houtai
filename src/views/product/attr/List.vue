<template>
  <div>
    <!-- 两个card -->
    <el-card>
      <!-- 三级分类列表 -->
      <CategorySelect @getcartgoryId="getcartgoryId" :isShowList="isShowList"></CategorySelect>
    </el-card>

      <!-- 属性列表展示 -->
    <el-card style="margin-top: 20px;">
      <!-- 第一个盒子显示正常展示属性 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table :data="attrList" border stripe>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope='{row,$index}'>
              <el-tag type="success" v-for="(attr, index) in row.attrValueList" :key='attr.id'>
                {{ attr.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" >
            <template slot-scope='{row,$index}'>
              <HintButton  type="warning" icon="el-icon-edit" size="mini" title="修改" @click="updateAttr(row)">
              </HintButton>
              <el-popconfirm :title="`确定删除${row.attrName}吗？`"  @onConfirm="deleteAttr(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除" ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 第二个盒子显示添加或修改的内容 -->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性值
        </el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table :data="attrForm.attrValueList" border stripe style="margin: 20px auto;">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope='{row,$index}'>
              <el-input v-if="row.isEdit" :ref="$index"  @blur="toLook(row)" @keyup.enter.native="toLook(row)"
                size="mini" v-model="row.valueName" placeholder="请输入属性值名称">
              </el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block;width:100%;height:100%">
                 {{row.valueName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope='{row,$index}'>
              <!-- @onConfirm点击确认按钮时触发 官网上是confirm是错的，真实应改是 onConfirm -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="attrForm.attrValueList.splice($index, 1)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除"> </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length===0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true, //控制是否显示添加或修改的界面显示
      attrForm: {
        "attrName": "",
        "attrValueList": [
          // {
          //  "attrId":'' ,
          //  "valueName": ''
          // }
        ],
        "categoryId": 0,
        "categoryLevel": 3,
        // "id": 0
      },
      isEdit: true, //给每个属性值带上标识，添加时为真，显示输入框。 修改时为false，显示span
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
        //最后拿到三级分类id后获取平台属性列表
        this.getAttrList()
      }
    },
    // 发请求获取属性值数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },

    showAddDiv() {
      this.isShowList = false
      // 点击添加属性时清空遗留
      this.attrForm = {
        "attrName": "",
        "attrValueList": [
          // {

          // }
        ],
        "categoryId": this.category3Id,
        "categoryLevel": 3
      }
    },

    // 添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        // 添加属性也好  修改属性也罢 都有可能添加属性值在这
        // 添加属性值的时候，属性值对象当中属性的id就是attrId，
        attrId: this.attrForm.id, //这个属性说的是属性值所属属性的id，如果是添加属性，这个id是没有的，如果是修改属性，这个id是有的
        valueName: '', //我现在只是添加了一个空的对象，属性都还没有呢，只是在占位,什么时候这个属性值有值，得让用户自己输入，输入了就有值
        isEdit: true, //点击添加属性时，加上标识  因为数组的方法在vue内部重写了，添加是响应式数据
      })

      // 新添加的input框自动获取焦点 
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },

    // 点击修改属性值
    updateAttr(row) {
      this.isShowList = false
      // 浅拷贝复制不行，因为数据里有对象
      // this.attrForm = {...row}
      // 深拷贝 用lodash的方法
      this.attrForm = cloneDeep(row);
      // 给每个属性值添加新的标识属性
      this.attrForm.attrValueList.forEach((item) => {
        //  item.isEdit = false  这样写不是响应式数据，因为响应式数据在beforecreate和created之间初始化数据
        // 用上面给数组的添加属性已经晚了，这时要用this.$set()方法
        this.$set(item, 'isEdit', false)
      });
    },

    // 给添加时的输入框设置的 触发失去焦点和回车事件后input变为span
    toLook(row) {
      //1. 切换状态前要判断input框内属性值不能为空
      let valueName = row.valueName
      if (valueName.trim() === '') {
        this.$message.warning('属性值不能为空')
        return
      }
      // 2.判断是否重复输入  数组的some()方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。
      // 它返回的是一个 Boolean 类型的值。
      let repeat = this.attrForm.attrValueList.some((item) => {
        // 先排除自身 
        if (item !== row) {
          // 排除自身后在做判断
          return item.valueName === valueName
        }
      })
      // 返回值为true表明有重复值
      if (repeat) {
        this.$message.warning('属性值不能重复')
        row.valueName = ""; //并清空输入框不合法的数据
        return
      }
      row.isEdit = false
    },

    // 给修改时的输入框 点击事件触发后 span变为input
    toEdit(row, index) {
      row.isEdit = true
      // 从span变为input后自动获取焦点逻辑
      this.$nextTick(() => {
        // 上面我们把row.isEdit = true改完之后，由于dom元素是通过vif才开始创建，紧接着你就开始获取这个元素
        // 此时我的input还没创建好，所以你获取到的就是undefined
        // this.$nextTick 和 updated 区别
        // this.$nextTick 页面的最近一次更新完成之后执行回调,一次就完了
        // updated  只要页面有数据更新 就会执行
        this.$refs[index].focus()
      })
    },

    // 保存添加的属性值
    async save() {
      // 1.获取参数
      let attr = this.attrForm
      // 2.整理参数 
      // 1).去掉空字符串的数据 2.)去掉后来添加的isEdit属性 
      //filter方法：过滤后将为 true的值返回新数组
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.isEdit  //如果属性值不为空，删掉对象中的isEdit属性
          return true
        }
      })
      // 3.) 若attrValueList为空数组，即属性值列表为空时不发数据
      if (attr.attrValueList.length === 0) {
        this.$message.warning('属性必须有属性值')
        return
      }

      // 3.发请求
      try {
        // 4.成功 和 失败
        await this.$API.attr.addOrUpdate(attr)
        this.$message.success('保存成功')
        // 回到展示页
        this.isShowList = true
        // 重新获取数据
        this.getAttrList()
      } catch (error) {
        // 4. 失败
        this.$message.error('保存失败')
      }

    },

    // 删除属性列表
    async deleteAttr(row){
        try {
          await this.$API.attr.delete(row.id)
          this.$message.success('删除成功')
           // 重新获取数据
          this.getAttrList()
        } catch (error) {
           this.$message.error('删除失败')
        }
    }
  }
}
</script>

<style >
 .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>