// ========================================================
//                   Global Variables
// ========================================================
var meetupList;
var userZip, userName, userColor;

var marker;
var markerObj = {};
var infowindow, map;

var weatherCounter, newsCounter;

var database = firebase.database();


// ========================================================
//                   John
// ========================================================


//on click search capture zipcode count each//
$("#user-zip-submit").on("click", function (event) {
    event.preventDefault();
    userZip = $("#user-zip").val().trim();
    database.ref("/zip").once("value", function (snap) {

        var zipObject = snap.val();
        if (zipObject.hasOwnProperty(userZip)) {
            zipObject[userZip]++;
        }
        else {
            zipObject[userZip] = 1
        }
        database.ref("/zip").update(zipObject)
    });
})


database.ref("/zip").on("value", function (snap) {
    var zipObject = snap.val();
    if (zipObject.hasOwnProperty(userZip)) {
        $("#zip-count").text(zipObject[userZip] + " people have been moved near you!")
    } else {
        $("#zip-count").text("Come join us!")
    }
})


// ========================================================
//                   Mindy
// ========================================================

function displayGoogleMap() {
    var bounds = new google.maps.LatLngBounds();
    var meetUpLoc = { lat: 37.773972, lng: -122.431297 };
    infowindow = new google.maps.InfoWindow({});
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: meetUpLoc
    });

    for (var i = 0; i < meetupList.length; i++) {
        var currLat = meetupList[i].lat;
        var currLong = meetupList[i].long;
        var eventName = meetupList[i].eventName;
        var eventInfo =
            "<a href = '" + meetupList[i].eventURL + "' target='_blank'" + " alt='" + eventName + "'>" + "<h6>" + eventName + "</h6>"
            + "</a>" +
            "<p>" + meetupList[i].eventDate.format("h:mm a MM/DD") + "</p>";
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(currLat, currLong),
            map: map,
            title: eventName,
            icon: "assets/images/pin2.png"
          });
        bounds.extend(marker.position);

        var markerKey = currLat + "," + currLong;
        markerObj[markerKey] = marker;
        google.maps.event.addListener(marker, 'click', (function (mark, infoContent) {
            return function () {
                infowindow.setContent(infoContent);
                infowindow.open(map, mark);
            }
        })(marker, eventInfo));
    }
    map.fitBounds(bounds);
}

// This will give you the latitude and longitude of the event associated with the
// pin the user clicked on
$(document).on("click", ".chat-pin-toggle", function (event) {
    // We don't need these variables
    var currLat = $(this).data("lat");
    var currLong = $(this).data("long");
    var currInfo = $(this).data("info");
    var currMarker = markerObj[currLat + "," + currLong];
    infowindow.setContent(currInfo);
    infowindow.open(map, currMarker);
})


