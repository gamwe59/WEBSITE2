import yuri from "/yuri.json" with { type: "json" }

function randImg() {
  let size = yuri.length
  let x = Math.floor(size * Math.random())
  document.getElementById('yurisrc').href="./gallery/view?img="+yuri[x].id
  document.getElementById('yuri').alt = yuri[x].name
  document.getElementById('yuri').src = yuri[x].src;
}

randImg();