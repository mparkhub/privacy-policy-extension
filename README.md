# Privacy Policy Analyzer Extension

## Overview
Privacy Policy Analyzer is a Chrome extension that helps users quickly assess the privacy practices of websites they visit. It detects privacy policies, scrapes their content, identifies potentially concerning keywords, and assigns a privacy score based on the findings.

This project is being developed as part of a group project for **CS4930: Privacy and Censorship**.

---

## Features
- ✅ Automatically finds links to privacy policies on web pages  
- ✅ Dynamically handles shadow DOM and common URL structures  
- ✅ Fetches and analyzes privacy policy content **without redirecting the user**  
- ✅ Parses the content for concerning and trustworthy keywords  
- ✅ Calculates a privacy risk score from a **balanced, weighted system**  
- ✅ Avoids over-penalizing by detecting positive privacy practices  

---

## How It Works

### 1. `content.js`
- Scans the current site for privacy policy links using multiple strategies:
  - Footer, header, dynamic menus, Shadow DOM, and common paths
- If a link is found, it **fetches** the linked page content in the background
- Scrapes main text sections from the page (`<main>`, `<article>`, or `body`)
- Sends the cleaned text to the background script for analysis

### 2. `background.js`
- Receives the text and applies a robust keyword matching system
- Keywords are weighted (+ for concerning terms, − for good practices)
- Outputs a **composite score** and classifies risk as:
  - Low Risk
  - Moderate Risk
  - Elevated Risk
  - High Risk
  - Severe Risk

### 3. `manifest.json`
- Declares permissions for scripting, messaging, and full URL access
- Enables the extension to run content and background scripts

---

## Installation (For Testing)
1. Clone or download the repository.
2. Open **Chrome** and go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the extension folder.
5. Visit any website. The extension will silently locate and rate the site's privacy policy.

---

## Planned Keyword Detection (Examples)
Includes both concerning and good-practice terms like:
- `sale of data`
- `tracking user behavior`
- `health information`
- `biometric data`
- `we do not share information`
- `data encryption`
- `user rights`

See `background.js` for the full weighted keyword list.

---

## Files
| File            | Purpose                                                  |
|-----------------|----------------------------------------------------------|
| `content.js`    | Scans pages and fetches privacy policy text             |
| `background.js` | Analyzes policy text and calculates privacy score       |
| `manifest.json` | Declares extension metadata and script permissions      |
| `README.md`     | Project documentation and status                        |
| `.gitignore`    | Prevents irrelevant files from being committed          |

---

## Roadmap
- [x] Find and follow privacy policy links
- [x] Handle Shadow DOM and dynamic elements
- [x] Brute-force common URL patterns
- [x] Fetch policy content without redirecting user
- [x] Parse and classify keywords
- [x] Balance score with good and bad indicators
- [ ] Display user-facing result (popup or banner UI)
- [ ] Export or visualize history of site ratings

---

## Team
- **Gunnar Anderson**  
- **Tyler Andrews**  
- **Morgan Parker**
