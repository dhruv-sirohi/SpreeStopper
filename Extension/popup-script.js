//https://stackoverflow.com/questions/29926598/sendmessage-from-popup-to-content-js-not-working-in-chrome-extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'update_success') {
        if (request.payload) {
            document.querySelectorAll('.add_rec_input').forEach(el => el.value = '');
            document.getElementById('wage-record').innerText = "Changes Saved";
            chrome.runtime.sendMessage({
                message: 'get',
                payload: "user_wage"
            });
        
        }
    }
    if (request.message === 'get_success' && false) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            console.log(request.payload);
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": ["start",request.payload]});
           });
    }

});

// ADD A RECORD

document.getElementById('wage-record').addEventListener('click', event => {
    event.preventDefault();
    let search_term = document.getElementById('wage').value;

    chrome.runtime.sendMessage({
        message: 'update',
        payload: search_term
    });
});
