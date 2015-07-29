var Chat = Chat = {};

$(document).ready(function(){
  $('#middle_panel').on('submit', '#chat_panel form', Chat.emit)
  $('.actions button').on('click', Chat.actionButton)
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
  },

  showChat: function() {
    $('#google_maps_panel').hide();
    $('#chat_panel').show();
    $('#chat_panel').empty();
    View.render($('#append_to_chat_template'), StorageUser, $('#chat_panel') );
  },

  hideChat: function() {
    $('#chat_panel').hide();
    $('#google_maps_panel').show();
  },

  actionButton: function(event) {
    var $name = $('#nick');
    var $button = $(event.currentTarget);
    socket.emit('action', {
      name: $name.val(), action: $button.data('type')
    });
    writeAction($name.val(), $button.data('type'));
  }

}