// ========================================================
//                   Hannah
// ========================================================
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});
$("#user-zip-submit").on("click", function () {
    event.preventDefault();
    userZip = $("#user-zip").val().trim();
    $("#user-zip").val("");

    $("#moveme-main-display").addClass("hidden");
    $("#moveme-loading").removeClass("hidden");
    $("#moveme-body").removeClass("hidden");

    //declare variables

    var apiKey = "5c377e757526c7c255f6c425f126e3";
    var radius = 10;
    var category = 13;
    var dateToday;
    var finalDateTime;


// REFACTOR THIS PLS

    var eventNameValue;
    var descripValue;
    var attendingValue;
    var imageValue;
    var longValue;
    var latValue;
    var eventDate;
    var groupLink;
    var linkNextEvent;
    var eventURL;

    var queryURL = "https://api.meetup.com/find/groups?" + "key=" + apiKey + "&zip=" + userZip + "&radius=" + radius + "&category=" + category + "&upcoming_events=true&start_date_range=" + dateToday;

    //request api with ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        meetupList = [];
        for (var i = 0; i < response.length; i++) {
            var temp = {};
            if (response[i].next_event) {
                eventNameValue = response[i].next_event.name;
                descripValue = response[i].description;
                attendingValue = response[i].next_event.yes_rsvp_count;
                eventDate = response[i].next_event.time;
                groupLink = response[i].link;
                linkNextEvent = response[i].next_event.id;
                eventURL = groupLink + "events/" + linkNextEvent
                var rawDate = new Date(eventDate);
                formattedDate = rawDate.toString(rawDate);
                finalDateTime = moment(formattedDate, "ddd MMM Do YYYY, h:mm a")
                if (response[i].group_photo) {
                    imageValue = response[i].group_photo.photo_link;
                };
                longValue = response[i].lon;
                latValue = response[i].lat;
                temp["eventName"] = eventNameValue;
                temp["descrip"] = descripValue;
                temp["attending"] = attendingValue;
                temp["image"] = imageValue;
                temp["lat"] = latValue;
                temp["long"] = longValue;
                temp["eventDate"] = finalDateTime;
                temp["eventURL"] = eventURL;
                //push object to array
                meetupList.push(temp);
            }

        }
        quickSort(meetupList, 0, (meetupList.length - 1))
        getWeather();
        $("#moveme-main-display").removeClass("hidden");
        $("#moveme-loading").addClass("hidden");
        displayGoogleMap();
    });
});

function quickSort (arr, start, end) {
    if (start < end) {
        var pivot = qsPartition(arr, start, end);
        quickSort(arr, start, pivot-1);
        quickSort(arr, pivot+1, end);
    }
}
  
function qsPartition (arr, start, end) {
    var randPivot = start + Math.floor(Math.random() * (end - start + 1));
    var tempObj = arr[start];
    arr[start] = arr[randPivot];
    arr[randPivot] = tempObj;
  
    var i = start + 1;
    var pivotElem = arr[start];
  
    for (var j = start + 1; j <= end; j++){        
        if (arr[j].eventDate.diff(arr[start].eventDate) < 0) {
            tempObj = arr[i];
            arr[i] = arr[j];
            arr[j] = tempObj;
            i++;
        }
    }

    tempObj = arr[start];
    arr[start] = arr[i-1];
    arr[i-1] = tempObj;

    return i-1;
  }
// ========================================================
//                   Meetup Display (Dynamic)
// ========================================================

var activeEvent;

