var domain = "localhost";
var port = "3000";
var api_url = "http://"+domain+":"+port+"/api/";
var count;
var map;
var msnry;
var posts;

/** Listen to enter in the search box */
$("#search").keyup(function(e) {
    console.log("Key up");
    if(e.keyCode == 13) {
        var query = $(this).val();
        console.log("Query: " + query);
        search(query);
    }
});

/** Searches for a certain query on Social Media */
function search(query) {
    $("#loading").show();
    clear();   
    query = encodeURIComponent(query);
    console.log("Search query: " + query);
    
    searchTwitter(query);
    searchInstagram(query);
    searchTumblr(query);
}

/** Searches for a certain query on Twitter */
function searchTwitter(query) {
    /** TWITTER */
    var twitter_url = api_url+"twitter/"+query;
    console.log("Twitter URL: " + twitter_url);
    $.getJSON(twitter_url, function(data) {
        console.log("Twitter data");
        console.log(data);
        for(var i = 0; i < data.statuses.length; i++) {
            var status = data.statuses[i];
            //console.log(status);
            
            if(status.possibly_sensitive == undefined || status.possibly_sensitive == false) { // Sensitive check
                // Details
                var name = status.user.screen_name;
                var text = status.text;
                var location = status.location;
                var source = "http://twitter.com/"+status.user.id_str+"/status/"+status.id_str;

                // Images
                var images = [];
                if(status.entities.media !== undefined && status.entities.media.length > 0) {
                    for(var j=0; j<status.entities.media.length; j++) {
                        images.push(status.entities.media[j].media_url);
                    }
                }

                // Add post
                var post = {name: name, text: text, images: images, location: location, source: source, type: "twitter"};
                posts.push(post);
            }
        }
        finished();
    });
}

/** Searches for a certain query on Instagram */
function searchInstagram(query) {
    /** INSTAGRAM */
    var insta_url = api_url+"instagram/"+query;
    console.log("Instagram URL: " + insta_url);
    $.getJSON(insta_url, function(data) {
        console.log("Instagram data");
        console.log(data);
        for(var i = 0; i < data.length; i++) {
            var media = data[i];
            //console.log(media);

            // Details
            var name = media.user.username;
            var text = null;
            if(media.caption !== undefined && media.caption !== null) {
                text = media.caption.text;
            }
            
            var images = [media.images.standard_resolution.url];
            var location = media.location;
            var source = media.link;
            
            // Add post
            var post = {name: name, text: text, images: images, location: location, source: source, type: "instagram"};
            posts.push(post);
        }

        finished();
    });
}


/** Searches for a certain query on Tumblr */
function searchTumblr(query) {
    var tumblr_url = api_url+"tumblr/"+query;
    console.log("Tumblr URL: " + tumblr_url);
    $.getJSON(tumblr_url, function(data) {
        console.log("Tumblr data");
        console.log(data);
        for(var i = 0; i < data.length; i++) {
            var blog = data[i];
            //console.log(blog);
            
            // Details
            var name = blog.blog_name;
            var text = blog.caption;
            var location = null;
            var source = blog.post_url;
            
            // Images
            var images = [];
            if(blog.photos && blog.photos.length > 0) {
                for(var j=0; j< blog.photos.length; j++) {
                    images.push(blog.photos[j].original_size.url);
                }
            }
            
            // Add post
            var post = {name: name, text: text, images: images, location: location, source: source, type: "tumblr"};
            posts.push(post);
        }
        finished();
    });
    
}

/** Shows retrieved locations on Google Maps */
var markers = [];
function mapLocations() {
    // Add markers
    var bounds = new google.maps.LatLngBounds();
    $.each(posts, function(i, post) {
        if(post.location !== undefined && post.location !== null) {
            // Position
            var latlng = new google.maps.LatLng(post.location.latitude, post.location.longitude);
            bounds.extend(latlng);
            
            // Marker
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: post.name
            });
            markers.push(marker);
            
            // Info
            var infowindow = new google.maps.InfoWindow({
                content: post.name
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }
    });
    map.fitBounds(bounds);
}


/** Creates a word cloud */
function createWordCloud() {
    var data = {};
    
    // Determine data
    if(posts.length > 0) {
        // Words in post text
        for(var i = 0; i < posts.length; i++) {
            var post = posts[i];
            if(post.text !== undefined && post.text !== null) {
                // Count words
                var words = post.text.split(" ");
                for(var j = 0; j < words.length; j++) {
                    var word = words[j];
                    if(data[words[j]] == undefined) {
                        data[word] = 1;
                    }else{
                        data[word]++;
                    }
                }
            }
        }
    }
    
    // Check data
    if(Object.keys(data).length <= 1) {
        data["No words available"] = 10;
    }
    console.log("Wordcloud data");
    console.log(data);
    drawWordCloud(data);
}

/** Draws the word cloud */
function drawWordCloud(data) {
    // Word cloud details
    var width = $("#wordcloud").width();
    var height = $("#wordcloud").height();
    console.log("Width: " + width + ", height: " + height);

    // Word cloud settings
    var fill = d3.scale.category20();
    d3.layout.cloud().size([width, height])
      .words(Object.keys(data).map(function(k) {
          return {text: k, size: 20+data[k]}; // Convert data to suitable format
      }))
      .padding(1)
      .rotate(function() { 
          return ~~(Math.random() * 5) * 30 - 60; 
      })
      .font("Impact")
      .fontSize(function(d) {
          return d.size; 
      })
      .on("end", draw)
      .start();

    /** Draws words */
    function draw(words) {
        d3.select("#wordcloud")
          .append("g")
          .attr("transform", "translate("+(width/2)+","+(height/2)+")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { 
              return d.size + "px"; 
          })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { 
              return fill(i); 
          })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { 
              return d.text; 
          });
    }
}

/** Clears everything */
function clear() {
    // Reset variables
    count = 0;
    posts = [];
    
    // Clear content
    $("#posts").empty();
    $("#wordcloud").empty();
    if(markers.length > 0) {
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}

/** Shuffles an array around */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/** Called when an API call is finished */
function finished() {
    count++;
    if(count >= 3) { // All API calls finished
        // Shuffle & show posts
        posts = shuffle(posts);
        addPosts();

        // Load map & word cloud
        $("#loading").hide();
        mapLocations();
        createWordCloud();
    }
}

/** Creates the post HTML */
function addPosts() {
    $("#posts").masonry('destroy');
    
    for(var i=0; i < posts.length; i++) {
        var post = posts[i];
        
        // Details
        var html  = "<div class='post "+post.type+"'>";
        html +=       "<a href='"+post.source+"' title='"+post.name +" on "+post.type+"' target='_blank' class='none'>"
        html +=         "<span class='name'>"+post.name+"</span>";
        html +=         "<span class='text'>"+post.text+"</span>";
    
        // Images
        if(post.images.length > 0) {
            for(var j=0; j<post.images.length; j++) {
                html +=     "<img class='image' src='"+post.images[j]+"'>";
            }
        }
        html +=       "</a>";
        html +=     "</div>";

        $("#posts").append(html);
    }
    
    $("#posts").masonry({itemSelector: '.post'});
    $("#posts").masonry();
}

/** Intializes everything is needed */
function init() {
    // Init map
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Init masonry
    $("#posts").masonry({itemSelector: '.post'});
    
    // Init search
    var query = $("#search").val();
    search(query);
}
init();