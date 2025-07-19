document.addEventListener('DOMContentLoaded', function() {
    const chooseBtn = document.getElementById('choose-btn');
    const restaurantResult = document.getElementById('restaurant-result');
    const locationResult = document.getElementById('location-result');
    const historyList = document.getElementById('history-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let history = [];
    let restaurants = []; // 将从JSON加载
    
    // 加载餐厅数据
    fetch('restaurants.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data.restaurants;
            console.log('成功加载', restaurants.length, '家餐厅');
        })
        .catch(error => {
            console.error('加载餐厅数据失败:', error);
            // 使用默认数据以防JSON加载失败
            restaurants = [
                {
                    "name": "宝珠酒酿酸奶",
                    "vendor": "SAP Digital Meal Service",
                    "location": "汇智商业中心1层 L1 — 24"
                },
                // 其他默认数据...
            ];
        });
    
    // 筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
        });
    });
    
    // 随机选择餐厅
    chooseBtn.addEventListener('click', function() {
        if (restaurants.length === 0) {
            restaurantResult.textContent = "数据加载中...";
            return;
        }
        
        chooseBtn.disabled = true;
        chooseBtn.textContent = '选择中...';
        
        // 添加动画效果
        restaurantResult.textContent = '...';
        locationResult.textContent = '正在寻找最佳选择';
        
        // 筛选餐厅
        let filteredRestaurants = restaurants;
        if (currentFilter !== 'all') {
            if (currentFilter === 'vendor') {
                filteredRestaurants = restaurants.filter(r => r.vendor === "SAP Digital Meal Service");
            } else if (currentFilter.startsWith('location:')) {
                const locationKeyword = currentFilter.split(':')[1];
                filteredRestaurants = restaurants.filter(r => r.location.includes(locationKeyword));
            }
        }
        
        // 模拟思考过程
        setTimeout(() => {
            if (filteredRestaurants.length === 0) {
                restaurantResult.textContent = "没有符合条件的餐厅";
                locationResult.textContent = "请尝试其他筛选条件";
            } else {
                const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
                const selectedRestaurant = filteredRestaurants[randomIndex];
                
                // 显示结果
                restaurantResult.textContent = selectedRestaurant.name;
                locationResult.textContent = selectedRestaurant.location;
                
                // 添加到历史记录
                addToHistory(selectedRestaurant.name);
            }
            
            chooseBtn.disabled = false;
            chooseBtn.textContent = '再选一次';
        }, 1000);
    });
    
    // 添加到历史记录
    function addToHistory(restaurantName) {
        history.unshift(restaurantName);
        if (history.length > 5) {
            history.pop();
        }
        updateHistoryDisplay();
    }
    
    // 更新历史记录显示
    function updateHistoryDisplay() {
        historyList.innerHTML = history.map(name => 
            `<span style="margin: 0 5px;">${name}</span>`
        ).join('');
    }
});