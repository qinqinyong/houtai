<template>
   <a href="javascript:;" :title="title">
        <el-button v-bind='$attrs'  v-on="$listeners"></el-button>
   </a>

<!-- l-tooltip 在删除时有bug -->
   <!-- <el-tooltip :content="title" placement="top" >
         <el-button v-bind='$attrs'  v-on="$listeners"></el-button>
   </el-tooltip>
    -->
</template>

<script>
export default {
  name: '',
  props:['title'],
  data(){
    return {
     
    } 
  }
}
</script>

<style lang="scss" scoped>
 a{
  margin: 0 5px;
 }
</style>