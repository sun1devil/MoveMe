// ========================================================
//                   Global Variables
// ========================================================
var meetupList;
var userZip;


// ========================================================
//                   John
// ========================================================

var database = firebase.database();
var zipObject ={};
//on click search capture zipcode count each//
$("#user-zip-submit").on("click", function (event) {
    event.preventDefault();

    var userZip = $("#user-zip").val().trim();
    var countZip = 0;
    if(zipObject.hasOwnProperty(userZip)){
        zipObject[userZip]++;
        // console.log(zipObject[userZip]);
    }
    else{
        zipObject[userZip]=1
    }
        
    // console.log(zipObject)
    $("#user-zip").val("");
    
    // database.ref("/zip").push(userZip);
    database.ref("/zip").update(zipObject)
    // console.log(userZip);
    })
    database.ref("/zip").on("value", function(snap)
    {
        var zipObject = snap.val();
        // console.log(snap.val());
        
    })



// ========================================================
//                   Mindy
// ========================================================



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
    var apiKey = "5c377e757526c7c255f6c425f126e3";
    var radius = 20;
    var category = 13;
    var dateToday;

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
        console.log(response);

        meetupList = [];
        //response from api in json form
        //find fields we need
        for (var i = 0; i < response.length; i++) {
            console.log("forLoop: " + i)
            console.log(response[i]);
            var temp = {};

            if (response[i].next_event) {

                eventNameValue = response[i].next_event.name;
                descripValue = response[i].description;
                attendingValue = response[i].next_event.yes_rsvp_count;
                eventDate = response[i].next_event.time;
                var rawDate = new Date(eventDate);
                formattedDate = rawDate.toString(rawDate);

                if (response[i].group_photo) {
                    imageValue = response[i].group_photo.photo_link;
                };

                longValue = response[i].lon;
                latValue = response[i].lat;

                console.log(eventNameValue);
                console.log(attendingValue);
                console.log(longValue);
                console.log(latValue);
                console.log(formattedDate);

                // console.log(imageValue);

                //store in object meetupList
                temp["eventName"] = eventNameValue;
                temp["descrip"] = descripValue;
                temp["attending"] = attendingValue;
                temp["image"] = imageValue;
                temp["lat"] = latValue;
                temp["long"] = longValue;
                temp["eventDate"] = formattedDate;
                console.log(temp)

                //push object to array
                meetupList.push(temp);
            }

        }
        console.log("meetupList")
        console.log(meetupList)
    });
    // push to html
    //create attributes for tag





});


// ========================================================
//                   Robert
// ========================================================

meetupList = [{
    eventName: "event placeholder",
    descrip: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus dolor vitae lacus suscipit mattis. Donec sed sem tempus, viverra neque non, consectetur sem. Donec lacinia mauris eget maximus blandit.",
    date: moment("08/02/2018", "MM/DD/YYYY"),
    attending: "200",
    image: "http://via.placeholder.com/200x200",
    lat: "109.7",
    long: "-117.1"
}, {
    eventName: "event placeholder 2",
    descrip: "Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus id gravida orci. Mauris at tincidunt mauris. Nam ultricies libero velit, eu vulputate est sodales ut. Fusce eu magna eget purus malesuada ullamcorper.",
    date: moment("07/22/2018", "MM/DD/YYYY"),
    attending: "324",
    image: "http://via.placeholder.com/200x200",
    lat: "119.2",
    long: "-117.4"
}, {
    eventName: "event placeholder 3",
    descrip: "Quisque luctus eros sit amet mollis porta. Phasellus ut massa sed diam faucibus ultrices quis non est. Duis viverra sagittis ligula, at malesuada arcu venenatis vel. Sed pulvinar interdum nibh, a condimentum augue pretium nec. ",
    date: moment("07/13/2018", "MM/DD/YYYY"),
    attending: "132",
    image: "http://via.placeholder.com/200x200",
    lat: "102.1",
    long: "-104.7"
}]
function displayMeetups() {
    $("#event-content").empty();
    for (var i = 0; i < meetupList.length; i++) {
        var currObj = meetupList[i];

        var eventWrapper = $("<div>");
        eventWrapper.addClass("mt-3 mr-3");

        var eventCard = $("<div>");
        eventCard.addClass("card col m-2 position-relative");

        var eventCardHeader = $("<div>");
        eventCardHeader.addClass("card-header row bg-dark text-light p-2");

        var eventCardHeaderName = $("<h5>");
        eventCardHeaderName.addClass("col-8");
        eventCardHeaderName.text(currObj.eventName);
        var eventCardHeaderDate = $("<h6>");
        eventCardHeaderDate.addClass("col-4 text-right");
        eventCardHeaderDate.text(currObj.date.format("MM/DD/YYYY"));

        eventCardHeader.append(eventCardHeaderName);
        eventCardHeader.append(eventCardHeaderDate);
        eventCard.append(eventCardHeader);

        var eventCardBody = $("<div>");
        eventCardBody.addClass("card-body row");

        var eventCardLeft = $("<div>");
        eventCardLeft.addClass("col-3");

        var eventCardRight = $("<div>");
        eventCardRight.addClass("col-9");
        var eventDescrip = $("<p>");
        eventDescrip.text(currObj.descrip);
        eventCardRight.append(eventDescrip);

        eventCardBody.append(eventCardLeft);
        eventCardBody.append(eventCardRight);
        eventCard.append(eventCardBody);

        eventWrapper.append(eventCard);
        $("#event-content").append(eventWrapper);
    }
}
displayMeetups();



