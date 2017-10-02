// pages/intro/intro.js

//引入data模块
//var dataObj = require("../../data/data.js");
//引入DBPost模块
//var DBPost = require('../../database/DBPost.js').DBPost;
//使用ES6版本的DBPost
import { DBPost } from '../../database/DBPost.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var dbPost = new DBPost();
        this.setData({
            postList: dbPost.getAllPostData()
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onReady:页面被渲染");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("onShow:页面被显示");
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onHide:页面被隐藏");
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log("onUnload:页面被卸载");
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

    },
    /**
     * 跳转到文章detail页面
     */
    onTapToDetail: function (event) {
        var postId = event.currentTarget.dataset.postId;
        wx.navigateTo({
            url: 'post-detail/post-detail?id='+postId,
        })
    }
})