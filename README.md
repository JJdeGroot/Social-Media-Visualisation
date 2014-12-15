##Task
I needed to show the impact of the Appreciate A Mate app by using Social Media. I used three API's: Twitter, Instagram and Tumblr. I also tried to add Facebook, but they have removed the ability to search through posts for a certain word. The result is a map that shows the locations of the users that posted on Social Media, a word cloud visualising the used words and a grid containing all posts.

##Steps
- create the config file as described below
- npm install
- node app
- navigate to http://127.0.0.1:3000/

*"config.js"*
```javascript
var twitter_details = {
    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  ''
};

var instagram_details = { 
    client_id: '',
    client_secret: '' 
};

var tumblr_details = {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: ''
};
```




