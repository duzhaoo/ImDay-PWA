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
    
    // 重置自定义日期选择器为今天
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // 更新隐藏的日期字段
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    document.getElementById('date').value = formattedDate;
    
    // 更新显示的日期文本
    const selectedDateElement = document.getElementById('selectedDate');
    selectedDateElement.textContent = `${year}年${month}月${day}日`;
    selectedDateElement.classList.remove('placeholder');
    
    // 更新全局变量
    selectedYear = year;
    selectedMonth = month;
    selectedDay = day;
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
    
    // 设置详情页统一样式
    const detailContent = document.querySelector('.detail-content');
    const detailDays = document.getElementById('detailDays');
    const detailLabel = document.getElementById('detailLabel');
    
    // 移除所有状态类，使用统一的橙红渐变样式
    detailContent.classList.remove('past', 'today', 'future-far', 'future-near', 'future-soon');
    
    // 确保天数文字始终为白色
    detailDays.style.color = 'white';
    detailLabel.style.color = 'white';
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

// 删除倒数日
function deleteCountdown() {
    if (!currentCountdownId) return;
    
    const countdown = countdowns.find(c => c.id === currentCountdownId);
    if (!countdown) return;
    
    if (confirm(`确定要删除"${countdown.title}"吗？\n\n删除后无法恢复！`)) {
        // 从数组中移除
        countdowns = countdowns.filter(c => c.id !== currentCountdownId);
        
        // 保存到本地存储
        saveCountdowns();
        
        // 显示成功提示
        showToast('倒数日删除成功！');
        
        // 返回列表页面
        showListPage();
        
        // 清空当前ID
        currentCountdownId = null;
    }
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

// 自定义日期选择器相关函数
let selectedYear, selectedMonth, selectedDay;

function initDatePicker() {
    const currentDate = new Date();
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    
    // 初始化年份选择器（从1990年到未来50年）
    const currentYear = currentDate.getFullYear();
    for (let year = 1990; year <= currentYear + 50; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    // 初始化月份选择器
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        if (month === currentDate.getMonth() + 1) option.selected = true;
        monthSelect.appendChild(option);
    }
    
    // 初始化日期选择器
    updateDayOptions();
    
    // 监听年份和月份变化，更新日期选项
    yearSelect.addEventListener('change', updateDayOptions);
    monthSelect.addEventListener('change', updateDayOptions);
    
    // 设置默认选中今天
    selectedYear = currentYear;
    selectedMonth = currentDate.getMonth() + 1;
    selectedDay = currentDate.getDate();
    daySelect.value = selectedDay;
    
    // 初始化隐藏的日期字段和显示文本
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    document.getElementById('date').value = formattedDate;
    
    const selectedDateElement = document.getElementById('selectedDate');
    selectedDateElement.textContent = `${selectedYear}年${selectedMonth}月${selectedDay}日`;
    selectedDateElement.classList.remove('placeholder');
}

function updateDayOptions() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 清空现有选项
    daySelect.innerHTML = '';
    
    // 添加新的日期选项
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        daySelect.appendChild(option);
    }
    
    // 如果之前选中的日期在新月份中存在，保持选中
    if (selectedDay && selectedDay <= daysInMonth) {
        daySelect.value = selectedDay;
    } else {
        daySelect.value = 1;
    }
}

function openDatePicker() {
    const modal = document.getElementById('datePickerModal');
    const hiddenInput = document.getElementById('date');
    
    // 如果隐藏输入框有值，使用该值初始化选择器
    if (hiddenInput.value) {
        const date = new Date(hiddenInput.value);
        selectedYear = date.getFullYear();
        selectedMonth = date.getMonth() + 1;
        selectedDay = date.getDate();
        
        document.getElementById('yearSelect').value = selectedYear;
        document.getElementById('monthSelect').value = selectedMonth;
        updateDayOptions();
        document.getElementById('daySelect').value = selectedDay;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDatePicker() {
    const modal = document.getElementById('datePickerModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function confirmDateSelection() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const daySelect = document.getElementById('daySelect');
    
    selectedYear = parseInt(yearSelect.value);
    selectedMonth = parseInt(monthSelect.value);
    selectedDay = parseInt(daySelect.value);
    
    // 格式化日期为 YYYY-MM-DD
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    
    // 更新隐藏的日期输入框
    document.getElementById('date').value = formattedDate;
    
    // 更新显示的日期
    const selectedDateElement = document.getElementById('selectedDate');
    selectedDateElement.textContent = `${selectedYear}年${selectedMonth}月${selectedDay}日`;
    selectedDateElement.classList.remove('placeholder');
    
    closeDatePicker();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderCountdowns();
    initDatePicker();
    
    // 添加日期框整行点击事件
    const dateFormGroup = document.querySelector('.form-group:has(.custom-date-picker)');
    if (dateFormGroup) {
        dateFormGroup.style.cursor = 'pointer';
        dateFormGroup.addEventListener('click', function(e) {
            // 如果点击的不是选择器内部元素，则打开日期选择器
            if (!e.target.closest('.date-picker-modal')) {
                openDatePicker();
            }
        });
    }
    
    // 点击模态框背景关闭
    document.getElementById('datePickerModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDatePicker();
        }
    });
});