function displayMeetups() {
    $("#event-content").empty();
    if (!meetupList) {
        return;
    }
    for (var i = 0; i < meetupList.length; i++) {
        var currObj = meetupList[i];

        var eventWrapper = $("<div>");
        eventWrapper.addClass("mt-4 pr-4 event-wrapper position-relative");

        var eventCard = $("<div>");
        eventCard.addClass("card col p-0 m-2 position-relative");

        var eventCardHeader = $("<div>");
        eventCardHeader.addClass("card-header text-light event-card-header");

        var eventCardIcon = $("<img>");
        eventCardIcon.addClass("float-left event-card-icon");
        eventCardIcon.attr("src", "assets/images/plusIcon.png");
        eventCardIcon.attr("alt", "Toggle Content");

        var eventCardHeaderName = $("<h5>");
        eventCardHeaderName.addClass("float-left");
        eventCardHeaderName.text(currObj.eventName);
        var eventCardHeaderDate = $("<h6>");
        eventCardHeaderDate.addClass("text-right");

        eventCardHeaderDate.text(currObj.eventDate.format("MM/DD/YYYY"));

        eventCardHeader.append(eventCardIcon);
        eventCardHeader.append(eventCardHeaderName);
        eventCardHeader.append(eventCardHeaderDate);
        eventCard.append(eventCardHeader);

        var eventCardBody = $("<div>");
        eventCardBody.addClass("card-body m-0 p-3 event-card-body");

        if (currObj.image) {
            var eventCardImage = $("<img>");
            eventCardImage.attr("src", currObj.image);
            eventCardImage.attr("alt", currObj.eventName);
            eventCardImage.addClass("event-card-image float-left m-0 mt-2 mr-2 mb-2");
        }

        var eventTime = $("<h6>");
        eventTime.addClass("text-right float-right pr-2");
        eventTime.text(currObj.eventDate.format("h:mm a"));

        var eventWeather = $("<h6>");
        eventTime.addClass("pl-2");
        eventWeather.html(currObj.eventWeather);

        var eventDescrip = $("<p>");
        eventDescrip.addClass("pl-2 mt-3 event-card-content");
        eventDescrip.html(currObj.descrip);

        var eventAttendees = $("<p>");
        eventAttendees.addClass("text-right pr-2 mr-5 event-card-content");
        eventAttendees.text(currObj.attending + " other people are attending.");

        var moveMePin = $("<img>");
        moveMePin.attr("src", "assets/images/MoveMePin.jpg");
        moveMePin.attr("alt", "Map Pin Toggle");
        moveMePin.addClass("chat-pin-toggle");
        moveMePin.attr("data-lat", currObj.lat);
        moveMePin.attr("data-long", currObj.long);
        var eventInfo =
            "<a href = '" + currObj.eventURL + "' target='_blank'" + " alt='" + currObj.eventName + "'>" + "<h6>" + currObj.eventName + "</h6>" + "</a>" +
            "<p>" + currObj.eventDate.format("h:mm a MM/DD") + "</p>";
        moveMePin.attr("data-info", eventInfo);

        if (currObj.image) {
            eventCardBody.append(eventCardImage);
        }
        eventCardBody.append(eventTime);
        eventCardBody.append(eventWeather);
        eventCardBody.append(eventDescrip);
        eventCardBody.append(eventAttendees);
        eventCardBody.append(moveMePin);
        eventCard.append(eventCardBody);

        eventWrapper.append(eventCard);
        $("#event-content").append(eventWrapper);

        // makes all links open in a new tab
        $("a", ".event-card-content").attr("target", "_blank");
    }
}

$(document).on("click", ".event-card-header", function (event) {

    if ($(".event-card-icon", this).attr("src") === "assets/images/plusIcon.png"){
        $(".event-card-icon", this).attr("src","assets/images/minusIcon.png");
    } else {
        $(".event-card-icon", this).attr("src","assets/images/plusIcon.png");
    }
    $(this).next().toggleClass("active-event-card-body")
})

$(document).on("click", ".event-card-body", function (event) {
    if ($(event.target).is(".chat-pin-toggle")) {
        return;
    }
    $(this).prev().find(".event-card-icon").attr("src","assets/images/minusIcon.png");
    $(this).addClass("active-event-card-body")
})
// ========================================================
//                   MoveMe Chat
// ========================================================



function randInt(x) {
    return Math.floor(Math.random() * x);
}

$(document).on("click", "#chat-header", function (event) {
    if (!userName) {
        $("#chat-name").toggleClass("hidden");
    } else {
        $("#chat-name").addClass("hidden");
        $("#chat-display").toggleClass("hidden");
        $("#chat-box").toggleClass("hidden");
    }
    $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
    $("html, body").scrollTop($(document).height());
})


$(document).on("click", "#chat-name-submit", function (event) {
    event.preventDefault();
    userName = $("#chat-name-input").val().trim();

    if (userName) {
        $("#chat-name-input").val("")
        $("#chat-name").addClass("hidden");
        $("#chat-display").removeClass("hidden");
        $("#chat-box").removeClass("hidden");
        $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
        $("html, body").scrollTop($(document).height());
        database.ref("/chatUsers").once("value", function (snap) {
            if (snap.hasChild(userName)) {
                userColor = snap.val()[userName];
            } else {
                var tempRand = randInt(200);
                userColor = "rgba(" + (50 + tempRand) + ", " + randInt(150) + ", " + (250 - tempRand) + ", 1);";
                var userObject = {};
                userObject[userName] = userColor;
                database.ref("/chatUsers").update(userObject);
            }
        })

    }
})

