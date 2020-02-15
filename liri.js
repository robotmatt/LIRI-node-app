let Spotify = require('node-spotify-api');
let Moment = require("moment");
let fs = require('fs');
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
        //console.log(argument);

        spotify.search({
            type: 'track',
            query: argument
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("you searched for: " + argument);
            console.log("The artist: " + data.tracks.items[0].artists[0].name);
            console.log("The Song Name: " + data.tracks.items[0].name);
            console.log("The Link: " + data.tracks.items[0].external_urls.spotify);
            console.log("The Album: " + data.tracks.items[0].album.name);
        });
    },
    movieThis: function (argument) {
        //console.log(argument);
        // Then run a request with axios to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + encodeURI(argument) + "&y=&plot=short&apikey=trilogy";
        // This line is just to help us debug against the actual URL.
        //console.log(queryUrl);
        //     Title of the movie.
        //    * Year the movie came out.
        //    * IMDB Rating of the movie.
        //    * Rotten Tomatoes Rating of the movie.
        //    * Country where the movie was produced.
        //    * Language of the movie.
        //    * Plot of the movie.
        //    * Actors in the movie.

        axios.get(queryUrl).then(
                function (response) {
                    //console.log("data: " + JSON.stringify(response.data));
                    console.log("The movie's name: " + response.data.Title);
                    console.log("The movie's release date is: " + response.data.Released);
                    console.log("The movie's IMDB Rating is: " + response.data.Ratings[0].Value);
                    console.log("The movie's Rotten Tomatoes Rating is: " + response.data.Ratings[1].Value);
                    console.log("The movie's was made in " + response.data.Country);
                    console.log("The movie's Language: " + response.data.Language);
                    console.log("The movie's Plot: " + response.data.Plot);
                    console.log("The movie's Actors: " + response.data.Actors);
                })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    },
    doWhatItSays: function () {
        fs.readFile("./random.txt", 'utf8', function (err, data) {
            let input = data.split(",");
            let command = input[0];
            let arg = input[1];
            console.log(command, arg);
            decideCall(command, arg)
        });
    }
};

let decideCall = function (command, argument) {
    switch (command) {
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
};

// get the arguments after the commad
let argument = "";
process.argv.forEach(function (element, index) {
    (index > 2) ? argument += element + " ": null;
});
argument = argument.trim(); // trim off the whitespace at the end

decideCall(process.argv[2], argument);
// Switch case to execute function based on what command was given
// switch (process.argv[2]) {
//     case "concert-this":
//         liri.concertThis(argument);
//         break;
//     case "spotify-this-song":
//         liri.spotify(argument);
//         break;
//     case "movie-this":
//         liri.movieThis(argument);
//         break;
//     case "do-what-it-says":
//         liri.doWhatItSays(argument);
//         break;
//     default:
//         console.log("Error");
// }