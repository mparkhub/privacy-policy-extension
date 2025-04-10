console.log("content.js script is running!");

// Helper function to pause execution
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Search for privacy policy links using multiple strategies
async function findPrivacyLinks() {
    // Strategy 1: Check footer links explicitly
    const footerLinks = [...document.querySelectorAll('footer a')]
        .filter(a => a.innerText.toLowerCase().includes('privacy'));

    if (footerLinks.length > 0) {
        console.log("Privacy policy found in footer:", footerLinks[0].href);
        return footerLinks[0].href;
    }

    // Strategy 2: Check sidebar after expanding dynamic menus
    const menuButton = document.querySelector('button[aria-label="More Options"]');
    if (menuButton) {
        menuButton.click();
        await sleep(1000);
        const sideBarLinks = [...document.querySelectorAll('a')]
            .filter(a => a.innerText.toLowerCase().includes('privacy'));

        if (sideBarLinks.length > 0) {
            console.log("Privacy policy found in sidebar:", sideBarLinks[0].href);
            return sideBarLinks[0].href;
        } else {
            console.log("No privacy policy found in sidebar. Searching elsewhere.");
        }
    }

    // Strategy 3: General link search across the whole page
    const privacyLinks = [...document.querySelectorAll('a, button')]
        .filter(el => el.innerText.toLowerCase().includes('privacy'));

    if (privacyLinks.length > 0) {
        const link = privacyLinks[0].href || privacyLinks[0].getAttribute('data-url');
        if (link) {
            console.log("Privacy policy found:", link);
            return link;
        }
    }

    // Strategy 4: Check Shadow DOM elements
    const shadowLinks = getShadowDomLinks();
    if (shadowLinks.length > 0) {
        console.log("Privacy policy found in Shadow DOM:", shadowLinks[0].href);
        return shadowLinks[0].href;
    }

    // Strategy 5: Attempt common URL patterns
    const commonPath = await tryCommonPaths();
    if (commonPath) return commonPath;

    console.log("No privacy policy found after all strategies.");
    return null;
}

// Scrape the privacy policy content from the page
function scrapePolicy() {
    console.log("Scraping privacy policy.");
    const policyElement = document.querySelector('main, article');
    const policyText = policyElement ? policyElement.innerText : document.body.innerText;
    console.log("Scraped text:", policyText);

    chrome.runtime.sendMessage({
        type: "privacyText",
        payload: {
            url: window.location.href,
            text: policyText
        }
    });
}

// Handle shadow DOM for privacy links
function getShadowDomLinks(root = document) {
    let links = [];
    root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            links.push(...el.shadowRoot.querySelectorAll('a, button'));
            links.push(...getShadowDomLinks(el.shadowRoot));
        }
    });
    return links.filter(link => link.innerText.toLowerCase().includes('privacy'));
}

// Try common privacy policy URL paths
async function tryCommonPaths() {
    const commonPaths = [
        '/privacy', '/privacy-policy', '/privacy_policy', '/policy', '/terms',
        '/legal/privacy', '/about/privacy', '/info/privacy', '/terms-of-service'
    ];

    for (const path of commonPaths) {
        const testUrl = `${window.location.origin}${path}`;
        try {
            const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
            if (response.status < 400 || response.type === 'opaque') {
                console.log("Found privacy policy at:", testUrl);
                return testUrl;
            }
        } catch (e) {
            console.log(`Failed to access ${testUrl}`, e);
        }
    }
    return null;
}

// Fallback text check if links not found
function fallbackTextCheck() {
    const text = document.body.innerText.toLowerCase();
    if (text.includes("privacy policy") || text.includes("privacy statement")) {
        console.log("Privacy statement found in page text directly.");
        scrapePolicy();
        return true;
    }
    return false;
}

// Monitor dynamic content loading using MutationObserver
function observeDynamicContent() {
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const link = await findPrivacyLinks();
                if (link) {
                    observer.disconnect();
                    window.location.href = link;
                    break;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Comprehensive workflow to robustly locate and scrape privacy policies
async function robustPrivacyFinder() {
    let link = await findPrivacyLinks();
    if (link) {
        window.location.href = link;
        return;
    }

    if (!fallbackTextCheck()) {
        observeDynamicContent();
    }
}

// Initialize the privacy policy check on page load
async function initPrivacyCheck() {
    if (window.location.href.includes("privacy")) {
        scrapePolicy();
    } else {
        robustPrivacyFinder();
    }
}

initPrivacyCheck();
