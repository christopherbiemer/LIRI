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

function master() {
	
	if (command == "my-tweets") {
		var params = {screen_name: 'beligerentitis'};
		twitter_call.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				console.log(" ");
				for (var i = 19; i>-1; i--) {
					console.log('"' + tweets[i]["text"] + '"');
					var timestamp = tweets[i]["created_at"];
					timestamp = moment(timestamp).format("LLLL");
					console.log("("+ timestamp + ")");
					console.log(" ");
				}
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
				console.log("Track: " + data['name']);
				console.log("Preview URL: " + data['preview_url']);
				console.log("Album: " + data['album']['name']);
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
				console.log("Track: " + data['tracks']['items'][0]['name']);
				console.log("Preview URL: " + data['tracks']['items'][0]['preview_url']);
				console.log("Album: " + data['tracks']['items'][0]['album']['name']);
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
				console.log("Year: " + JSON.parse(body).Year);
				console.log("IMDB Score: " + JSON.parse(body).imdbRating);
				console.log("Rotten Tomatoes: " + rotten_tomatoes);
				console.log("Country: " + JSON.parse(body).Country);
				console.log("Language: " + JSON.parse(body).Language);
				console.log("Plot: " + JSON.parse(body).Plot);
				console.log("Actors: " + JSON.parse(body).Actors);
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