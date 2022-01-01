'use strict';

import './popup.css'

var friend_activities=[];

(function() {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  // const counterStorage = {
  //   get: cb => {
  //     chrome.storage.sync.get(['count'], result => {
  //       cb(result.count);
  //     });
  //   },
  //   set: (value, cb) => {
  //     chrome.storage.sync.set(
  //       {
  //         count: value,
  //       },
  //       () => {
  //         cb();
  //       }
  //     );
  //   },
  // };

  // function setupCounter(initialValue = 0) {
  //   document.getElementById('counter').innerHTML = initialValue;

  //   document.getElementById('incrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // function updateCounter({ type }) {
  //   counterStorage.get(count => {
  //     let newCount;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter').innerHTML = newCount;

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           response => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  // function restoreCounter() {
  //   // Restore count value
  //   counterStorage.get(count => {
  //     if (typeof count === 'undefined') {
  //       // Set counter value as 0
  //       counterStorage.set(0, () => {
  //         setupCounter(0);
  //       });
  //     } else {
  //       setupCounter(count);
  //     }
  //   });
  // }

window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})
  

  // document.addEventListener('DOMContentLoaded', restoreCounter);

  //Communicate with background file by sending a message
  
  function unixTime(unixtime) {

    var u = new Date(unixtime*1000);

      return u.getUTCFullYear() +
        '-' + ('0' + u.getUTCMonth()).slice(-2) +
        '-' + ('0' + u.getUTCDate()).slice(-2) + 
        ' ' + ('0' + u.getUTCHours()).slice(-2) +
        ':' + ('0' + u.getUTCMinutes()).slice(-2) +
        ':' + ('0' + u.getUTCSeconds()).slice(-2) +
        '.' + (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) 
  };

  function getWebUrl(uri){
    var c=0;
    var weburl="";
    for (var i = 0; i < uri.length; i++){
      if(uri[i]===':'){
        c++;
      }
      if(c==2){
        weburl=uri.slice(i+1,uri.length);
        return weburl;
      }
    }
  }

  function appendData(data) {
    var mainContainer = document.getElementById("textview");
    for (var i = 0; i < data.length; i++) {
      var time_stamp=data[i].timestamp;  
      var user_name=data[i].user.name;
      var user_link="https://open.spotify.com/user/"+ getWebUrl(data[i].user.uri);
      var user_image_url=data[i].user.imageUrl;
      var track_name=data[i].track.name;
      var track_link="https://open.spotify.com/track/"+ getWebUrl(data[i].track.uri);
      var artist_name=data[i].track.artist.name;
      var artist_link="https://open.spotify.com/track/"+ getWebUrl(data[i].track.artist.uri);
      var context_name=data[i].track.context.name;
      var context_uri=data[i].track.context.uri;
      var context_link;
      if(context_uri.includes("playlist")){
        context_link="https://open.spotify.com/playlist/"+ getWebUrl(context_uri);
      }
      else{
        context_link="https://open.spotify.com/album/"+ getWebUrl(context_uri);
      }
      console.log(unixTime(time_stamp));

        // var div = document.createElement("div");
        // div.className="friend"
        // var t=document.createElement("a");
        // t.className="username"
        // t.setAttribute("href", "https://open.spotify.com/track/"+ getWebUrl(data[i].track.uri));
        // var t2 = document.createTextNode(data[i].track.name);
        // t.appendChild(t2);
        // //var i=document.createElement("img");
        // // i.src=data[i].user.imageUrl;
        // //i.src="https://i.scdn.co/image/ab67757000003b82fdb6e4c03ddf8478695d103c";
        // div.innerHTML = data[i].user.name + ': ';
        // //mainContainer.appendChild(i);
        // div.appendChild(t);
        // mainContainer.appendChild(div);
    }
}

  chrome.runtime.sendMessage(
    {
      type: "GetActivity" 
    },
    response => {
      //document.getElementById('counter').innerHTML = response.data;
      console.log(response.data);
      friend_activities=response.data;

      appendData(response.data);
      // document.getElementById('textview').innerHTML = response.data[1].user.name;
    }
  );

})();
