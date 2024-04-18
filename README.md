# PageShark

PageShark is a Chrome extension that uses AI21 API to analyze text on a webpage. The extension will create a sidebar that provides an article summary and a Q&A tool allowing for interactive questioning of the webpage's content.

![PageShark Demo](https://cryptid-megalodon.github.io/images/PageSharkDemo.png)

## Features
* Summarizes the body of the webpage.
* Provides Q&A tool. Ask any question about the webpage content and get an answer.
* Compatible with extremely long web-pages (even webpages that exceed the context window of the LLM)
* Compatible with most webpages
* Easy-to-use extension.

## Installation
1) Clone this repository to your local machine:
bash```git clone https://github.com/cryptid-megalodon/page-shark.git```
2) Open Google Chrome, and navigate to chrome://extensions/.
3) Enable "Developer mode" in the top right corner of the page.
4) Click "Load unpacked" and select the page-shark directory.
The extension is now installed and ready to use. You can now find the PageShark Extension in your chromium-based browser extensions toolbar.

## Dependencies
* AI21 API Key: This extension uses the AI21 API and requires an API key to run. The first time you use the extension, you'll need to enter in your API key in the extension pop-up. The API key is stored locally in your browser for future use. Using this extension calls the AI21 API and may incur costs. See AI21 for pricing.

## Usage
1) Navigate to a webpage containing text that you'd like to analyze.
2) Click the PageShark Extension icon in your browser's toolbar.
3) Click the "Process Article" button in the popup.

The extension will process the text on the page and display the summary and Q&A box.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or create an issue to report bugs or suggest new features.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
