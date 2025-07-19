// script.js - 主逻辑（使用restaurantData变量）
document.addEventListener('DOMContentLoaded', function() {
    const chooseBtn = document.getElementById('choose-btn');
    const restaurantResult = document.getElementById('restaurant-result');
    const locationResult = document.getElementById('location-result');
    const historyList = document.getElementById('history-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let history = [];
    let restaurants = restaurantData.restaurants; // 直接使用JS变量
    
    // 筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
        });
    });

    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category === 'all') {
                filteredRestaurants = restaurants;
            } else {
                filteredRestaurants = restaurants.filter(r => 
                    r.categories.includes(category)
                );
            }
        });
    });
    
    // 随机选择餐厅
    chooseBtn.addEventListener('click', function() {
        chooseBtn.disabled = true;
        chooseBtn.textContent = '选择中...';
        
        // 动画效果
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
            } else if (currentFilter.startsWith('sap')) {
                filteredRestaurants = restaurants.filter(r => r.vendor === "SAP");
            }
        }
        
        setTimeout(() => {
            if (filteredRestaurants.length === 0) {
                restaurantResult.textContent = "没有符合条件的餐厅";
                locationResult.textContent = "请尝试其他筛选条件";
            } else {
                const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
                const selected = filteredRestaurants[randomIndex];
                
                restaurantResult.textContent = selected.name;
                locationResult.textContent = selected.location;
                
                // 添加到历史记录
                history.unshift(selected.name);
                if (history.length > 5) history.pop();
                updateHistoryDisplay();
            }
            
            chooseBtn.disabled = false;
            chooseBtn.textContent = '再选一次';
        }, 1000);
    });
    
    function updateHistoryDisplay() {
        historyList.innerHTML = history.map(name => 
            `<span style="margin: 0 5px;">${name}</span>`
        ).join('');
    }
});