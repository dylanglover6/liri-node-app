require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs")

//spotify api
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//twitter api
var twitter = require("twitter");
var Twitter = require('twitter');
var params = {screen_name: 'dylangl36887131', count: 20};
var client = new Twitter(keys.twitter);

//user input
var command = process.argv[2];
var argument = process.argv[3];

//help function
if (command === "help") {
console.log(`
LIRI COMMANDS:
*node liri my-tweets: Record of my last 20 tweets.
*node liri spotify-this-song '<song name here>': Information for a specific song from Spotify.
*node liri movie-this '<movie name here>': Information for a specific movie from OMDB.
*node liri do-what-it-says: Runs a surprise function!
`)
}
//tweet function
if (command === "my-tweets") {
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (i=0; i<tweets.length; i++){
      console.log(`
      ${tweets[i].created_at}
      ${tweets[i].text}
      `);
      }
    }
  });
 };

//spotify function
if (command === "spotify-this-song") {
  console.log(keys.spotify)
spotify
  .search({ type: 'track', query: argument})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
};

//omdb function
if (command === "movie-this") {
  if (argument === undefined) {
    var queryUrl = "http://www.omdbapi.com/?t=mr nobody&y=&plot=short&apikey=trilogy"
  } else {
  var queryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=trilogy";
  } 
  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log(body)
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
};

//do what it says
if (command === "do-what-it-says") {
  fs.readFile("./random.txt", "utf-8", function(err, data){
    if( err ){
      return console.log(err);
    }
    return process.argv = JSON.parse("node liri " + data);
  
  })
};

console.log(`

 _     ___  ___ ___ 
| |   |_ _|| _ \|_ _|
| |__  | | |  / | | 
|____||___||_|_\|___|

Type 'node liri help' for a list of commands
`);