/* RUNNING TWITTER STREAM */

var db = require('./db');

var Twit = require('twit'); // https://github.com/ttezel/twit

var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
});

var fixTweet = function (tweet) {

    var date = new Date(tweet.created_at)
    ,hours = date.getHours()
    ,mins = date.getMinutes()
    ,months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    tweet.created_at = (hours>12?hours-12:hours)+':'+(mins<10?'0':'')+mins+(hours>12?'pm':'am')+' on '+months[date.getMonth()]+' '+date.getDate();
    tweet.text = tweet.text.toUpperCase();
    tweet.text = tweet.text.replace('#HELLODENVER', '');
    tweet.text = tweet.text.replace("'",'&#8217;');
    tweet.text = tweet.text.trim();
    tweet.active = 'y';
    return tweet;
};

// first search will get all tweets
var since_id = 0;

var search = function () {

  T.get('search', { q: '#hellodenver', result_type: 'recent', since_id:since_id, rpp:100}, function(err, reply) {
    
    var tweets = reply.results;
    
    if (tweets.length) {

      // set the since_id to the latest we got back
      // subsequent searches will be only new ones
      since_id = reply.max_id_str;

      db.open(function(err, db) {
        db.collection('tweets', function(err, collection) {
          tweets.forEach(function (tweet) {
            tweet = fixTweet(tweet);
            if (tweet.text!="") {
              collection.update({id_str:tweet.id_str}, {$set:tweet}, {multi:true, upsert:true}, function (err, doc) {
                
                // do public reply
                //T.post('statuses/update', {status:'@'+tweet.user.screen_name+' thanks for sharing! See your tweet in the Hello Denver font: http://hellodenver.org/'+tweet.id}, function (err, reply) {
                //  console.log(reply);
                //});
        
              }); // insert
            }
          }); //forEach  
          db.close();
        }); // collection
      }); // db.open
      
    }
    
    // rerun search in 15 seconds
    setTimeout(search, 15*1000);
  });

};

// start the search loop
search();