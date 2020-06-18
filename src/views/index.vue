<template>
  <div class=''>
    <div style="margin: 10px 0 30px 0;">模式：
      <el-radio-group v-model="mode" @change="modeChange">
        <el-radio label="1" border>文件合并模式</el-radio>
        <el-radio label="2" border>文件夹模式</el-radio>
      </el-radio-group>
    </div>

    <component :is="componentName"/>
  </div>
</template>

<script>
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import allFileCopy from '../views/allFileCopy.vue'

export default {
  name: 'app',
  data(){
    return {
      mode: '2',
      componentName: 'About',
    }
  },
  components: {
    Home,
    About,
    allFileCopy,
  },
  methods: {
    modeChange(mode) {
      if(mode === '1') this.componentName = 'allFileCopy';
      else this.componentName = 'About';
    },
  },
  mounted() {
    console.log('index.vue');
  },
}
</script>

<style lang='scss' scoped>

</style>