// Keyword list - you can expand this anytime
const keywords = [
    "third-party",
    "data retention",
    "sale of data",
    "cookies",
    "personal information",
    "advertising",
    "opt-out"
    // Add more keywords here!
];

/**
 * Parses a block of text and finds occurrences of concerning keywords.
 * @param {string} text - The privacy policy content.
 * @returns {object} - An object with keyword counts and total concerns.
 */
function parseKeywords(text) {
    const keywordCounts = {};
    let totalHits = 0;

    // Normalize text: lowercase for case-insensitive matching
    const lowerCaseText = text.toLowerCase();

    keywords.forEach(keyword => {
        // Create a RegExp to match the keyword globally and case-insensitive
        const regex = new RegExp(keyword.toLowerCase(), 'g');
        const matches = lowerCaseText.match(regex);
        
        const count = matches ? matches.length : 0;

        if (count > 0) {
            keywordCounts[keyword] = count;
            totalHits += count;
        }
    });

    // Return counts and a basic risk score (customize this logic later if needed)
    return {
        keywordsFound: keywordCounts,
        totalHits: totalHits,
        riskScore: calculatePrivacyScore(totalHits)
    };
}

/**
 * Generates a privacy score based on total keyword hits.
 * You can customize this scoring system.
 * @param {number} totalHits - Total keyword occurrences found.
 * @returns {string} - Risk level as a string.
 */
function calculatePrivacyScore(totalHits) {
    if (totalHits === 0) {
        return "Low Risk";
    } else if (totalHits <= 3) {
        return "Moderate Risk";
    } else {
        return "High Risk";
    }
}

// Example usage:
// (You can replace this with the scraped policy text once Morgan finishes)
const examplePolicyText = `
    We use cookies to collect personal information. 
    This information may be shared with third-party advertising partners.
    Our data retention policy outlines how long we keep your data.
`;

const analysisResult = parseKeywords(examplePolicyText);
console.log("Privacy Policy Analysis:", analysisResult);
