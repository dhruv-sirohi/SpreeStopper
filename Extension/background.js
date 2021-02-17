//Functions are boilerplate backend code

let db = null;

function create_database(){
    const request = window.indexedDB.open('database_1');
    request.onerror = function(event){
        console.log("Problem opening database")
    }

    request.onupgradeneeded = function(event){
        db=event.target.result; 

        let objectStore = db.createObjectStore('roster',{keyPath : 'id'});

        objectStore.transaction.oncomplete = function(event){
            console.log("Object store created");
        }
    }

    request.onsuccess = function(event){
      console.log("Database opened");
      insert_records(roster);
    }
}

function destroy_database(){
    const request = window.indexedDB.deleteDatabase('database_1');
    request.onerror = function(event){
        console.log("Problem deleting database")
    }

    request.onsuccess = function(event){
      console.log("Database deleted");

    }
}
function get_records(id) {
    if (db) {

      const get_transaction = db.transaction("roster", "readonly");
      const objectStore = get_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
        get_transaction.oncomplete = function () {
          console.log("All get transactions complete");
        }
        get_transaction.onerror = function () {
          console.log("Get transaction error")
        }
        let request = objectStore.get(id);
        request.onsuccess = function (event) {
          resolve(event.target.result);
        }
      });
    }
  }
function insert_records(wage){
        if(db){
            const insert_transaction = db.transaction("roster","readwrite");
            const objectStore = insert_transaction.objectStore("roster");
            return new Promise((resolve,reject) => {
                insert_transaction.onerror = function(){
                    console.log("Issue when adding");
                    resolve(false);
                }
                insert_transaction.oncomplete = function(){   
                    resolve(true);
                }
                roster.forEach(person => {
                   let request = objectStore.add(person);
                    request.onsuccess = function(){
                        console.log("Added: ", person);
                    }
                })  
            });
            
        }
    
    }
function update_records(id){
        if(db){
            const put_transaction = db.transaction("roster","readwrite");
            const objectStore = put_transaction.objectStore("roster");
            return new Promise((resolve,reject) => {
                put_transaction.onerror = function(){
                    console.log("Issue when updating");
                    resolve(false);
                }
                put_transaction.oncomplete = function(){
                    console.log("No issue when updating");
                    resolve(true);
                }
                objectStore.put(id);  
        });
}
}

function delete_records(id){
    if(db){
        const delete_transaction = db.transaction("roster","readwrite");
        const objectStore = delete_transaction.objectStore("roster");
        return new Promise((resolve,reject) => {
        delete_transaction.onerror = function(){
            console.log("Issue when deleting");
            resolve(false);
        }
        delete_transaction.oncomplete = function(){
            console.log("No issue when deleting");
            resolve(true);
        }
        let request = objectStore.delete(id);
    });    
    }   
}

//The following code is chrome-specific code that interfaces with extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //upon insert request, inserts contents and sends response
    if(request.message === 'insert'){
        let insert_request = insert_records(request.payload);
        insert_request.then(res =>{
            chrome.runtime.sendMessage({
            message: "insert_success",
            payload: res
        })
    })
    }

    else if(request.message === 'get'){
        //upon get request, retrieves relevant contents, responds with an update message to sitescraping script
        const get_transaction = db.transaction("roster", "readonly");
        const objectStore = get_transaction.objectStore("roster");
        var objectStoreRequest = objectStore.get("user_wage");
        objectStoreRequest.onsuccess = function(event) {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": ["update_scrape",objectStoreRequest.result.wage]});
           });
          }
    }

    //upon update request, changes stored records to match new information, responds upon success
    else if(request.message === 'update'){
        //since the extension only currently allows one user profile, updates are done by deleting and remaking a user profile due to some bugs
        //(a streamlined process is a current TODO)
    
        delete_records("user_wage");
        roster = [{
            'id' : "user_wage",
            "wage": request.payload
            }]
        
        insert_records(roster);
        
        chrome.runtime.sendMessage({
            message: "update_success",
            payload: true
    });
}
    //deletes information upon delete request
    else if(request.message === 'delete'){
        let request = delete_records(request.payload);
        request.then(res =>{
            chrome.runtime.sendMessage({
            message: "delete_success",
            payload: res
        })
    })
    }
});


//initializes with minimum wage
let roster = [{
'id' : "user_wage",
"wage": 11.06
}]

destroy_database();
create_database();
//This creates a new local database at every fresh install of the extensions (prevents bugs)
