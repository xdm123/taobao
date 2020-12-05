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
    platform_type: 0,
    item_url: "",
    shareStr: "",
    isCouponShow: false,
    pdd_share_tag: "",
  },
  //点击分享
  toShare: function () {
    this.getCoupon()
  },
  hiddenDialog: function () {
    this.setData({
      isCouponShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { item_id } = options//详细商品id
    const { platform_type } = options//平台类型
    const { others } = options
    var item = JSON.parse(others)
    switch (parseInt(platform_type)) {
      case 0:
        this.setData({
          item_url: decodeURIComponent(item.coupon_click_url),
        })
        break
      case 1:
        this.setData({
          pdd_share_tag: item.title + '\n'+"【原价】" + item.reserve_price + '\n'+"【劵后价】" + item.zk_final_price
        })
        break
      // default:
        
      //   break
    }
    this.setData({
      item_id: item_id,
      platform_type: platform_type,
    })

    //console.log("others:" + others)
    this.getGoodsList(others)
  },
  //获取优惠劵链接
  async getCoupon() {
    var _this = this;
    var params;
    var url_base;
    switch (parseInt(_this.data.platform_type)) {
      case 0:
        params = common.getTBParams({ method: app.tb_url_coupon, text: "不能少于5个字符", url: _this.data.item_url })
        url_base = app.tb_url_base
        break
      case 1:
        params = common.getPDDParams({ method: app.pdd_url_coupon, p_id: app.pdd_p_id, goods_sign: _this.data.item_id });
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
        var shareStr;
        switch (parseInt(_this.data.platform_type)) {
          case 0:
            shareStr = res.data.data.model
            break
          case 1:
            shareStr = "【推广链接】"+res.data.goods_promotion_url_generate_response.goods_promotion_url_list[0].short_url
            break
          case 2:
            var jdItem = JSON.parse(others)
            _this.setData({
              detailData: jdItem
            })
            break
        }
        wx.hideLoading({
          success: (res) => {
            _this.setData({
              shareStr: shareStr,
              isCouponShow: true,
            })
          },
        })
      },
      fail(res) {
        //console.log(res)
      }, complete(res) {
        console.log(res)
      }
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
        switch (parseInt(_this.data.platform_type)) {
          case 0:
            //console.log(tbItem)
            // var tbItem = res.data.results[0]
            var tbItem = JSON.parse(others)
            _this.setData({
              detailData: tbItem
            })
            break
          case 1:
            var detailItem = res.data.goods_detail_response.goods_details[0]
            _this.setData({
              detailData: common.pddToTb(detailItem)
              // detailData:pddItem
            })
            break
          case 2:
            var jdItem = JSON.parse(others)
            _this.setData({
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