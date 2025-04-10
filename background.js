// === Combined keyword patterns (positive and negative weighted) ===
const keywordPatterns = [
    // 🔴 Concerning Practices
    { label: "sale of data", pattern: /sale of data/gi, weight: 3, negation: /\b(do not|never|not)\b.*\b(sale of data|sell.*data)\b/i },
    { label: "third-party", pattern: /third[- ]?party/gi, weight: 2 },
    { label: "data retention", pattern: /data retention/gi, weight: 2 },
    { label: "cookies", pattern: /cookie[s]?/gi, weight: 1 },
    { label: "advertising", pattern: /advertis(e|ing|ers)?/gi, weight: 2 },
    { label: "location data", pattern: /location data/gi, weight: 2 },
    { label: "google analytics", pattern: /google analytics/gi, weight: 2 },
    { label: "web analytics", pattern: /web analytics/gi, weight: 2 },
    { label: "social security number", pattern: /social security number/gi, weight: 3 },
    { label: "passport", pattern: /passport/gi, weight: 2 },
    { label: "criminal history", pattern: /criminal history/gi, weight: 3 },
    { label: "ethnic origin", pattern: /ethnic origin/gi, weight: 2 },
    { label: "opt-out", pattern: /opt[- ]?out/gi, weight: 2 },
    { label: "usage information", pattern: /usage information/gi, weight: 1 },
    { label: "browser information", pattern: /browser information/gi, weight: 1 },
    { label: "data collection", pattern: /data collection/gi, weight: 2 },
    { label: "personal information", pattern: /personal (info|information)/gi, weight: 1 },
    { label: "government request", pattern: /government request/gi, weight: 2 },
    { label: "fundraising", pattern: /fundrais(e|ing)/gi, weight: 1 },

    // 🟢 Good Practices (negative weight = better)
    { label: "does not sell data", pattern: /\b(does not|do not|never)\b.*\b(sell|sale).*data\b/i, weight: -3 },
    { label: "does not share with third parties", pattern: /\b(does not|do not|never)\b.*\b(share).*third[- ]?part(y|ies)\b/i, weight: -3 },
    { label: "limited data collection", pattern: /\blimited\b.*\bdata collection\b/i, weight: -2 },
    { label: "minimal personal data", pattern: /\b(minimal|only necessary)\b.*\b(personal data|information)\b/i, weight: -2 },
    { label: "internal data use only", pattern: /\binternal (use|processing)\b/i, weight: -2 },
    { label: "restricted access", pattern: /restricted access/i, weight: -2 },
    { label: "security policy", pattern: /security (polic(y|ies)|standard)/gi, weight: -1 },
    { label: "data protection", pattern: /data protection/i, weight: -1 },
    { label: "does not track users", pattern: /\b(do not|does not|never)\b.*\b(track|monitor)\b/i, weight: -2 },
    { label: "information security officer", pattern: /information security officer/i, weight: -1 },
    { label: "third-party assessment", pattern: /third[- ]?party (review|assessment|audit)/i, weight: -1 },
    { label: "data retention schedule", pattern: /data retention schedule/i, weight: -1 },
    { label: "FERPA", pattern: /family educational rights and privacy act|ferpa/i, weight: -2 },
    { label: "HIPAA", pattern: /health insurance portability and accountability act|hipaa/i, weight: -2 },
    { label: "user rights", pattern: /request.*(delete|update|access).*information/i, weight: -2 },
    { label: "consent withdrawal", pattern: /withdraw.*consent/i, weight: -1 },
    { label: "not for children under 13", pattern: /not.*under.*13/i, weight: -2 },
    { label: "does not use tracking", pattern: /does not.*(track|monitor)/i, weight: -2 }
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
    if (score <= 0) return "Low Risk";
    if (score <= 5) return "Moderate Risk";
    return "High Risk";
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
