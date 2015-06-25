var View = View || {};
var User = User || {};

var StorageUser; 

function StoreCurrentUser() {
	$.get('/users', function(response) {
		// response = Array with ALL users and current_user
		StorageUser = response.current_user;
		console.log('Storage User: ', StorageUser);
	})
}

// *************************
// VIEW FUNCTIONS
// *************************

View = {

	eventListeners: function() {

	  $('#left_panel').on('click', '#yes_button', function(event){ 
	  	event.preventDefault();;
	  	User.addToLikes();
	  	View.showRandomProfile();
	  })

	  $('#left_panel').on('click', '#no_button', function(event){
	  	event.preventDefault();
	  	User.addToDislikes();
	  	View.showRandomProfile();
	  })

	  $('#mood_menu a').on('click', User.changeMood);

	  $('#submitLocation').on('submit', User.changeLocation);

	},

  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  setMood: function() {
  	$.get('/users', function(response) {
  		var current_user = response.current_user;
  		if (current_user) {
  			var element = $("#mood_menu a[data-mood='" +current_user.mood+ "']");
  			var highlight = element.parent();
  		} else { var highlight = $("#mood_menu li:first") }
  		highlight.addClass('active_mood');
  	})
  },
  
	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// response = Array with ALL users and current_user
			console.log('response random profile', response);
			var relevant_users = [];
			var current_user = response.current_user;

			// if someone logged in, show profiles based on them"
			if (current_user) {
				// keep users with relevant gender, and not being current user
				relevant_users = response.users.filter(function (value) {
					return (value.facebook.gender !== current_user.facebook.gender 
									&& value._id !== current_user._id);
				})
				// if mood is surprise me (default upon login), show everyone ;
				//  otherwise only show profiles with same mood as curr user
				if (current_user.mood !== 'surprise_me') {
					relevant_users = relevant_users.filter(function (value) {
						return (value.mood === current_user.mood)
					})
				}
			}

			else { 	// else noone logged in so show index page so show all users
				relevant_users = response.users;
			}

			// clear the profile box before adding the new one
			$('#left_panel').empty();

			if (relevant_users.length > 0) {
				// get random profile within the relevant ones
				var i = getRandomInt(0, relevant_users.length);
				View.render($('#random_profile_template'), relevant_users[i], $('#left_panel'));			
			} 
			else {
				var p = "<p class='nothing_here'>No users with such mood at the moment</p>";
				$('#left_panel').append(p);
			}	
		})
	},

	changeActiveMood: function(element, mood) {
		$('#mood_menu li').removeClass('active_mood');
		// get the <li> where the new mood is
		var highlight = element.parent();
		highlight.addClass('active_mood');

		// update the message in top left corner
		var $p = $('#info_current_user p:nth-child(2)');
		$p.text("Currently feeling " + mood)
	},

	// TEST: first show ALL matches, as user didnt choose a mood
	showMatches: function() {
		// if (current_user.matches.length === 0) {
			$('#right_panel').append($('<p class="no_matches">No matches yet on that mood</p>'));
		// }
		// else {
			// $.each(current_user.matches, function(index, match) {
			// 	// this works IF the match array stores FULL USERS, but at the moment I store user_id
			// 	// View.render($('#append_to_matches_template'), match, $('#right_panel') )

			// 	// choice 2: at each iteration, $.get to transform id into the object
			// 	// is that SUB-optimal??
			// 	$.get('/users/' + match._id, function(response) {
			// 		View.render($('#append_to_matches_template'), response, $('#right_panel') )
			// 	})
					
			// })
		// }
		
	}

}

// ************************
//USER FUNCTIONS 
// *************************

User = {


	addToDislikes: function() {
		var id = $('#showing_now_id').text();
		StorageUser.dislikes.push(id);
		var new_dislikes = StorageUser.dislikes;

		$.ajax({
			type: 'PUT',
			url: '/users/dislikes',
			data: {id: id, new_dislikes: new_dislikes}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes add dislikes', data);
		})

		// TO DO emit socket DISLIKE
	},

	addToLikes: function() {
		var id = $('#showing_now_id').text();
		StorageUser.likes.push(id);
		var new_likes = StorageUser.likes;

		$.ajax({
			type: 'PUT',
			url: '/users/likes',
			data: {id: id, new_likes: new_likes}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes add likes', data);
			// put request is also returning the "liked" profile
			User.chechIfMatch(data[0]);
		})
		// TO DO emit socket LIKE to server

	},

	chechIfMatch: function(match) {
		var id_me = StorageUser._id;
		var id_match = match._id;

		if ( StorageUser.likes.indexOf(id_match) !== -1
			&& match.likes.indexOf(id_me) !== -1 ) {

			console.log("IT'S A MATCH !");

			// showAnimationMatch,

			StorageUser.matches.push(id_match);
			var new_matches_me = StorageUser.matches;
			match.matches.push(id_me);
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
			
			// and add to Panel of Matches
			// emit socket Match, 
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
			console.log('succes change mood', data);
		})

		View.showRandomProfile();
		View.changeActiveMood($(this), mood);

		// emit socket new mood
		// update matches shown
	},

	changeLocation: function(event) {
		event.preventDefault();
		var location = $('#location_input').val();	

		$.ajax({
			type: 'PUT',
			url: '/users/location',
			data: {location: location}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes updated location', data);
		})
	}

}





function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(document).ready(function() {
	StoreCurrentUser();
	View.eventListeners();
	View.setMood();
	View.showRandomProfile();
	View.showMatches();

})