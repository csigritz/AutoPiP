// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const tabSwitchCheckbox = document.getElementById('tabSwitchCheckbox');
    const windowSwitchCheckbox = document.getElementById('windowSwitchCheckbox');
    
    // Load saved status
    browser.storage.local.get(['tabSwitchEnabled', 'windowSwitchEnabled'], function(result) {
        const tabEnabled = result.tabSwitchEnabled === undefined ? true : result.tabSwitchEnabled;
        const windowEnabled = result.windowSwitchEnabled === undefined ? true : result.windowSwitchEnabled;
        
        tabSwitchCheckbox.checked = tabEnabled;
        windowSwitchCheckbox.checked = windowEnabled;
        
        // Send inital statu to all tabs
        updateAllTabs('toggleTabSwitch', tabEnabled);
        updateAllTabs('toggleWindowSwitch', windowEnabled);
    });
    
    // Tab Switch Checkbox Event Listener
    tabSwitchCheckbox.addEventListener('change', function() {
        const enabled = tabSwitchCheckbox.checked;
        console.log('Tab Switch changed to:', enabled);
        
        browser.storage.local.set({ tabSwitchEnabled: enabled });
        updateAllTabs('toggleTabSwitch', enabled);
    });
    
    // Window Switch Checkbox Event Listener
    windowSwitchCheckbox.addEventListener('change', function() {
        const enabled = windowSwitchCheckbox.checked;
        console.log('Window Switch changed to:', enabled);
        
        browser.storage.local.set({ windowSwitchEnabled: enabled });
        updateAllTabs('toggleWindowSwitch', enabled);
    });
});

function updateAllTabs(command, enabled) {
    browser.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
            browser.tabs.sendMessage(tab.id, {
                command: command,
                enabled: enabled
            }).catch(err => console.log('Error sending message to tab:', err));
        });
    });
}
