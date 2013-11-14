var $ = require('jquery');
var fs = require('fs');
var top50movies = require('./top50rentals_parsed.json'); // parsed list of objects like {movieID : movieTitle}

var apikey = 'wqewutfkxnqur7jzfvhaq7kn';
var id = 771303549;

var promises = []; // list of promises to use $.when() on
var done = false; // set to true after the max number of movies are looked up from the API

var outputobjs = []; // objects that will finally be written out to a JSON file

var movieIds = []; // list of movie IDs from Rotten Tomatoes.
for (var id in top50movies) {
	movieIds.push(id);
}

var maxMoviesToLookup = 5; // max number of movies to lookup.
maxMoviesToLookup = movieIds.length;


// Loop through and add parsed review objects to the list of outputobjs
// A setTimeout() is used because you can only make 10 calls the Rotten Tomatoes API
// per second, and 10,000 calls daily.
for (var ctr = 0; ctr < maxMoviesToLookup; ctr++) {
	(function(currentId, currentIndex) {
		setTimeout(function() {
		var url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' + currentId + '.json?apikey=' + apikey;

		var promise1 = $.get(url, parseMovieInfo, 'text').fail(function(error) {
		    console.log( error );
		  });
		promises.push(promise1);
		console.log("COUTNER: " + currentIndex);
		console.log("MOVIE  : " + top50movies[currentId]);
		console.log("URL    : " + url);
		if (currentIndex === maxMoviesToLookup-1) { // set done to true after last iteration
			done = true;
		}
	}, 1000 * ctr);
	})(movieIds[ctr], ctr);
}

// This takes an individual movie object from the Rotten Tomatoes API as text (how it is normally returned.
// It then parses the text to an object and looks up the reviews.  It mashes the reviews together with the
// title, cast, and directors to create a review object that can be put into a list to be written to file.
function parseMovieInfo(movie) {
	var movie = JSON.parse(movie);
	var reviewsUrl = movie.links.reviews + 
		'?review_type=top_critic&page_limit=50&page=1&country=us'
		+'&apikey=' + apikey;
	console.log(reviewsUrl);
	var promise2 = $.get(reviewsUrl, function (reviewObj) {
  		var reviews = JSON.parse(reviewObj);
  		reviews = reviews.reviews;
  		console.log("NUM REVIEWS: " + reviews.length);
  		for (var i = 0; i < reviews.length; i++) {
  			var outputobj = {
  				review: reviews[i].quote,
  				title: movie.title,
  				cast: movie.abridged_cast,
  				directors: movie.abridged_directors
  			}
  			outputobjs.push(outputobj);
		}
		// console.log(JSON.stringify(outputobjs));
  	}, 'text').promise();
	promises.push(promise2);

	if (done === true) {
		$.when.apply(this, promises).done(function () {
	        console.log('all clear!');
	        console.log("\n\n\n");
	        console.log(JSON.stringify(outputobjs));
	        fs.appendFile('out.json', JSON.stringify(outputobjs));
	    });
	}
}

