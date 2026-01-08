import yuri from "/yuri.json" with { type: "json" }
import tagsJSON from "/tags.json" with { type: "json" }

let info = document.getElementById("info")
let USP = new URLSearchParams(document.location.search);

let img
let display
let isVideo = false

const name = document.getElementById("name")
const link = document.getElementById("link")
const id = document.getElementById("id")
const src = document.getElementById("src")
const tags = document.getElementById("tags")
const tagsdiv = document.getElementById("tagsDiv")
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
        if (USP.get("img") == "random") {
            let n = yuri.length;
            let x = Math.floor(n * Math.random())
            img = yuri[x]
        } else {
            location.replace("./")
        }
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
    id.textContent = "ID: "+img.id
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

link.onclick = function() {
    window.open(link.href)
}

function setSize(interval){ 
    clearInterval(interval) 
    let width = img.size.x
    let height = img.size.y
    let imgWidth = (window.innerHeight/((height/width)*(window.innerHeight)))*50

    console.log(imgWidth)
    if (width != 0) {
        tagsDiv.setAttribute("style", "width:"+imgWidth+"vh;")
        link.setAttribute("style", "width:"+imgWidth+"vh;")
        name.setAttribute("style", "width:"+imgWidth+"vh;")
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

let countDown = 0
window.onresize = function() {
    countDown++
    setTimeout(() => {
        countDown--
        if (countDown == 0) {
            setSize()
        }
    }, 300);
};
setSize()