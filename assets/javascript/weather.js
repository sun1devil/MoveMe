

//Weather API Variables, Need to determine if we want weather at Zip entered or at event long lat.
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
    // console.log(weatherURL);
    console.log(response);


    weatherList =[];

for (var i = 0; i < response.length; i++) 
    {
    console.log(response[i]);
    var tempWeather = {};
    
    if (response[i].daily) 
        {
    
    summary = response[i].daily.data.summary;
    high = response[i].daily.data.temperatureHigh;
    low = response[i].daily.data.temperatureLow;
    wind = response[i].daily.data.windSpeed
    weatherIcon = response[i].daily.data.icon

    //store in object weatherList
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