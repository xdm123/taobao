// pages/categary2/categary2.js
var common=require('../../utils/common')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    pageno:1, //页数
    pagesize:20, //分页数
    tabindex:0,
    tabid:'',
    tabBarData:[
      {
        name:'百货',
        id:'20100'
      },
      {
        name:'母婴',
        id:'20200'
      },
      {
        name:'食品',
        id:'20300'
      },
      {
        name:'女装',
        id:'20400'
      },
      {
        name:'电器',
        id:'20500'
      },
      {
        name:'鞋包',
        id:'20600'
      },
      {
        name:'内衣',
        id:'20700'
      },
      {
        name:'美妆',
        id:'20800'
      },
      {
        name:'男装',
        id:'20900'
      },
      {
        name:'水果',
        id:'21000'
      },
      {
        name:'家纺',
        id:'21100'
      },
      {
        name:'文具',
        id:'21200'
      },
      {
        name:'运动',
        id:'21300'
      },
      {
        name:'虚拟',
        id:'21400'
      },
      {
        name:'汽车',
        id:'21500'
      },
      {
        name:'家装',
        id:'21600'
      },
      {
        name:'家具',
        id:'21700'
      },
      {
        name:'医药',
        id:'21800'
      },

    ],
    materialId:20100,//百货
    publicParams:{},
    itemId:"",
   
  },
  onShow: function () {
    //console.log(publicParams);
  },
 
  onLoad:function(){
    this.getGoodsList()
  },
  
  async getGoodsList(){
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var materialId = _this.data.materialId;
    var pddParams=common.getPDDParams({cat_id:materialId,channel_type:"4",method:app.pdd_url_material,pageNo:_this.data.pageno,pageSize:_this.data.pagesize});
   

    wx.request({
      url: app.pdd_url_base,
      data: pddParams,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var goodslist = _this.data.goodsList;
        goodslist = goodslist.concat(common.packData(res,1))
      
        _this.setData({
          goodsList:goodslist
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail(res) {
        //console.log(res)
      }, complete(res) {
        //console.log(res)
      }
    })
  },
  tabbarClick:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var tabid = e.currentTarget.dataset.tabid
    console.log("物料id："+id,"tabId:"+index);
    this.setData({
      tabindex:index,
      materialId:id,
      pageno:1,
      pagesize:20,
      tabid:tabid,
      goodsList:[]
    })
    this.getGoodsList()
  },
  loaddata:function(){
    console.log(21321321321)
    var pageNo = this.data.pageno;
    pageNo++
    this.setData({
      pageno:pageNo
    })
    this.getGoodsList()
    console.log("pageNO:"+pageNo)
  }

})