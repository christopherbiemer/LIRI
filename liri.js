//referencing the key objects from keys.js
var keys = require("./keys.js");
//require node to read and write files on command
var fs = require("fs");
//require node to request data from an API on command
var request = require("request");
//require node to access the twitter npm on command
var twitter = require("twitter");
//require node to access the node-spotify-api npm on command
var spotify = require("node-spotify-api");
//require node to implement moment formats on command
var moment = require("moment");

//setting up a twitter call with authentication keys
var twitter_call = new twitter({
  consumer_key: keys.twitters["ckey"],
  consumer_secret: keys.twitters["csecret"],
  access_token_key: keys.twitters["akey"],
  access_token_secret: keys.twitters["asecret"]
});

//setting up a spotify call with authentication keys
var spotify_call = new spotify({
  	id: keys.spotifys["cid"],
	secret: keys.spotifys["cs"],
})

//set the first command line argument to a variable
var command = process.argv[2];
//initialize a variable with a blank string
var specific = "";
//create an array of all command line arguments
var nodes = process.argv;
//for those command line arguments after 3
for (var i = 3; i < nodes.length; i++) {
  //if the index is 4 or more
  if (i > 3 && i < nodes.length) {
  	//append the command with a plus sign
    specific = specific + "+" + nodes[i];
  }
  //if the index is 3
  else {
  	//keep the second command line argument as is
    specific += nodes[i];
  }
}

