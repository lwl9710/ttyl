const app = getApp();

Component({
  data: {
    userInfo: null
  },
  lifetimes: {
    attached() {
      console.log("页面加载完成");
    }
  },
  pageLifetimes: {
    show() {
      //更新用户信息
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },
  methods: {
    clickGetUserInfo(event) {
      const res = event.detail;
      if(res.errMsg.indexOf("ok") != -1) {
        this.setData({
          userInfo: res.userInfo
        })
        app.globalData.userInfo = res.userInfo;
      }else{
        wx.showToast({
          title: "您拒绝了授权",
          icon: "none"
        })
      }
    }
  }
});