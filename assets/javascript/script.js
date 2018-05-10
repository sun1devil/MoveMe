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
function displayMeetups () {
    $("#event-content").empty();

    for (var i=0; i<meetupList.length; i++){
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
        eventCardBody.addClass("card-body");
        
        var eventCardImage = $("<img>");
        eventCardImage.attr("src", currObj.image);
        eventCardImage.attr("alt", currObj.eventName);
        eventCardImage.addClass("event-card-image float-left");

        var eventDescrip = $("<p>");
        eventDescrip.text(currObj.descrip);

        eventCardBody.append(eventCardImage);
        eventCardBody.append(eventDescrip)
        eventCard.append(eventCardBody);

        eventWrapper.append(eventCard);
        $("#event-content").append(eventWrapper);
    }
}
displayMeetups();