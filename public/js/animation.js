var Animation = Animation || {};

Animation = {

  listeners: function(){
    Animation.hover('#surprise_me', 'flip');
    Animation.click('#surprise_me', 'bounceOutDown');
    Animation.click('#flirty', 'bounce');
    Animation.click('#flirty', 'bounce');
    Animation.click('#party', 'flash');
    Animation.click('#chatty', 'swing');
  },

  hover: function(element, animation){
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
    });
  }, 

  click: function(element, animation){
    element = $(element);
    element.click(
      function() {
        element.addClass('animated ' + animation);
        //wait for animation to finish before removing classes
        window.setTimeout( function(){
            element.removeClass('animated ' + animation);
        }, 2000);
    });
  }
}
