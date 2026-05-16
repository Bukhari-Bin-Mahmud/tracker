import { StorageDAL } from './storage.js';
import { AnalyticsEngine } from './engine.js';
import { InsightEngine } from './insights.js';

// DOM Binding Matrix
const focusSlider = document.getElementById('focusSlider');
const energySlider = document.getElementById('energySlider');
const focusVal = document.getElementById('focusVal');
const energyVal = document.getElementById('energyVal');
const btnCommit = document.getElementById('btnCommit');
const contextMatrix = document.getElementById('contextMatrix');
const ledgerBody = document.getElementById('ledgerBody');
const insightTerminal = document.getElementById('insightTerminal');

const kpiFlow = document.getElementById('kpiFlow');
const kpiCorrelation = document.getElementById('kpiCorrelation');
const kpiMeanFocus = document.getElementById('kpiMeanFocus');
const kpiMeanEnergy = document.getElementById('kpiMeanEnergy');

const btnExport = document.getElementById('btnExport');
const fileImport = document.getElementById('fileImport');
const btnPurge = document.getElementById('btnPurge');

const btnChrono = document.getElementById('btnChrono');
const chronoDisplay = document.getElementById('chronoDisplay');
const chronoState = document.getElementById('chronoState');

let selectedContext = "Dev";
let activeChart = null;

// Dynamic Interface Syncs
focusSlider.addEventListener('input', (e) => focusVal.textContent = e.target.value);
energySlider.addEventListener('input', (e) => energyVal.textContent = e.target.value);

contextMatrix.addEventListener('click', (e) => {
    const node = e.target.closest('.matrix-node');
    if (node) {
        document.querySelectorAll('.matrix-node').forEach(b => b.classList.remove('active'));
        node.classList.add('active');
        selectedContext = node.getAttribute('data-context');
    }
});

// Linear Execution State Machine for Pomodoro Chrono Block
let clockSession = null;
let secondsRemaining = 1500;

btnChrono.addEventListener('click', () => {
    if (clockSession) {
        clearInterval(clockSession);
        clockSession = null;
        chronoState.textContent = "HALTED";
        btnChrono.textContent = "RESUME BLOCK";
    } else {
        chronoState.textContent = "EXECUTING";
        btnChrono.textContent = "PAUSE CHRONO";
        clockSession = setInterval(() => {
            if (secondsRemaining > 0) {
                secondsRemaining--;
                const m = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
                const s = (secondsRemaining % 60).toString().padStart(2, '0');
                chronoDisplay.textContent = `${m}:${s}`;
            } else {
                clearInterval(clockSession);
                clockSession = null;
                chronoState.textContent = "TERMINATED";
                alert("Deep Work Block Complete. Commit Telemetry Data Vector immediately.");
            }
        }, 1000);
    }
});

// Canvas Context Pipeline Initializer
function initializeChartInstance() {
    const ctx = document.getElementById('canvasApex').getContext('2d');
    activeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Focus', data: [], borderColor: '#06b6d4', backgroundColor: 'transparent', borderWidth: 2, tension: 0.2 },
                { label: 'CNS', data: [], borderColor: '#a855f7', backgroundColor: 'transparent', borderWidth: 2, tension: 0.2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#14141c' }, ticks: { color: '#52526b', font: { size: 10 } } },
                y: { min: 1, max: 10, grid: { color: '#14141c' }, ticks: { color: '#52526b', stepSize: 2 } }
            }
        }
    });
}

// Master Orchestration Redraw Routine
function syncSystemState() {
    const data = StorageDAL.getCollection();
    const summary = AnalyticsEngine.calculateSummary(data);

    // Render Metric Counters
    kpiFlow.textContent = summary.flowIndex;
    kpiCorrelation.textContent = summary.correlation;
    kpiMeanFocus.textContent = summary.meanFocus;
    kpiMeanEnergy.textContent = summary.meanEnergy;

    // Render Insights Array using computed trends
    if (data.length > 0) {
        const structuralNode = data[data.length - 1];
        insightTerminal.innerHTML = InsightEngine.evaluateState(structuralNode.focus, structuralNode.energy, summary.correlation);
    } else {
        insightTerminal.innerHTML = "System cold start. Input telemetry signatures to compile analytics mapping.";
    }

    // Refresh Live Vector Graph Coordinates
    if (activeChart) {
        activeChart.data.labels = data.map(n => n.timestamp);
        activeChart.data.datasets[0].data = data.map(n => n.focus);
        activeChart.data.datasets[1].data = data.map(n => n.energy);
        activeChart.update();
    }

    // Paint Ledger Database Output Array Rows
    ledgerBody.innerHTML = data.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Memory array trace void.</td></tr>` : '';
    
    data.slice().reverse().forEach(node => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-family:monospace; color:var(--text-muted);">${node.timestamp}</td>
            <td><span class="context-tag">${node.context}</span></td>
            <td style="color:var(--cyan); font-weight:bold;">${node.focus}</td>
            <td style="color:var(--purple); font-weight:bold;">${node.energy}</td>
            <td style="font-family:monospace; font-weight:800;">${((node.focus * node.energy) / 10).toFixed(1)}</td>
        `;
        ledgerBody.appendChild(row);
    });
}

// Global Core UI Interface Triggers
btnCommit.addEventListener('click', () => {
    StorageDAL.pushNode(focusSlider.value, energySlider.value, selectedContext);
    syncSystemState();
});

btnPurge.addEventListener('click', () => {
    if (confirm("Execute hard purge on all local tables? This action cannot be reversed.")) {
        StorageDAL.purge();
        syncSystemState();
    }
});

btnExport.addEventListener('click', () => {
    const buffer = StorageDAL.getCollection();
    if (buffer.length === 0) return alert("Export rejected: Array collection memory trace empty.");
    
    const fileBlob = new Blob([JSON.stringify(buffer, null, 2)], { type: 'application/json' });
    const allocationUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = allocationUrl;
    link.download = `apex_telemetry_payload_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(allocationUrl);
});

fileImport.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const pipelineReader = new FileReader();
    pipelineReader.onload = function(evt) {
        const successful = StorageDAL.validateAndImport(evt.target.result);
        if (successful) {
            syncSystemState();
            alert("External telemetry dataset merged successfully.");
        } else {
            alert("Data fault: Refusing payload mapping. Structural verification validation failed.");
        }
    };
    pipelineReader.readAsText(file);
});

// App Boot Sequence Initializer
initializeChartInstance();
syncSystemState();
