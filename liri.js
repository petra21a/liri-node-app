//require dotenv
require("dotenv").config();

//require FS
const fs = require("fs");

//Add the code required to import the `keys.js` file and store it in a variable.
const keys = require("./keys.js")

//requires APIs
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require("request");

//creates new object with API constructor
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);



//gets hyphenated instructions as per homework directions
let instructions ="";
let searchItem=[];

//assumes everything after instructions is one item seperated by spaces
// let task = searchItem.map(x => x + " ");
if (process.argv[2] === "do-what-it-says") {
    //From Activity 12: ReadFile
    fs.readFile("./random.txt", "utf8", function (error, data) {
            
        if (error) {
            return console.log("Error reading file: " + error);
            }
            // We will then print the contents of data
            let fileContents = data.split(",");
            instructions = fileContents[0];
            searchItem = fileContents.splice(1);
            liri();
        })
    }else{
        instructions = process.argv[2];
        searchItem = process.argv.splice(3);
        liri();
    };
    
    function liri() {

    switch (instructions) {
        case "my-tweets":
            let params = { screen_name: 'petra21a', count: 20 };
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error && response.statusCode === 200) {
                    for (const n of tweets) {
                        console.log(n.text + " - created: " + n.created_at)
                    }
                }
            });
            ;
            break;
        case "spotify-this-song":
            //defaults to "The Sign"
            spotify.search({ type: 'track', query: searchItem.join(' ') || "The Sign Ace of Base", limit: 1 }, function (error, data) {
                if (!error) {
                    //This is a lazy way to get the Artists without creating a new variable to concatenate a string
                    console.log("Artists: ")
                    for (let i = 0; i < data.tracks.items[0].artists.length; i++) {
                        console.log("  " + data.tracks.items[0].artists[i].name)
                    }
                    console.log("Track name: " + data.tracks.items[0].name)
                    if (data.tracks.items[0].preview_url === null) {
                        console.log("No preview track provided. Link to Spotify: " + data.tracks.items[0].external_urls.spotify)
                    } else {
                        console.log("Preview track: " + data.tracks.items[0].preview_url)
                    }
                    console.log("Album name: " + data.tracks.items[0].album.name)
                }
            });
            ;
            break;

        case "movie-this":
            //From activity 18: 
            //request to the OMDB API with the movie specified
            let queryUrl = "http://www.omdbapi.com/?t=" + (searchItem.join('+') || "Mr+Nobody") + "&y=&plot=short&apikey=trilogy";

            // This line is just to help us debug against the actual URL.
            console.log(queryUrl);

            request(queryUrl, function (error, response, body) {

                // If the request is successful
                if (!error && response.statusCode === 200) {

                    // Parse the body of the site and recover just the imdbRating
                    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                    // console.log(JSON.parse(body));
                    console.log("Movie Title: " + JSON.parse(body).Title)
                    console.log("Year: " + JSON.parse(body).Year)

                    //looping here in case the ratings are in different order for different movies
                    for (let i = 0; i < JSON.parse(body).Ratings.length; i++) {
                        console.log(JSON.parse(body).Ratings[i].Source + " Rating: " + JSON.parse(body).Ratings[i].Value)
                    }
                    console.log("Production Countries: " + JSON.parse(body).Country)
                    console.log("Language(s): " + JSON.parse(body).Language)
                    console.log("Plot Summary: " + JSON.parse(body).Plot)
                    console.log("Actors: " + JSON.parse(body).Actors)
                }
            });


        default:
            break;
    };
}
