const dialogue = document.getElementById('dialogue');
const btn = document.getElementById('participants');
const span = document.getElementsByClassName('dBox-close')[0];

btn.onclick = function() {
  dialogue.style.display = 'block';
};

span.onclick = function() {
  dialogue.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target === dialogue) {
    dialogue.style.display = 'none';
  }
};
