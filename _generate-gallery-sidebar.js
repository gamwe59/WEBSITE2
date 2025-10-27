import tags from "/tags.json" with { type: "json" }
import yuri from "/yuri.json" with { type: "json" }

const sidebar = document.getElementById("sidepanel")

let types = {}
let tagCount = {}

function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let obj = arr[i]
        let key = obj.long
        let j = i-1;
        while (j >= 0 && arr[j].long.toString().localeCompare(key.toString())>=1) {
            arr[j+1]=arr[j]
            j--;
        }
        arr[j+1]=obj;
    }
    return arr;
}

function addContent() {
    for (const [key, tag] of Object.entries(tags)) {
        if (types[tag.type]) {
            if (!types[tag.type].includes(tag)) {
                tag.id = key
                types[tag.type].push(tag)
            }
        } else {
            tag.id = key
            types[tag.type] = new Array()
            types[tag.type].push(tag)
        }
    }
    
    for (const [key, type] of Object.entries(types)) {
        let div = document.createElement("ul")
        div.id = key
        let title = document.createElement("header")
        title.textContent = key
        sidebar.appendChild(div)
        div.appendChild(title)
        insertionSort(type)
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
    for (const [key, type] of Object.entries(types)) {
        for (const [key2, tag] of Object.entries(type)) {
            let li = document.createElement("li")
            let b = document.createElement("button")
            let folder = document.getElementById(tag.type)
            let count = tagCount[tag.id]
            if (count) {
                b.textContent = tag.long+" ["+count+"]"
                if (count == 1) {
                    b.classList.add("one")
                }
            } else {
                b.textContent = tag.long+" [0]"
                b.classList.add("zero")
            }
            b.id = "tagbutton"
            b.tagid = tag.id
            b.classList.add("tagbutton")
            li.appendChild(b)
            folder.appendChild(li)
        }
    }
}

addContent()