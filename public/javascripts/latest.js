(function ($) {
  
  var $figure = $('#latest figure');
  
  var getLatest = function () {
  
    $.getJSON('/latest', function (tweet) {
      
      // fade out
      // using animate because .fadeOut sets display:none which we don't want
      $figure.animate({opacity:0}, 750, function () {

        // set html content from tweet data        
        var html = '<blockquote class="current">'+tweet.text+'</blockquote><figcaption><p>from @'+tweet.from_user+' at '+tweet.created_at+'</p></figcaption>';
        
        $figure.html(html);
      
        // fade back in 
        $figure.animate({opacity:1}, 750, function () {
          
          // get the next tweet in another 30 seconds and repeat
          setTimeout(function () {getLatest();}, 30*1000);

        }); // animate fade IN
        
      }); // animate fade IN
      
    }); // getJSON
  
  }; // getLatest
  
  getLatest();
  
})(jQuery)