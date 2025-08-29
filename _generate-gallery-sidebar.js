import tags from "/tags.json" with { type: "json" }

const sidebar = document.getElementById("sidepanel")

let types = {}

function addContent() {
    for (const [key, tag] of Object.entries(tags)) {
        types[tag.type] = {name: tag.type}
    }
    console.log(types)
    
    for (const [key, type] of Object.entries(types)) {
        let div = document.createElement("ul")
        div.id = type.name
        let title = document.createElement("header")
        title.textContent = type.name
        sidebar.appendChild(div)
        div.appendChild(title)
    }
    for (const [key, tag] of Object.entries(tags)) {
        let li = document.createElement("li")
        let b = document.createElement("button")
        let folder = document.getElementById(tag.type)
        b.textContent = tag.long
        b.id = "tagbutton"
        b.class=key
        li.appendChild(b)
        folder.appendChild(li)
    }
}

addContent()