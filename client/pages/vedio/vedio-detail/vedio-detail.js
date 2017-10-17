// pages/vedio/vedio-detail/vedio-detail.j
var util = require('../../../utils/util.js');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        vedio: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var vedioId = options.id;
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + vedioId;
        util.http(url, this.processDoubanData); 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
     * 获取电影详情信息
     */
    processDoubanData: function(data) {
        if(!data){
            return;
        }
        var director = {
            avatar: '',
            name: '',
            id: ''
        };
        if (data.directors[0] != null){
            if(data.directors[0].avatars != null){
                director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var vedio = {
            vedioImg: data.images?data.images.large:'',
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wsih_count,
            commentCount: data.comment_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        };
        //设置导航栏标题
        wx.setNavigationBarTitle({
            title: data.title + ' 详情',
        });
        this.setData({
            vedio: vedio
        });
    },

    /**
     * 预览电影海报
     */
    viewVedioPostImg:function(event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src]
        })
    }
})