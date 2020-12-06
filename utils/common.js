var md5 = require('md5')
var util = require('util')
var app = getApp();

/* 获取淘宝参数（公共+请求）
materialId:物料id，
pageNo：第几页
pageSize：一页共几条数据
*/
function getTBParams(p) {
  var publicParams = {
    method: p.method,
    v: "2.0",
    timestamp: YYYYMMDDHHmmss(),
    app_key: app.tb_app_key,
    sign_method: "md5",
    format: "json",
    simplify: true,
    adzone_id: app.tb_adzone_id,
    material_id: p.materialId,
    page_no: p.pageNo,
    page: p.pageSize,
    num_iids: p.item_id,//查询商品详情使用
    //淘口令专用 text:字符必须大于5，url要转化为口令的目标链接
    text: p.text,
    url: p.url,
  };
  publicParams.sign = getSign(publicParams, app.tb_app_secret);//签名一定放在所有参数最下方
  return publicParams;
}
/*获取拼多多参数（公共+请求）
catId：物料id
pageNo:页数
pageSize：一页共几条数据
  */
function getPDDParams(p) {
  var publicParams = {
    // channel_type:"0",
    cat_id: p.cat_id,
    channel_type: p.channel_type,//[猜你喜欢场景]分类使用时必须是4
    type: p.method,//子url，请求链接
    client_id: app.pdd_client_id,
    timestamp: util.getUnixTime(),
    data_type: "JSON",
    version: "V1",
    limit: p.pageSize,
    goods_sign: p.goods_sign,//商品详情页-goods_sign
    offset: p.pageNo * p.pageSize,
    p_id: p.p_id,//推广位id* 推广劵用
  }
  publicParams.sign = getSign(publicParams, app.pdd_client_secret);//签名一定放在所有参数最下方

  return publicParams;
}

/*获取京东（公共+请求）
param_json：请求参数，物料与详情页不同
  */
function getJDParams(p) {
  var new_param_json = ""
  if (p.skuIds == null) {
    new_param_json = JSON.stringify({ "goodsReq": { "eliteId": p.eliteId, "pageIndex": p.pageIndex, "pageSize": p.pageSize } })
  } else {
    new_param_json = JSON.stringify({ "goodsReq": { "eliteId": p.eliteId, "pageIndex": p.pageIndex, "pageSize": p.pageSize } })
  }
  var publicParams = {
    param_json: new_param_json,
    method: p.method,
    app_key: app.jd_appkey,
    timestamp: YYYYMMDDHHmmss(),
    format: "json",
    v: "1.0",
    sign_method: "md5",
  }
  publicParams.sign = getSign(publicParams, app.jd_secretkey);
  // publicParams.param_json=;
  //签名一定放在所有参数最下方
  return publicParams;
}

// 假设app的secret为helloworld，则签名结果为：hex(md5(helloworld+按顺序拼接好的参数名与参数值+helloworld)) = “66987CB115214E59E6EC978214934FB8”
function getSign(params, url_secret) {
  var url_secret = url_secret;
  //根据ascii把api参数排序
  var sorted = Object.keys(params).sort();

  var basestring = url_secret
  for (var i = 0, l = sorted.length; i < l; i++) {
    var k = sorted[i];
    basestring += k + params[k];
  }
  basestring += url_secret
  console.log("sign加密前:" + basestring)
  var signStr = md5(basestring);
  signStr = signStr.toUpperCase();
  // console.log(basestring)
  return signStr;
}


