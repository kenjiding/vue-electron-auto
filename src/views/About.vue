<template>
  <div class="home">
    <h3 style="text-align: center;margin-bottom: 50px;">文件拷贝</h3>
    <div>是否保留原文件的目录结构：
      <el-radio v-model="originBin" :label="true">是</el-radio>
      <el-radio v-model="originBin" :label="false">否</el-radio>
    </div>
    <form id="formData">
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
            <h4 style="padding-left: 7px;">已选的文件:{{ sourceSize }} 个</h4>
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
                :key="item.path"
                >
                <span>{{ item.path }}</span>
                <el-progress style="width: 200px;display: inline-block;margin: 0 10px;" :text-inside="true" :stroke-width="26" :percentage="item.progress"></el-progress>
                <i class="el-icon-delete" @click="deleteItem(index)"></i>
              </p>
            </div>
          </div>

        </el-col>
      </el-row>
    </form>
    
    <el-button type="primary" @click="start">开始拷贝</el-button>
    <el-button type="primary" @click="reset">重置选中的文件</el-button>

    <div>
      <p
        v-for="(item, index) in copyErrorPathList"
        :key="index">
        文件： <span style="color: red;">{{ item.copuOverPath }} （拷贝失败）</span>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import copyFile from './copy.js';
import countSize from './count.js';
import child_process from 'child_process';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      originBin: true,
      source: [],
      targetPathList: [],
      copyErrorPathList: [],
      sourceSize: 0,
    }
  },
  methods: {
    reset() {
      document.getElementById('formData').reset();
      this.source = [];
      this.targetPathList = [];
      this.copyErrorPathList = [];
    },
    deleteItem(index) {
      this.targetPathList.splice(index, 1);
    },
    deleteSourceItem(index) {
      this.source.splice(index, 1);
    },
    targetChange() {
      let targetPath = document.getElementById('target').files[0];
      this.targetPathList.push({
        path: targetPath.path,
        progress: 0,
        nums: 0,
      });
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
      Array.from(sourceFile).forEach(item => {
        this.source.push({
          type: 'file',
          path: item.path,
          name: item.name,
        });
      });
      let list = new Set(this.source);
      this.source = [...list];
    },
    async start() {
      let sourceLen = this.source.length;

      this.targetPathList.forEach(item => {
        this.source.forEach(ele => {
          let command = `cp -r -f ${ele.path} ${item.path}`;
          // console.log('command: ', command);
          child_process.exec(command, {}, (e) => {
            console.log('e: ', e);
            if(!e) {
              ++item.nums;
              item.progress = (item.nums / sourceLen).toFixed(1) * 100;
              console.log('item.progress: ', item.progress);
            }
          })
        });
      })
    

      // let self = this;
      // if(this.targetPathList.length <= 0) {
      //   return this.$message.error('你还未选择资源文件夹');
      // }
      
      // if(this.targetPathList.length <= 0) {
      //   return this.$message.error('你还未选择目标文件夹');
      // }
      
      // this.sourceSize = countSize(this.source).staticFileCount;
      // let startTime = +new Date();

      // for(let i = 0; i < this.targetPathList.length; i++) {
      //   await self.copyFileHandler(this.targetPathList[i]);
      // }

      // console.log('用时：', +new Date() - startTime)

      // // this.targetPathList.forEach(async item => {
      // //     console.log(1111);
      // //     await self.copyFileHandler(item);
      // // });

      // function splicePath(path) {
      //   return path.split('/')[1];
      // }
    },
    copyFileHandler(item) {
      let self = this;
      return new Promise((resolve, reject) => {
        copyFile(
          this.source,
          item.path,
          0,
          (progress) => {
            item.progress = (progress / self.sourceSize).toFixed(1) * 100;
            if(progress === self.sourceSize) resolve();
          },
          reject,
        );
      });
    }
  },
}
</script>

<style lang='scss' scoped>
.home {
  width: 900px;
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
