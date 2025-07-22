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
            } else if (currentFilter.startsWith('drinks')) {
                filteredRestaurants = restaurants.filter(r => r.categories.includes("甜品") || r.categories.includes("饮品"));
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

    const languageContent = {
    en: {
        "page-title": "My Mini-Program Portfolio",
        "name-title": "Your Name",
        "job-title": "Mini-Program Developer & Designer",
        "about-title": "About Me",
        "about-content": "I am a designer/developer passionate about creating mini-programs. Focused on simple, practical user experiences.",
        "projects-title": "My Mini-Programs",
        "project1-title": "Mini-Program 1",
        "project1-desc": "A mini-program that solves XX problem, using XX technology.",
        "project2-title": "Mini-Program 2",
        "project2-desc": "A mini-program focused on XX field, with XX features.",
        "project3-title": "Mini-Program 3",
        "project3-desc": "A mini-program designed for XX audience, solving XX pain points.",
        "view-detail": "View Details",
        "contact-text": "Contact me:",
        "copyright": "© 2023 Your Name. All rights reserved."
    },
    zh: {
        "page-title": "我的小程序作品集",
        "name-title": "你的名字",
        "job-title": "小程序开发者 & 设计师",
        "about-title": "关于我",
        "about-content": "我是一个热爱创造小程序的设计师/开发者。专注于简洁、实用的用户体验。",
        "projects-title": "我的小程序",
        "project1-title": "小程序1",
        "project1-desc": "这是一个解决XX问题的小程序，使用了XX技术。",
        "project2-title": "小程序2",
        "project2-desc": "这是一个专注于XX领域的小程序，具有XX功能。",
        "project3-title": "小程序3",
        "project3-desc": "这是一个为XX人群设计的小程序，解决了XX痛点。",
        "view-detail": "查看详情",
        "contact-text": "联系我:",
        "copyright": "© 2023 你的名字. 保留所有权利."
    }
};

// 切换语言函数
function switchLanguage(lang) {
    // 更新所有文本内容
    Object.keys(languageContent[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (key === 'page-title') {
                document.title = languageContent[lang][key];
            } else {
                element.textContent = languageContent[lang][key];
            }
        }
    });
    
    // 更新按钮激活状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${lang}-btn`).classList.add('active');
    
    // 保存语言偏好到本地存储
    localStorage.setItem('preferredLanguage', lang);
}

// 初始化语言
function initLanguage() {
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(preferredLanguage);
    
    // 添加按钮事件监听
    document.getElementById('en-btn').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('zh-btn').addEventListener('click', () => switchLanguage('zh'));
}
document.addEventListener('DOMContentLoaded', initLanguage);

});