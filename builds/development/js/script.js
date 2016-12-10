/*Sometimes this needs to be reloaded to work. I really wanted to practice vanilla
JavaScript for this assignment and so had to make little hacks to get everything
working asynchronously with the limits of the API without breaking CORS */

var streams = ["chu8", "jowetv", "hiko", "ttches", "followgrubby", "trikslyr"],
  streamsJSONP = {},
  online = {},
  offline = {},
  apiURL = 'https://wind-bow.gomix.me/twitch-api/';

/* Appends scripts to HTML in order to save JSONP data to a variable from a
different domain without being blocked by CORS and then deletes the script from
the html to avoid clutter*/
function appendAndRemove(script) {
  document.getElementsByTagName('head')[0].appendChild(script);
  document.head.removeChild(script);
}

// the /streams/ api tells me whether or not a streamer is online.
function callEach(streams) {
  streamsJSONP = {};
  streams.forEach(function(stream, index) {
    var script = document.createElement('script');
    script.src = apiURL + 'streams/' + stream + '?callback=sortStreamJSONP';
    appendAndRemove(script);
    console.log('done with callEach');
    console.log(stream + " " + Object.keys(streamsJSONP).length);
    console.log(streamsJSONP);
  });
}

//collects data from the /streams API so sortOnline() can sort each stream as
//online or offline
function sortStreamJSONP(data) {
  document.getElementById('loading-div').style.display = 'flex';
  document.getElementsByClassName('online-streams')[0].style.display = 'none';
  document.getElementsByClassName('offline-streams')[0].style.display = 'none';
  if (data._links === undefined) {
    console.log('readloading');
    alert('API error, please reload');
    return;
  }
  var link = data._links.channel;
  var username = link.substr(38, link.length);
  streamsJSONP[username] = data;
  console.log(Object.keys(streamsJSONP).length+ " "+ streams.length);
  if (Object.keys(streamsJSONP).length == streams.length) {
    console.log('success');
    console.log(streams);
    sortOnline(streamsJSONP);
  }
}

//the /channels/ api gives me information about the streamer's channel
//categorizes each channel into offline or online
function sortOnline(data) {
  offline = {};
  online = {};
  for (var key in data) {
    console.log(key);
    console.log(data[key].stream === null);
    if (data[key].stream) {
      console.log('sending online' + key);
      var script = document.createElement('script');
      script.src = apiURL + 'channels/' + key + '?callback=addOnline';
      appendAndRemove(script);
    }
    else if (data[key].stream === null) {
      console.log('sending offline' + key);
      var script = document.createElement('script');
      script.src = apiURL + 'channels/' + key + '?callback=addOffline';
      appendAndRemove(script);
    } else {
      alert('The Twitch API has been changed or is offline');
    }
  }
}

//adds jsonp data for all of the online stream channels.
function addOnline(data) {
  online[data.name] = data;
  if (Object.keys(online).length + Object.keys(offline).length === Object.keys(streamsJSONP).length) {
    console.log('writing html');
    writeHTMLOnline(online);
    writeHTMLOffline(offline);
  }
}
//adds jsonp data for all of the offline stream channels.
function addOffline(data) {
  offline[data.name] = data;
  console.log(Object.keys(online).length + Object.keys(offline).length + "streamers offline and online");
  if (Object.keys(online).length + Object.keys(offline).length === Object.keys(streamsJSONP).length) {
    console.log('writing html');
    writeHTMLOnline(online);
    writeHTMLOffline(offline);
  }
}

//Appends streams to DOM
function writeHTMLOnline(data) {
  document.getElementsByClassName("online-streams")[0]
  .innerHTML='';
  var frag = document.createDocumentFragment(),
  sortedData = Object.keys(data).sort();
  for (var i = 0; i < sortedData.length; i++) {
    var div = document.createElement('div');
    div.innerHTML =
      `<div class="online-stream" id="`+ (data[sortedData[i]].display_name+
        data[sortedData[i]].game).toLowerCase() +`">
        <div class="stream-logo">
          <a href="` + data[sortedData[i]].url +`">
            <img src="`+ logoOrDefault(data[sortedData[i]].logo) +`">
          </a>
        </div> <!--logo-->
        <div class="stream-basic-info">
        <div class="online-light"></div>
          <a href="` + data[sortedData[i]].url +`">
            <h1><strong>` + data[sortedData[i]].display_name + `</strong></h1>
            <p>` + data[sortedData[i]].game +`</p>
          </a>
        </div><!--basic info-->
      </div><!--online stream -->`;
    frag.appendChild(div.firstChild);
  }
  document.getElementById('loading-div').style.display = 'none';
  document.getElementsByClassName('online-streams')[0].style.display = 'block';
  document.getElementsByClassName('offline-streams')[0].style.display = 'block';
  document.getElementsByClassName("online-streams")[0].appendChild(frag);
}

