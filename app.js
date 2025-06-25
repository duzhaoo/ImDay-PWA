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
    
    // 设置日期选择框默认为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${year}-${month}-${day}`;
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
    document.getElementById('detailDays').textContent = Math.abs(days) + '天';
    document.getElementById('detailLabel').textContent = getDaysText(days);
    document.getElementById('detailDate').textContent = formatDate(countdown.date);
    
    // 设置详情页颜色
    const detailDays = document.getElementById('detailDays');
    const detailLabel = document.getElementById('detailLabel');
    if (days > 30) {
        detailDays.style.color = '#4A90E2';
        detailLabel.style.color = 'white';
    } else if (days > 7) {
        detailDays.style.color = '#FF9500';
        detailLabel.style.color = 'white';
    } else if (days >= 0) {
        detailDays.style.color = '#FF3B30';
        detailLabel.style.color = 'white';
    } else {
        detailDays.style.color = 'white';
        detailLabel.style.color = 'white';
    }
}

// 保存倒数日
function saveCountdown() {
    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    
    if (!title || !date) {
        alert('请填写完整信息');
        return;
    }

    const countdown = {
        id: Date.now(),
        title,
        date,
        createdAt: new Date().toISOString()
    };

    countdowns.push(countdown);
    saveCountdowns();
    showListPage();
    showToast('倒数日添加成功！');
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

// 备份恢复功能
function showBackupModal() {
    document.getElementById('backupModal').style.display = 'block';
}

function hideBackupModal() {
    document.getElementById('backupModal').style.display = 'none';
}

// 备份数据
function backupData() {
    try {
        const data = {
            countdowns: countdowns,
            exportTime: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `倒数日备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('数据备份成功！');
        hideBackupModal();
    } catch (error) {
        console.error('备份失败:', error);
        showToast('备份失败，请重试');
    }
}

// 恢复数据
function restoreData() {
    document.getElementById('fileInput').click();
}

// 处理文件恢复
function handleFileRestore(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        showToast('请选择JSON格式的备份文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!data.countdowns || !Array.isArray(data.countdowns)) {
                throw new Error('无效的备份文件格式');
            }
            
            // 确认恢复
            if (confirm(`确定要恢复数据吗？\n\n备份时间: ${data.exportTime ? new Date(data.exportTime).toLocaleString('zh-CN') : '未知'}\n倒数日数量: ${data.countdowns.length}\n\n当前数据将被覆盖！`)) {
                countdowns = data.countdowns;
                saveCountdowns();
                renderCountdowns();
                showToast('数据恢复成功！');
                hideBackupModal();
            }
        } catch (error) {
            console.error('恢复失败:', error);
            showToast('文件格式错误，恢复失败');
        }
    };
    
    reader.readAsText(file);
    // 清空文件输入，允许重复选择同一文件
    event.target.value = '';
}

// 点击弹框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('backupModal');
    if (event.target === modal) {
        hideBackupModal();
    }
}

// 初始化应用
const app = new CountdownApp();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderCountdowns();
});