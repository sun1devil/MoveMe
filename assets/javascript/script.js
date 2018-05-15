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
//                   Zip Code Firebase Storage
// ========================================================

function storeZip () {
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
}

database.ref("/zip").on("value", function (snap) {
    var zipObject = snap.val();
    if (zipObject.hasOwnProperty(userZip)) {
        $("#zip-count").text(zipObject[userZip] + " people have been moved near you!")
    }
})


// ========================================================
//                   Google Maps
// ========================================================

function displayGoogleMap() {
    var bounds = new google.maps.LatLngBounds();
    var meetUpLoc = { lat: meetupList[0].lat, lng: meetupList[0].long };
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

// User clicking on the moveme pin in event display
$(document).on("click", ".chat-pin-toggle", function (event) {
    var currMarker = markerObj[$(this).data("lat") + "," + $(this).data("long")];
    infowindow.setContent($(this).data("info"));
    infowindow.open(map, currMarker);
})

// ========================================================
//                   Meetup Ajax
// ========================================================

//Add cors to our ajax call
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});
function validateZip() {
    var userInput = $("#user-zip").val().trim();
    if ((userInput.length != 5) || !parseInt(userInput)){
        $("#zip-count").text("Please enter a valid US Zip Code");
        return false;
    }
    return true;
}
// user enters a zipcode
$("#user-zip-submit").on("click", function () {
    event.preventDefault();

    if (validateZip()) {
        userZip = $("#user-zip").val().trim();
        $("#user-zip").val("");
        storeZip();

        $("#moveme-main-display").addClass("hidden");
        $("#moveme-loading").removeClass("hidden");
        $("#moveme-body").removeClass("hidden");

        var apiKey = "5c377e757526c7c255f6c425f126e3";
        var radius = 10;
        var category = 13;

        var queryURL = "https://api.meetup.com/find/groups?" + "key=" + apiKey + "&zip=" + userZip + "&radius=" + radius + "&category=" + category + "&upcoming_events=true";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            meetupList = [];
            for (var i = 0; i < response.length; i++) {
                var temp = {};
                if (response[i].next_event) {
                    var eventURL = response[i].link + "events/" + response[i].next_event.id
                    var rawDate = new Date(response[i].next_event.time);
                    var formattedDate = rawDate.toString(rawDate);
                    var finalDateTime = moment(formattedDate, "ddd MMM Do YYYY, h:mm a")
                    var imageValue;
                    if (response[i].group_photo) {
                        imageValue = response[i].group_photo.photo_link;
                    };
                    temp["eventName"] = response[i].next_event.name;
                    temp["descrip"] = response[i].description;
                    temp["attending"] = response[i].next_event.yes_rsvp_count;
                    temp["image"] = imageValue;
                    temp["lat"] = response[i].lat;
                    temp["long"] = response[i].lon;
                    temp["eventDate"] = finalDateTime;
                    temp["eventURL"] = eventURL;

                    meetupList.push(temp);
                }
            }
            meetupList.sort(function(a, b) {
                return a.eventDate.diff(b.eventDate)
            });
            getWeather();
        });
    }
});

// ========================================================
//                   Meetup Display (Dynamic)
// ========================================================

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
    chatItem.time = firebase.database.ServerValue.TIMESTAMP;
    chatItem.message = $("#chat-input").val().trim();

    $("#chat-input").val("");
    database.ref("/chat").push(chatItem);
});

database.ref("/chat").on("child_added", function (childSnapshot, prevChildKey) {

    var chatDate = moment.unix(childSnapshot.val().time / 1000)
    var chatTime, chatTimeColor;
    if (parseInt(moment().diff(chatDate, "days")) !== 0) {
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
            var tempDate = moment.unix(snap[tempKeys[i]].time / 1000);
            if (parseInt(moment().diff(tempDate, "days")) > maxChatStorage) {
                database.ref("/chat").child(tempKeys[i]).remove();
            }
        }
    }
})

// ========================================================
//                   Weather API
// ========================================================

function getWeather() {
 
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&zip=" + userZip + 
                        ",us&16&appid=166a433c57516f51dfab1f7edaed8413"

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        var forecastList = response.list;
        weatherList =[]
        for (var i = 0; i < meetupList.length; i++){
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
        $("#moveme-main-display").removeClass("hidden");
        $("#moveme-loading").addClass("hidden");
        displayGoogleMap();
        displayMeetups();     
    });
}