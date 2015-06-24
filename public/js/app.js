var View = View || {};
var User = User || {};


// ****** VIEW FUNCTIONS *****

View = {

	eventListeners: function() {

	  $('#left_panel').on('click', '#yes_button', function(event){ 
	  	event.preventDefault();
	  	console.log('add to likes');
	  	User.addToLikes();
	  	View.showRandomProfile();
	  })

	  $('#left_panel').on('click', '#no_button', function(event){
	  	event.preventDefault();
	  	console.log('add to DISlikes');
	  	User.addToDislikes();
	  	View.showRandomProfile();
	  })

	  $('#js_mood_menu a').on('click', User.changeMood)

	},

  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  // FIRST: show is a random profile
	// NEXT with conditions: relevant gender, and not in the user's arrays (no need to check for yourself as you are a different gender!)
	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// response = Array with ALL users and current_user
			console.log(response);
			var relevant_users = [];
			// if someone logged in, only keep profiles matching their mood - HARCDODING mood party for the moment
			// if (current_user) {
			// 	relevant_users = response.filter(function (value) {
			// 		return (value.mood === current_user.mood);
			// 	})
			// } else {
			// 	// else use all users
				relevant_users = response;
			// }
			// get random profile within the relevant ones
			var i = getRandomInt(0, relevant_users.length - 1);
			console.log(relevant_users[i]);
			// clear the profile box before adding the new one
			$('#left_panel').empty();
			View.render($('#random_profile_template'), relevant_users[i], $('#left_panel'));
		})
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

// ****** USER FUNCTIONS *****

User = {

	addToLikes: function() {
		// add to current user array of likes
		// emit socket LIKE to server
		// chechIfMatch();
	},

	chechIfMatch: function() {
		// IF match
		// showAnimationMatch,
		// add to Match array, 
		// emit socket Match, 
		// and add to Panel of Matches
		// ELSE nothing
	},

	addToDislikes: function() {
		// add to Dislike array
		// emit socket DISLIKE
	},

	changeMood: function(event) {
		event.preventDefault();
		// update mood
		// current_user.mood = $(this).attr('data-mood');
		// OR?? db.users.update()
		// emit socket new mood

		// update profile shown
		// update matches shown


	}
}





function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(document).ready(function() {
	View.eventListeners();

	// AS MVP we TEST with showing randome profile and ALL matches
	View.showRandomProfile();
	View.showMatches();

})