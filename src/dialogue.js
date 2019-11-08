var dialogue = document.getElementById("dialogue");
var btn = document.getElementById("participants");
var span = document.getElementsByClassName("dBox-close")[0];

btn.onclick = function() {
  dialogue.style.display = "block";
}

span.onclick = function() {
  dialogue.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == dialogue) {
    dialogue.style.display = "none";
  }
}