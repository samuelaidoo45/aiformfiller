function collectInputValues() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const inputValues = {};

    inputs.forEach(input => {
        let id = input.id || "";
        let name = input.name || "";
        let type = input.type || "";
        
       
        // if (input.type === 'checkbox' || input.type === 'radio') {
        //     if (input.checked) {
        //         if (inputValues[input.name]) {
        //             inputValues[input.name].push(input.value);
        //         } else {
        //             inputValues[input.name] = [input.value];
        //         }
        //     }
        // } else {
        //     inputValues[input.id] = input.value;
        // }
    });

    let selects = document.querySelectorAll('select');

    let textareas = document.querySelectorAll('textarea');

    return inputValues;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getInputValues") {
        const values = collectInputValues();
        sendResponse(values);
    }
});