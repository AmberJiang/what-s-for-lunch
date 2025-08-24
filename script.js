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
    let userLocation = null; // 存储用户位置
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
                        // 保存用户位置
                        userLocation = { latitude, longitude };
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
        '#ff6b6b', '#4ecdc4', '#45b7d1', 
        '#96ceb4', '#feca57', '#ff9ff3',
        '#54a0ff', '#5f27cd', '#00d2d3'
    ];
    
    let counter = 0;

    // 快速切换显示不同的餐厅和颜色
    scrollInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
        const tempRestaurant = filteredRestaurants[randomIndex];
        restaurantResult.textContent = tempRestaurant.name;

        // 显示地址和导航提示
        locationResult.innerHTML = `
            <div style="color: #2d3748; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
                ${tempRestaurant.address}
            </div>
            <div style="font-size: 12px; color: #718096;">
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

    // 根据筛选条件显示不同的地址信息
    if (currentFilter === 'nearBy') {
        // 附近餐厅模式：显示导航按钮
        // 获取餐厅坐标（如果存在）
        const destLat = selected.location ? selected.location.split(',')[1] : null;
        const destLng = selected.location ? selected.location.split(',')[0] : null;
        
        locationResult.innerHTML = `
            <div class="address-button" onclick="showMapOptions('${selected.address}', '${selected.name}', ${destLat}, ${destLng})">
                <div style="color: #2d3748; font-size: 14px; font-weight: 500;">
                    ${selected.address}
                </div>
                <div style="color: #667eea; font-size: 12px; margin-top: 4px;">
                    点击选择地图导航
                </div>
            </div>
        `;
    } else {
        // 其他模式：只显示地址信息
        locationResult.innerHTML = `
            <div style="color: #2d3748; font-size: 14px; font-weight: 500;">
                ${selected.address}
            </div>
        `;
    }

    // 添加到历史记录
    history.unshift(selected.name);
    if (history.length > 5) history.pop();
    updateHistoryDisplay();
}

    // 生成地图导航链接
    function generateMapLinks(address, name = '', userLat = null, userLng = null, destLat = null, destLng = null) {
        let amapUrl, baiduUrl, tencentUrl;

        if (userLat && userLng) {
            // 如果有用户位置，使用导航模式
            if (destLat && destLng) {
                // 如果有目的地坐标，使用坐标导航
                amapUrl = `https://ditu.amap.com/dir?type=car&policy=2&from[name]=我的位置&from[id]=dirmyloc-from&from[adcode]=310000&from[poitype]=&from[lnglat]=${userLng},${userLat}&from[modxy]=${userLng},${userLat}&to[name]=${encodeURIComponent(name || address)}&to[lnglat]=${destLng},${destLat}&to[modxy]=${destLng},${destLat}&to[poitype]=&to[adcode]=&src=mypage&innersrc=uriapi`;
                baiduUrl = `https://map.baidu.com/poi/@${destLng},${destLat},19z?querytype=detailConInfo&da_src=shareurl`;
                tencentUrl = `https://apis.map.qq.com/uri/v1/routeplan?type=drive&from=${userLat},${userLng}&to=${destLat},${destLng}&referer=myapp`;
            } else {
                // 如果没有目的地坐标，使用地址搜索
                const cleanAddress = address.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
                amapUrl = `https://ditu.amap.com/dir?type=car&policy=2&from[name]=我的位置&from[id]=dirmyloc-from&from[adcode]=310000&from[poitype]=&from[lnglat]=${userLng},${userLat}&from[modxy]=${userLng},${userLat}&to[name]=${encodeURIComponent(cleanAddress)}&to[lnglat]=&to[modxy]=&to[poitype]=&to[adcode]=&src=mypage&innersrc=uriapi`;
                baiduUrl = `https://map.baidu.com/search/${encodeURIComponent(cleanAddress)}/@116.404,39.915,12z`;
                tencentUrl = `https://apis.map.qq.com/uri/v1/routeplan?type=drive&from=${userLat},${userLng}&to=${encodeURIComponent(cleanAddress)}&referer=myapp`;
            }
        } else {
            // 如果没有用户位置，使用搜索模式
            const cleanAddress = address.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
            amapUrl = `https://ditu.amap.com/search?query=${encodeURIComponent(cleanAddress)}&type=car&src=mypage`;
            baiduUrl = `https://map.baidu.com/search/${encodeURIComponent(cleanAddress)}/@116.404,39.915,12z`;
            tencentUrl = `https://map.qq.com/m/search?keyword=${encodeURIComponent(cleanAddress)}`;
        }

        return {
            amap: amapUrl,
            baidu: baiduUrl,
            tencent: tencentUrl
        };
    }

    // 显示地图选择弹窗
    window.showMapOptions = function(address, name = '', destLat = null, destLng = null) {
        // 传递用户位置信息和目的地坐标给地图链接生成函数
        const mapLinks = generateMapLinks(
            address, 
            name, 
            userLocation ? userLocation.latitude : null,
            userLocation ? userLocation.longitude : null,
            destLat,
            destLng
        );
        
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // 移动端：使用新的现代化选择器样式
            showModernMapSelector(address, mapLinks);
        } else {
            // 桌面端：使用现代化弹窗
            showModernMapModal(address, mapLinks);
        }
    }

    // 现代化地图选择器
    function showModernMapSelector(address, mapLinks) {
        // 创建底部弹出的选择器
        const selector = document.createElement('div');
        selector.className = 'map-selector';
        selector.innerHTML = `
            <div style="padding: 30px 20px 40px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 40px; height: 4px; background: #e2e8f0; border-radius: 2px; margin: 0 auto 20px;"></div>
                    <h3 style="margin: 0 0 10px 0; color: #2d3748; font-size: 20px; font-weight: 600;">选择地图导航</h3>
                    <div style="color: #718096; font-size: 14px; line-height: 1.5;">${address}</div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div class="map-option" data-url="${mapLinks.amap}">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #2d3748; font-size: 16px;">高德地图</div>
                            <div style="font-size: 13px; color: #718096; margin-top: 2px;">${userLocation ? '从当前位置导航' : '搜索目的地'}</div>
                        </div>
                    </div>
                    
                    <div class="map-option" data-url="${mapLinks.baidu}">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #2d3748; font-size: 16px;">百度地图</div>
                            <div style="font-size: 13px; color: #718096; margin-top: 2px;">${userLocation ? '从当前位置导航' : '搜索目的地'}</div>
                        </div>
                    </div>
                </div>
                
                <button class="cancel-btn" style="width: 100%; padding: 16px; margin-top: 20px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 12px; color: #718096; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;">取消</button>
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
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(selector);

        // 动画显示
        setTimeout(() => {
            overlay.style.opacity = '1';
            selector.classList.add('show');
        }, 10);

        // 关闭函数
        function closeMapSelector() {
            overlay.style.opacity = '0';
            selector.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                selector.remove();
            }, 300);
        }

        // 打开地图函数
        function openMap(url) {
            window.open(url, '_blank');
            closeMapSelector();
        }

        // 事件监听器
        overlay.addEventListener('click', closeMapSelector);
        
        // 地图选项点击事件
        const mapOptions = selector.querySelectorAll('.map-option');
        mapOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                const url = this.getAttribute('data-url');
                openMap(url);
            });
        });

        // 取消按钮点击事件
        const cancelBtn = selector.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            closeMapSelector();
        });

        // 阻止选择器内部点击事件冒泡
        selector.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 现代化桌面端地图弹窗
    function showModernMapModal(address, mapLinks) {
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
            backdrop-filter: blur(5px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;

        modalContent.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 22px; font-weight: 600;">选择地图导航</h3>
            <div style="margin-bottom: 25px; color: #718096; font-size: 14px; line-height: 1.5; padding: 0 20px;">${address}</div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="map-btn" data-url="${mapLinks.amap}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 14px 20px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 500; transition: all 0.3s ease;">高德地图</button>
                <button class="map-btn" data-url="${mapLinks.baidu}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 14px 20px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 500; transition: all 0.3s ease;">百度地图</button>
            </div>
            <button class="cancel-btn" style="background: #f7fafc; color: #718096; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; cursor: pointer; margin-top: 20px; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">取消</button>
        `;

        modal.className = 'map-modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 地图按钮点击事件
        const mapBtns = modalContent.querySelectorAll('.map-btn');
        mapBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                window.open(url, '_blank');
                modal.remove();
            });
        });

        // 取消按钮点击事件
        const cancelBtn = modalContent.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            modal.remove();
        });

        // 点击背景关闭弹窗
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 阻止内容区域点击事件冒泡
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 更新历史记录显示
    function updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = history.map(name =>
                `<span>${name}</span>`
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