const dialogue = document.getElementById('dialogue');
const btn = document.getElementById('participants');

window.onload = function() {
  btn.onclick = function() {
    dialogue.style.display = 'block';
  };

  window.onclick = function(event) {
    if (event.target === dialogue) {
      dialogue.style.display = 'none';
    }
  };
};
