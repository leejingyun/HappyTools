//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   ocrMessage:"",//识别的反馈信息
   ocrText:"",//识别结果数组
   ocrCopyText:"", //复制文字
   ocrCopyBtn:false //复制按钮是否显示（true 显示 / false 不显示）
  },
  onLoad: function () {},
 
  clickChooseImage: function (e) {
    var self = this;
    // 传递的参数
    let query = e.currentTarget.dataset['index'];
    //选择图片api
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [query],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        // console.log(res)
        // if (res.tempFiles[0].size > 2097152){
        //   wx.showToast({
        //     title: '图片太大',
        //     icon: 'success',
        //     duration: 2000
        //   })
        // }
 
        //请求后台ocr接口
        wx.showLoading({
          title: '解析中'
        })
        wx.uploadFile({
          url: app.globalData.serverUrl + 'ocr_weixin_upload',
          filePath: tempFilePaths[0].path,
          method: 'POST',
          name: 'file',
          success(res) {
            //请求成功隐藏loading
            wx.hideLoading()
            const data = res.data
            //如果返回码 == 200 
            if (res.statusCode == 200){
              //获取 res.data 中的返回数据，转化成json对象
              const jsondata = JSON.parse(data);
              //如果返回码 == 200 
              if (jsondata.code == 200 ){
                //设置解析信息和是否显示复制按钮
                self.setData({
                  ocrMessage: jsondata.message,
                  ocrCopyBtn: true  //true  显示
                })
                //将返回的data转化成json对象
                const orcjson = JSON.parse(jsondata.data);
                //设置解析的数据 --展示数组
                self.setData({
                  ocrText: orcjson.items
                })
                //定义一个用来复制的字符串
                let extraLine = [];
                //循环把解析的文字拼接到 ocrCopyText 字符串中
                for (let i = 0; i < orcjson.items.length; ++i) {
                  extraLine.push(orcjson.items[i].text)
                }
                //设置复制的字符串
                self.setData({
                  //把解析的字符串数组换行
                  ocrCopyText: extraLine.join('\n')
                })
                
              }else{
                wx.hideLoading()
                //设置解析信息
                self.setData({
                  ocrMessage: jsondata.message
                })
              }

            }else{
              wx.hideLoading()
              //设置解析信息
              self.setData({
                ocrMessage: "服务异常"
              })
            }
          }
        })
      },
      fail(res) {
        //取消选择照片时隐藏解析信息和复制按钮
        self.setData({
          ocrMessage: "",
          ocrCopyBtn: false,  //false 隐藏
          ocrText:[]
        })
      }
    })
  },
  //点击复制事件
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
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
