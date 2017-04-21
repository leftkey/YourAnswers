//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: function (res) {
        //获取用户code
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.hounanxun.com/ans/index.php/Home/Login',
            data: {
              code: res.code
            },
            success: function (data) {
              console.log("获取到code")
              /**code 0 "非微信小程序接口!"
                *code 1 有user_id,老用户,直接显示页面
                *code 2 无user_id,打开过,但为注册,跳转添加个人信息添加
              */
              console.log(data.data)
              if (data.data.code == 2 && data.data.data.user_id == "") {
                wx.redirectTo({//跳转注册页
                  url: '/pages/register/register?wx_id='+data.data.data.wx_id
                })
              }else{
                wx.redirectTo({//跳转index页
                  url: '/pages/index/index?user_id='+data.data.data.user_id
                })
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    wx.checkSession({ //检测seesion
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log("没有过期")
      },
      fail: function () {
        console.log("过期")
        //登录态过期
        wx.login({  //重新登录
          success: function (res) {
            //获取用户code
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://www.hounanxun.com/ans/index.php/Home/Login',
                data: {
                  code: res.code
                },
                success: function (data) {
                  console.log("获取到code")
                  console.log(data)
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    })


  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})