//获取当前时间戳
function YYYYMMDDHHmmss(d, options) {
  d = d || new Date();
  if (!(d instanceof Date)) {
    d = new Date(d);
  }

  var dateSep = '-';
  var timeSep = ':';
  if (options) {
    if (options.dateSep) {
      dateSep = options.dateSep;
    }
    if (options.timeSep) {
      timeSep = options.timeSep;
    }
  }
  var date = d.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  var month = d.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var hours = d.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  var mintues = d.getMinutes();
  if (mintues < 10) {
    mintues = '0' + mintues;
  }
  var seconds = d.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return d.getFullYear() + dateSep + month + dateSep + date + ' ' +
    hours + timeSep + mintues + timeSep + seconds;
};
/* 
封装数据
res:网络数据
type:平台类型 0:淘宝 1:拼多多 2:京东
*/
function packData(res, type) {
  var oldList
  var newList = []
  switch (type) {
    case 0:
      oldList = res.data.result_list
      break
    case 1:
      oldList = res.data.goods_basic_detail_response.list
      break
    case 2:
      var res = res.data.jd_union_open_goods_jingfen_query_response.result
      oldList = JSON.parse(res).data
      break
  }
  for (var i = 0; i < oldList.length; i++) {
    var oItem = oldList[i];
    //console.log(oItem)
    switch (type) {
      case 0:
        newList[i] = tb2(oItem)
        break
      case 1:
        newList[i] = pdd2Tb(oItem)
        break
      case 2:
        newList[i] = jd2Tb(oItem)
        break
    }
  }
  return newList;
}
//淘宝自转
function tb2(o) {
  var data = {
    pict_url: o.pict_url,//列表缩略图
    title: o.title,//商品名字
    nick: o.nick,//商家
    reserve_price: o.reserve_price,//原价
    zk_final_price: o.zk_final_price,//最终价格
    volume: o.volume,//已售
    item_id: o.item_id,//商品签名（目前只用于拼多多）
    small_images: o.small_images,//图片数组
    coupon_click_url: encodeURIComponent("https:" + o.coupon_click_url),//淘口令链接*
    localIcon: "../../img/nick_tb.png",//本地小图标，放在详情页-店铺前
  }
  data.others = JSON.stringify(data)
  //console.log("others:"+data.coupon_click_url)
  return data
}
//京东参数名转化成淘宝的参数名，统一参数名
function jd2Tb(o) {
  var imageList = []
  var i
  for (i in o.imageInfo.imageList) {
    imageList[i] = o.imageInfo.imageList[i].url
  }
  var data = {
    pict_url: o.imageInfo.imageList[0].url,//列表缩略图
    title: o.skuName,//商品名字
    nick: o.shopInfo.shopName,//商家
    reserve_price: o.priceInfo.price,//原价
    zk_final_price: o.priceInfo.lowestCouponPrice == null ? o.priceInfo.lowestPrice : o.priceInfo.lowestCouponPrice,//最终价格
    volume: o.inOrderCount30Days,//已售
    item_id: o.skuId,//商品签名（目前只用于拼多多）
    small_images: imageList,//图片数组
    localIcon: "../../img/nick_jd.png",//本地小图标，放在详情页-店铺前
    // others:others
  }
  data.others = JSON.stringify(data)//京东详情页传参
  return data
}
//拼多多参数名转化成淘宝的参数名，统一参数名
function pdd2Tb(o) {
  //计算最终价格
  var final_price = (o.min_group_price - o.coupon_discount) / 100
  final_price = final_price.toFixed(2)
  //计算原价并保留两位小数
  var reserve_price = o.min_group_price / 100
  reserve_price = reserve_price.toFixed(2)

  var data = {
    pict_url: o.goods_thumbnail_url,//列表缩略图
    title: o.goods_name,//商品名字
    nick: o.mall_name,//商家
    reserve_price: reserve_price,//原价
    zk_final_price: final_price,//最终价格
    volume: o.sales_tip,//已售
    item_id: o.goods_sign,//商品签名（目前只用于拼多多）
    small_images: o.goods_gallery_urls,//图片数组
    localIcon: "../../img/nick_pdd.png",//本地小图标，放在详情页-店铺前
  }
  data.others = JSON.stringify(data)
  return data
}

module.exports = {
  getSign: getSign,
  YYYYMMDDHHmmss: YYYYMMDDHHmmss,
  getTBParams: getTBParams,
  getPDDParams: getPDDParams,
  packData: packData,
  pddToTb: pdd2Tb,
  getJDParams: getJDParams,
  jdToTb: jd2Tb,
}
