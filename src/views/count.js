
var fs = require('fs')
 
 
//遍历文件夹，获取所有文件夹里面的文件信息 
/* 
* @param path 路径 
* 
*/
function geFileList(path) {
    let filesList = [];
    let countSize = 0;
    let countFiles = 0;
    
    let fileSt = fs.statSync( path);
    if( fileSt.isFile() ) {
      countFiles++;
      countSize += fileSt.size;
    } else if( fileSt.isDirectory() ){
      readFile(path, filesList);
    }

    //遍历读取文件 
    function readFile(path, filesList) {
      let files = fs.readdirSync(path);//需要用到同步读取 
      files.forEach(walk);
      function walk(file) {
          let states = fs.statSync(path + '/' + file);
          if (states.isDirectory()) {
            readFile(path + '/' + file, filesList);
          } else {
            countFiles++;
            countSize += states.size;
            //创建一个对象保存信息 
            // var obj = new Object();
            // obj.size = states.size;//文件大小，以字节为单位 
            // obj.name = file;//文件名 
            // obj.path = path + '/' + file; //文件绝对路径 
            // filesList.push(obj);
          }
      }
    }

    return { filesList, countSize, countFiles };
}

function loopReadFile(pathList) {
  let staticCount = 0;
  let staticFileCount = 0;
  
  pathList.forEach(ele => {
    let countObj = geFileList(ele.path);
    staticCount += countObj.countSize;
    staticFileCount += countObj.countFiles;
  });

  return { staticCount, staticFileCount };
}

export default loopReadFile;