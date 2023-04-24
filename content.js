// Function to summarize text
async function summarizeText(apiKey, text) {
  const response = await fetch("https://api.ai21.com/studio/v1/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      sourceType: "TEXT",
      source: text
    })
  });

  const data = await response.json();
  return data.summary;
}

// Function to segment text
async function segmentText(apiKey, text) {
  const response = await fetch("https://api.ai21.com/studio/v1/segmentation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      sourceType: "TEXT",
      source: text
    })
  });

  const data = await response.json();
  return data.segments;
}

// Function to answer questions
async function answerQuestion(apiKey, context, question) {
  const response = await fetch("https://api.ai21.com/studio/v1/experimental/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      context: context,
      question: question
    })
  });

  const data = await response.json();
  return data.answer;
}

async function processArticle(apiKey) {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  if (!article || !article.content) {
    return;
  }

  const segments = await segmentText(apiKey, article.content);
  let summarizedContent = "";

  for (const segment of segments) {
    const summary = await summarizeText(apiKey, segment);
    summarizedContent += `<p>${summary}</p>`;
  }

  const summaryDiv = document.createElement("div");
  summaryDiv.innerHTML = summarizedContent;
  summaryDiv.id = "summarized-content";
  document.body.appendChild(summaryDiv);

  // Add an input field and a button to ask questions
  const questionInput = document.createElement("input");
  questionInput.type = "text";
  questionInput.id = "question-input";
  questionInput.placeholder = "Ask a question";
  document.body.appendChild(questionInput);

  const askButton = document.createElement("button");
  askButton.id = "ask-button";
  askButton.innerHTML = "Ask";
  document.body.appendChild(askButton);

  askButton.addEventListener("click", async () => {
    const question = questionInput.value;
    const answer = await answerQuestion(apiKey, article.content, question);
    alert(`Answer: ${answer}`);
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "processArticle") {
    chrome.storage.sync.get(["AI21_API_KEY"], (result) => {
      if (result.AI21_API_KEY) {
        processArticle(result.AI21_API_KEY);
      } else {
        alert("Please enter your AI21 API Key in the extension popup.");
      }
    });
  }
});
