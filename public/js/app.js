var View = View || {};
var User = User || {};

var StorageUser; 
var AllUsers;


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

	initialize: function() {
		
		$.get('/users', function(response) {
			// store the current user and all the users so far
			StorageUser = response.current_user;
			console.log('Storage User: ', StorageUser);
			AllUsers = response.users;
			console.log('AllUsers: ', AllUsers);

			View.setMood(StorageUser);
			User.showMatches(StorageUser, AllUsers);
		})
	},

  render: function(templateElement, object, parentElement) {
    var template = templateElement.html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, object);
    parentElement.append(rendered);
  },

  setMood: function(user) {
			var element = $("#mood_menu a[data-mood='" +user.mood+ "']");
			var highlight = element.parent();
  		highlight.addClass('active_mood');
  },
  
	showRandomProfile: function() { 
		$.get('/users', function(response) {
			// response = Array with ALL users and current_user
			var relevant_users = [];
			var current_user = response.current_user;

			// if someone logged in, show profiles based on them"
			if (current_user) {
				relevant_users = response.users.filter(function (value) {
					return User.okToShow(value, current_user);
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

}

// ************************
// USER FUNCTIONS 
// *************************

User = {

	okToShow: function(user, current_user) {
		// keep users with relevant gender, and not being current user, and not previously seen
		var oppositeGender = (user.facebook.gender !== current_user.facebook.gender 
				&& user._id !== current_user._id);
		var notInLikes = (current_user.likes.indexOf(user._id) === -1);
		var notInDislikes = (current_user.dislikes.indexOf(user._id) === -1);

		return oppositeGender && notInLikes && notInDislikes;
	},

	showMatches: function(user, all_users) {
		// passing it on StorageUser and AllUsers
		if (user.matches.length === 0) {
			$('#right_panel').append($('<p class="no_match">No matches yet</p>'));
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
			})
		}	
	},

	addToMatchView: function(user) {
		if ($('.no_match')) {  
			$('.no_match').remove()
		};
		console.log('add to match view', user)
		View.render($('#append_to_matches_template'), user, $('#right_panel') )	
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
		// TO DO emit socket LIKE to server
		// ***************************

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
			User.addToMatchView(data[0]);

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
		View.changeActiveMood($(this), mood);

		// ***************************
		// TO DO emit socket new mood
		// TO DO update matches shown
		// ***************************
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
			console.log('succes updated location');
		})
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// ************************************************************************************************************************************************************************************************************
// Chat things are below
// ****************************************************************************************************************************************
function writeLine(name, line) {
  $('.chatlines').append('<li class="talk"><span class="nick"&lt;' + name + '&gt;</span>' + line + '</li>');
}


  $('.actions button').on('click', function(ev) {
    var $name = $('#nick');
    var $button = $(ev.currentTarget);
    socket.emit('action', {name: $name.val(), action: $button.data('type')});
      writeAction($name.val(), $button.data('type'));
  });


    var socket = io.connect('http://localhost:3000/');
   

    socket.on('connected', function(){
    	console.log('connnnnnected')
		});
	  socket.on('chat', function(data){
      	writeLine(data.name, data.line);
    })




$(document).ready(function() {

animationHover('#surprise_me', 'flip');


animationClick('#surprise_me', 'bounceOutDown');
animationClick('#flirty', 'bounce');
animationClick('#party', 'flash');
animationClick('#chatty', 'swing');



	View.initialize();
	View.eventListeners();
	View.showRandomProfile();

	// var socket = io.connect('http://localhost:3000/');
 //  console.log(socket);
	
	// CHAT CHAT CHAT
	$('form').on('submit', function(ev) {
    ev.preventDefault();
    var $name = $('#nick');
    var $line = $('#text');
    socket.emit('chat', {name: $name.val(), line: $line.val()});
    writeLine($name.val(), $line.val());
    $line.val("");
	});
	// if( location.href == "http://lvh.me:3000/profile#_=_" )
	// {
	// 	$('#logo').addClass('animated bounceInDown')
	// }
	//Animate on hover function
	function animationHover(element, animation){
  element = $(element);
  element.hover(
    function() {
      element.addClass('animated ' + animation);
    },
    function(){
      //wait for animation to finish before removing classes
      window.setTimeout( function(){
        element.removeClass('animated ' + animation);
      }, 2000);
    }
  );
};
	//Animate on Click Function
function animationClick(element, animation){
  element = $(element);
  element.click(
    function() {
      element.addClass('animated ' + animation);
      //wait for animation to finish before removing classes
      window.setTimeout( function(){
          element.removeClass('animated ' + animation);
      }, 2000);
    }
  );
};

});


