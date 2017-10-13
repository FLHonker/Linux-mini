Page({
 /**
  * 跳转到post页面
  */
  /*
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
    },
    */

    /**
     * 切换Tab
     */
    onTapJump:function(event) {
        wx.switchTab({
            url: '../post/post',
            success:function(){
                console.log("Jump success");
            },
            fail:function(){
                console.log("Jump failed");
            },
            complete:function(){
                console.log("Jump complete");
            }
        });
    }
})