// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const toggleCheckbox = document.getElementById('toggleCheckbox');
    
    // Lade gespeicherten Status
    browser.storage.local.get('enabled', function(result) {
        const enabled = result.enabled === undefined ? true : result.enabled;
        toggleCheckbox.checked = enabled;
        
        // Sende initialen Status an alle Tabs
        updateAllTabs(enabled);
    });
    
    // Checkbox Event Listener
    toggleCheckbox.addEventListener('change', function() {
        const enabled = toggleCheckbox.checked;
        console.log('Checkbox changed to:', enabled); // Debug logging
        
        // Speichere Status
        browser.storage.local.set({ enabled: enabled });
        
        // Update alle Tabs
        updateAllTabs(enabled);
    });
});

function updateAllTabs(enabled) {
    browser.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
            browser.tabs.sendMessage(tab.id, {
                command: "toggleAutoPiP",
                enabled: enabled
            }).catch(err => console.log('Error sending message to tab:', err));
        });
    });
}
