const checkForSpam = require ("../src/check-for-spam")
const url = 'https://telescopetestblog.blogspot.com/feeds/posts/default?alt=rss';

describe('Spam detection checks', () => {

    //Running checkIfSpam() on each item returned by feedparser.parse(url) should return false, true, true, true in that order
    //Using feedparser on the url
    /*var parsedContent = feedparser.parse(url).then(items => 
        items.forEach(item => {
            checkIfSpam(item);
        })
    );*/
    
});
