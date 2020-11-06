module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  // can probably use querySelectorAll() instead
  var y = document.getElementsByTagName('pre'); // parse all pre

  for (var i = 0; i < y.length; i++) {
    if (y[i].className == '') {
      //pre doesn't have a class
      console.log(y[i]);
      //create a new array and fill it up
    }
  }

  // Return the array// add the <code></code> inside the <pre> tags
  // <pre><code></code></pre>// JOB DONE!?! send it off to syntax highlighter and see if its issue is fixed
};
