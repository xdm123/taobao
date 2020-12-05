// pages/categary/categary.js
var common = require('../../utils/common')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    pageno: 1, //页数
    pagesize: 20, //分页数
    tabindex: 0,
    tabid: '',
    tbData: [
      {
        name: '综合',
        id: '13366'
      },
      {
        name: '鞋包配饰',
        id: '13370'
      },
      {
        name: '母婴',
        id: '13374'
      },
      {
        name: '女装',
        id: '13367'
      },
      {
        name: '美妆个护',
        id: '13371'
      },
      {
        name: '食品',
        id: '13375'
      },
      {
        name: '家居家装',
        id: '13368'
      },
      {
        name: '男装',
        id: '13372'
      },
      {
        name: '运动户外',
        id: '13376'
      },
      {
        name: '内衣',
        id: '13373'
      },
      {
        name: '数码家电',
        id: '13369'
      }
    ],
    pddData: [
      {
        name: '百货',
        id: '20100'
      },
      {
        name: '母婴',
        id: '20200'
      },
      {
        name: '食品',
        id: '20300'
      },
      {
        name: '女装',
        id: '20400'
      },
      {
        name: '电器',
        id: '20500'
      },
      {
        name: '鞋包',
        id: '20600'
      },
      {
        name: '内衣',
        id: '20700'
      },
      {
        name: '美妆',
        id: '20800'
      },
      {
        name: '男装',
        id: '20900'
      },
      {
        name: '水果',
        id: '21000'
      },
      {
        name: '家纺',
        id: '21100'
      },
      {
        name: '文具',
        id: '21200'
      },
      {
        name: '运动',
        id: '21300'
      },
      {
        name: '虚拟',
        id: '21400'
      },
      {
        name: '汽车',
        id: '21500'
      },
      {
        name: '家装',
        id: '21600'
      },
      {
        name: '家具',
        id: '21700'
      },
      {
        name: '医药',
        id: '21800'
      }],
    materialId: 13366,//物料id备注
    publicParams: {},
    tabBarData: [],
  },
  clickTb: function () {
    console.log("点击淘宝：")
    this.setData({
      pageNo: 0,
      goodslist: [],
      tabBarData: this.data.tbData,
      materialId: 13366,//物料id备注
    })
    this.getGoodsList(0)
  },
  clickPdd: function () {
    console.log("点击拼多多：")
    this.setData({
      pageNo: 0,
      goodslist: [],
      tabBarData: this.data.pddData,
      materialId: 20100,//百货
    })
   // this.getGoodsList(1)

  },
  clickJd: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var tabid = e.currentTarget.dataset.tabid
    console.log("点击京东："+id+",index:"+index+",tabid:"+tabid)
    this.setData({
      tabid: tabid,
      tabindex:0,
      tabBarData:[],
      goodslist:[],
    })
  },

  onShow: function () {
    //console.log(publicParams);
  },
  //初始化
  onLoad: function () {
    this.setData({
      tabBarData: this.data.tbData
    })
    this.getGoodsList(0)
  },

  async getGoodsList(type) {
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
        params = common.getTBParams(materialId, _this.data.pageno, _this.data.pagesize)
        url_base = app.tb_url_base
        break
      case 1:
        params = common.getPDDParams({ cat_id: materialId, channel_type: "4", method: app.pdd_url_material, pageNo: _this.data.pageno, pageSize: _this.data.pagesize })
        url_base = app.pdd_url_base
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
        var goodslist = _this.data.goodsList;
        switch (type) {
          case 0:
            console.log(res.data.result_list)
            goodslist = goodslist.concat(res.data.result_list)
            break
          case 1:
            goodslist = goodslist.concat(common.packData(res.data.goods_basic_detail_response.list))
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
  tabbarClick: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var tabid = e.currentTarget.dataset.tabid
    console.log(id, index);
    this.setData({
      tabindex: index,
      materialId: id,
      pageno: 1,
      pagesize: 20,
      tabid: tabid,
      goodsList: []
    })
    this.getGoodsList()
  },
  loaddata: function () {
    console.log(21321321321)
    var pageNo = this.data.pageno;
    pageNo++
    this.setData({
      pageno: pageNo
    })
    this.getGoodsList()
    console.log(pageNo)
  }

})