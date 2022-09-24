<template>
  <div>
    <!-- 菜单管理
      code: "Acl" // 标识名称
      deleted: false
      gmtCreate: "2020-11-30 16:40:08"
      gmtModified: "2020-11-30 16:40:08"
      id: "1333329957008228353"
      level: 2
      name: "权限管理"
      pid: "1" // 所属节点的id
      select: false
      status: null
      toCode: ""
      type: 1  // 1: 路由 2: 按钮

      children: []
      code: "btn.Role.assgin"  //功能权限值
      deleted: false
      gmtCreate: "2020-11-30 16:50:13"
      gmtModified: "2020-12-01 08:13:47"
      id: "1333332492158812161"
      level: 4
      name: "分配权限"
      pid: "1333330152781561858"
      select: false
      status: null
      toCode: "RoleAuth" //路由跳转权限值
      type: 2
    -->
    <!-- expand-row-keys可以通过该属性设置 Table 目前的展开行，
      需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 -->
    <el-table border style="margin-bottom: 20px;" :data="menuPermissionList" :expand-row-keys="expandKeys" row-key="id">

      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column prop="toCode" label="跳转权限值" />

      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <HintButton type="primary" :title="getAddTitle(row.level)" icon="el-icon-plus" size="mini"
            :disabled="row.level===4" @click="toAddPermission(row)">
          </HintButton>

          <HintButton type="primary" :title="row.level===4 ? '修改功能' : '修改菜单'" icon="el-icon-edit" size="mini"
            :disabled="row.level===1" @click="toUpdatePermission(row)">
          </HintButton>

          <HintButton :disabled="row.level===1" title="删除" type="danger" icon="el-icon-delete" size="mini"
            @click="removePermission(row)">
          </HintButton>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogPermissionVisible" :title="dialogTitle" @close="resetData">
      <el-form ref="permission" :model="permission" :rules="permissionRules" label-width="120px">
        <el-form-item label="父级名称" v-if="permission.level>2 && !permission.id">
          <el-input :value="permission.pname" disabled />
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" />
        </el-form-item>

        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="permission.code" />
        </el-form-item>

        <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level===4">
          <el-input v-model="permission.toCode" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { permission } from '@/api'


// 菜单权限校验的规则
const menuRules = {
  name: [{ required: true, message: '名称必须输入' }],
  code: [{ required: true, message: '权限值必须输入' }],
}

// 按钮功能权限校验的规则
const btnRules = {
  name: [{ required: true, message: '名称必须输入' }],
  code: [{ required: true, trigger: 'blur', message: '功能权限值必须输入' }]
}

export default {
  name: 'PermissionList',
  data() {
    return {
      menuPermissionList: [], // 菜单列表
      expandKeys: [], // 需要自动展开的项
      dialogPermissionVisible: false, // 是否显示菜单权限的Dialog

      permission: { // dialog收集的要操作的菜单权限对象
        level: 0,
        name: '',
        code: '',
        toCode: ''
      },
    }
  },

  computed: {
    // 动态计算得到Dialog的标题 利用id判断 有id是修改。没有是添加
    dialogTitle() {
      const { id, level } = this.permission
      if (id) {
        return level === 4 ? '修改功能' : '修改菜单'
      } else {
        return level === 4 ? '添加功能' : `添加${level === 2 ? '一级' : '二级'}菜单`
      }
    },

    // 根据权限的等级来计算确定校验规则
    permissionRules() {
      return this.permission.level === 4 ? btnRules : menuRules
    }
  },

  mounted() {
    this.fetchPermissionList()
  },

  methods: {
    // 请求获取权限菜单数据列表
    async fetchPermissionList() {
      const result = await this.$API.permission.getPermissionList()
      this.menuPermissionList = result.data.children
      this.expandKeys = [this.menuPermissionList[0].id]
    },

    /* 根据级别得到要显示的添加dialog的标题*/
    getAddTitle(level) {
      if (level === 1 || level === 2) {
        return '添加菜单'
      } else if (level === 3) {
        return '添加功能'
      }
    },

    /* 显示添加权限的界面(菜单或功能)*/
    toAddPermission(row) {
      // console.log(row);
      this.dialogPermissionVisible = true
      this.permission.pid = row.id  //所属节点
      this.permission.level = row.level + 1  //在一级只能添加2级，等级加1
      this.permission.type = this.permission.level === 4 ? 2 : 1  //1: 路由 2: 按钮
      this.permission.pname = row.name // 用于显示父名称, 但提交请求时是不需要的

      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate())
    },

    /* 修改菜单或更新功能的dialog*/
    toUpdatePermission(row) {
      this.dialogPermissionVisible = true
      this.permission = { ...row }  // 使用浅拷贝
      this.permission.type = this.permission.level === 4 ? 2 : 1
      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate())
    },

    /*  删除某个权限节点 */
    removePermission(permission) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.permission.removePermission(permission.id)
        this.$message.success(result.message || '删除成功!')
        this.fetchPermissionList()
      }).catch((error) => {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },

    /*  确定保存按钮 */
    addOrUpdatePermission() {
      this.$refs.permission.validate(async valid => {
        if (valid) {
          const { pname, ...perm } = this.permission // pname不需要携带，剩下参数用扩展运算符代替
          const result = await this.$API.permission[perm.id ? 'updatePermission' : 'addPermission'](perm)
          this.$message.success(result.message || `${perm.id ? '修改' : '添加'}成功!`)
          this.resetData()
          this.fetchPermissionList()
        }
      })
    },

    /*  取消按钮*/
    resetData() {
      this.dialogPermissionVisible = false
      this.permission = {
        level: 0,
        name: '',
        code: '',
        toCode: ''
      }
    }
  }
}

</script>
