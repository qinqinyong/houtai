<template>
    <el-form :inline="true" :model="cForm" class="demo-form-inline" :disabled="!isShowList">
        <el-form-item label="一级分类">
            <!-- select选择器 @change事件 回调参数：目前的选中值 选中值发生变化时触发category1Id-->
            <el-select v-model="cForm.category1Id" placeholder="请选择" @change="changeCategory1">
                <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in category1List" :key='c1.id'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
            <el-select v-model="cForm.category2Id" placeholder="请选择" @change="changeCategory2">
                <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in category2List" :key='c2.id'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
            <el-select v-model="cForm.category3Id" placeholder="请选择" @change="changeCategory3">
                <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in category3List" :key='c3.id'></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'CategorySelect',
    props:['isShowList'],
    data() {
        return {
            cForm: {
                category1Id: '',
                category2Id: '',
                category3Id: '',
            },
            category1List: [],
            category2List: [],
            category3List: [],
        }
    },
    mounted() {
        this.getCategory1List()

    },
    methods: {
        // 获取一级列表
        async getCategory1List() {
            const result = await this.$API.category.getCategory1()
            if (result.code === 200) {
                this.category1List = result.data
            }
        },

        // 根据选择一级列表id获取二级列表信息
        async changeCategory1(category1Id) {
             // 一级重新获取信息前先清空二级和三级信息
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''
            this.category2List = []
            this.category3List = []
           
            const result = await this.$API.category.getCategory2(category1Id)
            if (result.code === 200) {
                this.category2List = result.data
            }
            // 自定义事件
             this.$emit('getcartgoryId',{categoryId:category1Id,level:1})
        },

        // 根据二级列表获取三级列表信息
        async changeCategory2(category2Id) {
            // 重新获取信息前先清空三级信息
            this.cForm.category3Id = ''
            this.category3List = []

            const result = await this.$API.category.getCategory3(category2Id)
            if (result.code === 200) {
                this.category3List = result.data
            }
             this.$emit('getcartgoryId',{categoryId:category2Id,level:2})
        },

        // 获取三级分类id
        changeCategory3(category3Id){
            // 自定义事件  子向父传递数据 把id传递过去
            this.$emit('getcartgoryId',{categoryId:category3Id,level:3})
        }


    }
}
</script>

<style lang="less" scoped>
</style>