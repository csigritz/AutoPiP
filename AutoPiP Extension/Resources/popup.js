// popup.js
const tabSwitchCheckbox = document.getElementById('tabSwitchCheckbox');
const windowSwitchCheckbox = document.getElementById('windowSwitchCheckbox');
const scrollSwitchCheckbox = document.getElementById('scrollSwitchCheckbox');

// Load saved status
browser.storage.local.get(['tabSwitchEnabled', 'windowSwitchEnabled', 'scrollSwitchEnabled'], function(result) {
    const tabEnabled = result.tabSwitchEnabled === undefined ? true : result.tabSwitchEnabled;
    const windowEnabled = result.windowSwitchEnabled === undefined ? true : result.windowSwitchEnabled;
    const scrollEnabled = result.scrollSwitchEnabled === undefined ? true : result.scrollSwitchEnabled;

    tabSwitchCheckbox.checked = tabEnabled;
    windowSwitchCheckbox.checked = windowEnabled;
    scrollSwitchCheckbox.checked = scrollEnabled;

    // Send initial status to all tabs
    updateAllTabs('toggleTabSwitch', tabEnabled);
    updateAllTabs('toggleWindowSwitch', windowEnabled);
    updateAllTabs('toggleScrollSwitch', scrollEnabled);
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

// Scroll Switch Checkbox Event Listener
scrollSwitchCheckbox.addEventListener('change', function() {
    const enabled = scrollSwitchCheckbox.checked;
    console.log('Scroll Switch changed to:', enabled);

    browser.storage.local.set({ scrollSwitchEnabled: enabled });
    updateAllTabs('toggleScrollSwitch', enabled);
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
