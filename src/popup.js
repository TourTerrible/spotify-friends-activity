'use strict';

import './popup.css'

var friend_activities=[];

(function() {
  
  window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})

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

  function diff(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);
    var hours_Difference = Math.floor(difference/1000/60/60);
    var min_Difference = Math.floor(difference/1000/60);
    if(daysDifference>0){
      return daysDifference+' d';
    }
    else if(hours_Difference>0){
      return hours_Difference+' hr';
    }
    else if(min_Difference>6){
      return min_Difference+' min';
    }
    else{
      return 'playing';
    }
}

  function appendData(data) {
    var mainContainer = document.getElementById("textview");
    for (var i = data.length-1; i >=0; i--) {
      var time_stamp=data[i].timestamp;  
      var unix = Math.round(+new Date());
      var last_played=diff(unix,time_stamp);
      var user_name=data[i].user.name;
      var user_link="https://open.spotify.com/user/"+ getWebUrl(data[i].user.uri);
      var user_image_url=data[i].user.imageUrl;
      var track_name=data[i].track.name.substring(0,22);
      if(data[i].track.name.length>22){
        track_name+='...';
      }
      var track_link="https://open.spotify.com/track/"+ getWebUrl(data[i].track.uri);
      var artist_name=data[i].track.artist.name.substring(0,22);
      if(data[i].track.artist.name.length>22){
        artist_name=artist_name+'...';
      }
      var artist_link="https://open.spotify.com/track/"+ getWebUrl(data[i].track.artist.uri);
      var context_name=data[i].track.context.name;
      if(context_name.length>43){
        context_name=context_name.substring(0,43)+'...';
      }
      var context_uri=data[i].track.context.uri;
      var context_link;
      if(context_uri.includes("playlist")){
        context_link="https://open.spotify.com/playlist/"+ getWebUrl(context_uri);
      }
      else{
        context_link="https://open.spotify.com/album/"+ getWebUrl(context_uri);
      }
      var main_div=document.createElement("div");

      var container=document.createElement("div");
      container.className="container";
      var pic=document.createElement("img");
      pic.className="profile_pic";
      pic.src=user_image_url;
      container.appendChild(pic);

      var text_div=document.createElement("div");

      text_div.className="maindiv";
      
      var user=document.createElement("a");
      user.className="user_name";
      user.setAttribute("href",user_link);
      var name = document.createTextNode(user_name);
      user.appendChild(name);
      text_div.appendChild(user);

      var status=document.createElement('span');
      status.className="status";
      var txt=document.createTextNode(' '+last_played);
      status.appendChild(txt);
      text_div.appendChild(status);

      var brek=document.createElement("br");
      text_div.appendChild(brek);

      var song=document.createElement("a");
      song.className="song_name";
      song.setAttribute("href",track_link);
      var s_name = document.createTextNode(track_name);
      song.appendChild(s_name);
      text_div.appendChild(song);

      text_div.appendChild(document.createTextNode(" . "));

      var singer=document.createElement("a");
      singer.className="song_name";
      singer.setAttribute("href",artist_link);
      var sin_name = document.createTextNode(artist_name);
      singer.appendChild(sin_name);
      text_div.appendChild(singer);



      var brek=document.createElement("br");
      text_div.appendChild(brek);
      
      var song_context=document.createElement("a");
      song_context.className="song_name";
      song_context.setAttribute("href",context_link);
      var c_name = document.createTextNode(context_name);
      song_context.appendChild(c_name);
      text_div.appendChild(song_context);

      container.appendChild(text_div);
      
      main_div.appendChild(container);
      mainContainer.appendChild(main_div);
    }
}

chrome.runtime.sendMessage(
  {
    type: 'FetchNow',
    payload: {
      message: 'fetch',
    },
  },
  response => {
    console.log(response.message);
  }
);

  chrome.runtime.sendMessage(
    {
      type: "GetActivity" 
    },
    response => {
      friend_activities=response.data;

      appendData(response.data);
      // document.getElementById('textview').innerHTML = response.data[1].user.name;
    }
  );



})();
