require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
let fs = require('fs');
let keys = require('./keys.js')

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

let nodeArg = process.argv;
let liriCommand = process.argv[2];
let liriCommandArgs = [];
if (nodeArg.length > 3) {
    liriCommandArgs = nodeArg.slice(3)
}


function myTweets() {
    var params = { screen_name: 'DavidTr48297218' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.map(x => console.log(`Created at: ${x.created_at}\nMessage: ${x.text}\n`));
        }
    });
}



function spotifyThisSong(song) {
    let querySong = song;


    spotify.search({ type: 'track', query: song, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        let album = data.tracks.items;

        album.map((x) => {
            let artists = x.artists.map((x) => x.name).join(",")
            console.log(`Artist(s): ${artists}`)
            console.log(`Song Name: ${x.album.name}`)
            console.log(`Preview URL: ${x.preview_url}`)
            console.log("--------------------------------------")
        });

    });
}

function movieThis() {
    let queryMovie = "Mr.+Nobody";
    if (liriCommandArgs.length !== 0) {
        queryMovie = liriCommandArgs.join('+');
    } else {
        console.log(`You didn't inputted anything so watch this instead!`)
    }
    let queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + queryMovie;
    request(queryUrl, function (err, response, body) {
        if (err) {
            return console.log(error);
        }
        if (!err && response.statusCode === 200) {
            let movie = JSON.parse(body);
            console.log(`Movie: ${movie.Title}`);
            console.log(`Year released: ${movie.Year}`);
            console.log(`IMDB Rating: ${movie.imdbRating}`);
            console.log(`Rotten Tomatoes: ${movie.Ratings.filter((x)=>x.Source === 'Rotten Tomatoes')[0].Value}`);
            console.log(`Country: ${movie.Country}`);
            console.log(`Language: ${movie.Language}`);
            console.log(`Plot: ${movie.Plot}`);
            console.log(`Actors: ${movie.Actors}`)
        }
    })
}

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        spotifyThisSong(data.split(',')[1]);
    })
}

switch (liriCommand) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        let searchSong = "The Sign";
        // console.log(liriCommandArgs.length)
        if (liriCommandArgs.length !== 0) {
            searchSong = liriCommandArgs.join(" ");
            console.log(searchSong)
        }
        spotifyThisSong(searchSong);
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Available commands: my-tweets, spotify-this-song, movie-this, do-what-it-says");
}

