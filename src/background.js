'use strict';
import './popup.css'
const buddyList = require('spotify-buddylist')

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages


console.log("Hey");

var my_activities=[];

function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
      if(callback) {
          callback(cookie.value);
      }
  });
}

async function fetchActivity () {
  var ID;
  getCookies("https://open.spotify.com", "sp_dc", function(id) {
    ID=id;
  });
  const spDcCookie = ID;
  const { accessToken } = await buddyList.getWebAccessToken(spDcCookie)
  const friendActivity = await buddyList.getFriendActivity(accessToken)
  //console.log(JSON.stringify(friendActivity, null, 2))
  my_activities=friendActivity.friends;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  //main();
  if (request.type === 'FetchNow') {
    console.log("Fetching ...");
    sendResponse({ data:'success' });
    await fetchActivity();
    for(var friend of my_activities){
      console.log(friend);
    }
  }
});

chrome.runtime.onMessage.addListener( async(request,sender, sendResponse)=>{
   if (request.type=== 'GetActivity') {
		sendResponse({ data: my_activities});
    console.log("gettting activity");
	}
});


//usage:
// getCookies("https://open.spotify.com", "sp_dc", function(id) {
//   console.log(id);
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   //main();
//   if (request.type === 'GREETINGS') {
//     const message = `Hi ${
//       sender.tab ? 'Con' : 'Pop'
//     }, my name is Bac. I am from Background. It's great to hear from you.`;

//     // Log message coming from the `request` parameter
//     console.log(request.payload.message);
//     // Send a response message
//     sendResponse({
//       message,
//     });
//   }
// });
