$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
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

var showTopAnswers = function(answ) {
	
	// clone our result template code
	var result = $('.templates .answerers').clone();
	
	var $profile_image = result.find('.profile_image');
	$profile_image.html('<a href="'+ answ.user.link +'" target="_blank"><img src="'+ answ.user.profile_image +'"/></a>');

	/*var profile_image = result.find('.profile_image img');
	profile_image.attr('src', answ.user.profile_image);
	var profile_image_link = result.find('.profile_image a');
	username.attr('href', answ.user.link);
	username.text(answ.user.display_name);*/

	var $username = result.find('.username');
	$username.html('<a href="'+ answ.user.link +'" target="">'+ answ.user.display_name +'</a>');

	/*var username = result.find('.username a');
	username.attr('href', answ.user.link);
	username.text(answ.user.display_name);*/

	var $reputation = result.find('.reputation');
	$reputation.html(answ.user.reputation + ' REPUTATION');



/*
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
	);*/

	return result;
};

var getInspiration = function(tags) {

	/*var str = '{"items":[{"user":{"reputation":82422,"user_id":165737,"user_type":"registered","accept_rate":97,"profile_image":"https://i.stack.imgur.com/odROI.jpg?s=128&g=1","display_name":"Anurag","link":"http://stackoverflow.com/users/165737/anurag"},"post_count":4,"score":1159},{"user":{"reputation":111497,"user_id":1386886,"user_type":"registered","accept_rate":100,"profile_image":"https://i.stack.imgur.com/ItXE6.jpg?s=128&g=1","display_name":"jAndy","link":"http://stackoverflow.com/users/1386886/jandy"},"post_count":2,"score":1071},{"user":{"reputation":17105,"user_id":59119,"user_type":"registered","accept_rate":91,"profile_image":"https://i.stack.imgur.com/2RWB1.jpg?s=128&g=1","display_name":"Natrium","link":"http://stackoverflow.com/users/59119/natrium"},"post_count":1,"score":1004},{"user":{"reputation":205317,"user_id":139459,"user_type":"registered","accept_rate":97,"profile_image":"https://i.stack.imgur.com/yWGxS.png?s=128&g=1","display_name":"Sarfraz","link":"http://stackoverflow.com/users/139459/sarfraz"},"post_count":3,"score":936},{"user":{"reputation":10278,"user_id":190371,"user_type":"registered","accept_rate":73,"profile_image":"https://www.gravatar.com/avatar/7edde2a03ddf8ac52bfe607e0d20f0cc?s=128&d=identicon&r=PG","display_name":"Mark","link":"http://stackoverflow.com/users/190371/mark"},"post_count":1,"score":584},{"user":{"reputation":393167,"user_id":157247,"user_type":"registered","accept_rate":89,"profile_image":"https://www.gravatar.com/avatar/ca3e484c121268e4c8302616b2395eb9?s=128&d=identicon&r=PG","display_name":"T.J. Crowder","link":"http://stackoverflow.com/users/157247/t-j-crowder"},"post_count":22,"score":387},{"user":{"reputation":324218,"user_id":18936,"user_type":"registered","profile_image":"https://www.gravatar.com/avatar/3f6f1bea81a68b2f1cfe3efbb9be94bc?s=128&d=identicon&r=PG","display_name":"bobince","link":"http://stackoverflow.com/users/18936/bobince"},"post_count":5,"score":360},{"user":{"reputation":7271,"user_id":1029146,"user_type":"registered","accept_rate":89,"profile_image":"https://www.gravatar.com/avatar/a659be962c006e43e110b5a9dfda538e?s=128&d=identicon&r=PG","display_name":"Aerovistae","link":"http://stackoverflow.com/users/1029146/aerovistae"},"post_count":1,"score":334},{"user":{"reputation":12608,"user_id":239916,"user_type":"registered","accept_rate":93,"profile_image":"https://i.stack.imgur.com/FT83A.jpg?s=128&g=1","display_name":"Thomas Eding","link":"http://stackoverflow.com/users/239916/thomas-eding"},"post_count":1,"score":326},{"user":{"reputation":3568,"user_id":627938,"user_type":"registered","accept_rate":71,"profile_image":"https://www.gravatar.com/avatar/e72094f6dfa1c03978bd164bef227c1f?s=128&d=identicon&r=PG","display_name":"sebastian","link":"http://stackoverflow.com/users/627938/sebastian"},"post_count":1,"score":312},{"user":{"reputation":13060,"user_id":92448,"user_type":"registered","accept_rate":100,"profile_image":"https://i.stack.imgur.com/iYq8Z.jpg?s=128&g=1","display_name":"JAL","link":"http://stackoverflow.com/users/92448/jal"},"post_count":1,"score":260},{"user":{"reputation":11354,"user_id":12034,"user_type":"registered","accept_rate":83,"profile_image":"https://www.gravatar.com/avatar/755ad21d2059ac3970754edd621ba65b?s=128&d=identicon&r=PG","display_name":"noah","link":"http://stackoverflow.com/users/12034/noah"},"post_count":1,"score":239},{"user":{"reputation":14063,"user_id":459688,"user_type":"registered","accept_rate":100,"profile_image":"https://i.stack.imgur.com/MgywE.jpg?s=128&g=1","display_name":"amosrivera","link":"http://stackoverflow.com/users/459688/amosrivera"},"post_count":1,"score":211},{"user":{"reputation":4137,"user_id":2001511,"user_type":"registered","accept_rate":100,"profile_image":"https://www.gravatar.com/avatar/533b687cf97f813c620703e41c215fd7?s=128&d=identicon&r=PG","display_name":"Michael Wales","link":"http://stackoverflow.com/users/2001511/michael-wales"},"post_count":1,"score":197},{"user":{"reputation":413524,"user_id":19068,"user_type":"registered","profile_image":"https://www.gravatar.com/avatar/1d2d3229ed1961d2bd81853242493247?s=128&d=identicon&r=PG","display_name":"Quentin","link":"http://stackoverflow.com/users/19068/quentin"},"post_count":17,"score":196},{"user":{"reputation":33580,"user_id":187291,"user_type":"registered","accept_rate":100,"profile_image":"https://www.gravatar.com/avatar/7b727a03622f0f926d8ea1c2b30ee800?s=128&d=identicon&r=PG","display_name":"user187291","link":"http://stackoverflow.com/users/187291/user187291"},"post_count":2,"score":176},{"user":{"reputation":1609,"user_id":595102,"user_type":"registered","profile_image":"https://www.gravatar.com/avatar/e1be26d851282e56d3c9014db31a7a28?s=128&d=identicon&r=PG","display_name":"Serge Paquet","link":"http://stackoverflow.com/users/595102/serge-paquet"},"post_count":1,"score":160},{"user":{"reputation":180926,"user_id":6782,"user_type":"registered","accept_rate":83,"profile_image":"https://www.gravatar.com/avatar/dc8c4ddd99b446c28d2e1546c457e508?s=128&d=identicon&r=PG","display_name":"Alnitak","link":"http://stackoverflow.com/users/6782/alnitak"},"post_count":10,"score":142},{"user":{"reputation":110054,"user_id":707111,"user_type":"moderator","accept_rate":100,"profile_image":"https://i.stack.imgur.com/oXZkh.jpg?s=128&g=1","display_name":"minitech","link":"http://stackoverflow.com/users/707111/minitech"},"post_count":5,"score":136},{"user":{"reputation":18026,"user_id":255756,"user_type":"registered","profile_image":"https://www.gravatar.com/avatar/2d5f5a95c73b1c3c353c27a8e90e6158?s=128&d=identicon&r=PG","display_name":"Linus Kleen","link":"http://stackoverflow.com/users/255756/linus-kleen"},"post_count":1,"score":120}],"has_more":false,"quota_max":"unlimited","quota_remaining":999999999999}';
	var result = JSON.parse(str);
	console.log(result);
	var searchResults = showSearchResults(tags, result.items.length);
	$('.search-results').html(searchResults);

	$.each(result.items, function(i, item) {
		var block = showTopAnswers(item);
		$('.results').append(block);
	});*/
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {site: 'stackoverflow',};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(tags, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var block = showTopAnswers(item);
			$('.results').append(block);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



