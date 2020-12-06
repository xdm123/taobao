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
    /*  1-好券商品,2-精选卖场,10-9.9包邮,15-京东配送,22-实时热销榜,23-为你推荐,
    24-数码家电,25-超市,26-母婴玩具,27-家具日用,28-美妆穿搭,30-图书文具,31-今日必推,32-京东好物,33-京东秒杀,34-拼购商品,40-高收益榜,41-自营热卖榜,108-秒杀进行中,109-新品首发,110-自营,112-京东爆品,125-首购商品,129-高佣榜单,130-视频商品,153-历史最低价商品榜，210-极速版商品 */
    jdData: [{
      name: '自营',
      id: '110'
    },
    {
      name: '超市',
      id: '25'
    }, {
      name: '母婴玩具',
      id: '26'
    }, {
      name: '家具日用',
      id: '27'
    }, {
      name: '美妆穿搭',
      id: '28'
    }, {
      name: '图书文具',
      id: '30'
    }, {
      name: '好券商品',
      id: '1'
    }, {
      name: '精选卖场',
      id: '2'
    }, {
      name: '9.9包邮',
      id: '3'
    }, {
      name: '京东配送',
      id: '15'
    }, {
      name: '实时热销榜',
      id: '22'
    }, {
      name: '今日必推',
      id: '31'
    }, {
      name: '京东好物',
      id: '32'
    }, {
      name: '京东秒杀',
      id: '33'
    }, {
      name: '自营热卖榜',
      id: '41'
    }, {
      name: '京东爆品',
      id: '112'
    }, {
      name: '新品首发',
      id: '109'
    }, {
      name: '历史最低价商品榜',
      id: '153'
    }, {
      name: '极速版商品',
      id: '210'
    },],
    platformBtns: [
      { name: "淘宝", id: "0", isActive: true },
      { name: "拼多多", id: "1", isActive: false },
      { name: "京东", id: "2", isActive: false },
    ],
    publicParams: {},
    tabBarData: [],
    materialId: "",
    last_platform_type: 0,//上一次点击的平台类型
    isNewType: false,//是否点击切换平台
  },
  //平台按钮点击事件
  platformClick: function (e) {
    //刷新ui
    var type = e.currentTarget.dataset.id;
    type = parseInt(type)
    if (this.data.last_platform_type == type) {//如果重复点击同一平台按钮不执行操作
      return
    }
    var arr = this.data.platformBtns
    //console.log("点击的id："+type)
    for (var i = 0; i < arr.length; i++) {
      if (i == type) {
        arr[i].isActive = true
      } else {
        arr[i].isActive = false
      }
    }
    var barData = []
    switch (type) {
      case 0:
        barData = this.data.tbData
        break;
      case 1:
        barData = this.data.pddData
        break;
      case 2:
        barData = this.data.jdData
        break
    }
    this.setData({
      //刷新平台分类数据
      platformBtns: arr,
      //刷新商品分类数据
      tabBarData: barData,
      isNewType: true,
      last_platform_type: type,
      materialId: barData[0].id
    })
    //请求数据
    this.getGoodsList()
  },

  onShow: function () {
    //console.log(publicParams);
  },
  //初始化
  onLoad: function () {
    this.setData({
      tabBarData: this.data.tbData,
      materialId: this.data.tbData[0].id
    })

    this.getGoodsList()
  },

  async getGoodsList() {
    var type = this.data.last_platform_type
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var materialId = _this.data.materialId;
    // var tbParams=this.publicParams;
    console.log("分类页加载平台为" + type + "，加载的物料ID为" + materialId)
    var params;
    var url_base;
    switch (type) {
      case 0:
        params = common.getTBParams({ "method": app.tb_url_material, "materialId": materialId, "pageNo": _this.data.pageno, "pageSize": _this.data.pagesize })
        url_base = app.tb_url_base
        break
      case 1:
        params = common.getPDDParams({ cat_id: materialId, channel_type: "4", method: app.pdd_url_material, pageNo: _this.data.pageno, pageSize: _this.data.pagesize })
        url_base = app.pdd_url_base
        break
      case 2:
        params = common.getJDParams({ eliteId: materialId, method: app.jd_url_material, pageIndex: _this.data.pageno, pageSize: _this.data.pagesize })
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
            console.log(res.data.result_list)
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
  //分页加载数据
  loaddata: function () {
    console.log(21321321321)
    var pageNo = this.data.pageno;
    pageNo++
    this.setData({
      pageno: pageNo
    })
    this.getGoodsList()
    console.log(pageNo)
  },


})