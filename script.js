// script.js - 主逻辑（使用restaurantData变量）
document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('action-btn');
    const restaurantResult = document.getElementById('restaurant-result');
    const locationResult = document.getElementById('location-result');
    const historyList = document.getElementById('history-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'nearBy';
    let history = [];
    let restaurants = []; //附近的餐厅
    let SAPrestaurants = [];  // SAP 餐厅，hard code 直接使用JS变量 
    let scrollInterval;
    let isChoosing = false;
    let filteredRestaurants = [];
    const API_KEY = "5b7a909260fb6be98abcbfd47dd3f324"; 

    async function getLocation()  {

    if (!navigator.geolocation) {
    alert("浏览器不支持地理位置 API");
    return;
    }
     const permission = await navigator.permissions.query({ name: 'geolocation' });
    if (permission.state === 'denied') {
        alert("请前往浏览器设置允许定位权限！");
        return;
    }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("位置:",latitude, longitude);
                         getNearbyRestaurants(latitude, longitude);
                    },
                    (error) => {
                        alert("获取位置失败：" + error.message);
                    }
                );
            } else {
                alert("浏览器不支持地理位置 API");
            }
        }

   async function getNearbyRestaurants(lat, lng) {
            const url = `https://restapi.amap.com/v3/place/around?key=${API_KEY}&location=${lng},${lat}&radius=1000&types=050000&offset=20`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();          
                
                if (data.status === "1" && data.pois) {                  
                    restaurants = data.pois;
                    document.getElementById("action-btn").disabled = false;
                    
                    // 示例筛选逻辑
                    const lunchRestaurants = data.pois.filter(poi => {
                        const name = poi.name.toLowerCase();
                        const type = poi.type || '';
                        
                        // 排除咖啡店、奶茶店等
                        const excludeKeywords = ['咖啡', '奶茶', '甜品', '蛋糕', '面包', '饮品', '酒吧'];
                        const hasExcludeKeyword = excludeKeywords.some(keyword => 
                            name.includes(keyword) || type.includes(keyword)
                        );
                        
                        // 包含午餐相关关键词
                        const includeKeywords = ['餐厅', '饭店', '快餐', '火锅', '烧烤', '面馆', '粥店'];
                        const hasIncludeKeyword = includeKeywords.some(keyword => 
                            type.includes(keyword)
                        );
                        
                        return !hasExcludeKeyword && hasIncludeKeyword;
                    });
                    
                    lunchRestaurants.forEach((restaurant, index) => {
                        console.log(`午餐餐厅 ${index + 1}: ${restaurant.name} (${restaurant.type})`);
                    });
                    
                } else {
                    alert("未找到附近餐厅");
                }
            } catch (error) {
                alert("API 请求失败：" + error);
            }
        }

    function filterRestaurants() {
        if (currentFilter === 'nearBy') {
            getLocation();
            if (restaurants.length === 0) {
                alert("请先允许定位权限");
                return;
            }   
            
            // 对附近餐厅进行筛选，排除非午饭选项
            filteredRestaurants = restaurants.filter(poi => {
                const name = poi.name.toLowerCase();
                const type = poi.type || '';
                
                // 排除咖啡店、奶茶店等非午饭选项
                const excludeKeywords = ['咖啡', '奶茶', '甜品', '蛋糕', '面包', '饮品', '酒吧', '夜宵', 'cafe', 'coffee', 'tea'];
                const hasExcludeKeyword = excludeKeywords.some(keyword => 
                    name.includes(keyword) || type.includes(keyword)
                );
                
                // 包含午餐相关关键词
                const includeKeywords = ['餐厅', '饭店', '食堂', '快餐', '火锅', '烧烤', '面馆', '粥店', 'restaurant', 'food'];
                const hasIncludeKeyword = includeKeywords.some(keyword => 
                    name.includes(keyword) || type.includes(keyword)
                );
                
                // 如果名称中没有明确的排除关键词，且包含午餐关键词，则保留
                return !hasExcludeKeyword && hasIncludeKeyword;
            });
            
            console.log(`筛选后剩余 ${filteredRestaurants.length} 家午餐餐厅`);
            return;
        }

        SAPrestaurants =restaurantData.restaurants;
        if (currentFilter === 'all') {
        // 筛选全部时排除饮品和甜品
        filteredRestaurants = SAPrestaurants.filter(r => 
            !r.categories.includes("饮品") && 
            !r.categories.includes("甜品")
        )        } else if (currentFilter === 'vendor') {
            filteredRestaurants = SAPrestaurants.filter(r => r.vendor === "SAP Digital Meal Service");
        } else if (currentFilter.startsWith('address:')) {
            const locationKeyword = SAPrestaurants.split(':')[1];
            filteredRestaurants = SAPrestaurants.filter(r => r.address.includes(locationKeyword));
        } else if (currentFilter.startsWith('category:')) {
            const category = currentFilter.split(':')[1];
            filteredRestaurants = SAPrestaurants.filter(r => r.categories.includes(category));
        }  else if (currentFilter.startsWith('drinks')) {
            filteredRestaurants = SAPrestaurants.filter(r => r.categories.includes("甜品") || r.categories.includes("饮品"));
        }  else if (currentFilter.startsWith('sap')) {
            filteredRestaurants = SAPrestaurants.filter(r => r.vendor === "SAP");
        }
    }

    // 开始滚动效果
    function startChoosing() {
        if (filteredRestaurants.length === 0) {
            restaurantResult.textContent = "没有符合条件的餐厅";
            locationResult.textContent = "请尝试其他筛选条件";
            return;
        }

        isChoosing = true;
        actionBtn.textContent = "停止选择";
        actionBtn.classList.add('choosing');
        restaurantResult.classList.add('scrolling');
        
         // 预定义颜色数组
    const colors = [
        '#FF5252', '#FF9800', '#FFEB3B', 
        '#4CAF50', '#2196F3', '#9C27B0',
        '#E91E63', '#00BCD4', '#673AB7'
    ];
    
    let counter = 0;

    // 快速切换显示不同的餐厅和颜色
    scrollInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
        const tempRestaurant = filteredRestaurants[randomIndex];
        restaurantResult.textContent = tempRestaurant.name;
        locationResult.textContent = "选择中...";
        
        // 动态改变颜色
        restaurantResult.style.color = colors[counter % colors.length];
        counter++;
    }, 100); // 调整这个值可以改变滚动速度
    }

    // 停止滚动并显示结果
function stopChoosing() {
    clearInterval(scrollInterval);
    isChoosing = false;
    actionBtn.textContent = "再选一次";
    actionBtn.classList.remove('choosing');
    restaurantResult.classList.remove('scrolling');
    
    // 移除内联颜色样式，使用默认样式
    restaurantResult.style.color = '';
    
    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
    const selected = filteredRestaurants[randomIndex];
    
    restaurantResult.textContent = selected.name;
    locationResult.textContent = selected.address;
    
    // 添加到历史记录
    history.unshift(selected.name);
    if (history.length > 5) history.pop();
    updateHistoryDisplay();
}

    // 更新历史记录显示
    function updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = history.map(name => 
                `<span style="margin: 0 5px;">${name}</span>`
            ).join('');
        }
    }

    // 筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterRestaurants();
        });
    });
    
    // 主按钮点击事件
    actionBtn.addEventListener('click', function() {
        if (isChoosing) {
            stopChoosing();
        } else {
            filterRestaurants();
            startChoosing();
        }
    });
});