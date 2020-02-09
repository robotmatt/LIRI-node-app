let Spotify = require('node-spotify-api');
let Moment = require("moment");
const axios = require('axios').default;
let dotenv = require("dotenv").config();
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);

let liri = {
    concertThis: function (argument) {
        let queryUrl = "https://rest.bandsintown.com/artists/" + encodeURI(argument) + "/events?app_id=codingbootcamp";
        axios.get(queryUrl)
            .then(function (response) {
                //console.log(response.data);
                console.log(`${argument} is playing soon! They have ${response.data[0].artist.upcoming_event_count} shows coming up!`);
                response.data.forEach(element => {
                    let showTime = Moment(element.datetime).format("MM/DD/YYYY");
                    console.log(`${element.venue.city}, ${element.venue.region}, ${element.venue.country}: ${showTime}`)
                    console.log(`Venue: ${element.venue.name}`);
                    console.log("------------------------------------------------")
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                
            });
    },
    spotify: function (argument) {
        console.log(argument);
    },
    movieThis: function (argument) {

    },
    doWhatItSays: function (argument) {

    }
};

// get the arguments after the commad
let argument = "";
process.argv.forEach(function (element, index) {
    (index > 2) ? argument += element + " ": null;
});
argument = argument.trim(); // trim off the whitespace at the end

// Switch case to execute function based on what command was given
switch (process.argv[2]) {
    case "concert-this":
        liri.concertThis(argument);
        break;
    case "spotify-this-song":
        liri.spotify(argument);
        break;
    case "movie-this":
        liri.movieThis(argument);
        break;
    case "do-what-it-says":
        liri.doWhatItSays(argument);
        break;
    default:
        console.log("Error");
}