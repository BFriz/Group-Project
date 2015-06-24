var View = View || {};
var User = User || {};

var StorageUser;

// *************************
// VIEW FUNCTIONS
// *************************

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

	  $('#mood_menu a').on('click', User.changeMood)

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
			console.log('response', response);
			var relevant_users = [];
			var current_user = response.current_user;

			/// store current_user in a global variable so we can use it in 
			// other functions without the get request
			StorageUser = response.current_user;

			// if someone logged in, show profiles based on them"
			if (current_user) {
				// keep users with relevant gender, and not being current user
				relevant_users = response.users.filter(function (value) {
					return (value.gender !== current_user.facebook.gender 
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
		console.log('storage in DIFFERENT function', StoreUser);
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
		var mood = $(this).attr('data-mood');
		$.ajax({
			type: 'PUT',
			url: '/users',
			data: {mood: mood}, 
			dataType: 'json'
		})
		.done(function(data) {
			console.log('succes put', data);
		})

		View.showRandomProfile();
		View.changeActiveMood($(this), mood);

		// emit socket new mood
		// update matches shown
	}

}





function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(document).ready(function() {
	View.eventListeners();
	View.setMood();
	View.showRandomProfile();
	View.showMatches();

})