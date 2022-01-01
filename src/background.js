'use strict';
import './popup.css'
const buddyList = require('spotify-buddylist')

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages


console.log("Hey");

var my_activities=[];

async function fetchActivity () {
  const spDcCookie = 'AQDCq28m1t4LkCDpWlZhhY3bFjalJxew7hvpWMkeKsmrbi0d6hauXMTij7NYf-ONBImn4Zhz78vPJGJBw0m8BzxhtxtRlCR04XiLIQV8jqvb0w'

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
		sendResponse({ data: my_activities });
    console.log("gettting activity");
	}
});


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
