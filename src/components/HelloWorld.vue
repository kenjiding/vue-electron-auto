<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button class="alt" @click="usingNode">渲染进程运行node接口</button>
  </div>
</template>

<script>
const fs = require('fs')
const path = require('path')

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    usingNode () {
      const dirPath = path.resolve('./pages_config/')
      var noneExistFileName = path.join(dirPath, ['async_create.', new Date() - 0, '.txt'].join(''))

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }

      fs.writeFile(noneExistFileName, new Date(), function (err) {
        if (err) throw err
        alert(err + '创建了新的文件！')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
