// Summarizes the text and returns the text summary.
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

// Segments the text and returns an array of text segments.
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

// Answers questions based on a given context and returns the answer.
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

// Updates the DOM with the extension's sidebar UI.
function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.id = 'ai21-sidebar';
  sidebar.innerHTML = `
    <style>
      #ai21-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        z-index: 9999;
        background-color: #f9f9f9;
        border-left: 1px solid #ccc;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
      }
      #summarized-content {
        margin-bottom: 20px;
      }
    </style>
    <h1>Summary</h1>
    <div id="summarized-content">Loading...</div>
    <h1>Q&A</h1>
    <input type="text" id="question-input" placeholder="Ask a question">
    <button id="ask-button">Ask</button>
    <div id="qa-section"></div>
  `;
  document.body.appendChild(sidebar);
}

async function processArticle(apiKey) {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  if (!article || !article.content) {
    return;
  }

  createSidebar();

  const summaryDiv = document.getElementById("summarized-content");

  const askButton = document.getElementById("ask-button");
  askButton.addEventListener("click", async () => {
    const questionInput = document.getElementById("question-input");
    const question = questionInput.value;

    // Create a container for questions and answers
    const qaSection = document.getElementById("qa-section");
    const qaDiv = document.createElement("div");
    qaDiv.id = "qa-div";

    // Add the question to the div
    const questionElement = document.createElement("p");
    questionElement.classList.add('question');
    questionElement.innerHTML = `<b>Q:</b> ${question}`;
    qaDiv.appendChild(questionElement);

    // Add a temporary answer to the div
    const answerElement = document.createElement("p");
    answerElement.classList.add('answer');
    answerElement.innerHTML = "<b>A:</b> loading...";
    qaDiv.appendChild(answerElement);

    // Append the div to the container
    qaSection.appendChild(qaDiv);

    // Fetch the anprocessArticleswer and update the answer element
    const answer = await answerQuestion(apiKey, article.content, question);
    answerElement.innerHTML = `<b>A:</b> ${answer}`;
  });

  // Request the summary asynchronously
  summarizeText(apiKey, article.textContent).then(summary => {
    summaryDiv.innerHTML = summary;
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
