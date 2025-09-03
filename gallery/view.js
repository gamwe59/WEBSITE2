import yuri from "/yuri.json" with { type: "json" }
import tagsJSON from "/tags.json" with { type: "json" }

let info = document.getElementById("info")
let USP = new URLSearchParams(document.location.search);

let img

const name = document.getElementById("name")
const link = document.getElementById("link")
const src = document.getElementById("src")
const tags = document.getElementById("tags")
const added = document.getElementById("added")

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
    src.src = img.src
    added.textContent = "Time added: "+img.added
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

validURL()
loadDetails()
generateTags()