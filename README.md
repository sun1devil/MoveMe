# MoveMe
Bringing people together since 2018, MoveMe is the all in one app for getting involved in your local community.

MoveMe was created to provide people easy access to find and join political or community events. Users are prompted to enter his/her zipcode and MoveMe will generate upcoming events from the Meetup.com and the location from Google Maps. We have also created a chat feature for MoveMe users to connect with other users online.

## Getting Started

Open up the [project link](https://sun1devil.github.io/MoveMe/) and you should be able to see the example webpage shown below:

![Homepage](assets/images/home-page.png)

Enter your zip code and join the MoveMe nation! See what people just like you are getting involved in in your local community. With every step forward, we stem the rising tide of apathy and take ownership of the future of our nation!

![Upcoming Events](assets/images/upcoming-events.PNG "MoveMe Upcoming Events Results")

### Prerequisites

You need to have a modern browser able to handle HTML5, Javascript, and CSS (such as the Google Chrome browser).

### Installing

No installation needed! Just open the page in your preferred browser.

## Built With

* HTML5

* CSS

* [Javascript](https://www.javascript.com/) - The scripting language used

* [BootstrapCDN v4.1.0](https://getbootstrap.com/docs/4.1/getting-started/introduction/) - The web framework used

* [jQuery v3.3.1](http://jquery.com/) - Java library for DOM and CSS manipulation

* [Moment.js 2.22.1](https://momentjs.com/) - Java Library for Time calculations

* [Google Firebase 4.13.0](https://firebase.google.com/) - Online database

* [Google Fonts](https://fonts.google.com/) - Font repository

* [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) - Google Maps

* [Meetup API](https://www.meetup.com/meetup_api/) - Meetup

* [Weather API](https://openweathermap.org/api) - Open Weather Map

## APIs

### Meetup API
![Meetup API](assets/images/MeetUp-API.gif)
We used the Metup.com API to pull events from the movements and politics category. Our queryURL shows that we filter based on the zipcode users entered, a radius of 10 miles, category and upcoming events. After executing that URL, we get a JSON file which we had to parse for relevant data. Within our ajax function we included a for loop that iterates through each event in the JSON file to retrieve the details for relevant events. With the details from the JSON file, we created an array called meetupList so that we can store each event and the related details as objects within the array for easy reference by other parts of the code.


## Authors

* **Mindy De Alba**  - [Mdealba](https://github.com/Mdealba)

* **Hannah Lim** - [hannahlim213](https://github.com/hannahlim213)

* **John McLeod**  - [sun1devil](https://github.com/sun1devil)

* **Robert Shaw**  - [robertshaw87](https://github.com/robertshaw87)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

