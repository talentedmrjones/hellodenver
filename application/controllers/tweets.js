var db = require('../lib/db');

var TweetsController = {
  
  getById:function (req, res) {
    var id = req.param('id');
    
    if (!id) {
      // if no id present just forward to index action
      TweetsController.index(req, res);
    } else {

      db.open(function(err, db) {
        db.collection('tweets', function(err, collection) {
          collection.find({id:parseInt(id,10)}).toArray(function (err, results) {
           
            db.close();

            if (!results.length) {
              res.redirect('/');
            } else {
              var latest = results.shift();    
              res.render('current', { title: 'Hello Denver', latest:latest});
            }
            
          }); //find.toArray
        }); // .collection()
      }); // .open()

      
    }
    
  }
  
  ,latest:function (req, res) {
  
    db.open(function(err, db) {
      db.collection('tweets', function(err, collection) {
        collection.find().sort({_id:-1}).limit(1).toArray(function (err, results) {
        
          db.close();
          var latest = results.shift();

          if (req.header('X-Requested-With')=='XMLHttpRequest') {
            res.json(latest);
          } else {
            res.render('latest', { title: 'Hello Denver', latest:latest});
          }
          
        }); //find.toArray
      }); // .collection()
    }); // .open()
    
  } // latest
  
  ,index:function (req, res) {
  
    db.open(function(err, db) {
      db.collection('tweets', function(err, collection) {
        collection.find({active:'y'}).sort({_id:-1}).limit(10).toArray(function (err, results) {
        
          db.close();
          var latest = results.shift();
          
          // put them into 3 columns
          var tweets = {
            col1:[]
            ,col2:[]
            ,col3:[]
          };
          
          var column = 1;
          
          results.forEach(function (tweet) {
            tweets['col'+column].push(tweet);
            column++;
            if (column > 3) {
              column = 1;
            }
          });
          
          res.render('index', { title: 'Hello Denver', latest:latest, tweets:tweets});
          
        }); //find.toArray
      }); // .collection()
    }); // .open()

  } // index
  
}; // TweetsController 

// expose
module.exports = TweetsController;