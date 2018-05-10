// ========================================================
//                   Global Variables
// ========================================================



// ========================================================
//                   John
// ========================================================

var database = firebase.database();

//on click search capture zipcode count each//
$("#user-zip-submit").on("click", function(event) 
{
    event.preventDefault();
    
    var userZip = $("#user-zip").val().trim();
    var countZip = 0;
    $("#user-zip").val("");
    database.ref().push(userZip);
    console.log(userZip);
    countZip++;
    console.log(countZip);
    
    
})
    database.ref().on("child_added", function(childSnapshot, prevChildKey)
    {
        var userZip = childSnapshot.val().zip;
        // var 
        console.log(childSnapshot.val());
    })


 

// ========================================================
//                   Mindy
// ========================================================



// ========================================================
//                   Hannah
// ========================================================



// ========================================================
//                   Robert
// ========================================================