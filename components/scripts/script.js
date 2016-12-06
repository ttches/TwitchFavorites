var streams = ["chu8", "ttches", "followgrubby", "Trikslyr"],
  streamsJSONP = [],
  online = [],
  offline = [],
  apiURL = 'https://wind-bow.gomix.me/twitch-api/streams/',
  //I need currentSTreamer because I can't use streams[i] in sortOnline
  currentStreamer = "";


function appendAndRemove(script) {
  document.getElementsByTagName('head')[0].appendChild(script);
  document.head.removeChild(script);
}

// the /streams/ api tells me whether or not a streamer is online.
  function callEach(streams) {
    streams.forEach(function(stream, index) {
      currentStreamer = stream;
      var script = document.createElement('script');
      script.src = apiURL + currentStreamer + '?callback=sortStreamJSONP';
      appendAndRemove(script);
      console.log('done with callEach');
      console.log(currentStreamer + " " + streamsJSONP.length);
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
      currentStreamer = streams[index];
      console.log(streamer.stream === null);
      if (streamer.stream) {
        console.log('sending online' + currentStreamer);
        var script = document.createElement('script');
        script.src = apiURL + currentStreamer + '?callback=addOnline';
        appendAndRemove(script);
      }
      else if (streamer.stream === null) {
        console.log('sending offline' + currentStreamer);
        var script = document.createElement('script');
        script.src = apiURL + currentStreamer + '?callback=addOffline';
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