$(document).on("click", "#chat-submit", function (event) {
    event.preventDefault();
    var chatItem = {};
    var time = moment().format("HH:mm MM/DD/YY")
    chatItem.name = userName;
    chatItem.color = userColor;
    chatItem.time = time;
    chatItem.message = $("#chat-input").val().trim();

    $("#chat-input").val("");
    database.ref("/chat").push(chatItem);
});

database.ref("/chat").on("child_added", function (childSnapshot, prevChildKey) {

    var chatDate = moment(childSnapshot.val().time, "HH:mm MM/DD/YY")
    var chatTime = moment(chatDate.format("MM/DD/YY"), "MM/DD/YY");
    var chatTimeColor;
    if (parseInt(moment().diff(chatTime, "days")) !== 0) {
        chatTime = chatDate.format("MMM Do");
        chatTimeColor = "font-style: italic; color: rgba(150, 150, 150, 1)";
    } else {
        chatTime = chatDate.format("h:mm a");
    }
    var chatItem = $("<p>");
    var chatTimeDisplay = $("<span>");
    chatTimeDisplay.addClass("chat-time-display")
    chatTimeDisplay.attr("style", chatTimeColor);
    chatTimeDisplay.text("(" + chatTime + ") ")
    var chatNameDisplay = $("<span>");
    chatNameDisplay.addClass("chat-name-display")
    chatNameDisplay.attr("style", "color: " + childSnapshot.val().color + "; font-weight: bold");
    chatNameDisplay.text(childSnapshot.val().name);
    var chatMessageDisplay = $("<span>");
    chatMessageDisplay.addClass("chat-message-display")
    chatMessageDisplay.attr("style", chatTimeColor);
    chatMessageDisplay.text(childSnapshot.val().message);

    chatItem.append(chatTimeDisplay);
    chatItem.append(chatNameDisplay);
    chatItem.append(":  ");
    chatItem.append(chatMessageDisplay)
    $("#chat-display").append(chatItem);
    $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
})

database.ref("/chat").on("value", function (snapshot) {
    var snap = snapshot.val();
    if (snap) {
        var maxChatStorage = 30;
        var chatObj = snapshot.val();
        var currDate;
        var tempKeys = Object.keys(snapshot.val());
        for (var i = 0; i < tempKeys.length; i++) {
            var tempDate = moment(snap[tempKeys[i]].time, "HH:mm MM/DD/YY");
            if (parseInt(moment().diff(tempDate, "days")) > maxChatStorage) {
                database.ref("/chat").child(tempKeys[i]).remove();
            }
        }
    }
})

// ========================================================
//                   Weather API
// ========================================================

// var lat;
// var long;
// var eventDate;
// var weatherDate;

function getWeather() {
 
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&zip=" + userZip + ",us&16&appid=166a433c57516f51dfab1f7edaed8413"
    //Weather Data points
    // var summary;
    // var high;
    // var low;
    // var wind;
    // var weatherIcon;

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        var forecastList = response.list;
        // weatherDate = moment.unix(1526374800).format("MMM Do YYYY");
        // console.log(forecastList);
        weatherList =[]
        for (var i =0; i <meetupList.length; i++){
            var currObj = meetupList[i];
            var eventTime = parseInt(currObj.eventDate.unix())
            var weatherTime;
            var weatherEntry; 
            var counter = 0;
            do {
                if (counter < forecastList.length){
                weatherTime = parseInt(forecastList[counter].dt);
                weatherEntry = "It will be " + forecastList[counter].main.temp + "°F with " + 
                    forecastList[counter].weather[0].description;
                counter++;
                } else {
                    weatherTime = eventTime + 1;
                    weatherEntry = "&nbsp;";
                }              
            } while ( weatherTime < eventTime);
            meetupList[i].eventWeather = weatherEntry;
        }
        displayMeetups();     
    });
}