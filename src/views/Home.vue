<template>
  <div class="home">
    <h3 style="text-align: center;margin-bottom: 50px;">文件拷贝</h3>
    <el-row>
      <el-col :span="10">
        <p style="margin-top: 0;">
          <strong>资源文件夹：</strong>
          <input type="file" webkitdirectory id="source-folder" @change="folderChange" name="请选择资源文件夹" />
        </p>
        <p>
          <strong>资源文件：</strong>
          <input type="file" multiple id="source-file" @change="fileChange" name="请选择资源文件夹" />
        </p>

        <div style="text-align: left;">
          <h4 style="width: 110px;padding-left: 7px;">已选的文件:</h4>
          <div class="dyolege">
            <p
              v-for="(item, index) in source"
              :key="item.path"
              >
              <span :class="{'fileType': true, 'folder': item.type === 'folder'}">
                {{ item.type === 'file' ? '文件' : '文件夹'}}
              </span>
              <span>{{ item.path }}</span>
              <i class="el-icon-delete" @click="deleteSourceItem(index)"></i>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <strong>目标文件夹（可多选）：</strong>
        <input type="file" webkitdirectory id="target" name="请选择目的文件夹" @change="targetChange"/>
        <div style="text-align: left; padding-left: 33px;">
          <h4 style="width: 110px;">已选的文件夹:</h4>
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
import copyFile from './copy.js';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      source: [],
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
    deleteSourceItem(index) {
      this.source.splice(index, 1);
    },
    targetChange() {
      let targetPathList = document.getElementById('target').files[0];
      this.targetPathList.push(targetPathList.path);
      let list = new Set(this.targetPathList);
      this.targetPathList = [...list];
    },
    folderChange() {
      let sourceFolder = document.getElementById('source-folder').files[0];
      if(!sourceFolder) return;
      this.source.push({
        type: 'folder',
        path: sourceFolder.path,
      });
      let list = new Set(this.source);
      this.source = [...list];
    },
    fileChange() {
      let sourceFile = document.getElementById('source-file').files;
      if(!sourceFile) return;
      sourceFile.forEach(item => {
        this.source.push({
          type: 'file',
          path: item.path,
          name: item.name,
        });
      });
      let list = new Set(this.source);
      this.source = [...list];
    },
    start() {
      let self = this;

      if(this.targetPathList.length <= 0) {
        return this.$message.error('你还未选择资源文件夹');
      }
      
      if(this.targetPathList.length <= 0) {
        return this.$message.error('你还未选择目标文件夹');
      }

      this.source.forEach(ele => {
        this.targetPathList.forEach(item => {
          copyFile(
            ele.path,
            item,
            function ({_src, _dst}) {
              self.copyOverPathList.push({sourcePath: splicePath(_src), copuOverPath: splicePath(_dst)});
            },
            function ({_src, _dst}) {
              self.copyErrorPathList.push({sourcePath: splicePath(_src), copuOverPath: splicePath(_dst)});
            },
          );
        });
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

.fileType {
  display: inline-block;
  border: 1px solid #fff;
  padding: 2px 5px;
  margin-right: 5px;
  background-color: #71d3e2;
  color: #000;
  border-radius: 5px;
}

.folder {
  background-color: #e2e216;
}

.dyolege {
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

</style>
