# SpreeStopper
Chrome browser extension targeted at impulse shoppers, written using JavaScript with the Google Chrome.Tabs and IndexedDB APIs. 

The extension injects JavaScript that finds item price on Amazon and converts it to hours worked, using an hourly wage input by the user. The default hourly wage is set to CAD 11.06 (federal minimum wage). The user's custom wage information is stored locally using IndexedDB. The Google Chrome.Tabs API is used to communicate between extension, the backend, and the injected content script.

## Features:

1. Cost Saliency: Replaces item price with the hours worked, which adds an element of tangible cost to spending money online.

2. Cooldown Timer: Sets a 75 second cooldown timer for the 'Add to Cart' and 'Buy Now' buttons. As the user considers the value of this purchase, System 2 thinking is activated, allowing for rational and non-impulse driven decision making.
