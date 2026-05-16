/**
 * Cognitive & Neurological State Assessment Subsystem
 */
export const InsightEngine = {
    evaluateState(currentFocus, currentEnergy, historicalCorrelation) {
        let title = "";
        let dispatch = "";

        const f = parseFloat(currentFocus);
        const e = parseFloat(currentEnergy);
        const r = parseFloat(historicalCorrelation);

        if (f >= 8 && e >= 8) {
            title = "NEURAL MAXIMUM FLOW";
            dispatch = "Cognitive faculties match central nervous system capacity exactly. Optimal state for deep software architecture definitions, hard compiler hacking, or explosive athletic thresholds. Suppress distractions immediately.";
        } else if (f >= 7 && e <= 4) {
            title = "COGNITIVE OVERDRIVE // ADAPTIVE COMPENSATION";
            dispatch = "Focus limits are high, but physiological reserves are depleted. You are running on raw willpower. Avoid motor-heavy execution. Shift to low-strain processes like technical reading or code review.";
        } else if (f <= 4 && e >= 7) {
            title = "MOTOR KINETIC SURGE // ATTENTION LEAK";
            dispatch = "High kinetic drive combined with scattered focus vectors. Keyboard work is inefficient right now. Pivot to immediate physical exertion (e.g., bodyweight thresholds, functional sets) to establish chemical calibration.";
        } else {
            title = "CRITICAL COGNITIVE RECOVERY REQUIREMENT";
            dispatch = "System levels are below operational thresholds. Pushing code or strain right now will cause micro-faults and slow long-term skill acquisition. Execute absolute strategic shutdown immediately.";
        }

        // Add additional observation based on global correlation metric
        let trendAnalysis = "";
        if (Math.abs(r) > 0.7) {
            trendAnalysis = ` State variables are strongly coupled (${r}). Mental and physical capacities are reacting synchronously.`;
        } else if (r < -0.4) {
            trendAnalysis = ` State variables are inversely decoupled (${r}). Your focus spikes when your energy drops, indicating a tendency to compensate under fatigue.`;
        }

        return `<strong>[${title}]</strong><br>${dispatch}${trendAnalysis}`;
    }
};
