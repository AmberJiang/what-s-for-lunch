// script.js - 主逻辑（使用restaurantData变量）
document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('action-btn');
    const restaurantResult = document.getElementById('restaurant-result');
    const locationResult = document.getElementById('location-result');
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
                    console.log(`找到 ${restaurants.length} 家餐厅`);
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
                const excludeKeywords = ['咖啡','熟食','早餐','食堂', '鸭脖', '奶茶', '甜品', '蛋糕', '面包', '饮品', '酒吧', '夜宵', 'cafe', 'coffee', 'tea'];
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
            const locationKeyword = currentFilter.split(':')[1];
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

        // 显示地址和导航提示
        locationResult.innerHTML = `
            <div style="color: #333; font-size: 14px; margin-bottom: 8px;">
                📍 ${tempRestaurant.address}
            </div>
            <div style="font-size: 12px; color: #666;">
                选择完成后点击地址进行导航
            </div>
        `;

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

    // 将地址显示为可点击的按钮
    locationResult.innerHTML = `
        <div class="address-button" style="cursor: pointer; padding: 10px; border: 2px solid #007cc0; border-radius: 8px; background: #f8f9fa; transition: all 0.3s;" onclick="showMapOptions('${selected.address}', '${selected.name}')">
            <div style="color: #333; font-size: 14px; font-weight: 500;">
                📍 ${selected.address}
            </div>
            <div style="color: #007cc0; font-size: 12px; margin-top: 4px;">
                点击选择地图导航
            </div>
        </div>
    `;

    // 添加悬停效果
    const addressButton = locationResult.querySelector('.address-button');
    addressButton.addEventListener('mouseenter', function() {
        this.style.background = '#e3f2fd';
        this.style.borderColor = '#009DE0';
        this.style.transform = 'translateY(-2px)';
    });
    addressButton.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
        this.style.borderColor = '#007cc0';
        this.style.transform = 'translateY(0)';
    });

    // 添加到历史记录
    history.unshift(selected.name);
    if (history.length > 5) history.pop();
    updateHistoryDisplay();
}

    // 生成地图导航链接
    function generateMapLinks(address, name = '') {
        // 清理地址中的特殊字符
        const cleanAddress = address.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');

        // 高德地图链接
        const amapUrl = `https://uri.amap.com/navigation?to=${encodeURIComponent(cleanAddress)}&mode=car&policy=1&src=mypage&coordinate=gaode`;

        // 百度地图链接
        const baiduUrl = `https://map.baidu.com/search/${encodeURIComponent(cleanAddress)}/@116.404,39.915,12z`;

        // 腾讯地图链接
        const tencentUrl = `https://map.qq.com/m/search?keyword=${encodeURIComponent(cleanAddress)}`;

        return {
            amap: amapUrl,
            baidu: baiduUrl,
            tencent: tencentUrl
        };
    }

    // 显示地图选择弹窗
    window.showMapOptions = function(address, name = '') {
        const mapLinks = generateMapLinks(address, name);
        
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // 移动端：使用原生选择器样式
            showMobileMapSelector(address, mapLinks);
        } else {
            // 桌面端：使用原有弹窗
            showDesktopMapModal(address, mapLinks);
        }
    }

    // 移动端地图选择器
    function showMobileMapSelector(address, mapLinks) {
        // 创建底部弹出的选择器
        const selector = document.createElement('div');
        selector.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: white;
            border-radius: 15px 15px 0 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateY(100%);
            transition: transform 0.3s ease-out;
        `;

        selector.innerHTML = `
            <div style="padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 40px; height: 4px; background: #ddd; border-radius: 2px; margin: 0 auto 15px;"></div>
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">选择地图导航</h3>
                    <div style="color: #666; font-size: 14px;">${address}</div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button onclick="openMap('${mapLinks.amap}')" style="display: flex; align-items: center; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; cursor: pointer; font-size: 16px; text-align: left;">
                        <span style="color: white; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">🗺️</span>
                        <div>
                            <div style="font-weight: 500; color: #333;">高德地图</div>
                            <div style="font-size: 12px; color: #666;">导航到目的地</div>
                        </div>
                    </button>
                    
                    <button onclick="openMap('${mapLinks.baidu}')" style="display: flex; align-items: center; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; cursor: pointer; font-size: 16px; text-align: left;">
                        <span style=" color: white; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">🗺️</span>
                        <div>
                            <div style="font-weight: 500; color: #333;">百度地图</div>
                            <div style="font-size: 12px; color: #666;">搜索并导航</div>
                        </div>
                    </button>
                    
                    <button onclick="openMap('${mapLinks.tencent}')" style="display: flex; align-items: center; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; cursor: pointer; font-size: 16px; text-align: left;">
                        <span style=" color: white; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">🗺️</span>
                        <div>
                            <div style="font-weight: 500; color: #333;">腾讯地图</div>
                            <div style="font-size: 12px; color: #666;">移动端优化</div>
                        </div>
                    </button>
                </div>
                
                <button onclick="closeMapSelector()" style="width: 100%; padding: 15px; margin-top: 15px; background: #f5f5f5; border: none; border-radius: 12px; color: #666; font-size: 16px; cursor: pointer;">取消</button>
            </div>
        `;

        // 添加背景遮罩
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(selector);

        // 动画显示
        setTimeout(() => {
            overlay.style.opacity = '1';
            selector.style.transform = 'translateY(0)';
        }, 10);

        // 点击背景关闭
        overlay.addEventListener('click', closeMapSelector);
        
        // 全局函数
        window.closeMapSelector = function() {
            overlay.style.opacity = '0';
            selector.style.transform = 'translateY(100%)';
            setTimeout(() => {
                overlay.remove();
                selector.remove();
            }, 300);
        };

        window.openMap = function(url) {
            window.open(url, '_blank');
            closeMapSelector();
        };
    }

    // 桌面端地图弹窗
    function showDesktopMapModal(address, mapLinks) {
        // 创建弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            max-width: 300px;
            width: 90%;
        `;

        modalContent.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">选择地图导航</h3>
            <div style="margin-bottom: 15px; color: #666; font-size: 14px; width: 220px; height: 32px; line-height: 32px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: auto; margin-right: auto;">${address}</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="window.open('${mapLinks.amap}', '_blank')" style="color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">🗺️ 高德地图</button>
                <button onclick="window.open('${mapLinks.baidu}', '_blank')" style=" color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">🗺️ 百度地图</button>
                <button onclick="window.open('${mapLinks.tencent}', '_blank')" style=" color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 16px;">🗺️ 腾讯地图</button>
            </div>
            <button onclick="this.closest('.map-modal').remove()" style="background: #ccc; color: #333; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 15px; font-size: 14px;">取消</button>
        `;

        modal.className = 'map-modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 点击背景关闭弹窗
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
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