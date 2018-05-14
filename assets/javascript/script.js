// ========================================================
//                   Global Variables
// ========================================================
var meetupList;
var userZip, userName;
var weatherCounter, newsCounter;


// ========================================================
//                   John
// ========================================================

var database = firebase.database();

//on click search capture zipcode count each//
$("#user-zip-submit").on("click", function (event) {
    event.preventDefault();
    userZip = $("#user-zip").val().trim();
    $("#moveme-body").removeClass("hidden");
    database.ref("/zip").once("value", function(snap){

        var zipObject = snap.val();

        if(zipObject.hasOwnProperty(userZip)){
            zipObject[userZip]++;
            
        }
        else{
            zipObject[userZip]=1
        }
            
        // console.log(zipObject)
        
        // database.ref("/zip").push(userZip);
        database.ref("/zip").update(zipObject)
        // console.log(userZip);
    });

    })


    database.ref("/zip").on("value", function(snap)
    {
        var zipObject = snap.val();
        // console.log(snap.val());
        if (zipObject.hasOwnProperty(userZip)){
            $("#zip-count").text(zipObject[userZip] + " people have been moved near you!")
        } else {
            $("#zip-count").text("Come join us!")
        }
        
        
        
    })

///Weather API Variables, Need to determine if we want weather at Zip entered or at event long lat.
 var weatherURL = "https://api.darksky.net/forecast/2f32ba83031454d3113997b8783167aa/37.8267,-122.4233,1526162017?/exclude=currently,flags,minutely,alerts"
    // var longValue
    // var latvalue
    //  var weatherLoc= 37.8267, -122.4233;
    // var weatherUrl ="https://api.darksky.net/forecast/2f32ba83031454d3113997b8783167aa/" + weatherLoc "/" + rawDate converted to unix
    //date = May 14 2008 from variable declared in event Ajax call named rawDate 1526349600000
    var weatherDate = moment(1526349600000).unix();{
    console.log(weatherDate);
    }
    
    // weather variables//
    var summary; 
    var high;
    var low; 
    var wind;
    var weatherIcon;
//  request weather with ajax through proxy 
jQuery.ajaxPrefilter(function (options) {
if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
}
});
 $.ajax({
    url: weatherURL,
    method: "GET"
}).then(function (response) 
{
    console.log(response);
    console.log(response.daily.data.summary)
    weatherList = [];

    for (var i = 0; i < response.length; i++)
    {
    console.log(response[i]);
    var tempWeather = {};
    
    if (response[i].daily) 
        {
    
    summary = response[i].daily.data.summary;
    high = response[i].daily.data.temperatureHigh;
    low = response[i].daily.data.temperatureLow;
    wind = response[i].daily.data.windSpeed;;
    weatherIcon = response[i].daily.data.icon
            
    //store in object weatherList array
    tempWeather["Summary"] = summary;
    tempWeather["High"] = high;
    tempWeather["Low"] = low;
    tempWeather["Wind"] = wind;
    tempWeather["Icon"] = weatherIcon;

    console.log(tempWeather)

    //push object to array
    weatherList.push(tempWeather);
}
    }
        });



// ========================================================
//                   Mindy
// ========================================================

// function initMap(latitude, longitude) {
//   var meetUpLoc = {lat: latitude, lng: longitude };
//   var map = new google.maps.Map(document.getElementById('google-map'), {
//     zoom: 4,
//     center: meetUpLoc
//   });
//   var marker = new google.maps.Marker({
//     position: meetUpLoc,
//     map: map
//   });
// }
// var marker;

// var mapResults = initMap(37.773972, -122.431297);
// $("#google-map").push(mapResults);
// console.log(mapResults)
var marker;
var markerObj = {};
var infowindow, map;

