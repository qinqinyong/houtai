<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from '@/views/dashboard/Card'
import Sale from '@/views/dashboard/Sale'
import Observe from '@/views/dashboard/Observe'
export default {
  name: 'DashBoard',

  data() {
    return {
    
    }
  },
  components: {
   Card,
   Sale,
   Observe
  },
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>


</style>
