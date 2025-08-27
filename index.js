import yuri from "/yuri.json" with { type: "json" }

function randImg() {
  var size = yuri.length
  var x = Math.floor(size * Math.random())
  document.getElementById('txt').textContent="faaagot"
  document.getElementById('image').src = yuri[x];
}

window.onload = function() {
    randImg();
}