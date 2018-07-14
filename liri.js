//require dotenv
require("dotenv").config();
const fs = require("fs");

//Add the code required to import the `keys.js` file and store it in a variable.
const keys = require("./keys.js")

const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

let instructions = process.argv[2];

let searchItem = process.argv.splice(3);
let task = searchItem.map(x => x + " ");
console.log(task.join(' '));

switch (instructions.join('-')) {
    case "my-tweets":
        let params = { screen_name: 'petra21a', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (const n of tweets){
                    console.log(n.text+" - created: "+n.created_at)
                }
            }
        });
        ;
        break;
    case "spotify-this-song":
    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });

        ;
        break;
    case "movie-this":
        ;
        break;
    case "do-what-it-says":
        ;

        break;
    case "remainder":

        break;
    default:
        break;
};