(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var streams = ["chu8", "ttches"],
  online = [],
  offline = [],
  //I need currentSTreamer because I can't use streams[i] in sortOnline
  currentStreamer = "";



// the /streams/ api tells me whether or not a streamer is online.
  function callEach(streams) {
    for (var i = 0; i < streams.length; i++) {
      var script = document.createElement('script');
      currentStreamer = streams[i];
      console.log(currentStreamer);
      script.src = 'https://wind-bow.gomix.me/twitch-api/streams/' + currentStreamer + '?callback=sortOnline';
      document.getElementsByTagName('head')[0].appendChild(script);
      document.head.removeChild(script);
      console.log('done with callEach');
    }
  }


//the /channels/ api gives me information about the streamer's channel
  function sortOnline(data) {
    console.log(data);
    console.log(data.stream === null);
    if (data.stream) {
      console.log('sending online' + currentStreamer);
      var script = document.createElement('script');
      script.src = 'https://wind-bow.gomix.me/twitch-api/channels/' + currentStreamer + '?callback=addOnline';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
    else if (data.stream === null) {
      console.log('sending offline' + currentStreamer);
      var script = document.createElement('script');
      script.src = 'https://wind-bow.gomix.me/twitch-api/channels/' + currentStreamer + '?callback=addOffline';
      document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      alert('The Twitch API has been changed or is offline');
    }
  }

//adds jsonp data for all of the online stream channels.
function addOnline(data) {
  online.push(data);
}
//adds jsonp data for all of the offline stream channels.
  function addOffline(data) {
    offline.push(data);
  }

callEach(streams);

},{}]},{},[1])