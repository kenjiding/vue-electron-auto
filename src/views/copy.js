process.env.UV_THREADPOOL_SIZE = 64
import fs from 'fs';
import os from 'os';
import zlib from 'zlib';

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( srcList, dst, chunksTotal, progressHandler, errorCb){
  var fileCopy = function (_src, _dst) {
    let readable, writable, zlibIns = zlib.createGzip();
    
    readable = fs.createReadStream( _src );
    writable = fs.createWriteStream( _dst );
    
    writable.on('close', function () {
      chunksTotal++;
      progressHandler(chunksTotal);
    });
    
    writable.on('error', function (err) {
      errorCb && errorCb({_src, _dst});
    });

    // readable.on('data',function(chunk) {
    //   writable.write(chunk); // Node中的Buffer不占用垃圾回收机制中的内存。  Buffer是由C/C++模块维护。  'data'+chunk会在内部自动调用toString()函数。 建议直接返回buffer节省处理字符串的性能开销。
    // });

    readable.on('end',function() {
      // 调用writable.end 触发writable.on('close')事件
      writable.end();
    })

    readable.pipe(zlibIns).pipe( writable );
  }

  var copyInit = function(){
    srcList.forEach(item => {
      copyHandler(item.path);
    });
  };

  function copyHandler (src) {
    fs.stat( src, function( err, st ){
      if( err ){
        throw err;
      }

      if( st.isFile() ) {
        let ext = [];
        if (os.type() == 'Windows_NT') {
          ext = src.split('\\').pop();

        } else if (os.type() == 'Darwin') {
          ext = src.split('/').pop();
        }

        fileCopy (src, dst + '/' + ext);
      } else {
        fs.readdir( src, function( err, paths ){
          if( err ){
            throw err;
          }
          paths.forEach(function( path ){
            var _src = src + '/' + path,
              _dst = dst + '/' + path;
      
              fs.stat( _src, function( err, st ){
              if( err ){
                throw err;
              }
      
              if( st.isFile() ){
                fileCopy(_src, _dst);
              } else if( st.isDirectory() ){
                exists( _src, _dst, chunksTotal, progressHandler, errorCb);
              }
            });
          });
        });
      }
    })
  }
  
  fs.exists( dst, function( exists ){
    if( exists ) copyInit();
    else fs.mkdir( dst, function(){
      copyInit();
    });
  });
};

export default exists;
