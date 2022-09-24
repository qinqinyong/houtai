<template>
   <div>
    <el-row :gutter="10">
        <div class="head">
            <span>{{title}}</span>
            <span><svg t="1660190049946" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2408" width="16" height="16"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" p-id="2409" fill="#8a8a8a"></path><path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="2410" fill="#8a8a8a"></path><path d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" p-id="2411" fill="#8a8a8a"></path></svg></span>
        </div>
        <div class="content">
            <span>{{number}}</span>
        </div>
        <div class="chart">
            <slot name="chart">
            </slot>
        </div>
        <div class="footer">
            <slot name="footer">
            </slot>
        </div>
    </el-row>
    
   </div>
</template>

<script>
export default {
  name: 'Detail',
  data(){
    return {
     
    }
  },
  props:['title','number']
}
</script>

<style lang="scss" scoped>
.head{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
    
}
.content{
    font-size: 30px;
    padding: 10px 0;
}
.chart{
    height: 50px;
}
.footer{
    border-top: 1px solid #d9d9d9;
    padding-top: 10px ;
}
</style>