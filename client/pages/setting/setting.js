// pages/setting/setting.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cache: [
            { iconurl: '/images/icon/clear.png', title: '缓存清理', tap: 'clearCache' }
        ],
        device: [
            { iconurl: '/images/icon/cellphone.png', title: '系统信息', tap: 'showSystemInfo' },
            { iconurl: '/images/icon/network.png', title: '网络状态', tap: 'showNetwork' },
            { iconurl: '/images/icon/map.png', title: '地图显示', tap: 'showMap' },
            { iconurl: '/images/icon/compass.png', title: '指南针', tap: 'showCompass' },
            { iconurl: '/images/icon/location.png', title: '当前位置、速度', tap: 'showLonLat' },
            { iconurl: '/images/icon/shake.png', title: '摇一摇', tap: 'shake' },
            { iconurl: '/images/icon/scanCode.png',title:'扫一扫', tap: 'scanQRCode' }
        ],
        api: [
            { iconurl: '/images/icon/list.png', title: '下载pdf、word文档', tap: 'downloadDocumentList' },
            { iconurl: '', title: '用户登录', tap: 'login' },
            { iconurl: '', title: '校检用户信息', tap: 'check' },
            { iconurl: '', title: '获取用户加密信息', tap: 'decryted' },
            { icon: '', title: '模板消息', tap: 'tplMessage' },
            { iconurl: '', title: '微信支付', tap: 'wxpay' }
        ],
        others: [
            { iconurl: '', title: 'wx:key示例', tap: 'showWxKeyDemo' },
            { iconurl: '', title: 'scoll-view高级用法演示', tap: 'showScollViewDemo' }
        ],

        //指南针数据
        compassVal: 0,       //数据绑定量
        compassHidden: true,  //指南针是否隐藏

        //摇一摇数据
        shakeInfo: {
            gravityModalHidden: true,
            num: 0,
            enabled: false,
        },
        shakeData: {
            x: 0,
            y: 0,
            z: 0
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.g_userInfo
        })
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
     * 
     * 显示模态窗口
     */
    showModal: function (title, content, callback) {
        wx.showModal({
            title: title,
            content: content,
            cancelColor: '#7F8389',
            success: function (res) {
                if (res.confirm) {
                    callback && callback();
                }
            }
        })
    },

    /**
     * 缓存清理
     */
    clearCache: function () {
        this.showModal('缓存清理', '确定要清楚本地缓存吗？', function () {
            wx.clearStorage({
                success: function (msg) {
                    wx.showToast({
                        title: '缓存清理成功',
                        duration: 1000,
                        mask: true,
                        icon: "success"
                    })
                },
                fail: function (e) {
                    console.log(e);
                }
            })
        })
    },

    /**
     * 显示系统信息
     */
    showSystemInfo: function () {
        wx.navigateTo({
            url: 'device/device',
        });
    },

    /**
     * 获取网络状态
     */
    showNetwork: function () {
        var that = this;
        wx.getNetworkType({
            success: function (res) {
                var networkType = res.networkType;
                that.showModal('网络状态', '您当前的网络:' + networkType);
            },
        });
    },

    // 获取当前位置经纬度与速度信息
    getLonLat: function (callback) {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                callback(res.longitude, res.latitude, res.speed);
            },
        })
    },

    /**
     * 显示当前位置经纬度与速度信息
     */
    showLonLat: function () {
        var that = this;
        this.getLonLat(function (lon, lat, speed) {
            var lonStr = lon >= 0 ? '东经' : '西经', latStr = lat >= 0 ? '北纬' : '南纬';
            lon = lon.toFixed(2);
            lat = lat.toFixed(2);
            lonStr += lon;
            latStr += lat;
            speed = (speed||0).toFixed(2);
            that.showModal('当前位置和速度','当前位置:('+lonStr+'°,'+latStr+'°)  速度:'+speed+'m/s');
        });
    },

    /**
     * 使用微信内置地图，在地图上显示坐标点
     */
    showMap:function() {
        this.getLonLat(function(lon, lat){
            wx.openLocation({
                latitude: lat,
                longitude: lon,
                scale: 15,
                name: '升升公寓C',
                address: '文秀街东30米',
                fail:function(){
                    wx.showToast({
                        title: '地图打开失败',
                        icon: 'cancel',
                        duration: 1000,
                        mask: true,
                    });
                }
            })
        })  
    },

    /**
     * 显示罗盘
     */
    showCompass:function() {
        var that = this;
        this.setData({
            compassHidden: false
        });
        wx.onCompassChange(function(res){
            if(!that.data.compassHidden){
                that.setData({
                    compassVal: res.direction.toFixed(2)
                });
            }
        })
    },

    //隐藏罗盘
    hideCompass:function() {
        this.setData({
            compassHidden: true
        });
    },

    /**
     * 摇一摇
     */
    shake:function() {
        var that = this;
        //启用摇一摇
        this.gravityModalConfirm(true);

        wx.onAccelerometerChange(function(res){
            //摇一摇核心代码，判断手机晃动幅度
            var x = res.x.toFixed(4), y = res.y.toFixed(4), z = res.z.toFixed(4)
            var flagX = that.getDelFlag(x,that.data.shakeData.x), 
                flagY = that.getDelFlag(y, that.data.shakeData.y),
                flagZ = that.getDelFlag(z, that.data.shakeData.z);
            that.data.shakeData = {
                x: res.x.toFixed(4),
                y: res.y.toFixed(4),
                z: res.z.toFixed(4)
            };
            if(flagX && flagY || flagX && flagZ || flagY && flagZ){
                //如果摇一摇幅度足够大，就认为摇一摇成功
                if(that.data.shakeInfo.enabled){
                    that.data.shakeInfo.enabled = false;
                    that.playShakeAudio();
                }
            }
        })
    },

    //启用或停用摇一摇功能
    gravityModalConfirm:function(flag) {
        if(flag !== true){
            flag = false;
        }
        var that = this;
        this.setData({
            shakeInfo:{
                gravityModalHidden: !that.data.shakeInfo.gravityModalHidden,
                num: 0,
                enabled: flag
            }
        })
    },

    //计算摇一摇偏移量
    getDelFlag:function(val1, val2) {
        return (Math.abs(val1 - val2) >= 1);
    },

    //摇一摇成功后播放声音并累加摇一摇次数
    palyShakeAudio:function() {
        var that = this;
        wx.playBackgroundAudio({
            dataUrl: 'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',
            title:'',
            coverImgUrl:'http://img1.imgtn.bdimg.com/it/u=1853490793,544454454&fm=27&gp=0.jpg'
        });
        wx.onBackgroundAudioStop(function(){
            that.data.shakeInfo.num++;
            that.setData({
                shakeInfo:{
                    num: that.data.shakeInfo.num,
                    enabled: true,
                    gravityModalHidden: false
                }
            });
        });
    },

    /**
     * 扫码
     */
    scanQRCode:function() {
        var that = this;
        wx.scanCode({
            success:function(res){
                console.log(res);
                that.showModal('扫描二维码/条形码',res.result,false);
            },
            fail:function(){
                that.showModal('扫描二维码/条形码','扫描失败，请重试', false);
            }
        });
    },

    /**
     * 跳转到文件下载页面
     */
    downloadDocumentList:function() {
        wx.navigateTo({
            url: '/pages/setting/document/download/download',
        });
    },

    /**
     * 下载并预览文档
     */
    downloadFile:function(event) {
        var type = event.currentTarget.dataset.type,
            url = 'https://raw.githubusercontent.com/qyuhen/book/master/Go%20%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%20%E7%AC%AC%E5%9B%9B%E7%89%88.';
        switch (type) {
            case 'pdf':
                url += "pdf";
                break;
            case 'word':
                url += "docx";
                break;
            case 'excel':
                url += "xlsx";
                break;
            default:
                url += "pptx";
                break;
        }
        wx.downloadFile({
            url: url,
            success: function (res) {
                var filePath = res.tempFilePath;
                console.log(filePath);
                wx.openDocument({
                    filePath: filePath,
                    sucess: function (res) {
                        console.log("打开文档成功！");
                    },
                    fail: function (res) {
                        console.log(res);
                    },
                    complete: function (res) {
                        console.log(res);
                    }
                })
            },
            fail:function(){
                console.log("文档下载失败");
            }
        })
    },
})