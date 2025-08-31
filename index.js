import yuri from "/yuri.json" with { type: "json" }

function randImg() {
  let size = yuri.length
  let x = Math.floor(size * Math.random())
  var str = yuri[x].name;
  str = str.replace(/\s+/g, '-').toLowerCase();
  document.getElementById('yurisrc').href="./gallery/view?img="+str
  document.getElementById('yuri').src = yuri[x].src;
}

randImg();