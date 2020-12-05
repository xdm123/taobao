const common = require("../../utils/common");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperData: [
      {
        itemtitle: '聚划算',
        id: '32366',
        img: '../../img/ju.jpg'
      }, {
        itemtitle: '天猫满减',
        id: '27160',
        img: '../../img/tianmaochaoshi.jpg'
      }, {
        itemtitle: '天天特卖',
        id: '31362',
        img: '../../img/temai.jpg'
      }, {
        itemtitle: '好货精品',
        id: '12321',
        img: '../../img/jingpin.jpg'
      }, {
        itemtitle: '今日爆款',
        id: '30443',
        img: '../../img/baokuan.jpg'
      }, {
        itemtitle: '今日特惠',
        id: '4094',
        img: '../../img/tehui.jpg'
      }, {
        itemtitle: ' 潮流范',
        id: '4093',
        img: '../../img/chaoliu.jpg'
      }, {
        itemtitle: '肯德基',
        id: '19810',
        img: '../../img/kuaican.jpg'
      }, {
        itemtitle: '抢购商品',
        id: '34616',
        img: '../../img/qiang.jpg'
      }, {
        itemtitle: '国际直营',
        id: '30015',
        img: '../../img/guojizhiying.jpg'
      }
    ],
    banner_data: [{
      pic: "../../img/banners/banner1.jpg",
      url: "https://u.jd.com/t9zfzYC"
    }, {
      pic:"../../img/banners/banner2.jpg",
      url:"https://u.jd.com/tizFVr9"
    },{
      pic:"../../img/banners/banner3.jpg",
      url:"https://u.jd.com/tOzxd4b"
    },{
      pic:"../../img/banners/banner4.jpg",
      url:"https://u.jd.com/t9zk8Di"
    }],
    //商品列表
    goodsList: [],
    //分页
    pageno: 1, //页数
    pagesize: 20, //分页数
    //悬停
    floatAreaTop: 0,
    isShowFloat: false,
    //上一次点击的titleBar
    last_title_index: 0,//默认淘宝 0:淘宝，1:拼多多，2:京东
    materialId: "28026",//淘宝默认 
    isNewType: false,//是否点击切换平台
  },
  //titleBar点击事件
  handleItemChange(e) {
    const { index } = e.detail
    if (this.data.last_title_index == index) {
      return
    } else {
      this.getGoodsList(index)
      this.setData({
        pageno: 1,
        pagesize: 20,

        last_title_index: index,
        isNewType: true,
      })
    }
  },

  onShow: function () {
    //console.log(publicParams);
  },

  onLoad: function () {
    //获取数据列表
    //console.log(this.data.last_title_index)
    this.getGoodsList(this.data.last_title_index)
    //计算什么滑动多长距离开始悬停
    this.countXuanTing()
  },
  //计算悬停距离
  countXuanTing: function () {
    let that = this;
    var query = wx.createSelectorQuery()
    query.select('#floatMirror').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        floatAreaTop: res[0].top
      })
    })
  },
  //监听滚动，触发悬停
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop
    //console.log("scrollTop:"+scrollTop+",floatAreaTop:"+this.data.floatAreaTop)
    if (scrollTop >= this.data.floatAreaTop) {
      this.setData({
        isShowFloat: true
      })
    } else {
      this.setData({
        isShowFloat: false
      })
    }
  },
  async getGoodsList(type) {
    //console.log("正在加载：" + type)
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var materialId = _this.data.materialId;
    // var tbParams=this.publicParams;
    var params;
    var url_base;
    switch (type) {
      case 0:
        params = common.getTBParams({ method: app.tb_url_material, materialId: materialId, pageNo: _this.data.pageno, pageSize: _this.data.pagesize })
        url_base = app.tb_url_base
        break
      case 1:
        //定义初始化参数-channel_type: "1"，pdd-今日热销
        params = common.getPDDParams({ cat_id: materialId, channel_type: "1", method: app.pdd_url_material, pageNo: _this.data.pageno, pageSize: _this.data.pagesize })
        url_base = app.pdd_url_base
        break
      case 2:
        params = common.getJDParams({ eliteId: 1, method: app.jd_url_material, pageIndex: _this.data.pageno, pageSize: _this.data.pagesize })
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
        var goodslist = []
        if (_this.data.isNewType) {
          goodslist = []
          _this.setData({
            isNewType: false
          })
        } else {
          goodslist = _this.data.goodsList
        }
        switch (type) {
          case 0:
            goodslist = goodslist.concat(common.packData(res, 0))
            break
          case 1:
            goodslist = goodslist.concat(common.packData(res, 1))
            break
          case 2:
            goodslist = goodslist.concat(common.packData(res, 2))
            break
        }
        _this.setData({
          goodsList: goodslist
        })
        wx.hideLoading({
          success: (res) => { },
        })
      },
      fail(res) {
        //console.log(res)
      }, complete(res) {
        console.log(res)
      }
    })
  },
  // 页面触底时执行
  onReachBottom: function () {
    console.log('页面触底了')
    var pageNo = this.data.pageno;
    pageNo++
    this.setData({
      pageno: pageNo
    })
    this.getGoodsList(this.data.last_title_index)
    console.log(pageNo)
  },
})