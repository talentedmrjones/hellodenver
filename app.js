
/**
 * Module dependencies.
 */

var express = require('express')
,app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({
    src: __dirname + '/views'
    ,dest: __dirname + '/public'
    ,compress:true
  }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
var TweetsController = require('./application/controllers/tweets');


// show the latest tweet in the window display
app.get('/latest', TweetsController.latest);

// Show a single tweet at a URL like http://hellodenver.org/crwnsl4e84
// OR the home page if no id present
app.get('/:id?', TweetsController.getById);


// listen on a unix socket (because the node process sits behind an nginx reverse proxy for the hellodever.org vhost)
// http://william.shallum.net/random-notes/nodejs-set-unix-socket-permissions
var oldUmask = process.umask(0000);
app.listen(__dirname+'/unix.sock', function () {
  process.umask(oldUmask); 
});

// load and init the lib that handles incoming tweets
require('./application/lib/twitter');