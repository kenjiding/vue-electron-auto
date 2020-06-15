const { type } = require('os');

var fs = require( 'fs' ), stat = fs.stat;

let succeseCallBack = null;
let errorCallBack = null;

var copy = function( src, dst ){
  fs.readdir( src, function( err, paths ){
    if( err ){
      throw err;
    }
    paths.forEach(function( path ){
      var _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable, writable;

      stat( _src, function( err, st ){
        if( err ){
          throw err;
        }

        if( st.isFile() ){
          readable = fs.createReadStream( _src );
          writable = fs.createWriteStream( _dst ); 
          
          writable.on('close', function () {
            succeseCallBack && succeseCallBack({_src, _dst});
          });
          
          writable.on('error', function () {
            errorCallBack && errorCallBack({_src, _dst});
          });

          readable.pipe( writable );
        } else if( st.isDirectory() ){
          exists( _src, _dst );
        }
      });
    });
  });
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, succeseCb, errorCb){
  if(succeseCb || errorCb) {
    succeseCallBack = succeseCb;
    errorCallBack = errorCb
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

module.exports = exists;
