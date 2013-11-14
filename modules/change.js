module.exports = function getTokenizedMovieReview(review, title, cast, directors) {
	
	// console.log("review: " + review);
	
	// replace title
	review = review.replace(new RegExp(title, "g"), '[TITLE]');

	// console.log("title: " + review);


	// replace cast and characters
	if (cast) {
		for (var i = 0; i < cast.length; i++) {
			var actor = cast[i].name;
			review = review.replace(new RegExp(actor, "g"), "[ACTOR-" + i + "]");

			// replace actor's last name
			var tmp = actor.split(' ');
			var actorLastName = tmp[tmp.length-1];
			review = review.replace(new RegExp(actorLastName, "g"), "[ACTOR-" + i + "]");

			var characters = cast.characters;
			if (characters && characters.length) {
				for (var j = 0; j < characters.length; j++) {
					var character = characters[j];
					review = review.replace(new RegExp(character, "g"), "[CHARACTER-" + j + "]");
				}
			}
		}
	}

	// console.log("actors: " + review);

	// replace director(s)
	if (directors) {
		for (var i = 0; i < directors.length; i++) {
			var director = directors[i].name;
			review = review.replace(new RegExp(director, "g"), "[DIRECTOR-" + i + "]");

			// replace director's last name
			var tmp = director.split(' ');
			var directorLastName = tmp[tmp.length-1];
			review = review.replace(new RegExp(directorLastName, "g"), "[DIRECTOR-" + i + "]");
		}
	} 
	
	// console.log("directors: " + review);

	return review;
}