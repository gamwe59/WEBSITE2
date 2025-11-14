import yuri from "/yuri.json" with { type: "json" }
import tagsJSON from "/tags.json" with { type: "json" }

let info = document.getElementById("info")
let USP = new URLSearchParams(document.location.search);

let img
let display
let isVideo = false

const name = document.getElementById("name")
const link = document.getElementById("link")
const src = document.getElementById("src")
const tags = document.getElementById("tags")
const added = document.getElementById("added")
const back = document.getElementById("back")

function validURL() {
    let valid = false
    if (USP.has("img")) {
        
        let n = yuri.length;
        for (let i = 0; i < n; i++) {
            if (yuri[i].id.toString() == USP.get("img")) {
                valid = true
                img = yuri[i]
                break;
            }
        }
    }
    if (valid == false) {
        location.replace("./")
    }
}

function generateTags() {
    for (const [key, tag] of Object.entries(img.tags)) {
        let l = document.createElement("li")
        let obj = document.createElement("a")
        obj.href = ".?t="+tag
        let type = tagsJSON[tag]
        obj.innerHTML = type.type+": <strong>"+type.long+"</strong>"
        tags.append(l)
        l.append(obj)
    }
}

function loadDetails() {
    name.textContent = img.name
    link.href = img.link
    if (img.tags.includes("here") || img.tags.includes("image")) {
        display = document.createElement("img")
        display.src = img.src
    } else if (img.tags.includes("video")) {
        display = document.createElement("video")
        display.src = img.src
        display.setAttribute("controls", "controls")
        display.type = "video/mp4"
        link.innerHTML = "<p><strong>VIDEO SOURCE</strong></p>"
        isVideo = true
    }
    display.id = "display"
    src.appendChild(display)
    added.textContent = ""+img.added
}

function createEmbed() {
    var m = document.createElement("meta")
    m.setAttribute('property', 'og:image')
    m.content = img.src  
    document.getElementsByTagName('head')[0].appendChild(m);
}

link.onclick = function() {
    window.open(link.href)
}

function checkIfReady(resolve){
    const interval = setInterval(() => {
        if(isVideo) resolve(interval);
        if(display.width != 0) resolve(interval);
    }, 10);
}

function ready(interval){ 
    clearInterval(interval) 
    let obj = document.getElementById("display")
    let width = obj.width
    if (width != 0) {
        tags.setAttribute("style", "width:"+width+"px;")
        link.setAttribute("style", "width:"+width+"px;")
    }
}

back.onclick = function() {
    if (history.length <= 1 || !document.referrer.includes("/gallery")) {
        location.replace("./")
    } else {
        history.back()
    }
}

validURL()
loadDetails()
generateTags()

const waitUntilReady = new Promise(checkIfReady); 
waitUntilReady.then(ready);