import fs from 'fs';
import os from 'os';

var stat = fs.stat;

let succeseCallBack = null;
let errorCallBack = null;

var fileCopy = function (_src, _dst) {
  let readable, writable;
  
  readable = fs.createReadStream( _src );
  writable = fs.createWriteStream( _dst ); 
  
  writable.on('close', function () {
    succeseCallBack && succeseCallBack({_src, _dst});
  });
  
  writable.on('error', function (err) {
    errorCallBack && errorCallBack({_src, _dst});
  });

  readable.pipe( writable );
}

var copy = function( src, dst ){
  stat( src, function( err, st ){
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
    
          stat( _src, function( err, st ){
            if( err ){
              throw err;
            }
    
            if( st.isFile() ){
              fileCopy(_src, _dst);
            } else if( st.isDirectory() ){
              exists( _src, _dst );
            }
          });
        });
      });
    }
  })
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, succeseCb, errorCb){
  if(succeseCb || errorCb) {
    succeseCallBack = succeseCb;
    errorCallBack = errorCb;
  }
  
  fs.exists( dst, function( exists ){
    if( exists ){
      copy( src, dst);
    }
    else{
      fs.mkdir( dst, function(){
        copy( src, dst);
      });
    }
  });
};

export default exists;
