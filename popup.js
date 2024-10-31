// G// Get the button
const button = document.getElementById('readInputs');

// Check if the button already has an event listener
if (button._handleClick) {
    // Remove the previous event listener
    button.removeEventListener('click', button._handleClick);
}

// Define the event handler function
async function handleClick() {
    button.textContent = 'Loading...'; // change the button text to 'Loading...'
    button.disabled = true; // disable the button

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
    });

    const response = await chrome.tabs.sendMessage(tab.id, { action: "getInputValues" });

    setTimeout(() => {
        button.textContent = 'Fill Form'; // change the button text back to 'Fill Form'
        button.disabled = false; // enable the button
    }, 7000); // delay of 7000 milliseconds (7 seconds)
}

// Store the event handler function on the button
button._handleClick = handleClick;

// Add the event listener
button.addEventListener('click', button._handleClick);