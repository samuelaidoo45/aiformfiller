function collectInputValues() {
    const inputs = document.querySelectorAll('input, textarea,select');
    const inputValues = [];


    inputs.forEach(input => {
        let id = input.id || "";
        let name = input.name || "";
        let type = input.type || "";
        
            let inputInfo = {};

            if (input.labels.length > 0) {
                inputInfo['label'] = input.labels[0].innerText;
            }
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

    return inputValues;

}

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
                inputField.value = item.value;
            }

            
        });

        //For select elements,radio and checkbox elements randomly select an option
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            const options = select.options;
            const randomIndex = Math.floor(Math.random() * options.length);
            select.selectedIndex = randomIndex;
        });

        const radios = document.querySelectorAll('input[type="radio"]');

        radios.forEach(radio => {
            const randomIndex = Math.floor(Math.random() * 2);
            radio.checked = randomIndex === 0;
        });

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            const randomIndex = Math.floor(Math.random() * 2);
            checkbox.checked = randomIndex === 0;
        });

        

    })
    .catch(error => console.log('Error:', error));
        //sendResponse(values);
    }
});

