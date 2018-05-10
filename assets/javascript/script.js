// ========================================================
//                   Global Variables
// ========================================================
var meetupList;
var userZip;


// ========================================================
//                   John
// ========================================================



// ========================================================
//                   Mindy
// ========================================================



// ========================================================
//                   Hannah
// ========================================================
$("#user-zip-submit").on("click", function () {
    event.preventDefault();
    //declare variables
    userZip = $("#user-zip").val().trim();
    var apiKey = "5c377e757526c7c255f6c425f126e3";
    var radius = 20;
    var category = 13;
    var dateToday = moment().format("YYYY-MM-DD");

    var queryURL = "https://api.meetup.com/find/groups?" + "key=" + apiKey + "&zip=" + userZip
        + "&radius=" + radius + "&category=" + category + "&upcoming_events=true&start_date_range=" +
        dateToday;


    //request api with ajax
    $.ajax({
        url: "https://api.meetup.com/find/groups?key=5c377e757526c7c255f6c425f126e3&zip=94043&radius=20&category=13&upcoming_events=true&start_date_range=2018-05-10T12:00:00",
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        var eventName = response.next_event.name;
        var attending = response.next_event.yes_rsvp_count;
        console.log(eventName);
        console.log(attending);
    });
    //response from api in json form

    //find fields we need

});


// ========================================================
//                   Robert
// ========================================================
var meetupList = [{
    eventName: "event placeholder",
    date: "08/02/2018",
    attending: "200",
    image: "#",
    lat: "109.7",
    long: "-117.1"
}]
