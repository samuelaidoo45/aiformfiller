
function collectInputValues() {
    const inputs = document.querySelectorAll('input, textarea');
    const inputValues = [];

    inputs.forEach(input => {
        let inputInfo = {};

        if (input.id) {
            inputInfo['id'] = input.id;
        }
        if (input.name) {
            inputInfo['name'] = input.name;
        }
        if (input.placeholder) {
            inputInfo['placeholder'] = input.placeholder;
        }
        if (input.type) {
            inputInfo['type'] = input.type;
        }

        inputInfo['value'] = "";

        inputValues.push(inputInfo);
    });

    // Ensure only unique values are collected
    const uniqueValues = [];
    inputValues.forEach(input => {
        if (!uniqueValues.some(item => item.id === input.id)) {
            uniqueValues.push(input);
        }
    });

    return uniqueValues;
}

function simulateEvent(element, eventType) {
    const event = new Event(eventType, {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
}

function setInputValue(inputField, value) {
    // Set value
    inputField.value = value;
    // Trigger events to simulate user input
    simulateEvent(inputField, 'input');
    simulateEvent(inputField, 'change');
    simulateEvent(inputField, 'blur');
}

let listenerAdded = false;

if (!listenerAdded) {

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "getInputValues") {
            const values = collectInputValues(); 

            fetch('https://tivateonline.com/aiformfiller.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(response => response.json()) // parse the response body as JSON
            .then(data => {
                data.forEach(item => {
                    let inputField = document.getElementById(item.id);
                    if (inputField) {
                        setInputValue(inputField, item.value);
                    }
                });

                // For select elements, randomly select an option
                const selects = document.querySelectorAll('select');
                selects.forEach(select => {
                    const options = select.options;
                    const randomIndex = Math.floor(Math.random() * options.length);
                    select.selectedIndex = randomIndex;
                    // Trigger change event for select element
                    simulateEvent(select, 'change');
                });

                // For radio buttons, randomly check an option
                const radios = document.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    const randomIndex = Math.floor(Math.random() * 2);
                    radio.checked = randomIndex === 0;
                    // Trigger change event for radio button
                    simulateEvent(radio, 'change');
                });

                // For checkboxes, randomly check/uncheck
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    const randomIndex = Math.floor(Math.random() * 2);
                    checkbox.checked = randomIndex === 0;
                    // Trigger change event for checkbox
                    simulateEvent(checkbox, 'change');
                });

                // Submit the form after values are set
                const form = document.querySelector('form');
                if (form) {
                    simulateEvent(form, 'submit');
                }
            })
            .catch(error => console.log('Error:', error));
        }
    });

    // Set the flag to true after adding the listener
    listenerAdded = true;
}
