//use wage value to compute hours worked
//parses input from popup for $ or other characters that we'd need to remove

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

    else if(request.message === 'update'){
        
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

let roster = [{
'id' : "user_wage",
"wage": 11.06
}]

let db = null;

function create_database(){
    const request = window.indexedDB.open('database_1');
    request.onerror = function(event){
        console.log("problem opening database")
    }

    request.onupgradeneeded = function(event){
        db=event.target.result; 

        let objectStore = db.createObjectStore('roster',{keyPath : 'id'});

        objectStore.transaction.oncomplete = function(event){
            console.log("object store created");
        }
    }

    request.onsuccess = function(event){
      console.log("database opened");
      insert_records(roster);
    }
}

function destroy_database(){
    const request = window.indexedDB.deleteDatabase('database_1');
    request.onerror = function(event){
        console.log("problem deleting database")
    }

    request.onsuccess = function(event){
      console.log("database deleted");

    }
}
function get_records(email) {
    if (db) {

      const get_transaction = db.transaction("roster", "readonly");
      const objectStore = get_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
        get_transaction.oncomplete = function () {
          console.log("All get transactions complete");
        }
        get_transaction.onerror = function () {
          console.log("get transaction error")
        }
        let request = objectStore.get(email);
        request.onsuccess = function (event) {
          resolve(event.target.result);
        }
      });
    }
  }
    function insert_records(records){
        if(db){
            const insert_transaction = db.transaction("roster","readwrite");
            const objectStore = insert_transaction.objectStore("roster");
            return new Promise((resolve,reject) => {
                insert_transaction.onerror = function(){
                    console.log("issue adding ppl");
                    resolve(false);
                }
                insert_transaction.oncomplete = function(){
                    console.log("no issue adding ppl");
                    
                    resolve(true);
                }
                roster.forEach(person => {
                   let request = objectStore.add(person);
                    request.onsuccess = function(){
                        console.log("added: ", person);
                    }
                })  
            });
            
        }
    
    }
function update_records(record){
        if(db){
            const put_transaction = db.transaction("roster","readwrite");
            const objectStore = put_transaction.objectStore("roster");
            return new Promise((resolve,reject) => {
                put_transaction.onerror = function(){
                    console.log("issue updating ppl");
                    resolve(false);
                }
                put_transaction.oncomplete = function(){
                    console.log("no issue updating ppl");
                    resolve(true);
                }
                objectStore.put(record);  
        });
}
}

function delete_records(email){
    if(db){
        const delete_transaction = db.transaction("roster","readwrite");
        const objectStore = delete_transaction.objectStore("roster");
        return new Promise((resolve,reject) => {
        delete_transaction.onerror = function(){
            console.log("issue deleting ppl");
            resolve(false);
        }
        delete_transaction.oncomplete = function(){
            console.log("no issue deleting ppl");
            resolve(true);
        }
        let request = objectStore.delete(email);
    });    
    }   
}

destroy_database();
create_database();
