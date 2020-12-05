//app.js
App({
  /* 
  淘宝api
  */
  tb_app_key:"31704442",
  tb_adzone_id:"109723850182",
  tb_app_secret: "4f615cc2c598d6db7ced076a284cf255",
  tb_url_base:"https://eco.taobao.com/router/rest",
  //商品列表
  tb_url_material:"taobao.tbk.dg.optimus.material",
  //详情页-item_id
  tb_url_detail:"taobao.tbk.item.info.get",
  //淘口令
  tb_url_coupon:"taobao.tbk.tpwd.create",

  /* 拼多多api
  pdd.ddk.goods.recommend.get- 
  cat_id：
  猜你喜欢场景的商品类目，20100-百货，20200-母婴，20300-食品，20400-女装，20500-电器，20600-鞋包，20700-内衣，20800-美妆，20900-男装，21000-水果，21100-家纺，21200-文具,21300-运动,21400-虚拟,21500-汽车,21600-家装,21700-家具,21800-医药;
  channel_type：
  0-1.9包邮, 1-今日爆款, 2-品牌清仓,3-相似商品推荐,4-猜你喜欢,5-实时热销,6-实时收益,7-今日畅销,8-高佣榜单，默认1
  */
  pdd_client_id:"3dc3f91840f2432d817b714819d4d672",
  pdd_client_secret:"1fdb0d823270f2321c975d10b2c60995e2a5e818",
  pdd_url_base:"https://gw-api.pinduoduo.com/api/router",
  pdd_p_id:"13848281_182717030",//推广位id
  //商品列表
  pdd_url_material:"pdd.ddk.goods.recommend.get",
  //商品详情页-goods_sign
  pdd_url_detail:"pdd.ddk.goods.detail",
  //淘口令
  pdd_url_coupon:"pdd.ddk.goods.promotion.url.generate",


  /* 京东api
  jd.union.open.goods.material.query:
  频道ID(eliteId)：1-好券商品,2-精选卖场,10-9.9包邮,15-京东配送,22-实时热销榜,23-为你推荐,24-数码家电,25-超市,26-母婴玩具,27-家具日用,28-美妆穿搭,30-图书文具,31-今日必推,32-京东好物,33-京东秒杀,34-拼购商品,40-高收益榜,41-自营热卖榜,108-秒杀进行中,109-新品首发,110-自营,112-京东爆品,125-首购商品,129-高佣榜单,130-视频商品,153-历史最低价商品榜，210-极速版商品
  */
  jd_appkey:"7b5d2f57ba396f05c9b1af6ecf5547e4",
  jd_secretkey:"195981d7339b4c3d9deb9ae2adf86691",
  jd_pid:"1003648498_4100101027_3003158896",//联盟id_应用iD_推广位id
  jd_url_base:"https://router.jd.com/api",
  //商品列表
  jd_url_material:"jd.union.open.goods.material.query",
  //商品详情页-skuIds
  jd_url_detail:"jd.union.open.goods.query",
  
  onLaunch(){
    console.log("app onshow")
  }
})