const bent = require('bent');
const jsdom = require('jsdom');
const fs = require('fs');

const request = bent('string');
const url = 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List';
const { JSDOM } = jsdom;

/** 
* Get feed data from url
* process it to remove unnecessary information like "name" and square brackets
*/
request(url)
    .then((data) => {
        const dom = new JSDOM(data);
        data = dom.window.document.querySelector("pre").textContent;
        var lines = data.split(/\r\n|\r|\n/);
        var feed = "";
        var nameTest = /^name/i;
        var linkTest = /^#/;

        lines.forEach(element => {
            if (!linkTest.test(element)){
                if (element.startsWith('[')){
                    element = element.replace(/\[href="|\[/, "");
                    element = element.replace("]", "");
                    feed += element + "\n";
                } 
                if (nameTest.test(element)){
                    element = element.replace(/^name = |^name= |^name=/i, "");
                    feed += element + "\n";
                }
            }
        });
        console.log(feed);
/** 
* Write data to file, for test purposes 
*
*       fs.writeFile("temp.txt", feed, function(err){
*           if (err) throw err;
*       })
*/
    })
    .catch((err) => {throw err});