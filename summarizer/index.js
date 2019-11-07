/***
 * This is used to test that the python script works with node.js
 * To run, confirm the dependencies for the python script are installed
 * Then run while in the summarizer directory:
 *      npm init
 *      npm install express
 *      node index.js
 * 
 * Open the browser and go to localhost:4000
 */

const express = require('express')
const app = express()

let runPy = new Promise((resolve, reject) => {

    const { spawn } = require('child_process');
    const pyprog = spawn('python3.6', ['./summarize.py','text.txt']); // Change this to change file

    pyprog.stdout.on('data', (data) => {
        resolve(data);
    });

    pyprog.stderr.on('data', (data) => {
        reject(data);
    });
});

app.get('/', (req, res) => {
    runPy.then((data) => {
        //console.log(data.toString());
        res.end(data);
    })
    .catch((data) => {
        console.log('Failed');
        res.end(data);
    });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))