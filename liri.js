var twitterKeys = require("./keys.js");
var spotifyKeys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify-web-api-node");
var moment = require("moment");
 
var twitter_call = new twitter({
  consumer_key: twitterKeys.twitters["ckey"],
  consumer_secret: twitterKeys.twitters["csecret"],
  access_token_key: twitterKeys.twitters["akey"],
  access_token_secret: twitterKeys.twitters["asecret"]
});

var spotify_call = new spotify({
	client_id: spotifyKeys.spotifys["cid"],
	client_secret: spotifyKeys.spotifys["cs"]
});

var command = process.argv[2];
var specific = process.argv[3];

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
		song_name = 'The Sign';
	}
	spotify_call.searchTracks(song_name)
		.then(function(data) {
			console.log(data.body);
		}, function(err) {
			console.error(err);
	})
}

else if (command == "movie-this") {
	var movie_name = specific;
	if (movie_name == undefined) {
		movie_name = 'Mr. Nobody';
	}

	var queryURL = "http://www.omdbapi.com/?t=" + movie_name + "&y=&plot=short&apikey=40e9cece";

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

		var dataArr = data.split(",");

		command = dataArr[0];
		specific = dataArr[1];
	})
}