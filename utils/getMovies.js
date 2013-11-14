
// This file takes a list of movies from the top rentals section of the
// Rotten Tomatoes API and parses it into simplified objects in the form:
// {movieId : movieTitle}

var top50rentals = require('../data/top50rentals.json').movies;

var movies = {};
for (var i = 0; i < top50rentals.length; i++) {
	var title = top50rentals[i].title;
	var id = top50rentals[i].id;
	console.log( id + " - " + title);
	movies[id] = title;
}
console.log(JSON.stringify(movies));