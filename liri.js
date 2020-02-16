// Import all dependencies 
const Spotify = require('node-spotify-api');
const Moment = require("moment");
const fs = require('fs');
const axios = require('axios').default;
const dotenv = require("dotenv").config();
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);

// Create Liri object to hold our functions
let liri = {
    // concertThis function for when concert-this is called
    concertThis: function (argument) {
        // Craft query URL
        let queryUrl = "https://rest.bandsintown.com/artists/" + encodeURI(argument) + "/events?app_id=codingbootcamp";
        // Call Bandsintown API via Axios
        axios.get(queryUrl)
            .then(function (response) {
                //console.log(response.data);
                console.log(`${argument} is playing soon! They have ${response.data[0].artist.upcoming_event_count} shows coming up!`);
                
                // Print out the upcoming shows
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
        // use Spotify API to search for a song title
        spotify.search({
            type: 'track',
            query: argument
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // Print out the song details
            console.log(`You searched for: "${argument}"`);
            console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Link to Play Song: " + data.tracks.items[0].external_urls.spotify);
        });
    },
    movieThis: function (argument) {
        //console.log(argument);
        // Then run a request with axios to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + encodeURI(argument) + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
                function (response) {
                    //console.log("data: " + JSON.stringify(response.data));

                    // Print out the movie details
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
    // doWhatItSays function to read from a file and call the appropriate function
    doWhatItSays: function () {
        // Read the file random.txt and 
        fs.readFile("./random.txt", 'utf8', function (err, data) {
            let input = data.split(",");
            let command = input[0];
            let arg = input[1];
            console.log(command, arg);
            decideCall(command, arg)
        });
    }
};

// decideCall function: decide which function to call based on the command given
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
            console.log("There was an error, the command was not found");
    }
};

// get the arguments after the commad
let argument = "";
process.argv.forEach(function (element, index) {
    (index > 2) ? argument += element + " ": null;
});
argument = argument.trim(); // trim off the whitespace at the end

decideCall(process.argv[2], argument);