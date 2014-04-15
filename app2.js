$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
//This is the feature 2 doc.ready section; Question: What do you call this part of the project?//	
	$('.inspiration-getter').submit(function(event){
	//zero out results if previous search has run
	$('.results').html('');
	//get the value of the tags the user submitted
	var tags = $(this).find("input[name='answerers']").val();
	getInspiration(tags);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};
/*Additonal Feature: This function takes the score object from stackoverview and append the result to the DOM*/
var showAnswererScore = function(answererScore) {

	//clone our result template code
	var result = $('.templates .answererScore').clone();

	//Set the answerer properties in result
	var answererElem = result.find('.answerer a');
	answererElem.attr('href', answererScore.user.link);
	answererElem.text(answererScore.user.display_name);

/* answerer = result.find('.answerer');
	answerer.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + topic.user.user_id + ' >' +
													topic.user.display_name +
												'</a>' +
							'</p>'
 	);
// set the #views for question property in result
var reputation = result.find('.reputation');
	reputation.text(topic.user.reputation);
*/

	result.find('.num-posts').text(answererScore.post_count);
	result.find('.score').text(answererScore.score);

	return result;
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
/*This is the beginning of feature 2 JS code: Request for Inspiration*/
var getInspiration = function(tags) {
/*Does this need to be function(tags)? */
	var request = {
							site:'stackoverflow',
				};
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/all-time",
		data: request,
		dataType:"jsonp", /*What does this mean? Why not just json?*/
		type: "GET",
	})
	.done(function(result){
		/*What is this for? Why do we need to change request:tagged to tags?*/
		var searchResults = showSearchResults(tags, result.items.length);
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answererScore = showAnswererScore(item);
			$(".result").append(answererScore);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
	

