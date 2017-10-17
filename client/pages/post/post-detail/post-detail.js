// pages/post/post-detail/post-detail.js

//获取小程序APP对象
var app = getApp();

//使用ES6版本的DBPost
import { DBPost } from '../../../database/DBPost.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //音乐播放控制变量
        isPlayingMusic: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var postId = options.id;
        this.dbPost = new DBPost(postId);
        this.postData = this.dbPost.getPostItemById().data;
        this.setData({
            post: this.postData
        })
        //只要是打开了此页面，阅读数就+1
        this.addReadingTimes();
        this.setMusicMonitor();
        this.initMusicStatus();
        //console.log(this.postData);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.postData.title + ' 详情',
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        //页面被卸载时主动停止音乐播放
        wx.stopBackgroundAudio();
        this.setData({
            isPlayingMusic: false
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.postData.title,
            desc: this.postData.content,
            path: "/pages//post/post-detail/post-detail"
        }
    },

    /**
     * 点击收藏
     */
    onCollectionTap: function() {
        //dbPost对象已经在onLoad函数里被保存到了this变量中，无需再次实例化
        var newData = this.dbPost.collect();
        //交互反馈
        wx.showToast({
            title: newData.collectionStatus?'收藏成功':'取消收藏',
            duration: 1000,
            icon: "success",
            mask: true
        })
        //重新绑定数据。注意，不要将整个newData全部作为setData的参数
        //应当有选择地更新部分数据
        this.setData({
            'post.collectionStatus':newData.collectionStatus,
            'post.collectionNum': newData.collectionNum
        })
    },

    /**
     * 点击点赞
     */
    onUpTap:function() {
        //dbPost对象已经在onLoad函数里被保存到了this变量中，无需再次实例化
        var newData = this.dbPost.up();

        //交互反馈 略

        //重新绑定数据。注意，不要将整个newData全部作为setData的参数
        //应当有选择地更新部分数据
        this.setData({
            'post.upStatus': newData.upStatus,
            'post.upNum': newData.upNum
        })
    },

    /**
     * 点击评论
     */
    onCommentTap: function(event) {
        var id = event.currentTarget.dataset.postId;
        wx.navigateTo({
            url: '../post-comment/post-comment?id='+id,
        })
    },

    //阅读量+1
    addReadingTimes: function() {
        this.dbPost.addReadingTimes();
    },

    /**
     * 切换音乐播放图标
     */
    onMusicTap:function(event) {
        if(this.data.isPlayingMusic){
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic:false
            });
            app.globalData.g_isPlayingMusic = false;
        }
        else{
            wx.playBackgroundAudio({
                dataUrl: this.postData.music.url,
                title: this.postData.music.title,
                coverImgUrl: this.postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = this.postData.postId;
        }
    },

    // 设置音乐播放监听
    setMusicMonitor:function() {
        var that = this;
        wx.onBackgroundAudioStop(function(){
            //只处理当前页面的音乐停止
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
        });

        wx.onBackgroundAudioPlay(function(){
            //只处理当前页面的音乐播放
            if(app.globalData.g_currentMusicPostId == that.postData.postId){
                that.setData({
                    isPlayingMusic: true
                })
            }
            app.globalData.g_isPlayingMusic = true;
        });

        wx.onBackgroundAudioPause(function () {
            //只处理当前页面的音乐暂停
            if (app.globalData.g_currentMusicPostId == that.postData.postId) {
                that.setData({
                    isPlayingMusic: false
                })
            }
            app.globalData.g_isPlayingMusic = false;
        });
    },

    //初始化音乐播放图标状态
    initMusicStatus:function() {
        this.setData({
            isPlayingMusic: app.globalData.g_isPlayingMusic
        });
    }
})