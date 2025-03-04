console.log("content.js script is running!");


function findPrivacyLinks() {
    let privacyLinks = [...document.querySelectorAll('a')].filter(a => a.innerText.toLowerCase().includes('privacy'));

    if (privacyLinks.length > 0) {
        console.log("Privacy policy found: ", privacyLinks[0].href);
    } else {
        console.log("No privacy policy found.");
    }
}

findPrivacyLinks();

const observer = new MutationObserver(() => {
    findPrivacyLinks();
});

observer.observe(document.body, {childList: true, subtree: true});