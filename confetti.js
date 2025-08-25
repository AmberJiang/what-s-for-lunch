// confetti.js - 礼花动画效果

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// 防止双击缩放
document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, false);

// 礼花动画函数
function createConfetti(x, y, count = 50, restaurantType) {
    
    for (let i = 0; i < count; i++) {
        // 随机决定是创建confetti还是emoji
        const isEmoji = Math.random() < 0.3; // 30%的概率创建emoji
        
        if (isEmoji && restaurantType) {
            // 创建emoji元素
            const emoji = document.createElement('div');
            emoji.className = 'confetti emoji-confetti';
            emoji.textContent = getEmojiByRestaurantType(restaurantType);
            emoji.style.left = x + 'px';
            emoji.style.top = '-100px'; // 确保从屏幕上方开始
            emoji.style.animationDelay = Math.random() * 0.1 + 's'; // 减少延迟时间，避免闪现
            emoji.style.animationDuration = (Math.random() * 2 + 2) + 's';
            emoji.style.fontSize = (Math.random() * 50 + 55) + 'px'; // 75-125px的随机大小（原来的5倍）
            
            // 添加随机摇摆效果
            const sway = (Math.random() - 0.5) * 200; // -100px 到 100px 的随机摇摆
            emoji.style.setProperty('--sway', sway + 'px');
            
            document.body.appendChild(emoji);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.parentNode.removeChild(emoji);
                }
            }, 5000);
        } else {
            // 创建原有的confetti元素
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = x + 'px';
            confetti.style.top = '-100px'; // 确保从屏幕上方开始
            confetti.style.animationDelay = Math.random() * 0.1 + 's'; // 减少延迟时间，避免闪现
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            // 添加随机摇摆效果
            const sway = (Math.random() - 0.5) * 200; // -100px 到 100px 的随机摇摆
            confetti.style.setProperty('--sway', sway + 'px');
            
            document.body.appendChild(confetti);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }
}

// 只创建emoji的函数
function createEmojiOnly(x, y, count = 50, restaurantType) {
    // 获取对应类型的emoji
    const emoji = getEmojiByRestaurantType(restaurantType);
    
    for (let i = 0; i < count; i++) {
        // 创建emoji元素
        const emojiElement = document.createElement('div');
        emojiElement.className = 'confetti emoji-confetti';
        emojiElement.textContent = emoji;
        emojiElement.style.left = x + 'px';
        emojiElement.style.top = '-100px'; // 确保从屏幕上方开始
        emojiElement.style.animationDelay = Math.random() * 0.1 + 's'; // 减少延迟时间，避免闪现
        emojiElement.style.animationDuration = (Math.random() * 2 + 2) + 's';
        emojiElement.style.fontSize = (Math.random() * 50 + 55) + 'px'; // 75-125px的随机大小
        
        // 添加随机摇摆效果
        const sway = (Math.random() - 0.5) * 200; // -100px 到 100px 的随机摇摆
        emojiElement.style.setProperty('--sway', sway + 'px');
        
        document.body.appendChild(emojiElement);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.parentNode.removeChild(emojiElement);
            }
        }, 5000);
    }
}

