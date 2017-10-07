// pages/post/post-comment/post-comment.js

import { DBPost } from '../../../database/DBPost.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //控制使用键盘还是语音
        useKeyboardFlag: true,
        //控制input组价的初始值
        keyboardInputValue:'',
        //控制是否显示图片选择面板
        sendMoreMsgFlag: false,
        //保存已选择的图片
        chooseFiles: [],
        //被删除图片的序号
        deleteIndex: -1,
        //保存当前正在播放语音的URL
        currentAudio: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var postId = options.id;
        this.dbPost = new DBPost(postId);
        var comments = this.dbPost.getCommentData();

        //console.log(comments);
        //綁定评论数据
        this.setData({
            comments:comments
        });
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
     * 预览图片
     */
    previewImg:function(event) {
        //获取评论序号
        var commentIdx = event.currentTarget.dataset.commentIdx,
        //获取图片在图片数组中的序号
        imgIdx = event.currentTarget.dataset.imgIdx,
        //获取评论的全部图片
        imgs = this.data.comments[commentIdx].content.img;
        wx.previewImage({
            current:imgs[imgIdx], //当前显示图片的http链接
            urls: imgs   //需要预览的图片http链接列表
        })
    },

    /**
     * 切换语音输入和键盘输入
     */
    switchInputType:function(event) {
        this.setData({
            useKeyboardFlag: !this.data.useKeyboardFlag
        });
    },

    /**
     * 获取用户输入
     */
    bindCommentInput:function(event) {
        var val = event.detail.value;
        //console.log(val);
        this.data.keyboardInputValue = val;
    },

    /**
     * 提交用户评论
     */
    submitComment:function(event) {
        var imgs = this.data.chooseFiles;
        var newData = {
            username: "yuang",
            avatar: "http://img3.imgtn.bdimg.com/it/u=426401689,945685388&fm=27&gp=0.jpg",
            create_time:new Date().getTime()/1000,
            content:{
                txt:this.data.keyboardInputValue,
                img: imgs
            },
        };
        if(!newData.content.txt && imgs.length==0){
            //如果没有评论内容，就不执行任何操作
            return;
        }
        //保存新评论到缓存数据库中
        this.dbPost.newComment(newData);
        //显示操作结果
        this.showCommitSuccessToast();
        //重新渲染并绑定所有评论
        this.bindCommentData();
        //恢复初始状态
        this.resetAllDefaultStatus();
    },

    // 评论成功弹框提示
    showCommitSuccessToast:function() {
        //显示操作结果
        wx.showToast({
            title: '评论成功',
            duration: 1000,
            icon: "success"
        });
    },

    // 重新渲染并绑定所有评论数据
    bindCommentData:function() {
        var comments = this.dbPost.getCommentData();
        //绑定评论数据
        this.setData({
            comments: comments
        });
    },

    // 将所有相关的按钮状态、输入状态都恢复到初始状态
    resetAllDefaultStatus:function() {
        //情况评论框
        this.setData({
            keyboardInputValue: '',
            chooseFiles: [],
            sendMoreMsgFlag:false
        });
    },

    /**
     * 显示选择图片、拍照等按钮
     */
    sendMoreMsg:function() {
        this.setData({
            sendMoreMsgFlag: !this.data.sendMoreMsgFlag
        })
    },

    /**
     * 选择本地照片与拍照
     */
    chooseImage:function(event) {
        //已选择图片数组
        var imgArr = this.data.chooseFiles;
        //只能上传3张照片，包括拍照
        var leftCount = 3 - imgArr.length;
        if(leftCount <= 0){
            //最多上传3张图片的Toast提示
            wx.showToast({
                title: '已选满3张图片',
                duration: 1000,
                icon: "success"
            });
            return;
        }
        var sourceType = [event.currentTarget.dataset.category],
            that = this;
        wx.chooseImage({
            count: leftCount,
            sourceType: sourceType,
            success: function(res) {
                //可以分次选择图片，但总数不能超过3张
                that.setData({
                    chooseFiles: imgArr.concat(res.tempFilePaths)
                });
            },
        })
    },

    /**
     * 删除已选的图片
     */
    deleteImage:function(event) {
        var index= event.currentTarget.dataset.idx,
            that = this;
        that.setData({
            deleteIndex: index
        });
        that.data.chooseFiles.splice(index, 1);
        setTimeout(function(){
            that.setData({
                deleteIndex: -1,
                chooseFiles: that.data.chooseFiles
            });
        }, 500)
    },

    /**
     * 开始录音
     */
    recordStart:function() {
        var that = this;
        this.setData({
            recordingClass: 'recording'
        });
        //记录录音开始时间
        this.startTime = new Date();
        wx.startRecord({
            success:function(res){
                //计算录音时长
                var diff = (that.endTime - that.startTime)/1000;
                diff = Math.ceil(diff);

                //发送录音
                that.submitVoiceComment({url:res.tempFilePath, timeLen:diff});
            },
            fail:function(res){
                console.log(res);
            },
            complete:function(res){
                console.log(res);
                //1分钟时间到后自动结束录音，发送录音
                //that.submitVoiceComment({ url: res.tempFilePath, timeLen: 60 });
            }
        })
    },

    /***
     * 结束录音
     */
    recordEnd:function() {
        this.setData({
            recordingClass: ''
        });
        this.endTime = new Date();
        wx.stopRecord();
    },

    /**
     * 提交录音
     */
    submitVoiceComment:function(audio) {
        var newData = {
            username: "xuexue",
            avatar: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2326007109,671296332&fm=27&gp=0.jpg",
            create_time: new Date().getTime() / 1000,
            content: {
                txt: '',
                img: [],
                audio: audio
            },
        };

        //保存新评论到缓存数据库中
        this.dbPost.newComment(newData);
        //显示操作结果
        this.showCommitSuccessToast();
        //重新渲染并绑定所有评论
        this.bindCommentData();
    },

    /**
     * 语音播放
     */
    playAudio:function(event) {
        var url = event.currentTarget.dataset.url,
            that = this;
        //暂停当前录音
        if(url == this.data.currentAudio){
            wx.pauseVoice();
            this.dats.currentAudio = '';
        } else {  //播放录音
            this.data.currentAudio = url;
            wx.playVoice({
                filePath: url,
                complete:function(){
                    //只有当录音播放完毕后才会执行
                    that.data.currentAudio = '';
                }
            });
        }
    },
})