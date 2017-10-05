/**
 * prototype构建数操作类
   var DBPost = function(){
    this.storageKeyName = 'postList';  //所有的文章本地缓存存储键值
}
DBPost.prototype = {
    //得到全部文章信息
    getAllPostData:function(){
        var res = wx.getStorageSync(this.storageKeyName);
        if(!res){
            res = require("../data/data.js").postList;
            this.execSetStorageSync(res);
        }
        return res;
    },

    //本地缓存 保存/更新
    execSetStorageSync:function(data){
        wx.setStorageSync(this.storageKeyName, data)
    },
};

module.exports = {
    DBPost:DBPost
};

*/

//引用utils模块
var util = require('../utils/util.js');
/**
 * ES6的新特性Class、Module来改写缓存操作类
 */
class DBPost {
    constructor(postId){
        this.storageKeyName = 'postList';
        this.postId = postId;
    }

    //得到全部文章信息,注意函数不需要function关键字
    getAllPostData() {
        var res = wx.getStorageSync(this.storageKeyName);
        if (!res) {
            res = require("../data/data.js").postList;
            this.execSetStorageSync(res);
        }
        return res;
    }

    //保存活更新缓存数据
    execSetStorageSync(data) {
        wx.setStorageSync(this.storageKeyName, data)
    }

    //获取指定id的文章数据
    getPostItemById(){
        var postsData = this.getAllPostData();
        var len = postsData.length;
        for(var i=0;i<len;i++){
            if(postsData[i].postId == this.postId){
                return {    //返回数据
                    index: i,   //当前文章在缓存数据库数组中的序号
                    data: postsData[i]
                }
            }
        }
    }

    // 收藏文章
    collect(){
        return this.updatePostData('collect');
    }

    // 点赞文章
    up(){
        return this.updatePostData('up');
    }

    //更新本地的点赞、评论信息、收藏、阅读量
    updatePostData(category){
        var itemData = this.getPostItemById(), postData = itemData.data, allPostData = this.getAllPostData();
        switch(category){
            case 'collect':
                //处理收藏
                if(!postData.collectionStatus){
                    //如果当前状态是未收藏
                    postData.collectionNum++;
                    postData.collectionStatus = true;
                } else {
                    //如果当前状态是已收藏
                    postData.collectionNum--;
                    postData.collectionStatus = false;
                }
                break;
            case 'up':
                //处理点赞
                if(!postData.upStatus){
                    //如果当前状态为未点赞
                    postData.upNum++;
                    postData.upStatus = true;
                } else {
                    //如果已经点赞
                    postData.upNum--;
                    postData.upStatus = false;
                }
                break;
            default: 
                break;
        }
        //更新缓存数据库
        allPostData[itemData.index] = postData;
        this.execSetStorageSync(allPostData);
        return postData;
    }

    //获取文章评论数据
    getCommentData(){
        var itemData = this.getPostItemById().data;
        //按时间降序排列评论
        /*
        itemData.comments.sort(this.compareWithTime);
        var len = itemData.comments.length, comment;
        for(var i=0;i<len;i++){
            //将comment中的时间戳转换成可阅读格式
            comment = itemData.comments[i];
            comment.create_time = util.getDiffTime(comment.crete_time, true);
        }
        */
        return itemData.comments;
    }
    
    //将评论按时间降序排列用到的时间戳比较方法
    compareWithTime(value1, value2){
        var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time);
        if(flag < 0){
            return 1;
        }else if(flag > 0){
            return -1;
        }else{
            return 0;
        }
    }
};
export{DBPost}