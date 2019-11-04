//TODO: Modularize code
var Feed = require('rss-to-json');
//Using my feed as a template
var link = 'https://paulopensourceblog.wordpress.com//feed/';

//TODO: Attach parser to feed-worker

Feed.load(link, function(err, rss){
    //Calling my latest feed which is index 0

    //Title of the blog
    console.log(rss.items[0].title);
    //The first few lines of the blog 
    console.log(rss.items[0].description);
    //Link of the blog
    console.log(rss.items[0].link);
    //URL of the blog same as link
    console.log(rss.items[0].url);
    //GUID, seems to be a unique ID for blog link
    console.log(rss.items[0].guid);
    //Category for blog
    console.log(rss.items[0].category);
    //Creator of blog
    console.log(rss.items[0].dc_creator);
    //Publish date of blog
    console.log(rss.items[0].pubDate);
    //Whole blog content
    console.log(rss.items[0].content_encoded);
    //Returns a number, unsure it's purpose more. More research required
    console.log(rss.items[0].created);
    //Returns objects, unsure it's purpose. More research required
    console.log(rss.items[0].media);
});

//TODO: Only tested with wordpress, must test with other blog sites