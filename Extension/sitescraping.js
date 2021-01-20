 //probs make an array of book

//UI

//add hover over cost text w/ CAD price
var new_run = false;
chrome.runtime.sendMessage({
    message: 'get',
    payload: "user_wage"
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message[0] === "start" ) {
        new_run = true;
        j = 75;
        hourly_wages =request.message[1]; 
        transformpage(request.message[1]);
           }
    }
  );

  var hourly_wages = 11.06;
  var price1 = document.querySelector("#priceblock_ourprice");
  var final_price_text = null;
  let cost_dec = -3.1415;
  let cost_text = "sample_text"

function changehourly(new_wage){
    hourly_pay = new_wage;
}    

function transformpage(hourly_pay){
    
var price1 = document.querySelector("#priceblock_ourprice");
if (price1 != null){
    
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
price2 = document.querySelector("#priceblock_dealprice");
if (price2 != null){
    var price_innerText = price2.innerText;
    if (final_price_text != null)
    {
        price2.innerText = final_price_text;
    }
    else{
        price2.innerText = price_innerText;
    }
}

book = document.querySelector("#priceblock_ourprice_lbl");
if (book != null){
    book.innerText = 'Cost:';    
}
price3 = document.querySelector("#price_inside_buybox");
if (price3 != null){
    var price_innerText = price3.innerText;
    if (final_price_text != null)
    {
        price3.innerText = final_price_text;
    }
    else{
        price3.innerText = price_innerText;
    }
}
if (document.getElementById("submit.add-to-cart-announce") != null){
    book = document.getElementById("submit.add-to-cart-announce")
    book.textContent = 'Cooldown: 75 sec';    
}


if (document.getElementById("add-to-cart-button") != null){
    book = document.getElementById("add-to-cart-button");
    book.type = "None";
}



if (document.getElementById("submit.buy-now-announce") != null){
    book = document.getElementById("submit.buy-now-announce");
    
    book.textContent = 'Cooldown: 75 sec';    
}


if (document.getElementById("buy-now-button") != null){
    book1 = document.getElementById("buy-now-button");
    book1.type = "None";
    
}
   
}

var timer;
var j=75;
var dec = 5;
if(document.getElementById("submit.buy-now-announce") != null){
    setInterval(function() {increment()}, 5000);
    }


function increment() {
book = document.getElementById("submit.buy-now-announce");
book1 = document.getElementById("submit.add-to-cart-announce")
 if(j>dec){
    j = j - dec;
    if ( book != null){
    book.textContent = "Cooldown: " + j + " seconds";   
    } 
    if ( book1 != null){
        book1.textContent = "Cooldown: " + j + " seconds";   
        }    
}
 else {
  clearInterval(timer);
  book = document.getElementById("add-to-cart-button");
  book.type = "submit";
  book = document.getElementById("buy-now-button");
  book.type = "submit";
  book = document.getElementById("submit.buy-now-announce");
  book.textContent = 'Buy Now';    
  book = document.getElementById("submit.add-to-cart-announce")
  book.textContent = 'Add to Cart';    
 }
}
