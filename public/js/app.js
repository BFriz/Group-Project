var View = View || {};
var User = User || {};

View = {

	eventListeners: function() {

		$( "#mood_menu a" ).click(function(event) {
	    console.log("button clicked!")
	    event.preventDefault();
	  });

	},
  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  }
	
}

User = {

	// TEST: first thing shown is a random profile, with conditions: relevant gender, and not in the user's arrays, and not yourself
	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// get random integer between 0 and last index of response (array with ALL profiles)
			var i = getRandomInt(0, response.length - 1);
			// show response[i]
			console.log(response[i]);
			View.render($('#random_profile_template'), response[i], $('#left_panel'));
		})
	},

	// TEST: first show ALL matches, as user didnt choose a mood
	showMatches: function() {
		// code here
	}
}





function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(document).ready(function() {
	View.eventListeners();

	// AS MVP we TEST with showing randome profile and ALL matches
	User.showRandomProfile();
	User.showMatches

})