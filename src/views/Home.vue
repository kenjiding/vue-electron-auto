<template>
  <div class="home">
    <h3 style="text-align: center;margin-bottom: 50px;">文件拷贝</h3>
    <el-row>
      <el-col :span="10">
        <strong>资源文件夹：</strong>
        <input type="file" webkitdirectory id="source" name="请选择资源文件夹" />
      </el-col>
      <el-col :span="14">
        <strong>目标文件夹（可多选）：</strong>
        <input type="file" webkitdirectory id="target" name="请选择目的文件夹"  @change="targetChange"/>
        <div style="text-align: left; padding-left: 25px;">
          
        <div class="aleardySelect">
          <h4 style="width: 110px;padding-left: 7px;">已选的文件夹:</h4>
          <div class="dyolege">
            <p
              v-for="(item, index) in targetPathList"
              :key="item"
              >
              <span>{{ item }}</span>
              <i class="el-icon-delete" @click="deleteItem(index)"></i>
            </p>
          </div>
        </div>
        </div>

      </el-col>
    </el-row>
    
    <el-button type="primary" @click="start">开始拷贝</el-button>

    <div>
      <p
        v-for="(item, index) in copyOverPathList"
        :key="index">
        文件： <span style="color: green;">{{ item.copuOverPath }} （拷贝成功）</span>
      </p>

      <p
        v-for="(item, index) in copyErrorPathList"
        :key="index">
        文件： <span style="color: red;">{{ item.copuOverPath }} （拷贝出错）</span>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
const copyFile = require('./copy.js');

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      source: '',
      targetPathList: [],
      copyOverPathList: [],
      copyErrorPathList: [],
    }
  },
  mounted() {
  },
  methods: {
    deleteItem(index) {
      this.targetPathList.splice(index, 1);
    },
    targetChange() {
      let targetPathList = document.getElementById('target').files[0];
      this.targetPathList.push(targetPathList.path);
      let list = new Set(this.targetPathList);
      this.targetPathList = [...list];
    },
    start() {
      let self = this;
      let source = document.getElementById('source').files[0];

      if(!source) {
        return this.$message.error('你还未选择资源文件夹');
      }
      
      if(this.targetPathList.length <= 0) {
        return this.$message.error('你还未选择目标文件夹');
      }

      this.targetPathList.forEach(item => {
        copyFile(
          source.path,
          item,
          function ({_src, _dst}) {
            self.copyOverPathList.push({sourcePath: splicePath(_src), copuOverPath: splicePath(_dst)});
          },
          function ({_src, _dst}) {
            self.copyErrorPathList.push({sourcePath: splicePath(_src), copuOverPath: splicePath(_dst)});
          },
        );
      });

      function splicePath(path) {
        return path.split('/')[1];
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.home {
  width: 850px;
  margin: 0 auto;
}

.aleardySelect {
  display: flex;

  .dyolege {
    flex: 1;
    padding: 0 20px;
    max-height: 400px;
    overflow: auto;
    margin-top: 25px;

    /deep/ .el-icon-delete {
      margin-left: 10px;
      cursor: pointer;
      font-size: 18px;
      color: red;
    }

    p {
      margin-top: 0;
      color: #0d4ad8;

      &:hover {
        color: green;
      }
    }
  }
}

</style>
