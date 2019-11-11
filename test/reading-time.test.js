/*
This function obtains the word count of a post, and calculates the the length of time to read the article

AvgNumber of Words is the number of words most people read per minute

*/
function readingTime(wordcount) {
    let readingTime;
    
    const avgNumberofWords=250;

    if(typeof(wordcount) === "string"){
        throw "Word Count must be a number"
    }

    if (typeof(wordcount) === "boolean"){
        throw "Word Count must be a number"

    }
    
    if ((wordcount) < 0){
        throw "Word Count must be a positive integer"
    }

    readingTime= Math.round(wordcount/avgNumberofWords);
    return readingTime;
    

}


//Tests

var test1= "Hello";
var test2= true;
var test3= -5;
var test4= 1000;

console.log(readingTime(test1));
console.log(readingTime(test2));
console.log(readingTime(test3));
onsole.log(readingTime(test4));