function writeHTMLOffline(data) {
  document.getElementsByClassName("offline-streams")[0]
  .innerHTML='';
  var frag = document.createDocumentFragment();
  sortedData = Object.keys(data).sort();
  for (var i = 0; i < sortedData.length; i++) {
    var div = document.createElement('div');
    div.innerHTML =
      `<div class="offline-stream" id="`+ (data[sortedData[i]].display_name+
        data[sortedData[i]].game).toLowerCase() +`">
        <div class="stream-logo">
          <a href="` + data[sortedData[i]].url +`">
            <img src="` + logoOrDefault(data[sortedData[i]].logo) + `">
          </a>
        </div> <!--logo-->
        <div class="stream-basic-info">
          <a href="` + data[sortedData[i]].url +`">
            <h1><strong>` + data[sortedData[i]].display_name + `</strong></h1>
            <p>` + (data[sortedData[i]].game || "") +`</p>
          </a>
        </div><!--basic info-->
      </div><!--offline stream -->`;
    frag.appendChild(div.firstChild);
  }
  document.getElementById('loading-div').style.display = 'none';
  document.getElementsByClassName('online-streams')[0].style.display = 'block';
  document.getElementsByClassName('offline-streams')[0].style.display = 'block';
  document.getElementsByClassName("offline-streams")[0].appendChild(frag);
}

function logoOrDefault(logo) {
  return logo || 'http://vignette3.wikia.nocookie.net/logopedia/images/8/83/Twitch_icon.svg/revision/latest?cb=20140727180700';
}

/****
Add streamer functions
*****/

function addStreamer(streamer) {
  var script = document.createElement('script');
  script.src = apiURL + 'channels/' + streamer + '?callback=verifyStreamer';
  appendAndRemove(script);
}

//Checks to see if the streamer exists on twitch and if the streamer
//is already in the list
function verifyStreamer(data) {
  if (Object.keys(streamsJSONP).indexOf(data.name) > -1) {
    alert('Streamer already in list');
  }
  else if (data.display_name) {
    document.getElementById("addStreamInput").value='';
    streams.push(data.name);
    var script = document.createElement('script');
    script.src = apiURL + 'streams/' + data.name + '?callback=sortStreamJSONP';
    appendAndRemove(script);
  } else {
    alert('Streamer not found.');
  }
}

/***********************************************/
/****This code will make sorting tabs work*****/
/**********************************************/

//turn this into a self running function to save global space
var tabElements = document.getElementsByClassName('tab-box'),
onlineDisplay = document.getElementsByClassName('online-streams')[0].style,
offlineDisplay = document.getElementsByClassName('offline-streams')[0].style;
Array.from(tabElements).forEach(function(element) {
  element.addEventListener('click', function() {
    var sibBoxes = document.getElementById('tab-container').childNodes,
        target = event.target;
    removeArrowBoxCSS(sibBoxes);
    event.target.closest('div').className="tab-box arrow-box";
    if (target.closest('div') === sibBoxes[1]) {
      offlineDisplay.display = "block";
      onlineDisplay.display = "block";
    }
    else if (target.closest('div') === sibBoxes[3]) {
      offlineDisplay.display = "none";
      onlineDisplay.display = "block";
    }
    else if (target.closest('div') === sibBoxes[5]) {
      offlineDisplay.display = "block";
      onlineDisplay.display = "none";

    }
  });
});

//removes the arrow-box class from all tabs
function removeArrowBoxCSS(sib) {
  sib.forEach(function(box) {
    box.className = "tab-box";
  });
}

/***********************************************/
/****This code will allow search to work********/
/**********************************************/

document.getElementById('searchInput').addEventListener('keyup', function() {
  var input = document.getElementById('searchInput').value.toLowerCase(),
  onlineStreams = document.querySelectorAll('.online-stream');
  offlineStreams = document.querySelectorAll('.offline-stream');
  console.log(input);
  if (input === '') {
    console.log('input nothing');
    onlineStreams.forEach(function(div) {
      div.style.display = 'flex';
    });
    offlineStreams.forEach(function(div) {
      div.style.display = 'flex';
    });
  } else {
    onlineStreams.forEach(function(div) {
      if (div.id.indexOf(input) > -1) {
        div.style.display = 'flex';
      } else {
        div.style.display = 'none';
      }
    });
    offlineStreams.forEach(function(div) {
      if (div.id.indexOf(input) > -1) {
        div.style.display = 'flex';
      } else {
        div.style.display = 'none';
      }
    });
  }
});

setTimeout(function(){ callEach(streams); }, 1000);
