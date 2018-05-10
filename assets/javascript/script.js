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
    var zipCodes =
    {
       userZip : 0
    };

    $("#user-zip").val("");
    database.ref().push(userZip);
    database.ref().push(zipCodes)
    console.log(userZip);
    console.log(zipCodes)
    
    
        
})
    database.ref().on("child_added", function(childSnapshot, prevChildKey)
    {
        var userZip = childSnapshot.val().zip;
        console.log(childSnapshot.val());
        If (userZip)
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