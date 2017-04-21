//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    tapTime: -3000     //扫码按钮的时间戳
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData(options)
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  // 扫码
  scan: function (event) {
    var that = this.data;

    if (event.timeStamp - that.tapTime > 3000) {//两次点击间隔3秒
      //扫码
      wx.scanCode({
        success: (res) => {
          console.log(res)
          if (res.errMsg == "scanCode:ok" && res.scanType == "QR_CODE") {
            //成功扫到二维码

            // console.log(getUrlParam(res.result, "testId"))
            var testId = getUrlParam(res.result, "testId");
            //获取考卷ID并发送后台,获取考卷考卷信息
            /**
             * 考卷code 1 成功返回 单选  多选  简答题 数量  出题人 时间 
             * 考卷code 2 失败 考卷已失效
             * .....
             */


          } else {
            wx.showModal({
              title: '提示',
              content: '获取二维码失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }

        },
        fail: (res) => {
          //调用扫码设备失败
          console.log(res)
          wx.showModal({
            title: '提示',
            content: '扫码失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
      console.log(event)
    }
    this.setData({
      tapTime: event.timeStamp
    })
  },
  //跳转我的信息
  info: function (event) {
    wx.navigateTo({
      url: '/pages/info/info?user_id='+this.data.user_id
    })
  },
  list:function (event){
    wx.navigateTo({
      url: '/pages/list/list?user_id='+this.data.user_id
    })
  }
})
function getUrlParam(url, paras) {
  var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  var paraObj = {};
  var i;
  var j;
  for (i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
  }
  var returnValue = paraObj[paras.toLowerCase()];
  if (typeof (returnValue) == "undefined") {
    return "";
  } else {
    return returnValue;
  }
}
