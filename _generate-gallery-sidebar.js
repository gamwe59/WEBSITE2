import tags from "/tags.json" with { type: "json" }
import yuri from "/yuri.json" with { type: "json" }

const sidebar = document.getElementById("sidepanel")

let types = {}
let tagCount = {}

function addContent() {
    for (const [key, tag] of Object.entries(tags)) {
        types[tag.type] = {name: tag.type}
    }
    
    for (const [key, type] of Object.entries(types)) {
        let div = document.createElement("ul")
        div.id = type.name
        let title = document.createElement("header")
        title.textContent = type.name
        sidebar.appendChild(div)
        div.appendChild(title)
    }
    for (const [key, img] of Object.entries(yuri)) {
        for (const [key2, tag] of Object.entries(img.tags)) {
            if (tagCount[tag]) {
                tagCount[tag] = tagCount[tag]+1
            } else {
                tagCount[tag] = 1
            }
        }
    }
    for (const [key, tag] of Object.entries(tags)) {
        let li = document.createElement("li")
        let b = document.createElement("button")
        let folder = document.getElementById(tag.type)
        let count = tagCount[key]
        if (count) {
            b.textContent = tag.long+" ["+count+"]"
        } else {
            b.textContent = tag.long+" [0]"
        }
        b.id = "tagbutton"
        b.class=key
        li.appendChild(b)
        folder.appendChild(li)
    }
}

addContent()