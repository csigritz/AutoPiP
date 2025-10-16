// content.js
let tabSwitchEnabled = true;
let windowSwitchEnabled = true;
let scrollSwitchEnabled = true;
let lastScrollPosition = window.scrollY;
let isVideoVisible = true;
let pipButton = null;
let currentVideo = null;
let manualPiPActivated = false;

// Load initial status
browser.storage.local.get(['tabSwitchEnabled', 'windowSwitchEnabled', 'scrollSwitchEnabled'], function(result) {
    tabSwitchEnabled = result.tabSwitchEnabled === undefined ? true : result.tabSwitchEnabled;
    windowSwitchEnabled = result.windowSwitchEnabled === undefined ? true : result.windowSwitchEnabled;
    scrollSwitchEnabled = result.scrollSwitchEnabled === undefined ? true : result.scrollSwitchEnabled;
    console.log('Initial status loaded - Tab Switch:', tabSwitchEnabled,
                'Window Switch:', windowSwitchEnabled,
                'Scroll Switch:', scrollSwitchEnabled);
});

// Message listener for toggle commands
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "toggleTabSwitch") {
        tabSwitchEnabled = message.enabled;
        console.log('Tab Switch toggled to:', tabSwitchEnabled);
        
        if (!tabSwitchEnabled) {
            const video = getVideo();
            if (video && isPiPActive(video)) {
                disablePiP(true);
            }
        }
        
        sendResponse({enabled: tabSwitchEnabled});
        return true;
    }
    else if (message.command === "toggleWindowSwitch") {
        windowSwitchEnabled = message.enabled;
        console.log('Window Switch toggled to:', windowSwitchEnabled);
        
        if (!windowSwitchEnabled) {
            const video = getVideo();
            if (video && isPiPActive(video)) {
                disablePiP(true);
            }
        }
        
        sendResponse({enabled: windowSwitchEnabled});
        return true;
    }
    else if (message.command === "toggleScrollSwitch") {
        scrollSwitchEnabled = message.enabled;
        console.log('Scroll Switch toggled to:', scrollSwitchEnabled);
        
        if (!scrollSwitchEnabled) {
            const video = getVideo();
            if (video && isPiPActive(video)) {
                disablePiP(true);
            }
        }
        
        sendResponse({enabled: scrollSwitchEnabled});
        return true;
    }
});

// Helper function for PiP status
function isPiPActive(video) {
    return document.pictureInPictureElement ||
        (video.webkitPresentationMode && video.webkitPresentationMode === "picture-in-picture");
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= -rect.height &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Event handlers with strict event separation
document.addEventListener("visibilitychange", (event) => {
    // Ignore visibility changes triggered by window blur/focus
    if (!event.isTrusted || event.sourceCapabilities) {
        return;
    }

    // Check if tab switch is enabled before proceeding
    if (!tabSwitchEnabled) {
        console.log('Tab switch is disabled, ignoring visibility change');
        return;
    }

    const video = getVideo();
    if (!video) return;

    console.log('Tab visibility changed, hidden:', document.hidden);

    if (document.hidden) {
        if (!video.paused && video.currentTime > 0 && !video.ended) {
            console.log('Enabling PiP on tab switch');
            enablePiP(false); // Automatic activation
        }
    } else {
        if (document.hasFocus() && isPiPActive(video) && !manualPiPActivated) {
            console.log('Disabling PiP on tab switch');
            disablePiP(false); // Don't reset flag - it was automatic
        }
    }
});

window.addEventListener("blur", (event) => {
    // Ignore blur events triggered by tab switching
    if (!event.isTrusted || document.hidden) {
        return;
    }

    // Check if window switch is enabled before proceeding
    if (!windowSwitchEnabled) {
        console.log('Window switch is disabled, ignoring blur');
        return;
    }
    
    const video = getVideo();
    if (!video) return;

    if (!video.paused && video.currentTime > 0 && !video.ended) {
        console.log('Enabling PiP on window blur');
        enablePiP(false); // Automatic activation
    }
});

window.addEventListener("focus", (event) => {
    // Ignore focus events triggered by tab switching
    if (!event.isTrusted || document.hidden) {
        return;
    }

    // Check if window switch is enabled before proceeding
    if (!windowSwitchEnabled) {
        console.log('Window switch is disabled, ignoring focus');
        return;
    }

    const video = getVideo();
    if (!video) return;

    if (!document.hidden && document.hasFocus() && isPiPActive(video) && !manualPiPActivated) {
        console.log('Disabling PiP on window focus');
        disablePiP(false); // Don't reset flag - it was automatic
    }
});

// Scroll event listener
window.addEventListener('scroll', debounce(() => {
    if (!scrollSwitchEnabled) {
        console.log('Scroll switch is disabled, ignoring scroll');
        return;
    }

    const video = getVideo();
    if (!video || !isYouTubePage()) return;
    
    const videoVisible = isElementInViewport(video);
    
    if (!videoVisible && isVideoVisible && !video.paused) {
        console.log('Video scrolled out of view, enabling PiP');
        enablePiP(false); // Automatic activation
        isVideoVisible = false;
    } else if (videoVisible && !isVideoVisible && !manualPiPActivated) {
        console.log('Video scrolled into view, disabling PiP');
        disablePiP(false); // Don't reset flag - it was automatic
        isVideoVisible = true;
    } else if (videoVisible) {
        isVideoVisible = true;
    }
}, 150));

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Helper function to check if current page is YouTube
function isYouTubePage() {
    const allowedHosts = ['youtube.com', 'www.youtube.com'];
        const hostname = window.location.hostname;
        return allowedHosts.includes(hostname);
}

// Watch for DOM changes
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
    // Prioritize YouTube player
    const youtubeVideo = document.querySelector('.html5-main-video');
    if (youtubeVideo) return youtubeVideo;
    
    // Disney+ Videoplayer
    const disneyPlusVideo = document.querySelector('#hivePlayer');
    if (disneyPlusVideo) return disneyPlusVideo;

    // Twitch: Search for typical Twitch video containers
    const twitchVideo = document.querySelector('.video-player__container video, video[data-a-player-state]');
    if (twitchVideo) return twitchVideo;

    // Fallback: Search for generic video-Element
    return document.querySelector('video');
}