function displayGoogleMap() {
    var bounds = new google.maps.LatLngBounds();
    var meetUpLoc = {lat: 37.773972, lng: -122.431297 };
    infowindow =  new google.maps.InfoWindow({});
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: meetUpLoc
    });

    for (var i=0; i < meetupList.length; i++){
        var currLat = meetupList[i].lat;
        var currLong = meetupList[i].long;
        var eventName = meetupList[i].eventName;
        var eventInfo = 
        "<h6>" + eventName + "</h6>" + 
        "<p>" + meetupList[i].eventDate.format("h:mm a MM/DD") + "</p>";
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(currLat, currLong),
            map: map,
            title: eventName
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
    console.log(markerObj);
}

// This will give you the latitude and longitude of the event associated with the
// pin the user clicked on
$(document).on("click", ".chat-pin-toggle", function (event){
    var currLat = $(this).data("lat");
    var currLong = $(this).data("long");
    alert("lat: " + currLat + " long: " + currLong)
    var currMarker = markerObj[currLat + "," + currLong];
    console.log(currLat + "," + currLong)
    console.log(currMarker)



// YOUR CODE HERE



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
    //declare variables
    userZip = $("#user-zip").val().trim();
    $("#user-zip").val("");
    var apiKey = "5c377e757526c7c255f6c425f126e3";
    var radius = 10;
    var category = 13;
    var dateToday;
    var finalDateTime;

    var eventNameValue;
    var descripValue;
    var attendingValue;
    var imageValue;
    var longValue;
    var latValue;
    var eventDate;

    var queryURL = "https://api.meetup.com/find/groups?" + "key=" + apiKey + "&zip=" + userZip + "&radius=" + radius + "&category=" + category + "&upcoming_events=true&start_date_range=" + dateToday;

        // var date = new Date(1526086800000);
        // console.log(date.toString(date));

    //request api with ajax
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(queryURL);
        // console.log(response);

        meetupList = [];
        //response from api in json form
        //find fields we need
        for (var i = 0; i < response.length; i++) {
            // console.log("forLoop: " + i)
            // console.log(response[i]);
            var temp = {};

            if (response[i].next_event) {

                eventNameValue = response[i].next_event.name;
                descripValue = response[i].description;
                attendingValue = response[i].next_event.yes_rsvp_count;
                eventDate = response[i].next_event.time;
                var rawDate = new Date(eventDate);
                formattedDate = rawDate.toString(rawDate);
                finalDateTime = moment(formattedDate, "ddd MMM Do YYYY, h:mm a")
                // console.log(finalDateTime.format("MM/DD/YYYY HH:mm"));
                

                if (response[i].group_photo) {
                    imageValue = response[i].group_photo.photo_link;
                };

                longValue = response[i].lon;
                latValue = response[i].lat;

                // console.log(eventNameValue);
                // console.log(attendingValue);
                // console.log(longValue);
                // console.log(latValue);
                // console.log(formattedDate);
                // console.log(finalDateTime);

                // console.log(imageValue);

                //store in object meetupList
                temp["eventName"] = eventNameValue;
                temp["descrip"] = descripValue;
                temp["attending"] = attendingValue;
                temp["image"] = imageValue;
                temp["lat"] = latValue;
                temp["long"] = longValue;
                temp["eventDate"] = finalDateTime;
                // console.log(temp)

                //push object to array
                meetupList.push(temp);
            }

        }
        // weatherCounter = 0;
        // weatherRecursion();
        // newsCounter = 0;
        // newsRecursion();
        displayGoogleMap();
        // console.log("meetupList")
        // console.log(meetupList)
        displayMeetups();
    });
    // push to html
    //create attributes for tag





});


// ========================================================
//                   Meetup Display (Dynamic)
// ========================================================

var activeEvent;

