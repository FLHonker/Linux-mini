//app.js

App({
    onLaunch: function () {
        // 展示本地存储能力，设置小程序缓存
        var storageData = wx.getStorageSync('postList');
        if (!storageData) {
            //如果postList缓存不存在
            var dataObj = require("data/data.js");
            wx.clearStorageSync();
            wx.setStorageSync('postList', dataObj.postList);
        }
    },

    /**
     * 获取用户基本信息 
     */
    _getUserInfo: function () {
        var userInfoStorage = wx.getStorageSync('user');
        if (!userInfoStorage) {
            //如果缓存中没有用户信息，那么获取用户信息
            var that = this;
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.g_userInfo = res.userInfo;
                            //将用户信息存入缓存中
                            wx.setStorageSync('user', res.userInfo);
                        }
                    })
                },
                fail:function(res){
                    console.log(res);
                }
            })
        }
        else{
            //如果缓存中已经存在用户的基本信息，阿么将信息保存到全局中
            this.globalData.g_userInfo = userInfoStorage;
        }
    },

  globalData: {
        userInfo: null,
        g_isPlayingMusic: false,
        g_currentMusicPoatId: null,
        doubanBase: "https://api.douban.com",
        g_userInfo: null
    }
})