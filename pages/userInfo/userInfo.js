//获取应用实例
const app = getApp()

Page({
  data: {
    userHead:"http://synctime-public.iyeeda.com/iface/background/1b994832-747b-42ad-87c1-818608f5a347.jpg",
    userName:""
  },
 
  onLoad: function () {
     
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (userInfo) {
              //请求登陆接口（参数：code,userKey）
              wx.request({
                url: app.globalData.serverUrl + "checkUserStatus",
                data: {
                  userKey: wx.getStorageSync('userKey')
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                success: function (res) {
                  //请求成功
                  if (res.statusCode == 200) {
                    if (res.data.code == 200) {
                      //将自定义登陆状态存入缓存
                      wx.setStorageSync('userKey', res.data.data);
                      //设置全局用户对象和当前页用户昵称和头像
                      app.globalData.userInfo = res.userInfo
                      self.setData({
                        userName: userInfo.userInfo.nickName,
                        userHead: userInfo.userInfo.avatarUrl
                      })
                    }
                  }  
                } 
              })
            }
          })
        }
      } 
    })
    wx.hideLoading()
  },
  
  //登陆
  loginServer:function(){
    var self = this;
    wx.login({
      success: function (e) {
        //登陆授权弹框
        wx.getUserInfo({
          //允许登陆
          success: function (userInfo) {
            wx.showLoading({
              title: '加载中',
            })
            //请求登陆接口（参数：code,userKey）
            wx.request({
              url: app.globalData.serverUrl + "thirdLogin",
              data: {
                code: e.code,
                userKey: wx.getStorageSync('userKey')
              },
              header: {
                'content-type': 'application/json',
              },
              success: function (res) {
                wx.hideLoading()
                //请求成功
                if (res.statusCode == 200 ){
                  if (res.data.code == 200 ){
                    //将自定义登陆状态存入缓存
                    wx.setStorageSync('userKey', res.data.data);
                    //设置全局用户对象和当前页用户昵称和头像
                    app.globalData.userInfo = res.userInfo
                    self.setData({
                      userName: userInfo.userInfo.nickName,
                      userHead: userInfo.userInfo.avatarUrl
                    })
                   }
                }else{
                  //返回码 != 200 
                }
              },
              //登陆失败
              fail(res) {
                wx.hideLoading()
                //拒绝登陆提示用户
                wx.showToast({
                  title: '登陆失败',
                  image: '/pages/images/nosuccess.png',
                  duration: 2000
                })
              }
            })
          },
          //拒绝登陆
          fail(res) {
            //拒绝登陆什么都不做
            wx.hideLoading()
          }
        })

      }
    })
  }
  ,
  //转发
  onShareAppMessage: function (e) {
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      return {
        title: 'HappyTools',
        path: '/pages/index/index',
        imageUrl: '/pages/images/share.png' //不设置则默认为当前页面的截图
      }
    }
  }
})