function displayMeetups() {
    $("#event-content").empty();
    if (!meetupList){
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

        var eventCardHeaderName = $("<h5>");
        eventCardHeaderName.addClass("float-left");
        eventCardHeaderName.text(currObj.eventName);
        var eventCardHeaderDate = $("<h6>");
        eventCardHeaderDate.addClass("text-right");
        
        eventCardHeaderDate.text(currObj.eventDate.format("MM/DD/YYYY"));

        eventCardHeader.append(eventCardHeaderName);
        eventCardHeader.append(eventCardHeaderDate);
        eventCard.append(eventCardHeader);

        var eventCardBody = $("<div>");
        eventCardBody.addClass("card-body m-0 p-3 event-card-body");
        
        if (currObj.image){
            var eventCardImage = $("<img>");
            eventCardImage.attr("src", currObj.image);
            eventCardImage.attr("alt", currObj.eventName);
            eventCardImage.addClass("event-card-image float-left m-0 mt-2 mr-2 mb-2");
        }

        var eventTime = $("<h6>");
        eventTime.addClass("text-right float-right pr-2")
        eventTime.text(currObj.eventDate.format("h:mm a"));

        var eventWeather = $("<h6>");
        eventWeather.addClass("pl-2");
        eventWeather.text("Weather Placeholder Here");
        //put weather data here

        var eventDescrip = $("<p>");
        eventDescrip.addClass("pl-2 mt-3")
        eventDescrip.html(currObj.descrip);

        var eventAttendees = $("<p>");
        eventAttendees.addClass("text-right pr-2 mr-5")
        eventAttendees.text(currObj.attending + " other people are attending.")

        //add news article stuff here?

        var moveMePin = $("<img>");
        moveMePin.attr("src", "assets/images/MoveMePin.jpg");
        moveMePin.attr("alt", "Map Pin Toggle");
        moveMePin.addClass("chat-pin-toggle");
        moveMePin.attr("data-lat", currObj.lat);
        moveMePin.attr("data-long", currObj.long);

        if (currObj.image){
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
        $("a").attr("target", "_blank");
    }
}

$(document).on("click", ".event-card-header", function(event) {
    $(this).next().toggleClass("active-event-card-body")
})

$(document).on("click", ".event-card-body", function(event) {
    if ($(event.target).is(".chat-pin-toggle")) {
        return;
    }
    $(this).addClass("active-event-card-body")
})
// ========================================================
//                   MoveMe Chat
// ========================================================

var database = firebase.database();
var userColor; 
function randInt(x) {
    return Math.floor(Math.random() * x);
}

$(document).on("click", "#chat-header", function(event) {
    if (!userName){
        $("#chat-name").toggleClass("hidden");
    } else {
        $("#chat-name").addClass("hidden");
        $("#chat-display").toggleClass("hidden");
        $("#chat-box").toggleClass("hidden");
    }
    $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
    $("html, body").scrollTop($(document).height());
})


$(document).on("click", "#chat-name-submit", function(event){
    event.preventDefault();
    userName = $("#chat-name-input").val().trim();
    $("#chat-name-input").val("")
    if (userName) {
        $("#chat-name").addClass("hidden");
        $("#chat-display").removeClass("hidden");
        $("#chat-box").removeClass("hidden");
        $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
        $("html, body").scrollTop($(document).height());
        database.ref("/chatUsers").once("value", function(snap){
            if (snap.hasChild(userName)) {
                userColor = snap.val()[userName];
            } else {
                var tempRand = randInt(200);
                userColor = "rgba(" + (50+ tempRand) + ", " + randInt(100) + ", " + (250-tempRand) + ", 1);";
                var userObject = {};
                userObject[userName] = userColor;
                database.ref("/chatUsers").update(userObject);
            }
        })
    }
})

$(document).on("click", "#chat-submit", function(event){
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

database.ref("/chat").on("value", function (snapshot){
    if (snapshot.val()){
        var maxChatStorage = 50;
        var chatObj = snapshot.val();
        var tempKeys = Object.keys(snapshot.val());
        for (var i=maxChatStorage; i<tempKeys.length; i++) {
            database.ref("/chat").child(tempKeys[i-maxChatStorage]).remove();
        }
    }
})