function createConfettiExplosion(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-explosion';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        
        // 随机方向
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 100 + Math.random() * 100;
        const xOffset = Math.cos(angle) * velocity;
        const yOffset = Math.sin(angle) * velocity;
        
        confetti.style.setProperty('--x', xOffset + 'px');
        confetti.style.setProperty('--y', yOffset + 'px');
        
        document.body.appendChild(confetti);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function triggerConfetti(restaurantType) {
    // 从屏幕顶部随机位置掉落礼花
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 第一阶段：先显示爆炸礼花（只有confetti，没有emoji）
    setTimeout(() => {
        // 中央爆炸
        createConfettiExplosion(screenWidth / 2, screenHeight / 2, 30);
        
        // 左上角爆炸
        createConfettiExplosion(screenWidth * 0.2, screenHeight * 0.3, 20);
        
        // 右上角爆炸
        createConfettiExplosion(screenWidth * 0.8, screenHeight * 0.3, 20);
        
        // 左下角爆炸
        createConfettiExplosion(screenWidth * 0.2, screenHeight * 0.7, 20);
        
        // 右下角爆炸
        createConfettiExplosion(screenWidth * 0.8, screenHeight * 0.7, 20);
    }, 300);
    
    // 第二阶段：延迟显示emoji效果（只有emoji，没有confetti）
    setTimeout(() => {
        for (let i = 0; i < 4; i++) { // 从8减少到4
            const x = Math.random() * screenWidth;
            const y = -50; // 从屏幕顶部上方开始
            createEmojiOnly(x, y, 8, restaurantType); // 从15减少到8
        }
    }, 1000); // 延迟1秒后开始emoji效果
}

// 根据餐厅类型获取对应emoji
function getEmojiByRestaurantType(restaurantType) {
    // 餐厅类型到emoji的映射
    const typeToEmoji = {
        // 高德地图API类型
        '中餐厅': '🥢',
        '火锅': '🍲',
        '烧烤': '🍖',
        '快餐': '🍔',
        '日本料理': '🍣',
        '韩料': '🍜',
        '西餐': '🍴',
        '甜品': '🍰',
        '饮品': '🥤',
        '餐饮服务': '🍽️',
        
        // SAP餐厅数据分类
        '中餐': '🥢',
        '家常菜': '🥢',
        '湘菜': '🌶️',
        '川菜': '🌶️',
        '海鲜': '🦐',
        '港式': '🥤',
        '茶餐厅': '🥤',
        '越南菜': '🍜',
        '米粉': '🍜',
        '日式': '🍣',
        '烤肉': '🍖',
        '小吃': '🍢',
        '炸鸡': '🍗',
        '面食': '🍜',
        '陕西菜': '🥢',
        '轻食': '🥗'
    };
    console.log('restaurantType: ', restaurantType);
    // 模糊搜索匹配
    if (restaurantType) {
        const typeString = restaurantType.toString().toLowerCase();
        // 按优先级搜索关键词
        const searchPatterns = [
            { pattern: '日本料理', emoji: '🍣' },
            { pattern: '韩料', emoji: '🍜' },
            { pattern: '火锅', emoji: '🍲' },
            { pattern: '烧烤', emoji: '🍖' },
            { pattern: '快餐', emoji: '🍔' },
            { pattern: '甜品', emoji: '🍰' },
            { pattern: '饮品', emoji: '🥤' },
            { pattern: '中餐厅', emoji: '🥟' },
            { pattern: '中餐', emoji: '🥢' },
            { pattern: '西餐', emoji: '🍴' },
            { pattern: '湘菜', emoji: '🌶️' },
            { pattern: '川菜', emoji: '🌶️' },
            { pattern: '海鲜', emoji: '🦐' },
            { pattern: '港式', emoji: '🥤' },
            { pattern: '茶餐厅', emoji: '🥤' },
            { pattern: '越南菜', emoji: '🍜' },
            { pattern: '米粉', emoji: '🍜' },
            { pattern: '日式', emoji: '🍣' },
            { pattern: '烤肉', emoji: '🍖' },
            { pattern: '小吃', emoji: '🍢' },
            { pattern: '炸鸡', emoji: '🍗' },
            { pattern: '面食', emoji: '🍜' },
            { pattern: '陕西菜', emoji: '🥢' },
            { pattern: '轻食', emoji: '🥗' },
            { pattern: '家常菜', emoji: '🥡' }
        ];
        
        for (const { pattern, emoji } of searchPatterns) {
            if (typeString.includes(pattern.toLowerCase())) {
                return emoji;
            }
        }
    }
    
    // 如果没有找到对应的类型，返回默认emoji
    return '🍽️';
}

// 根据餐厅类型创建emoji动画
function createTypeSpecificEmoji(x, y, restaurantType, count = 20) {
    const emoji = getEmojiByRestaurantType(restaurantType);
    
    for (let i = 0; i < count; i++) {
        // 创建emoji元素
        const emojiElement = document.createElement('div');
        emojiElement.className = 'confetti emoji-confetti';
        emojiElement.textContent = emoji;
        emojiElement.style.left = x + 'px';
        emojiElement.style.top = '-100px'; // 确保从屏幕上方开始
        emojiElement.style.animationDelay = Math.random() * 0.1 + 's'; // 减少延迟时间，避免闪现
        emojiElement.style.animationDuration = (Math.random() * 2 + 2) + 's';
        emojiElement.style.fontSize = (Math.random() * 50 + 55) + 'px'; // 75-125px的随机大小
        
        // 添加随机摇摆效果
        const sway = (Math.random() - 0.5) * 200; // -100px 到 100px 的随机摇摆
        emojiElement.style.setProperty('--sway', sway + 'px');
        
        document.body.appendChild(emojiElement);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.parentNode.removeChild(emojiElement);
            }
        }, 5000);
    }
}

// 导出函数供其他文件使用
window.triggerConfetti = triggerConfetti;
window.getEmojiByRestaurantType = getEmojiByRestaurantType;
window.createTypeSpecificEmoji = createTypeSpecificEmoji;
