document.addEventListener('DOMContentLoaded', function() {
    const chooseBtn = document.getElementById('choose-btn');
    const foodResult = document.getElementById('food-result');
    const foodReason = document.getElementById('food-reason');
    const historyList = document.getElementById('history-list');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    let currentCategory = 'all';
    let history = [];
    
    // 分类按钮点击事件
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
        });
    });
    
    // 随机选择食物
    chooseBtn.addEventListener('click', function() {
        chooseBtn.disabled = true;
        chooseBtn.textContent = '选择中...';
        
        // 添加动画效果
        foodResult.textContent = '...';
        foodReason.textContent = '正在思考最佳选择';
        
        // 筛选当前分类的食物
        let filteredFoods = foods;
        if (currentCategory !== 'all') {
            filteredFoods = foods.filter(food => food.categories.includes(currentCategory));
        }
        
        // 模拟思考过程
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * filteredFoods.length);
            const selectedFood = filteredFoods[randomIndex];
            
            // 显示结果
            foodResult.textContent = selectedFood.name;
            foodReason.textContent = getRandomReason(selectedFood);
            
            // 添加到历史记录
            addToHistory(selectedFood.name);
            
            chooseBtn.disabled = false;
            chooseBtn.textContent = '再选一次';
        }, 1000);
    });
    
    // 添加到历史记录
    function addToHistory(foodName) {
        history.unshift(foodName);
        if (history.length > 5) {
            history.pop();
        }
        updateHistoryDisplay();
    }
    
    // 更新历史记录显示
    function updateHistoryDisplay() {
        historyList.innerHTML = history.map(food => 
            `<span style="margin: 0 5px;">${food}</span>`
        ).join('');
    }
    
    // 随机推荐理由
    function getRandomReason(food) {
        const reasons = [
            `今天适合吃${food.spicy ? '辣' : '不辣'}的`,
            `最近${food.healthy ? '需要' : '不需要'}注意健康`,
            `这个${food.time < 30 ? '快速' : '需要时间'}准备`,
            `营养搭配: ${food.nutrition.join('+')}`,
            `特别适合${food.weather || '任何'}天气`
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
});