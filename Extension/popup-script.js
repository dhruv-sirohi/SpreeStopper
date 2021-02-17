//https://stackoverflow.com/questions/29926598/sendmessage-from-popup-to-content-js-not-working-in-chrome-extension -> Stack Overflow page used to troubleshoot problem
//Javascript code that updates the saved wage information when the user clicks the 'submit' button.

// This code checks for when the button is pressed, and then sends an update message with the new wage value
document.getElementById('wage-record').addEventListener('click', event => {
    event.preventDefault();
    let search_term = document.getElementById('wage').value;
    chrome.runtime.sendMessage({
        message: 'update',
        payload: search_term
    });
});

// Checks for response to update request to see if update was successful
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'update_success') {
        //Updates Popup text when wage values are saved
        //Sends get request, which is used by sitescraping script to update the website
        if (request.payload) {
            //Clears the text box
            document.querySelectorAll('.add_rec_input').forEach(el => el.value = '');
            //Changes text on button
            document.getElementById('wage-record').innerText = "Changes Saved";
            chrome.runtime.sendMessage({
                message: 'get',
                payload: "user_wage"
            });
        
        }
    }
    //If update isn't successful, sends a custom update_scrape message to sitescraping script to still update the website
    if (request.message === 'get_success' && false) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            console.log(request.payload);
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": ["update_scrape",request.payload]});
           });
    }

});
