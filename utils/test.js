// Load the "change" module.  It strips out the title, actors, characters, and directors from the review
// for comedic effect.
var change = require('../modules/change');

// final file of review objects in the form:
// {
// 	review: review,
// 	title: title,
// 	cast: cast,
// 	directors: directors
// }
var top50reviews = require('../data/top50reviews.json');

// Loop through formed review objects and run the parser module on them.
for (var i = 0; i < top50reviews.length; i++) {
	var review = top50reviews[i];
	var after = change(review.review, review.title, review.cast, review.directors);
	console.log('before: ' + review.review);
	console.log('after : ' + after);
}