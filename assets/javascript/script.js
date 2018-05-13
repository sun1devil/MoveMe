// ========================================================
//                   Global Variables
// ========================================================
var meetupList;
var userZip, userName;


// ========================================================
//                   John
// ========================================================

var database = firebase.database();

//on click search capture zipcode count each//
$("#user-zip-submit").on("click", function (event) {
    event.preventDefault();
    userZip = $("#user-zip").val().trim();
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
        $("#zip-count").text(zipObject[userZip])
        
        
        
    })




// ========================================================
//                   Mindy
// ========================================================

function initMap(latitude, longitude) {
  var meetUpLoc = {lat: latitude, lng: longitude };
  var map = new google.maps.Map(document.getElementById('google-map'), {
    zoom: 4,
    center: meetUpLoc
  });
  var marker = new google.maps.Marker({
    position: meetUpLoc,
    map: map
  });
}

// var mapResults = initMap(37.773972, -122.431297);
// $("#google-map").push(mapResults);
// console.log(mapResults)

// This will give you the latitude and longitude of the event associated with the
// pin the user clicked on
$(document).on("click", ".chat-pin-toggle", function (event){
    var currLat = $(this).data("lat");
    var currLong = $(this).data("long");
    alert("lat: " + currLat + " long: " + currLong)




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
    var radius = 20;
    var category = 13;
    var dateToday = moment().format("YYYY-MM-DD");
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
        console.log(queryURL);
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
        // console.log("meetupList")
        // console.log(meetupList)
        displayMeetups();
    });
    // push to html
    //create attributes for tag
});

var newsDateFrom = moment().format("YYYY-MM-DD");
var newsKeyword = "#";
var newsApiKey = "5f03fe0753814e19a56fa636ba696c89"

console.log(eventNameValue)
var newsURL = "https://newsapi.org/v2/everything?q=" + newsKeyword + "&from=" + newsDateFrom + "&apiKey=" + newsApiKey;
console.log(newsURL)
var req = new Request(newsURL);
fetch(req)
    .then(function(response) {
        console.log(response)
    });

// ========================================================
//                   Meetup Display (Dynamic)
// ========================================================

function displayMeetups() {
    $("#event-content").empty();
    if (!meetupList){
        return;
    }
    for (var i = 0; i < meetupList.length; i++) {
        var currObj = meetupList[i];


        var eventWrapper = $("<div>");
        eventWrapper.addClass("mt-4 mr-3");

        var eventCard = $("<div>");
        eventCard.addClass("card col m-2 position-relative");

        var eventCardHeader = $("<div>");
        eventCardHeader.addClass("card-header row bg-dark text-light p-2");

        var eventCardHeaderName = $("<h5>");
        eventCardHeaderName.addClass("col-8");
        eventCardHeaderName.text(currObj.eventName);
        var eventCardHeaderDate = $("<h6>");
        eventCardHeaderDate.addClass("col-4 text-right");
        eventCardHeaderDate.text(moment(currObj.date).format("MM/DD/YYYY"));

        eventCardHeader.append(eventCardHeaderName);
        eventCardHeader.append(eventCardHeaderDate);
        eventCard.append(eventCardHeader);

        var eventCardBody = $("<div>");
        eventCardBody.addClass("card-body p-0");
        
        if (currObj.image){
            var eventCardImage = $("<img>");
            eventCardImage.attr("src", currObj.image);
            eventCardImage.attr("alt", currObj.eventName);
            eventCardImage.addClass("event-card-image float-left m-0 mt-2 mr-2 mb-2");
        }

        var eventTime = $("<h6>");
        eventTime.addClass("text-right")
        eventTime.text(moment(currObj.date).format("HH:mm MM/DD/YYYY"));

        var eventDescrip = $("<p>");
        eventDescrip.html(currObj.descrip);

        var eventAttendees = $("<p>");
        eventAttendees.text(currObj.attending + " other people are attending.")

        var moveMePin = $("<img>");
        moveMePin.attr("src", "assets/images/MoveMePin.png");
        moveMePin.attr("alt", "Map Pin Toggle");
        moveMePin.addClass("chat-pin-toggle");
        moveMePin.attr("data-lat", currObj.lat);
        moveMePin.attr("data-long", currObj.long);

        if (currObj.image){
        eventCardBody.append(eventCardImage);
        }
        eventCardBody.append(eventTime);
        eventCardBody.append(eventDescrip);
        eventCardBody.append(eventAttendees);
        eventCardBody.append(moveMePin);
        eventCard.append(eventCardBody);

        eventWrapper.append(eventCard);
        $("#event-content").append(eventWrapper);
    }
}


// ========================================================
//                   MoveMe Chat
// ========================================================

var database = firebase.database();

$(document).on("click", "#chat-header", function(event) {
    if (!userName){
        $("#chat-name").toggleClass("hidden");
    } else {
        $("#chat-name").addClass("hidden");
        $("#chat-display").toggleClass("hidden");
        $("#chat-box").toggleClass("hidden");
    }
    $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
})

$(document).on("click", "#chat-name-submit", function(event){
    event.preventDefault();
    userName = $("#chat-name-input").val().trim();
    $("#chat-name-input").val("")
    
    $("#chat-name").addClass("hidden");
    $("#chat-display").removeClass("hidden");
    $("#chat-box").removeClass("hidden");
    $("#chat-display").scrollTop($("#chat-display").prop("scrollHeight"));
})

$(document).on("click", "#chat-submit", function(event){
    event.preventDefault();
    var chatItem = userName + ":  " + $("#chat-input").val().trim();
    $("#chat-input").val("");
    database.ref("/chat").push(chatItem);
});

database.ref("/chat").on("child_added", function (childSnapshot, prevChildKey) {
    $("#chat-display").append($("<p>").text(childSnapshot.val()));
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
