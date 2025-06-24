// 全局变量
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
let currentCountdownId = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    renderCountdowns();
});

// 显示列表页面
function showListPage() {
    document.getElementById('listPage').classList.remove('hidden');
    document.getElementById('createPage').classList.add('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    renderCountdowns();
}

// 显示创建页面
function showCreatePage() {
    document.getElementById('listPage').classList.add('hidden');
    document.getElementById('createPage').classList.remove('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    
    // 清空表单
    document.getElementById('titleInput').value = '';
    document.getElementById('dateInput').value = '';
}

// 显示详情页面
function showDetailPage(id) {
    const countdown = countdowns.find(c => c.id === id);
    if (!countdown) return;
    
    currentCountdownId = id;
    
    document.getElementById('listPage').classList.add('hidden');
    document.getElementById('createPage').classList.add('hidden');
    document.getElementById('detailPage').classList.remove('hidden');
    
    // 设置详情页内容
    document.getElementById('detailMainTitle').textContent = countdown.title;
    
    const targetDate = new Date(countdown.date);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('detailDays').textContent = Math.abs(diffDays);
    document.getElementById('detailDate').textContent = formatDate(countdown.date);
}

// 保存倒数日
function saveCountdown() {
    const title = document.getElementById('titleInput').value.trim();
    const date = document.getElementById('dateInput').value;
    
    if (!title || !date) {
        alert('请填写完整信息');
        return;
    }
    
    const countdown = {
        id: Date.now(),
        title: title,
        date: date,
        createdAt: new Date().toISOString()
    };
    
    countdowns.push(countdown);
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    
    showListPage();
}

// 渲染倒数日列表
function renderCountdowns() {
    const container = document.getElementById('countdowns');
    
    if (countdowns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>还没有倒数日</h3>
                <p>点击右上角的 + 号添加第一个倒数日吧</p>
            </div>
        `;
        return;
    }
    
    // 按日期排序
    const sortedCountdowns = countdowns.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    container.innerHTML = sortedCountdowns.map(countdown => {
        const targetDate = new Date(countdown.date);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let statusText;
        if (diffDays > 0) {
            statusText = `还有 ${diffDays} 天`;
        } else if (diffDays === 0) {
            statusText = '就是今天！';
        } else {
            statusText = `已过去 ${Math.abs(diffDays)} 天`;
        }
        
        return `
            <div class="countdown-card" onclick="showDetailPage(${countdown.id})">
                <div class="countdown-info">
                    <h3>${countdown.title}</h3>
                    <div class="days-passed">${statusText}</div>
                </div>
                <div class="countdown-days">
                    <span class="number">${Math.abs(diffDays)}</span>
                    <span class="label">天</span>
                </div>
            </div>
        `;
    }).join('');
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}