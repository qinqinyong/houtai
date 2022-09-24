<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addDialog" v-if="$hasBP('btn.Trademark.add')">添加</el-button>

    <!-- 展示列表 -->
    <el-table :data="trademarkList" border style="margin:20px 0">
      <el-table-column align="center" label="序号" type="index" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope='{row,$index}'>
          <img :src="row.logoUrl" alt="" style="width:100px;height:80px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <!-- row和index代表当前遍历品牌的对象 和这个品牌对象在数组中的下标-->
        <template slot-scope='{row,$index}'>
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updatedialog(row)"
            v-if="$hasBP('btn.Trademark.update')">修改</el-button>
          <el-button type="danger " icon="el-icon-delete" size="mini" @click="deleteTrademark(row)"
            v-if="$hasBP('btn.Trademark.remove')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器  -->
    <el-pagination background style="text-align: center;" :current-page="page" :page-sizes="[3, 5, 7]"
      :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="7"
      @size-change="sizeChange" @current-change="getTrademarkList">
    </el-pagination>

    <!-- 点击添加或修改按钮弹出dialog对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">

      <el-form :model="tmForm" style="width: 80%;" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--action 保存的是真实上传地址 /dev-api必须加上
          :show-file-list="false" 表明是单张图片上传，而不是一组照片墙
          --> 
          <el-upload class="avatar-uploader" 
            action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
 
<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      trademarkList: [],

      dialogFormVisible: false, //对话框隐藏或显示
      tmForm: { //收集表单数据的对象
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
      }
      // imageUrl: ''  //上传的图片
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: { 
    async getTrademarkList(page = 1) {
      this.page = page
      const result = await this.$API.trademark.reqPageList(this.page, this.limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.trademarkList = result.data.records
      }
    },

    sizeChange(size) {
      this.limit = size
      this.getTrademarkList()
    },

    // 上传图片的方法
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // 收集真正网络返回图片的路径 res.data
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      // 设置数组保存图片格式种类
      const typeArr = ['image/jpeg', 'image/png']
      // const isJPG = file.type === 'image/jpeg';
      const isJpegOrPng = typeArr.indexOf(file.type) !== -1

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJpegOrPng) {
        this.$message.error('上传头像图片只能是 JPG和PNG格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJpegOrPng && isLt2M;
    },

    // 添加数据是的对话框回调方法
    addDialog() {
      this.dialogFormVisible = true
      // 点击后清空数据遗留bug
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },

    // 修改对话框内容  修改必须传入当前修改的对象  已经添加的商品有id
    updatedialog(row) {
      this.dialogFormVisible = true
      // 浅拷贝 row中的数据都是基本数据类型
      this.tmForm = { ...row }
    },

    // 确定按钮的回调  分为添加确定和修改确定
    addOrUpdate() {
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 拿数据
          let trademark = this.tmForm
          try {
            // 发请求
            const result = await this.$API.trademark.addOrUpdate(trademark)
            // 成功提示  
            this.$message.success(trademark.id ? '修改品牌成功' : '添加品牌成功')
            // 关闭对话框
            this.dialogFormVisible = false
            //重新发请求获取数据   添加成功后数据会加载在最后页显示，但界面需返回到第一页  修改则是继续停留在当前页
            this.getTrademarkList(trademark.id ? this.page : 1)
          } catch (error) {
            this.$message.warning(trademark.id ? '修改品牌失败' : '添加品牌失败')
          }

        } else {
          console.log('校验失败不提交');
          return false;
        }
      });



    },

    // 删除品牌  利用MesaaageBox弹框
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 处理点击确定按钮的逻辑
        .then(async () => {
          //发请求
          try {
            await this.$API.trademark.delete(row.id);
            //成功干啥
            // 提示
            this.$message.success("删除成功!");
            // 重新获取列表数据
            // 我们得看当前页有几条数据，如果当前页只有一条数据，删除以后，我们要回到前一页
            // 如果当前页不是一条数据，就回到当前页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            //失败干啥
            this.$message.error("删除品牌失败");
          }
        })
        // 处理点击取消按钮的逻辑
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

  }
}    
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>