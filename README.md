Requires a file named *"config.js"* that contains the following variables:

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

**Steps**
- Put in your keys
- npm install
- app js
- navigate to http://127.0.0.1:3000/

**Goal**
I needed to show the impact of the Appreciate A Mate app by using Social Media. I used three API's: Twitter, Instagram and Tumblr. I also tried to add Facebook, but they have removed the ability to search through posts for a certain word. The result is a map that shows the locations of the users that posted on Social Media, a word cloud visualising the used words and a grid containing all posts.
