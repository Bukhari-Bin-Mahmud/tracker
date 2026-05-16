// DOM Element Selectors
const focusSlider = document.getElementById('focusSlider');
const energySlider = document.getElementById('energySlider');
const focusVal = document.getElementById('focusVal');
const energyVal = document.getElementById('energyVal');
const logBtn = document.getElementById('logBtn');
const historyList = document.getElementById('historyList');
const tagsContainer = document.getElementById('tagsContainer');
const avgFocusDisplay = document.getElementById('avgFocus');
const avgEnergyDisplay = document.getElementById('avgEnergy');
const clearBtn = document.getElementById('clearBtn');

let selectedTag = "Code";
let savedLogs = JSON.parse(localStorage.getItem('dashboardLogs')) || [];

// Live Slider Feedback
focusSlider.addEventListener('input', (e) => focusVal.textContent = `${e.target.value}/10`);
energySlider.addEventListener('input', (e) => energyVal.textContent = `${e.target.value}/10`);

// Handle Dynamic Tag Highlighting
tagsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-btn')) {
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        selectedTag = e.target.getAttribute('data-tag');
    }
});

// Initialize Chart.js configuration
const ctx = document.getElementById('analyticsChart').getContext('2d');
let analyticsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Focus',
                data: [],
                borderColor: '#38bdf8',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4
            },
            {
                label: 'Energy',
                data: [],
                borderColor: '#a855f7',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } },
            y: { min: 1, max: 10, grid: { color: '#27272a' }, ticks: { color: '#71717a', stepSize: 2 } }
        }
    }
});

// Core Processing Functions
function updateDashboard() {
    // 1. Render History List
    historyList.innerHTML = savedLogs.length === 0 ? '<div style="color:#71717a; font-size:0.85rem; text-align:center; padding-top:20px;">No historical entries found.</div>' : '';
    
    let totalFocus = 0;
    let totalEnergy = 0;
    let chartLabels = [];
    let focusData = [];
    let energyData = [];

    savedLogs.forEach((log) => {
        totalFocus += parseFloat(log.focus);
        totalEnergy += parseFloat(log.energy);
        
        chartLabels.push(log.time);
        focusData.push(log.focus);
        energyData.push(log.energy);
    });

    // Render history records sequentially (reversed display for newest first)
    savedLogs.slice().reverse().forEach(log => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div>
                <span style="color:#fafafa; font-weight:500;">[${log.tag}]</span> 
                <span style="color:var(--text-muted); margin-left: 6px;">F: ${log.focus} | E: ${log.energy}</span>
            </div>
            <span style="color:#71717a; font-size:0.75rem;">${log.time}</span>
        `;
        historyList.appendChild(item);
    });

    // 2. Math Processing: Calculate Metrics Averages
    if (savedLogs.length > 0) {
        avgFocusDisplay.textContent = (totalFocus / savedLogs.length).toFixed(1);
        avgEnergyDisplay.textContent = (totalEnergy / savedLogs.length).toFixed(1);
    } else {
        avgFocusDisplay.textContent = "0.0";
        avgEnergyDisplay.textContent = "0.0";
    }

    // 3. Update Visual Graph Elements
    analyticsChart.data.labels = chartLabels;
    analyticsChart.data.datasets[0].data = focusData;
    analyticsChart.data.datasets[1].data = energyData;
    analyticsChart.update();
}

// Log Processing Click Event
logBtn.addEventListener('click', () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    savedLogs.push({
        focus: focusSlider.value,
        energy: energySlider.value,
        tag: selectedTag,
        time: timestamp
    });

    // Enforce sliding window limit of last 7 entries for clean layout presentation
    if (savedLogs.length > 7) {
        savedLogs.shift();
    }

    localStorage.setItem('dashboardLogs', JSON.stringify(savedLogs));
    updateDashboard();
});

// Purge Dataset Action
clearBtn.addEventListener('click', () => {
    savedLogs = [];
    localStorage.removeItem('dashboardLogs');
    updateDashboard();
});

// App Initialization Execution
updateDashboard();
