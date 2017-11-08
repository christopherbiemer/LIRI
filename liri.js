var twitterKeys = require("./keys.js");
var spotifyKeys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var moment = require("moment");
 
var twitter_call = new twitter({
  consumer_key: twitterKeys.twitters["ckey"],
  consumer_secret: twitterKeys.twitters["csecret"],
  access_token_key: twitterKeys.twitters["akey"],
  access_token_secret: twitterKeys.twitters["asecret"]
});

var spotify_call = new spotify({
  	id: spotifyKeys.spotifys["cid"],
	secret: spotifyKeys.spotifys["cs"],

})

var command = process.argv[2];
var specific = process.argv[3];

var morespecific;

if (specific == undefined) {
	morespecific = "";
}

function master() {
	fs.appendFile("log.txt", command + " " + morespecific, function(error) {
				})
	if (command == "my-tweets") {
		var params = {screen_name: 'beligerentitis'};
		twitter_call.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				console.log(" ");
				for (var i = 19; i>-1; i--) {
					console.log('"' + tweets[i]["text"] + '"');
					fs.appendFile("log.txt", ", " + tweets[i]["text"], function(error) {
					})
					var timestamp = tweets[i]["created_at"];
					timestamp = moment(timestamp).format("LLLL");
					console.log("("+ timestamp + ")");
					fs.appendFile("log.txt", "-->" + timestamp, function(error) {
					})
					console.log(" ");		
				}
			fs.appendFile("log.txt", " || ", function(error) {
					})
			}
		});
	}

	else if (command == "spotify-this-song") {
		var song_name = specific;
		if (song_name == undefined) {
			song_name = '0hrBpAOgrt8RXigk83LLNE';
			spotify_call.request("https://api.spotify.com/v1/tracks/" + song_name)
			.then(function(data) {
				console.log("");
				console.log("Artist(s): " + data['artists'][0]['name']);
				fs.appendFile("log.txt", ", " + data['artists'][0]['name'], function(error) {
					})
				console.log("Track: " + data['name']);
				fs.appendFile("log.txt", ", " + data['name'], function(error) {
					})
				console.log("Preview URL: " + data['preview_url']);
				fs.appendFile("log.txt", ", " + data['preview_url'], function(error) {
					})
				console.log("Album: " + data['album']['name']);
				fs.appendFile("log.txt", ", " + data['album']['name'] + " || ", function(error) {
					})
				console.log("");
			})
			.catch(function(err) {
				console.log(err);
			})
		}

		else {
			spotify_call.search({ type: 'track', query: song_name}, function(err, data) {
				if (err) {
					return console.log(err);
				}
				console.log("");
				console.log("Artist(s): " + data['tracks']['items'][0]['artists'][0]['name']);
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['artists'][0]['name'], function(error) {
					})
				console.log("Track: " + data['tracks']['items'][0]['name']);
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['name'], function(error) {
					})
				console.log("Preview URL: " + data['tracks']['items'][0]['preview_url']);
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['preview_url'], function(error) {
					})
				console.log("Album: " + data['tracks']['items'][0]['album']['name']);
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['album']['name'] + " || ", function(error) {
					})
				console.log("");			
			})
		}
	}

	else if (command == "movie-this") {
		var movie_name = specific;
		if (movie_name == undefined) {
			movie_name = 'Mr. Nobody';
		}

		var queryURL = "http://www.omdbapi.com/?t=" + movie_name + "&y=&plot=short&apikey=40e9cece";

		console.log(queryURL);

		request(queryURL, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var rotten_tomatoes = JSON.parse(body).Ratings[1]["Value"];
				console.log("");
				console.log("Title: " + JSON.parse(body).Title);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Title, function(error) {
					})
				console.log("Year: " + JSON.parse(body).Year);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Year, function(error) {
					})
				console.log("IMDB Score: " + JSON.parse(body).imdbRating);
				fs.appendFile("log.txt", ", " + JSON.parse(body).imdbRating, function(error) {
					})
				console.log("Rotten Tomatoes: " + rotten_tomatoes);
				fs.appendFile("log.txt", ", " + rotten_tomatoes, function(error) {
					})
				console.log("Country: " + JSON.parse(body).Country);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Country, function(error) {
					})
				console.log("Language: " + JSON.parse(body).Language);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Language, function(error) {
					})
				console.log("Plot: " + JSON.parse(body).Plot);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Plot, function(error) {
					})
				console.log("Actors: " + JSON.parse(body).Actors);
				fs.appendFile("log.txt", ", " + JSON.parse(body).Actors + " || ", function(error) {
					})
				console.log("");
			}
		})
	}

	else if (command == "do-what-it-says") {

		fs.readFile("random.txt", "utf8", function(error, data) {

			if (error) {
				return console.log(error);
			}
			dataArr = data.split(",");
			command = dataArr[0];
			specific = dataArr[1];
			master();
		})	

	}
}

master();