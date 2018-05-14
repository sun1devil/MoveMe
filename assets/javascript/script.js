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
        "<a href = '" + meetupList[i].eventURL + "' target='_blank'" + " alt='" + eventName + "'>" + "<h6>" + eventName + "</h6>"
        + "</a>" +
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
    var currInfo = $(this).data("info");
    // alert("lat: " + currLat + " long: " + currLong + " " + currInfo)
    var currMarker = markerObj[currLat + "," + currLong];
    // console.log(currLat + "," + currLong)
    // console.log(currMarker)
    // console.log(currInfo)
    infowindow.setContent(currInfo);
    infowindow.open(map, currMarker);

})
// YOUR CODE HERE



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
    var groupLink;
    var linkNextEvent;
    var eventURL;

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
                groupLink = response[i].link;
                linkNextEvent = response[i].next_event.id;
                // console.log(eventDate);

                eventURL = groupLink + "events/" + linkNextEvent

                var rawDate = new Date(eventDate);
                formattedDate = rawDate.toString(rawDate);
                finalDateTime = moment(formattedDate, "ddd MMM Do YYYY, h:mm a")
                // console.log(finalDateTime.format("MM/DD/YYYY HH:mm"));
                

                if (response[i].group_photo) {
                    imageValue = response[i].group_photo.photo_link;
                };

                longValue = response[i].lon;
                // console.log(longValue)
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
                temp["eventURL"] = eventURL;
                // console.log(temp)

                //push object to array
                meetupList.push(temp);
            }

        }
        console.log("STARTING SORT")
        bubbleSortMeetUpList();
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


function bubbleSortMeetUpList() {
    // console.log(meetupList)
    do {
        var shiftedObj = false;
        for (var i=1; i<meetupList.length; i++){

            if (meetupList[i].eventDate.diff(meetupList[i-1].eventDate) < 0) {
                // console.log("iteration ", i)
                // console.log(meetupList[i-1].eventDate.format("HH:mm MM/DD/YY"))
                // console.log(meetupList[i].eventDate.format("HH:mm MM/DD/YY"))
                // console.log(meetupList);
                var tempObj = Object.assign({}, meetupList[i-1]);
                var tempObj2 = Object.assign({}, meetupList[i])
                meetupList[i] = tempObj;
                meetupList[i-1] = tempObj2;
                shiftedObj = true;
                // console.log(meetupList);
            }

        }
    } while (shiftedObj);
    // console.log("COMPLETE")
    // console.log(meetupList)
}

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
        eventTime.addClass("text-right float-right pr-2");
        eventTime.text(currObj.eventDate.format("h:mm a"));

        var eventWeather = $("<h6>");
        eventTime.addClass("pl-2");
        eventWeather.text("There will be weather.");

        var eventDescrip = $("<p>");
        eventDescrip.addClass("pl-2 mt-3 event-card-content");
        eventDescrip.html(currObj.descrip);

        var eventAttendees = $("<p>");
        eventAttendees.addClass("text-right pr-2 mr-5 event-card-content");
        eventAttendees.text(currObj.attending + " other people are attending.");

        //add news article stuff here?

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

    if (userName) {
        $("#chat-name-input").val("")
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
                userColor = "rgba(" + (50+ tempRand) + ", " + randInt(150) + ", " + (250-tempRand) + ", 1);";
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
    var snap = snapshot.val();
    if (snap){
        var maxChatStorage = 30;
        var chatObj = snapshot.val();
        var currDate;
        var tempKeys = Object.keys(snapshot.val());
        for (var i=0; i<tempKeys.length; i++) {
            var tempDate = moment(snap[tempKeys[i]].time, "HH:mm MM/DD/YY");
            if (parseInt(moment().diff(tempDate, "days")) > maxChatStorage){
                database.ref("/chat").child(tempKeys[i]).remove();
            }
        }
    }
})

// ========================================================
//                   Weather API
// ========================================================

// var outCounter = 0;
// weather Variables
var weatherURL = "https://api.darksky.net/forecast/2f32ba83031454d3113997b8783167aa/37.8267,-122.4233,1526162017?/"
var weatherLoc = lat + "," +  long + "," + weatherDate
var lat
var long
var eventDate
var weatherDate = moment(eventDate).unix();{
    console.log(weatherDate);
    
}  
    
//Weather Data points
var summary; 
var high;
var low; 
var wind;
var weatherIcon;
// function weatherRecursion () {
//     if (outCounter < meetupList.length){
//         var currObj = meetupList[outCounter];
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
    

var summary = response.hourly.summary;
weatherList = [summary];
console.log(weatherList)
// for (var i = 0; i < response.length; i++)
// {
// // console.log(response[i]);
// var tempWeather = {};

// if (response[i].daily) 
//   {
        
// //store in object weatherList array
// tempWeather["Summary"] = summary;
// tempWeather["High"] = high;
// tempWeather["Low"] = low;
// tempWeather["Wind"] = wind;
// tempWeather["Icon"] = weatherIcon;


// //push object to array
// weatherList.push(tempWeather);
});









//         {
//             var tempWeather; //grab the weather from the response
//             meetupList[outCounter].weather = tempWeather;
//             outCounter++;
//             weatherRecursion();
//         })
//     } else {
//         displayMeetups();
//     }
// }

// for (var outCounter=0; outCounter < meetupList.length; outCounter++){


    // WAIT FOR THE AJAX TO FINISH BEFORE MOVING ON
// }