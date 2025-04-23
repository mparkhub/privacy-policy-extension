console.log("Popup script loaded");
document.addEventListener("DOMContentLoaded", function () {
  const loadingEl = document.getElementById("loading");
  const resultEl = document.getElementById("result");
  const riskDisplay = document.getElementById("riskDisplay");
  const progressBar = document.getElementById("progressBar");
  const siteInfo = document.getElementById("siteInfo");
  const keywordsList = document.getElementById("keywordsList");
  const clearCloseBtn = document.getElementById("clearCloseBtn");
  
function resizePopupToContent() {
  const card = document.querySelector('.card');
  const loading = document.getElementById('loading');
  let newHeight = 0;

  if (card && card.offsetHeight > 0) {
    newHeight = card.offsetHeight + 40; // Padding for outer layout
  } else if (loading && loading.offsetHeight > 0) {
    newHeight = loading.offsetHeight + 40; // Account for loading state
  }

  if (newHeight > 0 && newHeight < 600) {
    document.body.style.height = `${newHeight}px`;
  }
  setTimeout(resizePopupToContent, 100);

}


  const riskColor = {
    "Low Risk": "green",
    "Moderate Risk": "yellow",
    "Elevated Risk": "orange",
    "High Risk": "red",
    "Severe Risk": "darkred"
  };

  chrome.storage.local.get("lastAnalysis", (data) => {
    loadingEl.style.display = "none";

    if (!data.lastAnalysis) {
      loadingEl.innerHTML = `
        <div style="
          border: 1px dashed #666;
          border-radius: 10px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          color: #aaa;
          text-align: center;
          font-family: sans-serif;
        ">
          <h2 style="font-size: 18px; margin-bottom: 8px;">No Privacy Policy Detected</h2>
          <p style="font-size: 13px;">Try visiting a website that clearly displays a privacy policy or refresh this extension.</p>
          <p style="font-size: 12px; margin-top: 10px; font-style: italic;">(We can't analyze what isn't there... yet!)</p>
        </div>
      `;
      loadingEl.style.display = "block";
      return;
    }


    resultEl.style.display = "block";
    const { url, result: analysis } = data.lastAnalysis;

    const score = analysis.score;
    const risk = analysis.riskScore;

    // Display risk
    riskDisplay.textContent = risk;
    riskDisplay.style.backgroundColor = riskColor[risk] || "gray";
    riskDisplay.style.color = "white";
    riskDisplay.style.padding = "4px";
    riskDisplay.style.borderRadius = "8px";

    // Display progress
    progressBar.innerHTML = `<div style="background-color:#ccc;height:8px;width:100%;border-radius:4px;overflow:hidden;">
      <div style="background-color:${riskColor[risk] || "gray"};width:${Math.min((score / 250) * 100, 100)}%;height:100%"></div>
    </div>`;

    // Display site
    siteInfo.innerHTML = `<small>Site: <span style="text-decoration:underline;">${url}</span></small>`;

    for (const [label, data] of Object.entries(analysis.keywordsFound)) {
      const li = document.createElement("li");
      li.textContent = `${label}: ${data.count} hit(s), weight ${data.weight}`;

      const weight = Number(data.weight);
      if (data.weight >= 8) {
        li.style.color = "red";
      } else if (data.weight >= 5) {
        li.style.color = "orange";
      } else if (data.weight >= 3) {
        li.style.color = "yellow";
      } else {
        li.style.color = "lightgreen";
      }

      keywordsList.appendChild(li);
    }
    resizePopupToContent();

  });

  clearCloseBtn.addEventListener("click", () => {
    chrome.storage.local.clear(() => window.close());
    
    // Matrix Rain Animation
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 400;

const letters = "abcdefghijklmnopqrstuvwxyz0123456789$#@!";
const fontSize = 12;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

function loopMatrix() {
  drawMatrix();
  requestAnimationFrame(loopMatrix);
}
loopMatrix();

  });
});

