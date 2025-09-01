import yuri from "/yuri.json" with { type: "json" }
import unsorted from "/yuriunsorted.json" with { type: "json" }

let gallery = {}
let curLoadedFromGallery = 0
let loopLoaded = 0
const maxLoaded = 12;
let div = document.getElementById("gallery")
const unsortedDiv = document.getElementById("unsorted")
const loadButton = document.getElementById("load")
const panelButton = document.getElementById("paneltoggle")
const buttons = document.querySelectorAll("[id='tagbutton']")
const select = document.getElementById("sort")
const sortSett = document.getElementById("descending")
let USP = new URLSearchParams(document.location.search);
let url = new URL(window.location.href)

let params = {sort: "added", tags: []}
let sortBy = true //true = descending, false = ascending

function removeImgs() {
    div.innerHTML = '';
    unsortedDiv.innerHTML = '';
    curLoadedFromGallery = 0;
}

function addImgs() {
    loopLoaded = 0;
    let n = gallery.length;
    for (let i = curLoadedFromGallery; i < n; i++) {
        let data = gallery[i]
        let obj = document.createElement("a")
        var str = data.name;
        str = str.replace(/\s+/g, '-').toLowerCase();

        obj.href = "./gallery/view?img="+str
        let img = document.createElement("img")
        let src = data.src
        src = src.replace("?","%3F")
        src = src.replace("&","%26")
        img.src = "//img.femboy.skin/?url="+data.src+"&output=webp" //if gif add &n=-1
        img.alt = data.name
        div.append(obj)
        obj.appendChild(img)
        curLoadedFromGallery++;
        loopLoaded++;
        if (loopLoaded>=maxLoaded) {
            break;
        }
    }
    if (n == 0) {
        console.log("theres nothing.")
        let video = document.createElement("video")
        let vsrc = document.createElement("source")
        vsrc.src = "./images/theresnothing.mp4"
        vsrc.type = "video/mp4"
        video.setAttribute("controls", "controls")
        video.appendChild(vsrc)
        div.appendChild(video)
    }
    addUnsortedImgs()
}

function addUnsortedImgs() {
    let n = unsorted.length;
    console.log(curLoadedFromGallery)
    for (let i = curLoadedFromGallery; i < n; i++) {
        if (loopLoaded>=maxLoaded) {
            break;
        }
        let obj = document.createElement("a")
        obj.href = unsorted[i]
        let img = document.createElement("img")
        img.src = unsorted[i]
        unsortedDiv.append(obj)
        obj.appendChild(img)
        curLoadedFromGallery++;
        loopLoaded++;
        if (loopLoaded>=maxLoaded) {
            break;
        }
    }
}

loadButton.onclick = function() {
    addImgs()
}

function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let obj = arr[i]
        let key = obj[params.sort]
        let j = i-1;
        while (j >= 0 && arr[j][params.sort].toString().localeCompare(key.toString())>=1) {
            arr[j+1]=arr[j]
            j--;
        }
        arr[j+1]=obj;
    }
    if (sortBy) {
        arr.reverse()
    }
    return arr;
}

function clearUnrelated(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let valid = 0
        for (const [key, tag] of Object.entries(params.tags)) {
            let ind = arr[i].tags.includes(tag)
            if (ind) {
                valid++
            }
        }
        if (valid < params.tags.length) {
            arr.splice(i,1)
            n--;
            i--;
        }
    }
    return arr;
}

function sort() {
    clearUnrelated(gallery)
    insertionSort(gallery)
}

function resetFilters() {
    gallery = yuri.slice()
    sort(gallery)
    addImgs()
}

function setParams() {
    let tags = USP.getAll("t")
    params.tags = tags.slice()
    removeImgs()
    gallery = yuri.slice()
    sort(gallery)
    addImgs()
}

function clickTagButton(button, tag) {
    let found = USP.has("t", tag)
    if (found) {
        USP.delete("t", tag)
        url.searchParams.delete("t", tag)
        button.classList.remove("tag-selected")
    } else {
        USP.append("t", tag)
        url.searchParams.append("t", tag)
        button.classList.add("tag-selected")
    }
    history.pushState({}, '', url.href)
    setParams()
}

function siteLoaded() {
    let tags = USP.getAll("t")
    
    for (const [key, button] of Object.entries(buttons)) {
        if (tags.includes(button.class)) {
            button.classList.add("tag-selected")
        }
    }
    setParams()
}

for (const [key, button] of Object.entries(buttons)) {
    button.onclick = function() {
        clickTagButton(button, button.class)
    }
}

panelButton.onclick = function() {
    document.querySelector(".wrapper").classList.toggle("side-panel-open")
}

document.addEventListener('input', function (event) {

	// Only run on our select menu
	if (event.target.id !== 'sort') return;

	// Do stuff...
    console.log(event.target.value)
    if (event.target.value == "name") {
        params.sort = "name"
    } else {
        params.sort = "added"
    }
    setParams()

}, false);

sortSett.onclick = function() {
    sortBy = !sortBy
    if (sortBy) {
        sortSett.textContent = "(DESCENDING)"
    } else {
        sortSett.textContent = "(ASCENDING)"
    }
    setParams()
}

select.selectedIndex = 0;
sortBy = true
sortSett.textContent = "(DESCENDING)"


siteLoaded()