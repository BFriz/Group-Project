var View = View || {};
var User = User || {};


// ****** VIEW FUNCTIONS *****

View = {

	eventListeners: function() {

		$( "#mood_menu a" ).on('click', function(event) {
	    console.log("button clicked!")
	    event.preventDefault();
	  });

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

	},
  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  // FIRST: show is a random profile
	// NEXT with conditions: relevant gender, and not in the user's arrays, and not yourself
	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// get random index in the response.length (response = array with ALL profiles)
			var i = getRandomInt(0, response.length - 1);
			console.log(response[i]);
			// clear the profile box before adding the new one
			$('#left_panel').empty();
			View.render($('#random_profile_template'), response[i], $('#left_panel'));
		})
	},

	// TEST: first show ALL matches, as user didnt choose a mood
	showMatches: function() {
		// code here
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