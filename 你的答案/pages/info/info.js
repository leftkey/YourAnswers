// pages/info/info.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options)
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        console.log(userInfo)
        that.setData({ userInfo: userInfo })
      }
    })
    that.setData(options)
    wx.request({
      url: 'https://www.hounanxun.com/ans/index.php/Home/Info',
      data: {user_id:that.data.user_id},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res)
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})