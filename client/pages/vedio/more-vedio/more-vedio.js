// pages/vedio/more-vedio/more-vedio.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        vedios: [],
        requestUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        //设置导航栏title
        wx.setNavigationBarTitle({
            title: category,
        });
        var dataUrl = '';
        switch(category){
            case '正在热映':
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case '即将上映':
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case '豆瓣 Top250':
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        util.http(dataUrl,this.processDoubanData);
        this.data.requestUrl = dataUrl;
        //显示loading状态
        wx.showNavigationBarLoading();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //显示loading状态
        wx.showNavigationBarLoading();
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
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";
        //页面刷新后将页面所有初始化参数恢复到初始值
        this.data.vedios = [];
        util.http(refreshUrl, this.processDoubanData);
        //显示loading状态
        wx.showNavigationBarLoading();
    },

    /**
     * 页面上拉触底事件的处理函数，上滑加载更多数据
     */
    onReachBottom: function (event) {
        var totalCount  = this.data.vedios.length;
        //拼接下一组数据的URL
        var nextUrl = this.requestUrl + "?start=" + totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);
        //显示loading状态
        wx.showNavigationBarLoading();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 处理豆瓣电影数据
     */
    processDoubanData: function (vediosDouban) {
        var vedios = [];
        //for中的代码将所有豆瓣电影数据转换成我们需要的格式
        for (var idx in vediosDouban.subjects) {
            var subject = vediosDouban.subjects[idx];
            var title = subject.title;
            if (title.length > 6) {
                //电影标题只取前6个字符
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                vedioId: subject.id
            }
            vedios.push(temp);
        }
        var totalVedios = [];
        totalVedios = this.data.vedios.concat(vedios);
        this.setData({
            vedios: totalVedios
        }); 
        //结束下拉刷新
        wx.stopPullDownRefresh();
        //加载完成后隐藏loading状态
        wx.hideNavigationBarLoading();
        // console.log(vedios); 
    },

    /**
     * 跳转到电影详情页
     */
    onVedioTap: function () {
        var vedioId = event.currentTarget.dataset.vedioId;
        wx.navigateTo({
            url: '../vedio-detail/vedio-detail?id=' + vedioId,
        })
    },
})