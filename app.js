const focusSlider = document.getElementById('focusSlider');
const energySlider = document.getElementById('energySlider');
const focusVal = document.getElementById('focusVal');
const energyVal = document.getElementById('energyVal');
const logBtn = document.getElementById('logBtn');
const logsContainer = document.getElementById('logsContainer');

// Update UI text dynamically when moving sliders
focusSlider.addEventListener('input', (e) => focusVal.textContent = e.target.value);
energySlider.addEventListener('input', (e) => energyVal.textContent = e.target.value);

// Load previous logs from local storage
let savedLogs = JSON.parse(localStorage.getItem('stateLogs')) || [];

function renderLogs() {
    logsContainer.innerHTML = savedLogs.length === 0 ? '<div style="color:#71717a; font-size:0.85rem;">No logs today yet.</div>' : '';
    savedLogs.slice().reverse().forEach(log => {
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerHTML = `<span>⚡ E: ${log.energy} | 🎯 F: ${log.focus}</span> <span style="color:#71717a;">${log.time}</span>`;
        logsContainer.appendChild(item);
    });
}

logBtn.addEventListener('click', () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    savedLogs.push({
        focus: focusSlider.value,
        energy: energySlider.value,
        time: timeString
    });
    
    localStorage.setItem('stateLogs', JSON.stringify(savedLogs));
    renderLogs();
});

// Initial Render
renderLogs();