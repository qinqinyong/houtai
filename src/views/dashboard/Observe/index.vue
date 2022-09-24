<template>
    <el-row :gutter="10">
        <el-col :span="12">
            <Search></Search>
        </el-col>
        <el-col :span="12">
            <Category></Category>
        </el-col>
    </el-row>




</template>

<script>
import Search from '@/views/dashboard/Observe/Search'
import Category from '@/views/dashboard/Observe/Category'
export default {
    name: '',
    data() {
        return {

        }
    },
    components: {
        Search,
        Category
    }
}
</script>

<style lang="scss" scoped>
</style>