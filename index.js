import yuri from "/yuri.json" with { type: "json" }

function randImg() {
  let size = yuri.length
  let x = Math.floor(size * Math.random())
  document.getElementById('txt').textContent=yuri[x].name.toString()
  document.getElementById('yuri').src = yuri[x].src;
}

randImg();