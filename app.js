import { getAuthorizeInfo } from "./utils/auth";

App({
  globalData: {
    userInfo: null
  },
  onLaunch() {
    //获取用户信息
    getAuthorizeInfo(["userInfo"]).then(({ userInfo })=>{
      if(userInfo.errMsg.indexOf("ok") != -1) {
        this.globalData.userInfo = userInfo.userInfo;
      }
    })
  }
})