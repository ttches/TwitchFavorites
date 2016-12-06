var streams = ["chu8", "ttches"],
  streamsJSONP = [],
  online = [],
  offline = [],
  apiURL = 'https://wind-bow.gomix.me/twitch-api/streams/';

/* Appends scripts to HTML in order to save JSONP data to a variable from a
different domain without being blocked by CORS and then deletes the script from
the html to avoid clutter*/
function appendAndRemove(script) {
  document.getElementsByTagName('head')[0].appendChild(script);
  document.head.removeChild(script);
}

// the /streams/ api tells me whether or not a streamer is online.
function callEach(streams) {
  streams.forEach(function(stream, index) {
    var script = document.createElement('script');
    script.src = apiURL + stream + '?callback=sortStreamJSONP';
    appendAndRemove(script);
    console.log('done with callEach');
    console.log(stream + " " + streamsJSONP.length);
    console.log(streamsJSONP.length);
  });
}

//collects data from the /streams API so sortOnline() can sort each stream as
//online or offline
function sortStreamJSONP(data) {
  streamsJSONP.push(data);
  console.log(data);
  if (streamsJSONP.length == streams.length) {
    console.log('success');
    sortOnline(streamsJSONP);
  }
}

//the /channels/ api gives me information about the streamer's channel
//categorizes each channel into offline or online
function sortOnline(data) {
  data.forEach(function(streamer, index) {
    console.log(streamer.stream === null);
    if (streamer.stream) {
      console.log('sending online' + streams[index]);
      var script = document.createElement('script');
      script.src = apiURL + streams[index] + '?callback=addOnline';
      appendAndRemove(script);
    }
    else if (streamer.stream === null) {
      console.log('sending offline' + streams[index]);
      var script = document.createElement('script');
      script.src = apiURL + streams[index] + '?callback=addOffline';
      appendAndRemove(script);
    } else {
      alert('The Twitch API has been changed or is offline');
    }
  });
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
