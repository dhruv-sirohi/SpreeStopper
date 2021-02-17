//This script is used to:
//parse shop webpages, find item price, calculate equivalent time worked, and replace all price text with time text
//place Buy and Add to Cart buttons on a cooldown

//Initialization values 
var hourly_wages = 11.06; //minimum wage
var final_price_text = null;

let cost_dec = -3.1415;
let cost_text = "sample_text"
//^ Sample values used upon initialization, but changed after first page transformation

//arrays with the id's of elements to transform
var cooldown_labels = ["submit.buy-now-announce","submit.add-to-cart-announce"];
var disable_labels = ["add-to-cart-button","buy-now-button"];
var price_labels = ["#priceblock_dealprice","#price_inside_buybox"];
var price_text_labels = ["#priceblock_ourprice_lbl"];

var new_run = false;

//asks backend for wage value
chrome.runtime.sendMessage({
    message: 'get',
    payload: "user_wage"
});

//upon receiving 'update_scrape' response, it updates the page with new wage information
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message[0] === "update_scrape" ) {
        new_run = true;
        cooldown_timer = 75;
        hourly_wages =request.message[1]; 
        //calls function which updates page
        transformpage(request.message[1]);
           }
    }
  );

//parses page for price information, converts it to a number, and uses that to calculate time worked
//price information is replaced by time worked
function transformpage(hourly_pay){
var price1 = document.querySelector("#priceblock_ourprice");
if (price1 != null){
    //Refines price text input, converts to number 
    var price_innerText = price1.innerText;
   
    //only changes cost_text value once after each page refresh
    //otherwise, if price information is already replaced by time worked..
    //..the page will then copy time worked text, and incorrectly use that for calculations
    if (cost_text == "sample_text"){
        cost_text = price1.innerText;
    }
    
    var price_text = "";
    var i;
    var ascii_val = 0;
    
    for(i = 0; i<price_innerText.length; i++)
    {   ascii_val = price_innerText.charCodeAt(i);
        //parses price for digit values, stores that as a string
        if(ascii_val <= 57 && ascii_val >= 46 && ascii_val != 47){
            price_text += price_innerText[i];
        }
    }
    
    if(price_text.length > 0){
        //if statement's condition is only true on first run-through after page refresh
        if (cost_dec ==  -3.1415)
        {
        //parseInt converts string to base-10 digit
        cost_dec = parseInt(price_text, 10);
        }
    }
    
    //converts price number to time worked
    
    var time_val = cost_dec / hourly_pay;
    var hrs = Math.floor(time_val);
    var mins = time_val - hrs;
    mins = mins * 60;
    
    //saves time worked as a string
    if (cost_dec >= 0){
        final_price_text = hrs + " hrs " + Math.round(mins) + " mins of work\n";
        price1.innerText = final_price_text;
        
        //Allows user to see monetary price if they hover over price text
        price1.title = cost_text;
       
    }
    else{
        price1.innerText = "Error in determining time cost; " + price_innerText;
        price1.title = cost_text;
    }
}

//Iterates through all 'price text' elements 
//Changes item price with time worked
for(i = 0; i< price_labels.length; i++)
{
    if (document.getElementById(price_labels[i]) != null){
        document.getElementById(price_labels[i]).textContent = final_price_text;  
    }    
}

//Iterates through all 'price text label' elements 
//Changes 'Price:' labels to 'Cost:', as this works better with a time value
for(i = 0; i< price_text_labels.length; i++)
{
    if (document.getElementById(price_text_labels[i]) != null){
        document.getElementById(price_text_labels[i]).textContent = 'Cost:';  
    }    
}

//Iterates through all 'Buy Now' and 'Add to Cart' text elements 
//Changes text with a countdown
for(i = 0; i< cooldown_labels.length; i++)
{
    if (document.getElementById(cooldown_labels[i]) != null){
        document.getElementById(cooldown_labels[i]).textContent = 'Cooldown: 75 sec';  
    }    
}

//Iterates through all 'Buy Now' and 'Add to Cart' button elements 
//Disables button
for(i = 0; i< disable_labels.length; i++)
{
    if (document.getElementById(disable_labels[i]) != null){
        document.getElementById(disable_labels[i]).type = 'None';  
    }    
}
}

//initializes values for the cooldown timer
var timer;
var cooldown_timer=75;
var dec = 5;
//Decrements by 5 every 5 seconds (counting down each second is distracting + 5 sec decrement..
//..makes time appear to pass slower
if(document.getElementById("submit.buy-now-announce") != null){
    setInterval(function() {increment()}, 5000);
    }

//Function which finds 'Add to Cart' and 'Buy Now' text elements, and updates their text with time remaining every 5 seconds
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
 //Reverts buttons to normal after cooldown ends
 else {
  clearInterval(timer);
  document.getElementById("add-to-cart-button").type = "submit";
  document.getElementById("submit.add-to-cart-announce").textContent = 'Add to Cart';
  document.getElementById("buy-now-button").type = "submit";
  document.getElementById("submit.buy-now-announce").textContent = 'Buy Now';    
 }
}
