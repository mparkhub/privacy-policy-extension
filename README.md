#Privacy Policy Analyzer Extension
=================================


Overview
============
Privacy Policy Analyzer is a Chrome extension that helps users quickly assess the privacy practices of websites they visit. It detects privacy policies, scrapes their content, identifies potentially concerning keywords, and assigns a privacy score based on the findings.

This project is being developed as part of a group project for CS4930: Privacy and Censorship.

Features
==================
Automatically finds links to privacy policies on web pages
Detects changes to the page and scans for newly loaded privacy links
(Planned) Scrapes privacy policy content
(Planned) Parses the content for concerning keywords
(Planned) Calculates and displays a privacy risk score

How It Works
================
1. Content Script (content.js):
-Searches for links that include the word "privacy."
-Logs the link to the console if found.
-Observes dynamic page changes to catch privacy links that load later.

2. Manifest (manifest.json):
-Registers the content script to run on all URLs.
-Declares permissions to interact with page content and store analysis results.

3. Next Steps (In Development):
-Follow the privacy policy link and scrape its content.
-Analyze the scraped content for concerning privacy keywords.
-Generate a privacy score and display it to the user (via popup or injected into the page).

Installation (For Testing)
===========================
Clone or download the repository.
Open Chrome and go to chrome://extensions/.
Enable Developer Mode.
Click Load unpacked and select the extension folder.
Navigate to any website and open the console to see privacy link detection in action.

Planned Keyword Detection
========================
-third-party
-data retention
-sale of data
-cookies
-personal information
-advertising
-opt-out
-And more...


Files
=========
File	        Purpose
content.js	    Scans for privacy policy links and observes DOM changes
manifest.json	Configures extension settings and permissions
.gitignore	    Ignores unnecessary files and folders
README.md	    Project overview and documentation

Roadmap
========
 Detect privacy policy links
 Scrape privacy policy content
 Parse for concerning keywords
 Calculate privacy score
 Display results in extension popup or webpage overlay


Team
=======
Gunnar Anderson
Tyler Andrews
Morgan Parker