npm<template>
    <div>
        <!-- Table 表格 树形数据与懒加载 -->
        <el-table  :data="categoryList1"  style="width: 1000px;margin-bottom: 20px;" :row-key="getRowKey"  
                border  lazy :load="load"  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"  
                :row-class-name="tableRowClassName">

            <el-table-column prop="id" label="分类ID" align="center" width="150" />

            <el-table-column prop="name" label="分类名称" sortable />

            <el-table-column label="操作" width="250" align="center">
                <template slot="header" slot-scope="scope">
                    <el-input placeholder="按Enter键添加一级分类" />
                </template>

                <template slot-scope='{row,$index}'>
                    <HintButton title="添加子分类" :disabled="!row.level" size="mini" type="primary" icon="el-icon-plus" />
                    <HintButton title="修改分类" size="mini" type="primary" icon="el-icon-edit" />
                    <HintButton title="删除分类" size="mini" type="danger" icon="el-icon-delete" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'CategoryList',

    data() {
        return {
            categoryList1: [], //用于存储一级分类列表的数组
        };
    },

    mounted() {
        this.getCategoryList1()
    },

    methods: {
        // 获取一级分类列表显示
        async getCategoryList1() {
            const result = await this.$API.category.getCategory1()
            if (result.code === 200) {
                const categoryList1 = result.data
                // 添加属性
                categoryList1.forEach(item => {
                    item.hasChildren = true
                    item.level = 1
                })
                this.categoryList1 = categoryList1
            }
        },

        // 获取二级分类列表
        async getCategoryList2(row) {
            const result = await this.$API.category.getCategory2(row.id)
            if (result.code === 200) {
                let category2 = result.data
                if (category2 && category2.length > 0) {
                    category2.forEach(item => {
                        item.hasChildren = true
                        item.level = 2
                    })
                    return category2
                } else {
                    row.hasChildren = false
                    return []
                }
            }
        },

        // 获取三级分类列表
        async getCategoryList3(row) {
            const result = await this.$API.category.getCategory3(row.id)
            const category3 = result.data
            if (category3 && category3.length > 0) {
                return category3
            } else {
                row.hasChildren = false
                return []
            }
        },

            // 异步加载load函数下一级分类列表显示
        async load(row, treeNode, resolve) {
          if (row.level === 1) {
              const category2 = await this.getCategoryList2(row)
              resolve(category2)
          } else if (row.level === 2) {
              const category3 = await this.getCategoryList3(row)
              resolve(category3)
          }
      },

        // 动态确定当前行的唯一key
        getRowKey(row) {
            return row.level + '-' + row.id
        },

        // 给返回二级分类列表的添加类名  这样就可以在style标签中设置背景色
        //行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className
        tableRowClassName({ row, rowIndex }) {
            if (row.level === 2) {
                return 'level2-row'
            }else if (row.level !== 1 && row.level !== 2) {
                return 'level3'
            }
        },
    }
}
</script>
<style>
.el-table .level2-row {
    background: #f0f9eb;
}
.el-table .level3 {
    background: pink;
}
</style>