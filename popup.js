const apiKeyForm = document.getElementById("api-key-form");
const apiKeyInput = document.getElementById("api-key-input");
const processArticleBtn = document.getElementById("process-article-btn");

function saveAPIKey(e) {
  e.preventDefault();
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    chrome.storage.sync.set({ AI21_API_KEY: apiKey }, () => {
      alert("API Key saved.");
    });
  } else {
    alert("Please enter a valid API Key.");
  }
}

function loadAPIKey() {
  chrome.storage.sync.get(["AI21_API_KEY"], (result) => {
    if (result.AI21_API_KEY) {
      apiKeyInput.value = result.AI21_API_KEY;
    }
  });
}

function processArticle() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "processArticle" });
  });
}

apiKeyForm.addEventListener("submit", saveAPIKey);
processArticleBtn.addEventListener("click", processArticle);
document.addEventListener("DOMContentLoaded", loadAPIKey);

