// Requirements
var express = require('express'),// Express
    path = require('path'),      // Path
    credentials = require('./config.js'); // Configuration files
 
console.log(credentials.twitter)

// App configuration
var app = express();
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
// App routes
app.get('/', function(req, res) {
    res.render('index');
});


/** API */
app.get('/api', function (req, res) {
    res.send('API calls are available!');
});


/** TWITTER API */
var Twit = require('twit');
var T = new Twit(credentials.twitter);

// Twitter search
app.get('/api/twitter/:q', function (req, res) {
    console.log("Twitter request");
    T.get('search/tweets', { q: req.params.q, count: 25, include_entities: true, result_type: 'recent' }, function(err, data, response) {
        res.send(data);
    });
});


/** INSTAGRAM API */
var ig = require('instagram-node').instagram();
ig.use({ access_token: '*' });
ig.use(credentials.instagram);

// Instagram search
app.get('/api/instagram/:q', function (req, res) {
    console.log("Instagram request");
    ig.tag_media_recent(req.params.q, function(err, medias, pagination, remaining, limit) {
        res.send(medias);
    });
});


/** TUMBLR API */
var tumblr = require('tumblr');
var tagged = new tumblr.Tagged(credentials.tumblr);

// Tumblr search
app.get('/api/tumblr/:q', function(req, res) {
    console.log("Tumblr request");
    tagged.search(req.params.q, {filter: 'text'}, function(error, response) {
        res.send(response);
    });
});




// Listen to port 3000
app.listen(3000);
console.log('Your app is now running at: http://127.0.0.1:3000/');