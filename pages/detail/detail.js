// pages/detail/detail.js
var common = require('../../utils/common')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {

    },
    item_id: 0,
    platform_type: 0,//平台分类类型
    item_url: "",
    shareStr: "",//分享的实际链接
    isCouponShow: false,//是否显示分享对话框
    pdd_share_tag: "",//分享内容前缀，自己编辑的
    mini_app_path: "",//跳转目标小程序的路径wx_app_url
    tb_password_simple: "",//淘宝的淘口令，用于打开淘宝app定位的优惠劵页面啊
    is_tb_tkl_dialogShow: false,//淘宝专用，是否显示淘口令对话框
    materialUrl: "",//京东专用，请求券链接的一个参数
    couponUrl: "",//京东专用，用于分享券
    pdd_search_id: "",//pdd专用
    item_name: "",//分享好友是使用
    user_name: "",//分享好友使用,用户昵称
    pict_url: "",//分享朋友圈专用，商品页缩略图
    coupon_dialog_btns: [
      { name: "复制链接", id: 0, img: "../../img/chaoliu.jpg" },
      { name: "分享好友", id: 1, img: "../../img/chaoliu.jpg" },
      { name: "分享海报", id: 2, img: "../../img/chaoliu.jpg" },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAuthInfo()
    console.log(options)
    const { item_id } = options//详细商品id
    const { platform_type } = options//平台类型
    const { others } = options
    var jsonStr
    /* 
    通过右上角的分享好友，打开链接后others中的链接数据会被encode，
    所以这里添加了decode的过程
     */
    if (others.indexOf("}") == -1) {
      jsonStr = decodeURIComponent(others)
      //console.log("转化后jsonStr:"+jsonStr)
    } else {
      //console.log("未转化")
      jsonStr = others
    }
    var item = JSON.parse(jsonStr)

    switch (parseInt(platform_type)) {
      case 0:
        this.setData({
          item_url: decodeURIComponent(item.coupon_click_url),
        })
        break
      case 1:
        this.setData({
          pdd_search_id: item.searchId,
          pdd_share_tag: item.title + '\n' + "【原价】" + item.reserve_price + '\n' + "【劵后价】" + item.zk_final_price
        })
        break
      case 2:
        this.setData({
          pdd_share_tag: item.title + '\n' + "【原价】" + item.reserve_price + '\n' + "【劵后价】" + item.zk_final_price,
          item_url: decodeURIComponent(item.coupon_click_url),
        })
        break
    }

    this.setData({
      item_id: item_id,
      platform_type: platform_type,
      item_name: item.title,
      pict_url: item.pict_url,
    })
    //console.log("others:" + others)
    this.getGoodsList(jsonStr)

  },
  //获取授权信息
  getAuthInfo() {
    var _this = this
    wx.getSetting({
      success: res => {
        if (res.authSetting && res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (data) {
              console.log(data.userInfo);
              _this.setData({
                user_name: data.userInfo.nickName
              })
            }
          });
        } else {
          this.showShouquan = true; // 打开模态框进行授权
        }
      }
    })
  },
  //分享好友
  onShareAppMessage(options) {
    this.hiddenDialog()
    return {
      title: this.data.user_name + "推荐" + this.data.item_name,
    }

  },
  //分享朋友圈
  onShareTimeline() {
    var pict_url = this.data.pict_url
    return {
      title: this.data.user_name + "推荐" + this.data.item_name,
      imageUrl: pict_url.indexOf("http") == -1 ? "https:" + pict_url : pict_url
    }
  },
  //复制链接按钮点击事件
  clipboardData: function (e) {
    var _this = this
    wx.setClipboardData({
      data: this.data.pdd_share_tag + this.data.shareStr,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
            _this.hiddenDialog()
          }
        })
      }
    })
  },

  //立即分享
  toShare: function () {
    //console.log("点击分享")
    this.getCoupon(0)
  },
  //马上购买。跳转小程序
  toBuy: function () {
    this.getCoupon(1)
  },
  //隐藏任何对话框
  hiddenDialog: function () {
    this.setData({
      isCouponShow: false,
      is_tb_tkl_dialogShow: false
    })
  },

  /*获取优惠劵链接
  getType:
  0:立即分享
  1:马上购买
    */
  async getCoupon(getType) {
    var _this = this;
    var params;
    var url_base;
    switch (parseInt(_this.data.platform_type)) {
      case 0:
        params = common.getTBParams({ method: app.tb_url_coupon, text: "不能少于5个字符", url: _this.data.item_url })
        url_base = app.tb_url_base
        break
      case 1:
        params = common.getPDDParams({ method: app.pdd_url_coupon, p_id: app.pdd_p_id, goods_sign: _this.data.item_id, generate_we_app: true, search_id: _this.data.pdd_search_id });
        url_base = app.pdd_url_base
        break
      case 2:
        params = common.getJDParams({ method: app.jd_url_coupon, materialId: _this.data.materialUrl, siteId: app.jd_appid, couponUrl: _this.data.item_url });
        url_base = app.jd_url_base
        break
    }
    wx.request({
      url: url_base,
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var shareStr;
        var app_path;
        switch (parseInt(_this.data.platform_type)) {
          case 0:
            shareStr = res.data.data.model
            var password_simple = res.data.data.password_simple
            console.log("tb_password_simple:" + password_simple)
            _this.setData({
              tb_password_simple: password_simple,
            })
            break//淘宝的话，直接结束
          case 1:
            var obj = res.data.goods_promotion_url_generate_response.goods_promotion_url_list[0]
            shareStr = "【推广链接】" + obj.short_url
            app_path = obj.we_app_info.page_path
            break
          case 2:
            shareStr = "【推广链接】" + _this.data.item_url//妈的找不到短链
            var jsonStr = res.data.jd_union_open_promotion_common_get_response.result
            var jsonObj = JSON.parse(jsonStr)
            var clickUrlStr = jsonObj.data.clickURL
            app_path = "pages/union/proxy/proxy?spreadUrl=" + encodeURIComponent(clickUrlStr) + "&appid=" + app.my_wx_appid
            break
        }

        switch (getType) {
          case 0:
            _this.setData({
              shareStr: shareStr,
              isCouponShow: true,
            })
            break
          case 1:
            _this.jumpToMiniApp(app_path)
            break
        }
      },
      fail(res) {
        //console.log(res)
      }, complete(res) {
        console.log(res)
      }
    })
  },
  //pdd & jd 跳转到小程序
  jumpToMiniApp(app_path) {
    var appid = ""
    switch (parseInt(this.data.platform_type)) {
      /*  淘宝没有微信小程序
      弹出居中对齐的淘口令
      使用方法：复制淘口令（password_simple）打开淘宝的方式*/
      case 0:
        this.setData({
          is_tb_tkl_dialogShow: true
        })
        return //***********弹出对话框拉倒
      case 1:
        appid = app.pdd_mini_appid
        break
      case 2:
        appid = app.jd_mini_appid
        break
    }
    console.log("跳转小程序的appId:" + appid + ",path:" + app_path)
    wx.navigateToMiniProgram({
      appId: appid,
      path: app_path,
    })
  },
  async getGoodsList(others) {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var params;
    var url_base;
    switch (parseInt(_this.data.platform_type)) {
      case 0:
        params = common.getTBParams({ method: app.tb_url_detail, item_id: _this.data.item_id })
        url_base = app.tb_url_base
        break
      case 1:
        params = common.getPDDParams({ method: app.pdd_url_detail, goods_sign: _this.data.item_id });
        url_base = app.pdd_url_base
        break
      case 2:
        params = common.getJDParams({ method: app.jd_url_detail, skuIds: _this.data.item_id });
        url_base = app.jd_url_base
        break
    }
    wx.request({
      url: url_base,
      data: params,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var descArr = []
        switch (parseInt(_this.data.platform_type)) {
          case 0:

            var tbDetail = res.data.results[0]
            tbDetail.is_prepay != null && tbDetail.is_prepay == true ? descArr[0] = "消费者保障" : ""
            tbDetail.free_shipment != null && tbDetail.free_shipment == true ? descArr[1] = "包邮" : ""
            tbDetail.provcity != null ? descArr[2] = tbDetail.provcity : ""
            tbDetail.shop_dsr != null ? descArr[3] = "dsr评分:" + tbDetail.shop_dsr : ""
            tbDetail.ratesum != null ? descArr[4] = "店铺等级:" + tbDetail.ratesum : ""
            tbDetail.superior_brand != null && tbDetail.superior_brand == 1 ? descArr[5] = "品牌精选" : ""
            tbDetail.h_good_rate != null && tbDetail.h_good_rate == true ? descArr[6] = "好评率高" : ""
            var newDesArr = []
            for (var i = 0; i < descArr.length; i++) {
              if (descArr.hasOwnProperty(i)) {
                newDesArr[i] = descArr[i]
              }
            }
            var tbItem = JSON.parse(others)
            tbItem.descArr = newDesArr
            console.log(newDesArr)
            _this.setData({
              detailData: tbItem
            })
            break
          case 1:
            var detailItem = res.data.goods_detail_response.goods_details[0]
            // detailItem.desc_txt != null ? descArr[0] = "描述分:" + detailItem.desc_txt : ""
            // detailItem.lgst_txt != null ? descArr[1] = "物流分:" + detailItem.lgst_txt : ""
            // detailItem.serv_txt != null ? descArr[2] = "服务分:" + detailItem.serv_txt : ""
            // detailItem.descArr=descArr
            _this.setData({
              detailData: common.pddToTb(detailItem)
              // detailData:pddItem
            })
            break
          case 2:
            var jsonStr = res.data.jd_union_open_goods_promotiongoodsinfo_query_response.result
            var jsonObj = JSON.parse(jsonStr).data[0]
            var materialUrl = jsonObj.materialUrl
            jsonObj.isFreeShipping != null && jsonObj.isFreeShipping == 1 ? descArr[0] = "包邮" : ""
            jsonObj.isJdSale != null && jsonObj.isJdSale == 1 ? descArr[1] = "自营" : ""
            var jdItem = JSON.parse(others)
            jdItem.descArr = descArr
            _this.setData({
              materialUrl: materialUrl,
              detailData: jdItem
            })
            break
        }
        wx.hideLoading({
          success: (res) => { },
        })
      },
      fail(res) {
        //console.log(res)
      }, complete(res) {
        console.log("详情页---------item_id：" + _this.data.item_id + ",platform_type:" + _this.data.platform_type + ",item_url:" + _this.data.item_url)
        console.log(res)
      }
    })
  },
})