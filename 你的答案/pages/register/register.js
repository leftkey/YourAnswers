// pages/register/register.js
Page({
  data: {
    name: "",
    school: "请选择校区",
    lesson: "请选择学科",
    grade: "请选择班级",
    schools: [],
    schools_id: [],
    school_index: 0,
    lessons: [],
    lessons_id: [],
    lesson_index: 0,
    grades: [],
    grades_id: [],
    grade_index: 0,
    is_lessons: true,
    is_grades: true,
    font_lessons: "pickfont",
    font_grades: "pickfont",
    isBtn: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    this.setData(options)
    var that = this;
    getDetails(0, that, 0);
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
  },
  bindPickerChange: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      lesson: "请选择学科",
      grade: "请选择班级",
      school_index: e.detail.value,
      school: that.data.schools[e.detail.value],
      is_lessons: false,
      font_lessons: '',
      lessons: [],
      lessons_id: [],
      lesson_index: 0,
      grades: [],
      grades_id: [],
      grade_index: 0,
      is_grades: true,
      font_grades: "pickfont",
      isBtn: true
    })
    getDetails(that.data.schools_id[e.detail.value], that, 1);
  },
  bindPickerChangeLesson: function (e) {
    var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      grade: "请选择班级",
      lesson_index: e.detail.value,
      lesson: that.data.lessons[e.detail.value],
      is_grades: false,
      font_grades: '',
      grades: [],
      grades_id: [],
      grade_index: 0,
      isBtn: true
    })
    getDetails(that.data.lessons_id[e.detail.value], that, 2);
  },
  bindPickerChangeGrade: function (e) {
    var that = this;
    // console.log(that.data.name)
    // console.log('picker发送选择改变，携带值为' + that.data.grades[e.detail.value])
    if (that.data.grades[e.detail.value] != undefined) {
      console.log(that.data.name)
      this.setData({
        grade_index: e.detail.value,
        grade: that.data.grades[e.detail.value]
      })
      if (that.data.name != "") {
        this.setData({
          isBtn: false
        })
      } else {
        this.setData({
          isBtn: true
        })
      }
    } else {
      this.setData({
        grade_index: e.detail.value,
        grade: "请选择班级",
        isBtn: true
      })
    }

  },
  getName: function (e) {
    // console.log(e)
    if (e.detail.value != "" && this.data.grade != "请选择班级") {
      this.setData({
        name: e.detail.value,
        isBtn: false
      })
    } else {
      this.setData({
        name: e.detail.value,
        isBtn: true
      })
    }

  },
  sub: function () {
    var that = this.data;
    console.log(that.name + that.grades_id[that.grade_index] + that.wx_id)
    //注册
    wx.request({
      url: 'https://www.hounanxun.com/ans/index.php/Home/Register',
      data: {
        name: that.name,
        grade: that.grades_id[that.grade_index],
        wx: that.wx_id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
      success: function (res) {
        console.log(res)
        // success
        if (res.data.code == 1) {
          //注册成功
          console.log("跳转")
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            mask: true,
            success: function () {
              setTimeout(function () {
                console.log("弹出")
                wx.redirectTo({
                  url: '/pages/index/index?user_id=' + res.data.data
                })
              }, 1500)

            }
          })
        } else {
          //失败
          wx.showModal({
            title: '提示',
            content: res.data.data,
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
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})

//定义获取数组
/**
 * 参数一 uid 父级id
 * 参数二 that 绑定的数据
 * 参数三 n 对应的数组
 */
function getDetails(uid, that, n) {

  wx.request({
    url: 'https://www.hounanxun.com/admin/action.php',
    data: { uid: uid },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
      var newArr = [];
      var uids = [];
      console.log(res.data.data)
      for (var i = 0; i < res.data.data.length; i++) {
        newArr.push(res.data.data[i].info)
        uids.push(res.data.data[i].id)
      }
      console.log(uids)

      switch (n) {
        case 0://修改校区数组
          that.setData({
            schools: newArr,
            schools_id: uids
          });
          break;
        case 1://修改学科数组
          that.setData({
            lessons: newArr,
            lessons_id: uids
          });
          break;
        case 2:
          that.setData({
            grades: newArr,
            grades_id: uids
          });
          break;
      }

    },
    fail: function (res) {
      // fail
    },
    complete: function (res) {
      // complete
    }
  })
}