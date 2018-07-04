require("dotenv").config();

//Global variables
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var nodeArgs = process.argv;
var request = require("request");

//Switch statment for var command...
switch (command) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

//Function for Twitter NPM
function tweets() {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: 'hildarrgo', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Date: " + tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
                console.log("------------------------")
            }
        }
    });
}

//Function for Spotify NPM
function spotify(song) {
    var spotify = new Spotify(keys.spotify);
    if (!song) {
        var song = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            song = song + " " + nodeArgs[i];
        }
    }
    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];

                console.log("Artist: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

            }
        } else {
            console.log('Error occurred.');
        }
    });
}

//Function for OMDB NPM
function movie(movie) {
    if (!movie) {
        var movie = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            movie = movie + " " + nodeArgs[i];
        }
    }
    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "=&plot=short&apikey=124ed23e";
    request(omdbURL, function (error, response, body) {
        if (process.argv[3] === undefined) {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        } else if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
        } else {
            console.log('Error occurred.')
        }
    });
}

//Function for do-what-it-says
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var dataResult = data.split(',');
        console.log(dataResult);
        console.log(dataResult[1]);
        switch (dataResult[0]) {
            case "spotify-this-song":
                spotify(dataResult[1]);
                break;
            case "my-tweets":
                tweets();
                break;
            case "movie-this":
                movie(dataResult[1]);
                break;
        }
    });
}