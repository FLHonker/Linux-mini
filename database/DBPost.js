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
            this.initPostList(res);
        }
        return res;
    }

    //保存活更新缓存数据
    initPostList(data) {
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
};
export{DBPost}