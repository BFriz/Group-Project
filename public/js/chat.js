var Chat = Chat = {};

// I think best way is tht on chat load we grab the chat history from the server
// same on chat load with a single person

$(document).ready(function(){
  $('#bottom_panel').on('submit', '#chat_area form', Chat.emit)
  $('.container-fluid').on('click', '.icon-map', Map.show);
  // actions removed for the moment
  // $('.actions button').on('click', Chat.actionButton)
})

// Use Socket.io to manage the Chat

var socket = io.connect('http://localhost:3000/');
   
socket.on('connected', function(){
  console.log('connected');
  $('#chat panel p').hide();
});
socket.on('chat', function(data){
    Chat.writeLine(data.name, data.line);
})

// end socket

/***********
CHAT OBJECT
**********/

Chat = {

  emit: function() {
    event.preventDefault();

    var $name = $('#nick');
    var $line = $('#text');
    socket.emit('chat', {
      name: $name.val(), line: $line.val()
    });
    Chat.writeLine($name.val(), $line.val());
    $line.val("");
  },

  // write on the client's chat so it can be read
  writeLine: function(name, line) {
    $('.chatlines').append('<li class="talk"><span class="nick">&lt;' + name + '&gt;</span>' + line + '</li>');
    $("#chat_container").scrollTop($("#chat_container")[0].scrollHeight);
    // think this was the command to ensure chat stays inside the div and scrolls to keep showing the latest one
  },

  // show chat means icon shows map
  show: function() {
    View.render($('#chat_template'), StorageUser, $('#bottom_panel') );
    $('#mood_menu .icon-map').removeClass('hidden');
    $('#mood_menu .icon-map').show();
    $('#mood_menu .icon-chat').hide();
  }

  // actionButton: function(event) {
  //   var $name = $('#nick');
  //   var $button = $(event.currentTarget);
  //   socket.emit('action', {
  //     name: $name.val(), action: $button.data('type')
  //   });
  //   writeAction($name.val(), $button.data('type'));
  // }

}