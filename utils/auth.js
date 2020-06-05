export function getToken() {

}

export function serToken() {

}

export const getAuthorizeInfo = function() {
  //获取授权过的信息
  function createAuthorizeHandler(target, key, promiseStateFunction) {
    return {
      success(res) {
        target[key] = res;
        promiseStateFunction();
      },
      fail(err) {
        target[key] = err;
        promiseStateFunction();
      }
    }
  }
  return function(authorizes = []) {
    return new Promise((resolve, reject)=>{
      if(authorizes.length > 0) {
        wx.getSetting({
          success(res){
            const data = {};
            const authorizePromises = [];
            if(res.errMsg.indexOf("ok") != -1) {
              authorizes.map(key=>"scope." + key).forEach((scopeKey, index)=>{
                let fn = null;
                switch(scopeKey) {
                  case "scope.userInfo":
                    fn = new Promise(res=>{
                      wx.getUserInfo(createAuthorizeHandler(data, authorizes[index], res));
                    })
                  break; 
                  default:
                    fn = new Promise(res=>{
                      wx.authorize(Object.assign(createAuthorizeHandler(data, authorizes[index], res), { scope: scopeKey }));
                    })
                  break;  
                }
                authorizePromises[index] =fn;
              })
            }
            Promise.all(authorizePromises).then(()=>resolve(data));
          },
          fail(err) {
            reject(err);
          }
        })
      }else {
        resolve({});
      }
    })
  }
}();