const feedparser = require('feedparser-promised');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//Minimum words set to 20, can be changed
MINWORDS = 20;

//content refers to the contents of the blog post sent by feedparser, is a 
function checkIfSpam(content)
{
    //The main body of the blog post with all HTML tags removed
    noTagsDesc = removeTags(content.description);

    //If the title is empty, post is considered spam
    if (content.title != null)
    {
        //If the word count is under MINWORDS or all characters are capital, post is considered spam
        if  (getWordCount(noTagsDesc) > MINWORDS && getCapitalLetters(noTagsDesc) < getAllLetters(noTagsDesc))
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    else
    {
        return true;
    }


    //Functions
    function removeTags(str)    //Removes HTML tags from a string, leaving only plaintext
    {
        if(str != null && str != '')
        {
            str = str.toString();
            return str.replace(/<[^>]*>/g, '');
        }
        return "";
    }

    function getWordCount(str)  //Counts number of words in string
    {
        return str.split(" ").length;
    }

    function getCapitalLetters(str) //Counts number of capital letters in string
    {
        return str.replace(/[^A-Z]/g, "").length
    }

    function getAllLetters(str) //Counts number of alphabetical characters in string
    {
        return str.replace(/[^A-Za-z]/g, "").length
    }
}