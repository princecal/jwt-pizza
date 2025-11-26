# Curiosity Report: Har Files

HTTP Archive files, or Har for short, were created to serve as a deveolpment tool for web browsers. Seeking a common base for HTTP logging, three people working with W3C worked together to create a new standard for browser side logs. These three people, Jan Odvarko, Steve Souders, and Simon Perkins, eventually created the 1.0 version of the Har standard around 2007, with the latest version, 1.2, getting released in 2012. Notably, the standard was never fully published by W3C, and viewing their page for it shows a warning label with: 

*DO NOT USE* This document was never published by the W3C Web Performance Working Group and has been abandoned. 

Searching for the HAR standard on W3C's website returns no results. While the standard was never fully published by W3C, it is the current standard that has been adoped by each major browser. 

## How Har Files Work
Har files are currently integrated into all major web browsers. They can accessed by using the developer tools with the F12 key. The network tab contains a Har viewer, which is both able to export the current Har file or have one imported. 

Har files contain a JSON object that represent every single request and response that is handled by the browser. This include request not made over HTTP such as cache requests. If data for a website is cached, the browser will first send a request to the cache. If there is any needed elements not in the cache it will then query the site. 

Current browsers will do their best to avoid outputting sensitive inromation by default. They do this by searching for items such as passwords, cookies, and auth tokens and either redacting or deleting those elements from the object tree. This option can be changed, but a unsanitized har file represents a very real threat to any account that is referenced in the file.

## Components of a Har File

|Json Entry|Meaning|
|---|---|
|Log|Root JSON Object|
|Version|Version of the Har file format, currently 1.2| 
|Creator|Web recorder that created file|   
|Pages|List of each website visit that was recorded|  
|Pages.id|Unique Identifer for Page|   
|Pages.title|Url for the Page|     
|Pages.timings|Time for both Content Load and Page Load|
|Entries|A list of each induvidual request made and response received by the browser|   
|Entries.fromCache|If the page had data pulled from a cache, this specifies what type of cache it is| 
|Entries.connectionID|Unique Id for the specific request|     
|Entries.Initiator|Indicates what process started the request|   
|Entries.Connection|Port connected to, 443 for HTTPS|   
|Entries.Pageref|A reference to the unique identifer listed in Pages| 
|Entries.Request|Standard HTTP Request|   
|Entries.Response|Standard HTTP Response|  
|Entries.queryString|Query String sent with the request|   
|Entries.serverIPAddress|IP address of the connected site|  
|Entries.time|How long the request took in Milliseconds|   
|Entries.timings|A breakdown of the time took, e.g. how many milliseconds it took sending the request vs receiving the response|  
|Entries.Initiator.stack.callFrames|A list of function calls leading up to the request|   

## Common Usages

There are two main usages of Har files:

### **1. Debugging**

Har files serve as an incredible tool for debugging client side network requests, as each file contains incredibly important information. A HAr file allows a dev ops team to debug common issues like latency or response errors, but it also allow to debug more complicated issues such as CORS or header issues. The main issue with using it for this purpose is that it only gets information from requests, and y data adjustment or analysis made on the client side is inaccesible to a har file.

### **2. Scripting**

This is how we use Har files in class. A Har file contains a full record of a sequence of requests, and it is possible to use that information to automate a replay of that file. We use this with Grafana in order to load test our JWT Pizza Implementations. Grafana spins up a virtual user which then follows the har file and alerts if a response returns the wrong status code. Due to its efficacy for load testing, most major load testing sites allow for the importing of har files. 


