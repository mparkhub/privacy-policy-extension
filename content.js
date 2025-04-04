console.log("content.js script is running!");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function findPrivacyLinks() {
    let footerLinks = [...document.querySelectorAll('footer a')]
        .filter(a => a.innerText.toLowerCase().includes('privacy'));

    if (footerLinks.length > 0) {
        console.log("Privacy policy found in footer: ", footerLinks[0].href);
        return footerLinks[0].href;
    }

    const menuButton = document.querySelector('button[aria-label="More Options"]');
    if(menuButton) {
        menuButton.click();
        sleep(1000).then(() => {
            let sideBarLinks = [...document.querySelectorAll('a')]
                .filter(a => a.innerText.toLowerCase().includes('privacy'));
                
            if(sideBarLinks.length > 0) {
                console.log("Privacy policy found in sidebar: ", sideBarLinks[0].href);
                return sideBarLinks[0].href;
            } else {
                console.log("No privacy policy found in sidebar. Searching the rest of the page.");
            }
        });
    } else {
        console.log("No menu button found. Searching the rest of the page.");
    }

    let privacyLinks = [...document.querySelectorAll('a')]
        .filter(a => a.innerText.toLowerCase().includes('privacy'));

    if (privacyLinks.length > 0) {
        console.log("Privacy policy found: ", privacyLinks[0].href);
    } else {
        console.log("No privacy policy found.\nAttempting common URLs.");
    }
}

findPrivacyLinks();
