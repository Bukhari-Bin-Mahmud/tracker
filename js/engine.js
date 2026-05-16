/**
 * Statistical Analytics & Data Engineering Core Modules
 */
export const AnalyticsEngine = {
    calculateSummary(dataset) {
        if (!dataset || dataset.length === 0) {
            return { flowIndex: 0, meanFocus: 0, meanEnergy: 0, correlation: 0 };
        }

        const count = dataset.length;
        let focusSum = 0;
        let energySum = 0;
        let flowSum = 0;

        dataset.forEach(node => {
            focusSum += node.focus;
            energySum += node.energy;
            flowSum += (node.focus * node.energy) / 10; // Composite Flow formula
        });

        const meanFocus = focusSum / count;
        const meanEnergy = energySum / count;
        const flowIndex = flowSum / count;

        // Calculate Pearson Correlation Coefficient (r)
        let num = 0;
        let denFocus = 0;
        let denEnergy = 0;

        dataset.forEach(node => {
            const diffF = node.focus - meanFocus;
            const diffE = node.energy - meanEnergy;
            num += diffF * diffE;
            denFocus += diffF * diffF;
            denEnergy += diffE * diffE;
        });

        let correlation = 0;
        if (denFocus !== 0 && denEnergy !== 0) {
            correlation = num / Math.sqrt(denFocus * denEnergy);
        }

        return {
            flowIndex: flowIndex.toFixed(1),
            meanFocus: meanFocus.toFixed(1),
            meanEnergy: meanEnergy.toFixed(1),
            correlation: correlation.toFixed(2)
        };
    }
};