//one function with all possible command line arguments
function master() {
	//originate command line arguments in a log file
	fs.appendFile("log.txt", command + " " + specific, function(error) {
				})
	//if the first command line argument is "my-tweets"
	if (command == "my-tweets") {
		//demo page username
		var params = {screen_name: 'beligerentitis'};
		//access twitter npm to grab statuses
		twitter_call.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				//clean formatting
				console.log(" ");
				//last 20 tweets in descending order
				for (var i = 19; i>-1; i--) {
					//print the tweet in the console
					console.log('"' + tweets[i]["text"] + '"');
					//log the tweet in the text file
					fs.appendFile("log.txt", ", " + tweets[i]["text"], function(error) {
					})
					//set the timestamp to a variable
					var timestamp = tweets[i]["created_at"];
					//use the moment LLLL format
					timestamp = moment(timestamp).format("LLLL");
					//print the timestamp in the console
					console.log("("+ timestamp + ")");
					//log the timestamp to the text file
					fs.appendFile("log.txt", "-->" + timestamp, function(error) {
					})
					//clean formatting
					console.log(" ");		
				}
			//add an instance break to the text file
			fs.appendFile("log.txt", " || ", function(error) {
					})
			}
		});
	}

	//if the first command argument is equal to "spotify-this-song"
	else if (command == "spotify-this-song") {
		//set the second argument to the song_name to be searched
		var song_name = specific;
		//if a song_name is not specified
		if (song_name == "") {
			//set the song_name equal to the id of The Sign by Ace of Bass 
			song_name = '0hrBpAOgrt8RXigk83LLNE';
			//call on the spotify npm to look up the track
			spotify_call.request("https://api.spotify.com/v1/tracks/" + song_name)
			.then(function(data) {
				//clean formatting in console
				console.log("");
				//print the artist(s) name in the console
				console.log("Artist(s): " + data['artists'][0]['name']);
				//log the artist(s) name in the text file
				fs.appendFile("log.txt", ", " + data['artists'][0]['name'], function(error) {
					})
				//print the track name in the console
				console.log("Track: " + data['name']);
				//log the track name in the text file
				fs.appendFile("log.txt", ", " + data['name'], function(error) {
					})
				//print the preview URL in the console
				console.log("Preview URL: " + data['preview_url']);
				//log the preview URL in the text file
				fs.appendFile("log.txt", ", " + data['preview_url'], function(error) {
					})
				//print the album name in the console
				console.log("Album: " + data['album']['name']);
				//log the album name in the text file with an instance seperator
				fs.appendFile("log.txt", ", " + data['album']['name'] + " || ", function(error) {
					})
				//clean formatting in console
				console.log("");
			})
			//log errors if they occur
			.catch(function(err) {
				console.log(err);
			})
		}

		//if a song_name is entered
		else {
			//call on the spotify npm to search for the track
			spotify_call.search({ type: 'track', query: song_name}, function(err, data) {
				//catches errors in the request
				if (err) {
					return console.log(err);
				}
				//clean formatting in the console
				console.log("");
				//print the artist(s) name in the console
				console.log("Artist(s): " + data['tracks']['items'][0]['artists'][0]['name']);
				//log the artist(s) name in the text file
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['artists'][0]['name'], function(error) {
					})
				//print the track name in the console
				console.log("Track: " + data['tracks']['items'][0]['name']);
				//log the track name in the text file
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['name'], function(error) {
					})
				//print the preview URL in the console
				console.log("Preview URL: " + data['tracks']['items'][0]['preview_url']);
				//log the track name in the text file
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['preview_url'], function(error) {
					})
				//print the album name in the console
				console.log("Album: " + data['tracks']['items'][0]['album']['name']);
				//log the album name in the text file with an instance seperator
				fs.appendFile("log.txt", ", " + data['tracks']['items'][0]['album']['name'] + " || ", function(error) {
					})
				//clean formatting in the console
				console.log("");			
			})
		}
	}

	//if the first command line argument is "movie-this"
	else if (command == "movie-this") {
		//set the movie_name equal to the second command
		var movie_name = specific;
		//if a movie_name is not specified
		if (movie_name == "") {
			//set the default movie to Mr. Nobody
			movie_name = 'Mr. Nobody';
		}
		//set the query URL with the movie name and API key
		var queryURL = "http://www.omdbapi.com/?t=" + movie_name + "&y=&plot=short&apikey=40e9cece";

		//request data from the OMDB API
		request(queryURL, function(error, response, body) {
			//if the request page loads and there are no errors in the request
			if (!error && response.statusCode === 200) {
				//set the rotten tomatoes rating to a variable for later use
				var rotten_tomatoes = JSON.parse(body).Ratings[1]["Value"];
				//clean formatting in the console
				console.log("");
				//print the title in the console
				console.log("Title: " + JSON.parse(body).Title);
				//log the title to a text file
				fs.appendFile("log.txt", ", " + JSON.parse(body).Title, function(error) {
					})
				//print the year in the console
				console.log("Year: " + JSON.parse(body).Year);
				//log the year in the console
				fs.appendFile("log.txt", ", " + JSON.parse(body).Year, function(error) {
					})
				//print the IMDB rating in the console
				console.log("IMDB Score: " + JSON.parse(body).imdbRating);
				//log the IMDB rating in the console
				fs.appendFile("log.txt", ", " + JSON.parse(body).imdbRating, function(error) {
					})
				//print the rotten tomatoes score in the console
				console.log("Rotten Tomatoes: " + rotten_tomatoes);
				//log the rotten tomatoes score in a text file
				fs.appendFile("log.txt", ", " + rotten_tomatoes, function(error) {
					})
				//print the country in the console
				console.log("Country: " + JSON.parse(body).Country);
				//log the country in a text file
				fs.appendFile("log.txt", ", " + JSON.parse(body).Country, function(error) {
					})
				//print the language in the console
				console.log("Language: " + JSON.parse(body).Language);
				//log the language in a text file
				fs.appendFile("log.txt", ", " + JSON.parse(body).Language, function(error) {
					})
				//print the plot in the console
				console.log("Plot: " + JSON.parse(body).Plot);
				//log the plot in a text file
				fs.appendFile("log.txt", ", " + JSON.parse(body).Plot, function(error) {
					})
				//print the actors in the console
				console.log("Actors: " + JSON.parse(body).Actors);
				//log the actors in a text file with an instance seperator
				fs.appendFile("log.txt", ", " + JSON.parse(body).Actors + " || ", function(error) {
					})
				//clean formatting for display in console
				console.log("");
			}
		})
	}
	//if the first command line argument is "do-what-it-says"
	else if (command == "do-what-it-says") {
		//read the random.txt file associated with the app
		fs.readFile("random.txt", "utf8", function(error, data) {
			//report errors
			if (error) {
				return console.log(error);
			}
			//split the data in the text file into an array with commas
			dataArr = data.split(",");
			//set the first command line argument to the first phrase in the document
			command = dataArr[0];
			//set the second command line argument to the second phrase in the document
			specific = dataArr[1];
			//run the function again to implement the command
			master();
		})	

	}
}

master();