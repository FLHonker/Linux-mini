Page({
 /**
  * 跳转到post页面
  */
    toPost: function (event) {
        wx.redirectTo({
            url: '../post/post',
            success: function () {
                console.log("jump success")
            },
            fail: function () {
                console.log("jump fail")
            },
            complete: function () {
                console.log("jump complete")
            }
        });
    }
})