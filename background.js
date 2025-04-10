// === Combined keyword patterns (positive and negative weighted) ===
const keywordPatterns = [
    // 🔴 Concerning Practices
    { label: "sale of data", pattern: /sale of data|sell.*(user|personal)? data/gi, weight: 3, negation: /\b(does not|do not|never|not)\b.*\b(sell|sale).*data\b/i },
    { label: "third-party", pattern: /third[- ]?part(y|ies)|third-party apps?|third-party services?/gi, weight: 2 },
    { label: "data retention", pattern: /data retention|retain (personal|user) data|stored.*data|retention period/gi, weight: 2 },
    { label: "cookies", pattern: /cookie[s]?|web storage|local storage|browser storage|pixel tags|tracking pixel/gi, weight: 1 },
    { label: "advertising", pattern: /advertis(e|ing|ers)?|personalized ads|targeted ads|behavioral advertising/gi, weight: 2 },
    { label: "location data", pattern: /location (data|information)|gps data|geolocation|ip[- ]?based location|cell tower data|wifi access points/gi, weight: 2 },
    { label: "analytics", pattern: /analytics|google analytics|web analytics|usage metrics|performance measurement|ad performance|activity tracking/gi, weight: 2 },
    { label: "biometric data", pattern: /biometric (data|information)|fingerprint|face recognition|voice recognition/gi, weight: 3 },
    { label: "device identifiers", pattern: /device (identifier|id|ids)|unique identifiers?|device fingerprint/gi, weight: 2 },
    { label: "social security number", pattern: /social security number|ssn/gi, weight: 3 },
    { label: "passport", pattern: /passport|government-issued id|identification documents?/gi, weight: 2 },
    { label: "criminal history", pattern: /criminal history|criminal record|background checks?/gi, weight: 3 },
    { label: "ethnic origin", pattern: /ethnic origin|race|racial|ethnicity/gi, weight: 2 },
    { label: "health data", pattern: /health (data|information|metrics)|medical history|healthcare information|blood glucose|vital signs|mental health/gi, weight: 3 },
    { label: "opt-out", pattern: /opt[- ]?out|unsubscribe|withdraw consent|opt-out tool|privacy preferences/gi, weight: 2 },
    { label: "usage information", pattern: /usage information|activity data|interaction data|user activity|system activity/gi, weight: 2 },
    { label: "communication logs", pattern: /call logs?|message logs?|email address(es)?|phone number|contact history/gi, weight: 2 },
    { label: "browser information", pattern: /browser (type|information|settings)|browser history|browsing history|chrome history/gi, weight: 2 },
    { label: "personal information", pattern: /personal (info|information|data)|user information|identifiable information/gi, weight: 2 },
    { label: "government request", pattern: /government request|law enforcement|court order|legal process|subpoena|warrant/gi, weight: 2 },
    { label: "fundraising", pattern: /fundrais(e|ing)|donations?|financial contributions?/gi, weight: 1 },
    { label: "badge scanning", pattern: /badge scan(ned|ning)|event badge|attendee badge/gi, weight: 2 },
    { label: "tracking activity", pattern: /track(ed|ing)? user (activity|behavior|usage)|user tracking|behavior tracking/gi, weight: 3 },
    { label: "social media integration", pattern: /social media (networks|accounts|data|integration)|social login|connect.*social media/gi, weight: 2 },
    { label: "email sharing", pattern: /share.*email|email.*third[- ]?part(y|ies)|email.*marketing/gi, weight: 2 },
    { label: "data sharing", pattern: /share.*personal.*(data|info|information)|data sharing|shared.*third-party|share.*affiliates?/gi, weight: 3 },
    { label: "voice data", pattern: /voice (recordings?|data|information)|audio data|speech recognition/gi, weight: 3 },
    { label: "payment information", pattern: /payment (info|information|data)|credit card|billing information|financial data|transaction history/gi, weight: 3 },

    // 🟢 Good Practices (negative weight = better)
    { label: "does not sell data", pattern: /\b(does not|do not|never|not)\b.*\b(sell|sale).*data\b/i, weight: -3 },
    { label: "does not share with third parties", pattern: /\b(does not|do not|never)\b.*\b(share).*third[- ]?part(y|ies)\b/i, weight: -3 },
    { label: "limited data collection", pattern: /\blimited\b.*\bdata collection\b|\bminimum\b.*\bdata necessary\b/i, weight: -2 },
    { label: "minimal personal data", pattern: /\b(minimal|only necessary|essential)\b.*\b(personal data|information)\b/i, weight: -2 },
    { label: "internal data use only", pattern: /\binternal (use|processing|purposes only)\b/i, weight: -2 },
    { label: "restricted access", pattern: /restricted access|limited access|controlled access/i, weight: -2 },
    { label: "security measures", pattern: /security (polic(y|ies)|standard|measures|protocols)|data protection|encryption/i, weight: -2 },
    { label: "does not track users", pattern: /\b(do not|does not|never)\b.*\b(track|monitor|follow)\b/i, weight: -3 },
    { label: "user rights", pattern: /request.*(delete|update|access|correct).*information|user rights|privacy rights|data subject rights/i, weight: -2 },
    { label: "consent withdrawal", pattern: /withdraw.*consent|revoke.*consent|withdrawal of consent/i, weight: -2 },
    { label: "child protection", pattern: /not.*under.*13|children'?s.*privacy|coppa|protect.*children/i, weight: -2 },
    { label: "data deletion", pattern: /delete.*(your)? data|erase.*data|remove.*data|data deletion/i, weight: -2 },
    { label: "data export", pattern: /export.*data|download.*data|backup.*data/i, weight: -1 },
    { label: "privacy settings", pattern: /privacy (settings|controls|checkup|preferences|tools)|manage.*privacy/i, weight: -1 },
    { label: "transparent policy updates", pattern: /notice.*privacy.*updates|notify.*changes.*privacy policy|transparency.*report/i, weight: -1 },
    { label: "no personalized ads from sensitive categories", pattern: /no personalized ads.*(race|religion|sexual orientation|health|sensitive)/i, weight: -2 },
    { label: "anonymize data", pattern: /anonymiz(e|ed|ation).*data|aggregate.*data/i, weight: -1 },
    { label: "inactive account manager", pattern: /inactive account manager|manage.*inactive account/i, weight: -1 }
];



function cleanText(rawText) {
    return rawText
        .replace(/(skip to main content|apply now|request info|contact us|main navigation|breadcrumb)/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function parseKeywords(text) {
    const keywordHits = {};
    let score = 0;
    const lowerText = text.toLowerCase();

    keywordPatterns.forEach(({ label, pattern, weight, negation }) => {
        if (negation && negation.test(lowerText)) {
            console.log(`[Negation Detected] Skipping: ${label}`);
            return;
        }

        const matches = lowerText.match(pattern);
        const count = matches ? matches.length : 0;

        if (count > 0) {
            keywordHits[label] = {
                count: count,
                weight: weight
            };
            score += count * weight;
        }
    });

    return {
        keywordsFound: keywordHits,
        score,
        riskScore: getRiskLevel(score)
    };
}

function getRiskLevel(score) {
    if (score <= 20) return "Low Risk";
    if (score <= 75) return "Moderate Risk";
    if (score <= 150) return "Elevated Risk";
    if (score <= 250) return "High Risk";
    return "Severe Risk";
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "privacyText" && message.payload?.text) {
        console.log("[Background] Received privacy policy content from:", message.payload.url);

        const cleaned = cleanText(message.payload.text);
        const result = parseKeywords(cleaned);

        console.log("[Background] Analysis result:", result);

        chrome.storage.local.set({
            lastAnalysis: {
                url: message.payload.url,
                result: result,
                timestamp: Date.now()
            }
        }, () => {
            console.log("[Background] Analysis result saved to storage.");
        });
    }
});
