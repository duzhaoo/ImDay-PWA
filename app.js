// 全局变量
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
let currentCountdownId = null;

// 页面导航函数
function showListPage() {
    document.getElementById('listPage').classList.remove('hidden');
    document.getElementById('createPage').classList.add('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    renderCountdowns();
}

function showCreatePage() {
    document.getElementById('listPage').classList.add('hidden');
    document.getElementById('createPage').classList.remove('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    
    // 清空表单
    document.getElementById('title').value = '';
    document.getElementById('date').value = '';
    
    // 更新预览
    updatePreview();
    
    // 添加输入事件监听
    document.getElementById('title').addEventListener('input', updatePreview);
    document.getElementById('date').addEventListener('change', updatePreview);
}

function showDetailPage(id) {
    currentCountdownId = id;
    const countdown = countdowns.find(c => c.id === id);
    if (!countdown) return;
    
    document.getElementById('listPage').classList.add('hidden');
    document.getElementById('createPage').classList.add('hidden');
    document.getElementById('detailPage').classList.remove('hidden');
    
    // 更新详情页内容
    document.getElementById('detailMainTitle').textContent = countdown.title;
    const days = calculateDays(countdown.date);
    document.getElementById('detailDays').textContent = Math.abs(days);
    document.getElementById('detailLabel').textContent = getDaysText(days);
    document.getElementById('detailDate').textContent = formatDate(countdown.date);
    
    // 设置详情页颜色
    const detailDays = document.getElementById('detailDays');
    if (days > 30) {
        detailDays.style.color = '#4A90E2';
    } else if (days > 7) {
        detailDays.style.color = '#FF9500';
    } else if (days >= 0) {
        detailDays.style.color = '#FF3B30';
    } else {
        detailDays.style.color = '#8E8E93';
    }
}

// 保存倒数日
function saveCountdown() {
    const title = document.getElementById('titleInput').value.trim();
    const date = document.getElementById('dateInput').value;
    
    if (!title || !date) {
        showToast('请填写完整信息');
        return;
    }
    
    const countdown = {
        id: Date.now(),
        title: title,
        date: date
    };
    
    countdowns.push(countdown);
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    
    showToast('保存成功');
    showListPage();
}

// 日期快捷按钮功能
function setDateShortcut(days) {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);
    
    const dateString = targetDate.toISOString().split('T')[0];
    document.getElementById('dateInput').value = dateString;
    
    updatePreview();
}

// 更新预览功能
function updatePreview() {
    const title = document.getElementById('titleInput').value.trim() || '我的纪念日';
    const date = document.getElementById('dateInput').value;
    
    const previewTitle = document.querySelector('.preview-title');
    const previewDays = document.querySelector('.preview-days');
    const previewLabel = document.querySelector('.preview-label');
    const previewDate = document.querySelector('.preview-date');
    
    if (previewTitle) previewTitle.textContent = title;
    
    if (date) {
        const days = calculateDays(date);
        const daysText = getDaysText(days);
        
        if (previewDays) previewDays.textContent = Math.abs(days);
        if (previewLabel) previewLabel.textContent = daysText;
        if (previewDate) previewDate.textContent = formatDate(date);
    } else {
        if (previewDays) previewDays.textContent = '0';
        if (previewLabel) previewLabel.textContent = '选择日期';
        if (previewDate) previewDate.textContent = '请选择一个日期';
    }
}



class CountdownApp {
    constructor() {
        this.init();
    }

    init() {
        renderCountdowns();
    }

}

// 工具函数
function calculateDays(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    
    // 设置时间为当天的开始
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getDaysText(days) {
    if (days > 0) {
        return '还有';
    } else if (days === 0) {
        return '今天';
    } else {
        return '已过去';
    }
}

function getCardClass(days) {
    if (days > 30) {
        return 'blue';
    } else if (days > 7) {
        return 'orange';
    } else {
        return 'gray';
    }
}

function getSubtitle(countdown) {
    const date = new Date(countdown.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 渲染倒数日列表
function renderCountdowns() {
    const container = document.getElementById('countdowns');
    
    if (countdowns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>还没有倒数日</h3>
                <p>点击右上角的 + 号<br>创建你的第一个倒数日</p>
            </div>
        `;
        return;
    }

    // 按日期排序，最近的日期在前
    const sortedCountdowns = [...countdowns].sort((a, b) => {
        const daysA = calculateDays(a.date);
        const daysB = calculateDays(b.date);
        
        // 未来的日期优先，然后按天数升序
        if (daysA >= 0 && daysB >= 0) {
            return daysA - daysB;
        } else if (daysA >= 0) {
            return -1;
        } else if (daysB >= 0) {
            return 1;
        } else {
            return daysB - daysA; // 过去的日期按天数降序
        }
    });

    container.innerHTML = sortedCountdowns.map(countdown => {
        const days = calculateDays(countdown.date);
        const cardClass = getCardClass(days);
        const subtitle = getSubtitle(countdown);
        
        return `
            <div class="countdown-card ${cardClass}" onclick="showDetailPage(${countdown.id})">
                <div class="countdown-info">
                    <div class="countdown-title">${countdown.title}</div>
                    <div class="countdown-subtitle">${subtitle}</div>
                </div>
                <div class="countdown-days-container">
                    <div class="countdown-days">${Math.abs(days)}</div>
                    <div class="countdown-label">天</div>
                </div>
            </div>
        `;
    }).join('');
}

// 保存数据到本地存储
function saveCountdowns() {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
}

// 显示提示消息
function showToast(message) {
    // 创建简单的提示
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    toast.textContent = message;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
        document.head.removeChild(style);
    }, 2000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderCountdowns();
});