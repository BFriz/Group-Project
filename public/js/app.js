var View = View || {};
var User = User || {};

var StorageUser; 
var AllUsers;

$(document).ready(function() {
	View.initialize();
	View.eventListeners();
	View.showRandomProfile();
});

// *************************
// VIEW FUNCTIONS
// *************************

View = {

	eventListeners: function() {

	  $('#panels_container').on('click', '#yes_button', function(event){ 
	  	event.preventDefault();;
	  	User.addToLikes();
	  	View.showRandomProfile();
	  });
	  $('#panels_container').on('click', '#no_button', function(event){
	  	event.preventDefault();
	  	User.addToDislikes();
	  	View.showRandomProfile();
	  })

	  $('#all_moods a').on('click', User.changeMood);

	  $('.container-fluid').on('click', '.show_matches', function(){
	  	User.showMatches(StorageUser, AllUsers);
	  })

},

	// store the current user and all the users so far
	// update moods and matches accordingly
	// everything starts here as we need the current user and all users to process the map
	initialize: function() {
		$.get('/users', function(response) {
			StorageUser = response.current_user;
			console.log('Storage User: ', StorageUser);
			AllUsers = response.users;
			console.log('AllUsers: ', AllUsers);

			// add shortened name to all users // VERY temporary soluion, of course much better to do that at DB leve
			_.each(AllUsers, function(user){
				user.shortName = User.shortenName(user.facebook.name);
			});
			StorageUser.shortName = User.shortenName(StorageUser.facebook.name);

			// all functions to initalize the rest of the app
			View.setActiveMood(StorageUser);
	    Map.markerArray = [];
		  Map.show();
      Map.initialize();
		})
	},

	setActiveMood: function(elementOrUser) {
		$('#all_moods li').removeClass('active_mood');
		// if I passed in a user, get li with user.mood, 
		// if I passed in an <a>, get its parent <li>
		if (elementOrUser._id !== undefined) {
			var element = $("#all_moods a[data-mood='" +elementOrUser.mood+ "']");
			element.parent().addClass('active_mood');
		} else {
			elementOrUser.parent().addClass('active_mood');
		}	
	}, 

	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// response = Array with ALL users and currentUser
			var relevantUsers = [];
			var currentUser = response.current_user;

			// if someone logged in, show profiles based on them"
			if (currentUser) {
				relevantUsers = response.users.filter(function (value) {
					return User.okToShow(value, currentUser);
				})

				// if mood is surprise me (default upon login), show everyone ;
				//  otherwise reduce relevantUsers to only show profiles with same mood as curr user
				if (currentUser.mood !== 'surprise_me') {
					relevantUsers = relevantUsers.filter(function (value) {
						return (value.mood === currentUser.mood)
					})
				}
			}

			// get random profile within the relevant ones
			if (relevantUsers.length > 0) {
				var i = getRandomInt(0, relevantUsers.length);
				// add shortened name to all users // VERY temporary soluion, of course much better to do that at DB leve
				relevantUsers[i].shortName = User.shortenName(relevantUsers[i].facebook.name);
				View.render($('#random_profile_template'), relevantUsers[i], $('#profile_panel'))
				console.log('relevantUsers', relevantUsers);

				// and show these profiles on the map
				Map.getCoords(relevantUsers);

			} else {
					View.render($('#nobody_mood_template'), null, $('#profile_panel'));
					// remove markers from map
			    Map.clearMarkerArray();
			}
		});
	},

  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.html(rendered);
  },

  append: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },
  prepend: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.prepend(rendered);
  }

}

// ************************
// USER FUNCTIONS 
// *************************

User = {

	okToShow: function(user, currentUser) {
		// keep users with relevant gender, and not being current user, and not previously seen
		var oppositeGender = (user.facebook.gender !== currentUser.facebook.gender 
				&& user._id !== currentUser._id);
		var notInLikes = (currentUser.likes.indexOf(user._id) === -1);
		var notInDislikes = (currentUser.dislikes.indexOf(user._id) === -1);

		return oppositeGender && notInLikes && notInDislikes;
	},

	showMatches: function(user, all_users) {
		// check objects StorageUser and AllUsers to retrieve matches
		$('#profile_panel').empty();

		// special msg if no matches
		if (user.matches.length === 0) {
			View.append( $('#no_matches_template'), null, $('#profile_panel') )
		}
		else {
			// for each id in user.matches, go into all_users and select the user having this id
			user.matches = _.uniq(user.matches);

			$.each(user.matches, function(index, id) {
				var retrieved_match = _.find(all_users, function(user){
					return user._id === id;
				});
				User.addToMatchView(retrieved_match);
				console.log('the match is', retrieved_match);
			});		
			// finally add the message telling how to play again
			View.prepend($('#matches_msg_template'), null, $('#profile_panel'));
		}
	},

	addToMatchView: function(user) {
		console.log('add to match view', user);
		View.prepend($('#append_to_matches_template'), user, $('#profile_panel') );
		$("#profile_panel").scrollTop($("#profile_panel")[0].scrollHeight);
    // think this was the command to ensure chat stays inside the div and scrolls to keep showing the latest one
	},

	addToDislikes: function() {
		var id = $('#showing_now_id').text();
		StorageUser.dislikes.push(id);
		StorageUser.dislikes = _.uniq(StorageUser.dislikes);
		var new_dislikes = StorageUser.dislikes;

		$.ajax({
			type: 'PUT',
			url: '/users/dislikes',
			data: {id: id, new_dislikes: new_dislikes}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes add dislikes');
		})

		// ***************************
		// TO DO emit socket DISLIKE
		// ***************************
	},

	addToLikes: function() {
		var id = $('#showing_now_id').text();
		StorageUser.likes.push(id);
		StorageUser.likes = _.uniq(StorageUser.likes);
		var new_likes = StorageUser.likes;

		$.ajax({
			type: 'PUT',
			url: '/users/likes',
			data: {id: id, new_likes: new_likes}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes add likes');
			// put request is also returning the "liked" profile
			User.chechIfMatch(data[0]);
		})
		// ***************************
		// TO DO emit socket LIKE to serverc

	},

	chechIfMatch: function(match) {
		var id_me = StorageUser._id;
		var id_match = match._id;

		if ( StorageUser.likes.indexOf(id_match) !== -1
			&& match.likes.indexOf(id_me) !== -1 ) {

			console.log("IT'S A MATCH !");

			// ***************************
			// TO DO showAnimationMatch,
			// ***************************

			StorageUser.matches.push(id_match);
			StorageUser.matches = _.uniq(StorageUser.matches);
			var new_matches_me = StorageUser.matches;

			match.matches.push(id_me);
			match.matches = _.uniq(match.matches);
			var new_matches_match = match.matches;


			$.ajax({
			type: 'PUT',
			url: '/users/match',
			data: { id_match: id_match,
					   new_matches_me: new_matches_me, 
					   new_matches_match: new_matches_match}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes add Match', data);
			User.addToMatchView(data);
			alert('It is a match!!');

			// ***************************
			// TO DO emit socket Match,
			// *************************** 
		})
		} else { 
			console.log('NOT a match yet')
		}
	},

	changeMood: function(event) {
		event.preventDefault();
		// update mood
		var mood = $(this).attr('data-mood');
		$.ajax({
			type: 'PUT',
			url: '/users/mood',
			data: {mood: mood}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes change mood');
		})

		View.showRandomProfile();
		View.setActiveMood($(this), mood);

		// ***************************
		// TO DO emit socket new mood
		// TO DO update matches shown
		// ***************************
	}, 

	shortenName: function(name) {
		return name.split(' ')[0];
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}





