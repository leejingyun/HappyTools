//获取应用实例
const app = getApp()

Page({
  data: {
    userHead:"http://synctime-public.iyeeda.com/iface/background/1b994832-747b-42ad-87c1-818608f5a347.jpg",
    userName:""
  },
 
  onLoad: function () {
    var self = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              //设置全局用户对象和当前页用户昵称和头像
              app.globalData.userInfo = res.userInfo
              self.setData({
                userName : res.userInfo.nickName,
                userHead : res.userInfo.avatarUrl
              })
            },
            fail(res) {
              //console.log(res)
            }
          })
        }
      }, 
      fail(res){
        //console.log(res)
      }
    })
 
  },
  //按钮回调的方法
  bindGetUserInfo: function (e) {
    console.log(e)
    var self = this;
    //点击允许
    if (e.detail.errMsg == "getUserInfo:ok"){
      //设置全局用户对象和当前页用户昵称和头像
      app.globalData.userInfo = e.detail.userInfo
      self.setData({
        userName: e.detail.userInfo.nickName,
        userHead: e.detail.userInfo.avatarUrl
      })
    }
  }
})