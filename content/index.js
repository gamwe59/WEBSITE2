import yuri from "./yurigen/yuri.json" with { type: "json" }

let obj = document.getElementById('yurisrc')
let size = yuri.length

function getYuri() {
  let x = Math.floor(size * Math.random())
  if (yuri[x].tags.includes("suggestive")) {
    return getYuri()
  }
  return yuri[x]
}

function randImg() {
  let data = getYuri()
    obj.href = "./gallery/view?img="+data.id
    let img
    if (data.tags.includes("here")) {
        img = document.createElement("img")
        img.src = data.src
    } else if (data.tags.includes("image")) {
        img = document.createElement("img")
        let src = data.src
        src = src.replace("?","%3F")
        src = src.replace("&","%26")
        img.src = "//img.femboy.skin/?url="+src+"&output=webp&default=1" //if gif add &n=-1
    } else if (data.tags.includes("video")) {
        img = document.createElement("video")
        img.src = data.src
        img.setAttribute("controls", "controls")
        img.setAttribute("poster", data.thumbnail)
        img.type = "video/mp4"
    }
    img.alt = data.name
    obj.appendChild(img)
}

randImg();