function enablePiP(isManual = false) {
    const video = getVideo();
    if (!video) return;
    
    if (!video.paused && video.currentTime > 0 && !video.ended) {
        try {
            if (video.webkitSupportsPresentationMode &&
                typeof video.webkitSetPresentationMode === "function") {
                video.webkitSetPresentationMode('picture-in-picture');
            } else {
                video.requestPictureInPicture()
                    .catch(console.error);
            }
            console.log('PiP enabled successfully', isManual ? '(manual)' : '(automatic)');
            // Set the manual flag based on how PiP was activated
            manualPiPActivated = isManual;
        } catch (error) {
            console.error('PiP enable error:', error);
        }
    }
}

function disablePiP(resetManualFlag = true) {
    const video = getVideo();
    if (!video) return;

    try {
        if (video.webkitSupportsPresentationMode &&
            typeof video.webkitSetPresentationMode === "function") {
            video.webkitSetPresentationMode('inline');
        } else if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        }
        console.log('PiP disabled successfully');
        // Reset manual flag only when appropriate (e.g., automatic exit or manual button click)
        if (resetManualFlag) {
            manualPiPActivated = false;
        }
    } catch (error) {
        console.error('PiP disable error:', error);
    }
}

// Create and inject PiP button styles
function injectPiPButtonStyles() {
    if (document.getElementById('autopip-button-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'autopip-button-styles';
    style.textContent = `
        .autopip-button {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.7);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 2147483647;
            opacity: 0;
            transition: opacity 0.2s, background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        
        .autopip-button:hover {
            background: rgba(0, 0, 0, 0.9);
        }
        
        .autopip-button.visible {
            opacity: 1;
        }
        
        .autopip-button svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
    `;
    document.head.appendChild(style);
}

// Create PiP button element
function createPiPButton() {
    const button = document.createElement('button');
    button.className = 'autopip-button';
    button.setAttribute('aria-label', 'Picture in Picture');
    button.title = 'Picture in Picture';
    
    // PiP icon SVG
    button.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/>
        </svg>
    `;
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const video = getVideo();
        if (video) {
            if (isPiPActive(video)) {
                disablePiP(true); // Reset flag when manually disabled
            } else {
                enablePiP(true); // Pass true to indicate manual activation
            }
        }
    });
    
    return button;
}

// Position the PiP button over the video
function positionPiPButton(video) {
    if (!pipButton) return;
    
    const rect = video.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    pipButton.style.position = 'absolute';
    pipButton.style.top = (rect.top + scrollTop + 10) + 'px';
    pipButton.style.left = (rect.left + scrollLeft + rect.width - 50) + 'px';
}

// Show/hide PiP button on video hover
function setupVideoHoverListener(video) {
    if (!video || video.dataset.autopipListenerAttached) return;
    
    video.dataset.autopipListenerAttached = 'true';
    
    let hoverTimeout;
    
    const showButton = () => {
        if (!pipButton) {
            pipButton = createPiPButton();
            document.body.appendChild(pipButton);
            
            // Add button hover listeners after it's created
            pipButton.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
            });
            
            pipButton.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(hideButton, 300);
            });
        }
        positionPiPButton(video);
        requestAnimationFrame(() => {
            pipButton.classList.add('visible');
        });
    };
    
    const hideButton = () => {
        if (pipButton) {
            pipButton.classList.remove('visible');
        }
    };
    
    video.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        showButton();
    });
    
    video.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(hideButton, 300);
    });
    
    // Update button position on scroll/resize
    const updatePosition = debounce(() => {
        if (pipButton && pipButton.classList.contains('visible')) {
            positionPiPButton(video);
        }
    }, 100);
    
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
}

// Watch for video changes and attach hover listener
function checkAndSetupPiPButton() {
    const video = getVideo();
    if (video && video !== currentVideo) {
        currentVideo = video;
        setupVideoHoverListener(video);
    }
}

// Initialize PiP button functionality
injectPiPButtonStyles();
checkAndSetupPiPButton();

// Watch for new videos
const observer = new MutationObserver(() => {
    checkAndSetupPiPButton();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

