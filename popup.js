document.getElementById('readInputs').addEventListener('click', async () => {
    
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      files : [ "content.js" ],
    })
    .then(async () => {
        const response = await chrome.tabs.sendMessage(tab.id, { action: "getInputValues" });
        document.getElementById('output').textContent = JSON.stringify(response, null, 2);
    });
});