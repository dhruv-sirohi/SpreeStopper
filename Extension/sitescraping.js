
var hourly_wages = 11.06;
var price1 = document.querySelector("#priceblock_ourprice");
var final_price_text = null;

let cost_dec = -3.1415;
let cost_text = "sample_text"
//^ Sample values used so that script can differentiate betweem first and future page transformations

var cooldown_labels = ["submit.buy-now-announce","submit.add-to-cart-announce"];
var disable_labels = ["add-to-cart-button","buy-now-button"];
var price_labels = ["#priceblock_dealprice","#price_inside_buybox"];
var price_text_labels = ["#priceblock_ourprice_lbl"];
//arrays with labels of which elements to transform


var new_run = false;
chrome.runtime.sendMessage({
    message: 'get',
    payload: "user_wage"
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message[0] === "update_scrape" ) {
        new_run = true;
        cooldown_timer = 75;
        hourly_wages =request.message[1]; 
        transformpage(request.message[1]);
           }
    }
  );
  
function changehourly(new_wage){
    hourly_pay = new_wage;
}    

function transformpage(hourly_pay){
    
var price1 = document.querySelector("#priceblock_ourprice");
if (price1 != null){
    //Refines price text input, converts to number 
    var price_innerText = price1.innerText;
    if (cost_text == "sample_text"){
        cost_text = price1.innerText;
    }
    var price_text = "";
    var i;
    var ascii_val = 0;
    
    
    for(i = 0; i<price_innerText.length; i++)
    {   ascii_val = price_innerText.charCodeAt(i);
        
        if(ascii_val <= 57 && ascii_val >= 46 && ascii_val != 47){
            price_text += price_innerText[i];
           
        }
    }
    if(price_text.length > 0){
        if (cost_dec ==  -3.1415)
        {
        cost_dec = parseInt(price_text, 10);
        }
    }
    var time_val = cost_dec / hourly_pay;
    var hrs = Math.floor(time_val);
    var mins = time_val - hrs;
    
    mins = mins * 60;
    
    if (cost_dec >= 0){
        final_price_text = hrs + " hrs " + Math.round(mins) + " mins of work\n";
        price1.innerText = final_price_text;
        price1.title = cost_text;
    }
    else{
        price1.innerText = "Error in determining time cost; " + price_innerText;
        price1.title = cost_text;
    }
    
}

for(i = 0; i< price_labels.length; i++)
{
    if (document.getElementById(price_labels[i]) != null){
        document.getElementById(price_labels[i]).textContent = final_price_text;  
    }    
}

for(i = 0; i< price_text_labels.length; i++)
{
    if (document.getElementById(price_text_labels[i]) != null){
        document.getElementById(price_text_labels[i]).textContent = 'Cost:';  
    }    
}

for(i = 0; i< cooldown_labels.length; i++)
{
    if (document.getElementById(cooldown_labels[i]) != null){
        document.getElementById(cooldown_labels[i]).textContent = 'Cooldown: 75 sec';  
    }    
}

for(i = 0; i< disable_labels.length; i++)
{
    if (document.getElementById(disable_labels[i]) != null){
        document.getElementById(disable_labels[i]).type = 'None';  
    }    
}

//To Do: write function to do element modification more efficiently (instead of having 4 for loops)

}

var timer;
var cooldown_timer=75;
var dec = 5;
//Decrements by 5 every 5 seconds (counting down each second is distracting + 5 sec decrement..
//..makes time appear to pass slower
if(document.getElementById("submit.buy-now-announce") != null){
    setInterval(function() {increment()}, 5000);
    }


function increment() {
buy_button = document.getElementById("submit.buy-now-announce");
cart_button = document.getElementById("submit.add-to-cart-announce")
 if(cooldown_timer>dec){
    cooldown_timer = cooldown_timer - dec;
    if ( buy_button != null){
    buy_button.textContent = "Cooldown: " + cooldown_timer + " seconds";   
    } 
    if ( cart_button != null){
    cart_button.textContent = "Cooldown: " + cooldown_timer + " seconds";   
        }    
}
 else {
  clearInterval(timer);
  //Allows user to normally access buy functionalities
  document.getElementById("add-to-cart-button").type = "submit";
  document.getElementById("submit.add-to-cart-announce").textContent = 'Add to Cart';
  document.getElementById("buy-now-button").type = "submit";
  document.getElementById("submit.buy-now-announce").textContent = 'Buy Now';    
 }
}
