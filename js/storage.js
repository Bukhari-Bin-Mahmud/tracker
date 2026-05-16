/**
 * Data Access Layer (DAL) - Handles LocalStorage pipeline persistence & serialization
 */
const STORAGE_KEY = 'apex_telemetry_v2';

export const StorageDAL = {
    getCollection() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            console.error("Storage read exception. Resetting baseline.", e);
            return [];
        }
    },

    saveCollection(dataArray) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
    },

    pushNode(focus, energy, context) {
        const collection = this.getCollection();
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const payload = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            timestamp,
            context,
            focus: parseFloat(focus),
            energy: parseFloat(energy)
        };

        collection.push(payload);
        
        // Sliding window data retention paradigm (max 15 entries for visualization scale)
        if (collection.length > 15) collection.shift();
        
        this.saveCollection(collection);
        return collection;
    },

    purge() {
        localStorage.removeItem(STORAGE_KEY);
    },

    validateAndImport(rawJsonText) {
        try {
            const parsed = JSON.parse(rawJsonText);
            if (!Array.isArray(parsed)) return false;
            
            // Basic structural schema check
            const isValid = parsed.every(item => 'context' in item && 'focus' in item && 'energy' in item);
            if (isValid) {
                this.saveCollection(parsed);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
};
