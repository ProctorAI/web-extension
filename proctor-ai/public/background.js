chrome.runtime.onInstalled.addListener(() => {
  console.log("Proctoring extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});
