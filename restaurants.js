// restaurants.js - 带分类的餐厅数据
const restaurantData = {
  "restaurants": [
    {
      "name": "独当一面",
      "vendor": "SAP",
      "location": "SAP L1",
      "categories": ["中餐","家常菜"]
    },
      {
      "name": "中餐",
      "vendor": "SAP",
      "location": "SAP L1",
      "categories": ["中餐","家常菜"]
    },
      {
      "name": "煲煲好",
      "vendor": "SAP",
      "location": "SAP L1",
      "categories": ["中餐","家常菜"]
    },
      {
      "name": "西餐",
      "vendor": "SAP",
      "location": "SAP L1",
      "categories": ["西餐"]
    },
    {
      "name": "宝珠酒酿酸奶",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智商业中心1层 L1 — 24",
      "categories": ["甜品", "饮品"]
    },
    {
      "name": "Wagas",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智商业中心1层646",
      "categories": ["西餐", "轻食"]
    },
    {
      "name": "胡子大厨 汇智店",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智广场B1",
      "categories": ["中餐", "家常菜"]
    },
    {
      "name": "胖哥俩肉蟹煲",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智商业中心 5 楼",
      "categories": ["中餐", "海鲜"]
    },
    {
      "name": "辣杰冰室",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智广场B1层24室",
      "categories": ["港式", "茶餐厅"]
    },
    {
      "name": "湘先生米小姐",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智广场5楼",
      "categories": ["湘菜", "中餐"]
    },
    {
      "name": "饿梨酱",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智商业中心1楼",
      "categories": ["西餐", "轻食"]
    },
    {
      "name": "PHO HONG",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智商业中心5楼",
      "categories": ["越南菜", "米粉"]
    },
    {
      "name": "山牛将",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智国际广场B1楼",
      "categories": ["日式", "烤肉"]
    },
    {
      "name": "椒锅锅",
      "vendor": "SAP Digital Meal Service",
      "location": "金科路3057号汇智国际商业中心5楼",
      "categories": ["川菜", "火锅"]
    },
    {
      "name": "老韩煸鸡",
      "vendor": "SAP Digital Meal Service",
      "location": "上海市浦东新区金科路3057号汇智国际商业中心地下一层B1-3号",
      "categories": ["小吃", "炸鸡"]
    },
    {
      "name": "秦小乖 油泼面",
      "vendor": "SAP Digital Meal Service",
      "location": "汇智国际B1（大润发对面）",
      "categories": ["面食", "陕西菜"]
    },
    {
      "name": "和府捞面",
      "vendor": "SAP Digital Meal Service",
      "location": "金科路3057号汇智国际商业中心B1层31室",
      "categories": ["面食", "中餐"]
    },
    {
      "name": "园区第六餐厅",
      "vendor": "SAP Digital Meal Service",
      "location": "亮秀路112号Y1座",
      "categories": ["食堂", "中餐"]
    },
    {
      "name": "赛百味(浦东)",
      "vendor": "SAP Digital Meal Service",
      "location": "晨晖路1000号1楼117-B",
      "categories": ["西式", "三明治"]
    },
    {
      "name": "PVG04 Coffee Bar",
      "vendor": "SAP Digital Meal Service",
      "location": "晨晖路1001号",
      "categories": ["咖啡", "饮品"]
    },
    {
      "name": "园区第五餐厅",
      "vendor": "SAP Digital Meal Service",
      "location": "晨晖路1000号",
      "categories": ["食堂", "中餐"]
    },
    {
      "name": "果之满满",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场西区GF层，美食广场内",
      "categories": ["饮品", "水果"]
    },
    {
      "name": "喜家德",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场东区GF层，西区",
      "categories": ["饺子", "中餐"]
    },
    {
      "name": "炙柒",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场1座 1W48, 天泰餐厅隔壁",
      "categories": ["日式", "寿司"]
    },
    {
      "name": "松鹤楼面馆",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场，一楼",
      "categories": ["苏式", "面食"]
    },
    {
      "name": "知鱼之味",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场B1A2N",
      "categories": ["海鲜", "中餐"]
    },
    {
      "name": "陈香贵",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场西区 GF美食广场",
      "categories": ["兰州拉面", "中餐"]
    },
    {
      "name": "不二烫捞",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场东区 GF美食广场",
      "categories": ["麻辣烫", "小吃"]
    },
    {
      "name": "胡子大厨 长泰店",
      "vendor": "SAP Digital Meal Service",
      "location": "祖冲之路1239弄7号B120-3号",
      "categories": ["中餐", "家常菜"]
    },
    {
      "name": "Blue Frog 蓝蛙",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场1座1E27",
      "categories": ["西餐", "汉堡"]
    },
    {
      "name": "小满手工粉",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场西区,GF层美食广场内",
      "categories": ["米粉", "中餐"]
    },
    {
      "name": "鱼酷",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场GF层，美食广场西区",
      "categories": ["烤鱼", "中餐"]
    },
    {
      "name": "舒味广西老友粉",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场B1",
      "categories": ["广西菜", "米粉"]
    },
    {
      "name": "马记永兰州牛肉面",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场",
      "categories": ["兰州拉面", "中餐"]
    },
    {
      "name": "肥汁米蘭香港米线",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场",
      "categories": ["港式", "米线"]
    },
    {
      "name": "王春春鸡汤饭",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场B1层",
      "categories": ["汤品", "中餐"]
    },
    {
      "name": "左庭右院",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场5座B1",
      "categories": ["火锅", "牛肉"]
    },
    {
      "name": "重庆小面",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场东区，B1 48-7室",
      "categories": ["重庆菜", "面食"]
    },
    {
      "name": "煲仔皇",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场地下一层15-3",
      "categories": ["粤菜", "煲仔饭"]
    },
    {
      "name": "点都德",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场三座二楼",
      "categories": ["粤菜", "早茶"]
    },
    {
      "name": "鑫花溪",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场GF层东区",
      "categories": ["米粉", "中餐"]
    },
    {
      "name": "巴黎贝甜",
      "vendor": "SAP Digital Meal Service",
      "location": "长泰广场",
      "categories": ["面包", "甜品"]
    }
  ]
};