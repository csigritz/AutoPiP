// content.js
let isEnabled = true;

// Wrapper-Funktionen für Event Listener
function handleVisibilityChangeWrapper() {
    if (isEnabled) handleVisibilityChange();
}

function handleWindowBlurWrapper() {
    if (isEnabled) handleWindowBlur();
}

function handleWindowFocusWrapper() {
    if (isEnabled) handleWindowFocus();
}

// Initial Event Listener Setup mit Wrapper-Funktionen
document.addEventListener("visibilitychange", handleVisibilityChangeWrapper);
window.addEventListener("blur", handleWindowBlurWrapper);
window.addEventListener("focus", handleWindowFocusWrapper);

// Lade initialen Status
browser.storage.local.get('enabled', function(result) {
    isEnabled = result.enabled === undefined ? true : result.enabled;
});

// Message Listener für Toggle-Befehle
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "toggleAutoPiP") {
        isEnabled = message.enabled;
        console.log('AutoPiP enabled:', isEnabled);
        
        // Wenn deaktiviert, PiP sofort beenden
        if (!isEnabled && getVideo()) {
            const video = getVideo();
            if (document.pictureInPictureElement ||
                (video.webkitPresentationMode &&
                 video.webkitPresentationMode === "picture-in-picture")) {
                disablePiP();
            }
        }
        
        sendResponse({enabled: isEnabled});
        return true;
    }
});

function handleVisibilityChange() {
    const video = getVideo();
    if (!video) return;

    if (document.hidden) {
        // Tab wird verlassen - aktiviere PiP wenn Video läuft
        if (!video.paused && video.currentTime > 0 && !video.ended) {
            enablePiP();
        }
    } else {
        // Tab wird wieder aktiv - beende PiP nur wenn wir wirklich im Tab sind
        if (document.hasFocus() &&
            (document.pictureInPictureElement ||
            (video.webkitPresentationMode && video.webkitPresentationMode === "picture-in-picture"))) {
            disablePiP();
        }
    }
}

function handleWindowBlur() {
    const video = getVideo();
    if (!video) return;
    
    // Aktiviere PiP wenn Safari den Fokus verliert und Video läuft
    if (!video.paused && video.currentTime > 0 && !video.ended) {
        enablePiP();
    }
}

function handleWindowFocus() {
    const video = getVideo();
    if (!video) return;
    
    // Deaktiviere PiP wenn Safari den Fokus erhält und wir im Video-Tab sind
    if (!document.hidden && document.hasFocus() &&
        (document.pictureInPictureElement ||
        (video.webkitPresentationMode && video.webkitPresentationMode === "picture-in-picture"))) {
        disablePiP();
    }
}

// DOM Änderungen überwachen
new MutationObserver(checkForVideo).observe(document, {
    subtree: true,
    childList: true
});

function dispatchMessage(messageName, parameters) {
    browser.runtime.sendMessage({
        name: messageName,
        params: parameters
    });
}

var previousResult = null;

function checkForVideo() {
    if (getVideo() != null) {
        if (previousResult === null || previousResult === false) {
            dispatchMessage("videoCheck", {found: true});
        }
        previousResult = true;
    } else if (window == window.top) {
        if (previousResult === null || previousResult === true) {
            dispatchMessage("videoCheck", {found: false});
        }
        previousResult = false;
    }
}

function getVideo() {
    // Priorisiere YouTube Player
    const youtubeVideo = document.querySelector('.html5-main-video');
    if (youtubeVideo) return youtubeVideo;
    
    // Fallback für andere Video-Player
    return document.querySelector('video');
}

function enablePiP() {
    const video = getVideo();
    if (!video) return;
    
    // Prüfe ob Video wirklich läuft
    if (!video.paused && video.currentTime > 0 && !video.ended) {
        try {
            if (video.webkitSupportsPresentationMode &&
                typeof video.webkitSetPresentationMode === "function") {
                video.webkitSetPresentationMode('picture-in-picture');
            } else {
                video.requestPictureInPicture()
                    .catch(console.error);
            }
        } catch (error) {
            console.error('PiP Fehler:', error);
        }
    }
}

function disablePiP() {
    const video = getVideo();
    if (!video) return;

    try {
        if (video.webkitSupportsPresentationMode &&
            typeof video.webkitSetPresentationMode === "function") {
            video.webkitSetPresentationMode('inline');
        } else if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        }
    } catch (error) {
        console.error('PiP Deaktivierung Fehler:', error);
    }
}
