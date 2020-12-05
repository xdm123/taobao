// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      
    },
    detached: function () {
      
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleBarData: [
      { name: "淘宝", id: 0, isActive: true ,desc:"万千好物淘不停"},
      { name: "拼多多", id: 1, isActive: false ,desc:"新电商开创者"},//initId=今日爆款
      { name: "京东", id: 2, isActive: false,desc:"只为品质生活"},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    titleItemTap(e) {
      const { index } = e.currentTarget.dataset
      let { titleBarData } = this.data
      //子向父传参数
      this.triggerEvent("itemChange", { index})
      titleBarData.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
      this.setData({
        titleBarData
      })
    },
  }
})
