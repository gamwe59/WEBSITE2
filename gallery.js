import yuri from "/yuri.json" with { type: "json" }
import unsorted from "/yuriunsorted.json" with { type: "json" }

let gallery = {}
let curLoadedFromGallery = 0
let curLoadedFromUnsorted = 0
let loopLoaded = 0
const maxLoaded = 20;
let div = document.getElementById("gallery")
const unsortedDiv = document.getElementById("unsorted")
const panelButton = document.getElementById("paneltoggle")
const unsortedInfo = document.getElementById("unsortedInfo")
const buttons = document.querySelectorAll("[id='tagbutton']")
const select = document.getElementById("sort")
const sortSett = document.getElementById("descending")
const curLoadedText = document.getElementById("curloaded")
const notes = document.getElementById("notes")
const notesDiv = document.getElementById("notesDiv")
const loader = document.getElementById("loader")
const goback = document.getElementById("goback")
let USP = new URLSearchParams(document.location.search);
let url = new URL(window.location.href)
let loading = false

let newImgObjs = []

let notesOpen = false

let params = {sort: "added", tags: [], exclude: []}
let sortBy = true //true = descending, false = ascending

function removeImgs() {
    div.innerHTML = '';
    unsortedDiv.innerHTML = '';
    curLoadedFromGallery = 0;
}

function waitForLoad() {
    const images = [...document.querySelectorAll("div img")];

    const proms=newImgObjs.map(im=>new Promise(res=>
    im.onload=()=>res([im.width,im.height])
    ))

    console.log(images)
    Promise.all(proms).then(data=>{
    loader.classList.remove("loadvisible")
    loading = false
    })
}

function addImgs() {
    if (loading == false) {
        loading = true
        newImgObjs = []
        loader.classList.add("loadvisible")
        loopLoaded = 0;
        let n = gallery.length;
        for (let i = curLoadedFromGallery; i < n; i++) {
            let data = gallery[i]
            let obj = document.createElement("a")

            obj.href = "./gallery/view?img="+data.id
            let img
            if (data.tags.includes("here")) {
                img = document.createElement("img")
                img.src = data.src
                newImgObjs.push(img)
            } else if (data.tags.includes("image")) {
                img = document.createElement("img")
                let src = data.src
                src = src.replace("?","%3F")
                src = src.replace("&","%26")
                img.src = "//img.femboy.skin/?url="+src+"&output=webp&default=1" //if gif add &n=-1
                newImgObjs.push(img)
            } else if (data.tags.includes("video")) {
                img = document.createElement("video")
                img.src = data.src
                img.setAttribute("controls", "controls")
                img.setAttribute("poster", data.thumbnail)
                img.type = "video/mp4"
            }
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
            video.src = "./images/theresnothing.mp4"
            video.type = "video/mp4"
            video.setAttribute("class", "theresnothing")
            video.setAttribute("controls", "controls")
            div.appendChild(video)
        }
        curLoadedText.innerHTML = "total images: <strong>"+(yuri.length+unsorted.length)+"</strong><br>total images in database: <strong>"+yuri.length+"</strong><br> currently loaded: <strong>"+(curLoadedFromGallery+curLoadedFromUnsorted)+"</strong>"
        addUnsortedImgs()
    }
}


function addUnsortedImgs() {
    let n = unsorted.length;
    if (loopLoaded>=maxLoaded) {
        unsortedInfo.setAttribute("class", "hidden")
        unsortedDiv.setAttribute("class", "hidden")
    }
    for (let i = curLoadedFromUnsorted; i < n; i++) {
        if (loopLoaded>=maxLoaded) {
            break;
        }
        let obj = document.createElement("a")
        obj.href = unsorted[i]
        let img = document.createElement("img")
        img.src = unsorted[i]
        unsortedDiv.append(obj)
        obj.appendChild(img)
        newImgObjs.push(img)
        curLoadedFromUnsorted++;
        loopLoaded++;
        unsortedInfo.removeAttribute("class")
        unsortedDiv.setAttribute("class", "gallery")
        if (loopLoaded>=maxLoaded) {
            break;
        }
    }
    waitForLoad()
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
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
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
        for (const [key, exclude] of Object.entries(params.exclude)) {
            let ind = arr[i].tags.includes(exclude)
            if (ind) {
                valid = -1000
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
    if (params.sort != "random") {
        insertionSort(gallery)
    } else {
        shuffle(gallery)
    }
}

function resetFilters() {
    gallery = yuri.slice()
    sort(gallery)
    addImgs()
}

function setParams() {
    let tags = USP.getAll("t")
    params.tags = tags.slice()
    let exclude = USP.getAll("e")
    params.exclude = exclude.slice()
    removeImgs()
    gallery = yuri.slice()
    sort(gallery)
    addImgs()
}

function clickTagButton(button, tag, val) {
    let found = USP.has(val, tag)
    if (found) {
        USP.delete(val, tag)
        url.searchParams.delete(val, tag)
        button.classList.remove("tag-"+val)
    } else {
        if (val == "e" && button.classList.contains("tag-t")) {
            clickTagButton(button, tag, "t")
            return
        } else if (val == "t" && button.classList.contains("tag-e")) {
            clickTagButton(button, tag, "e")
            return
        } else {
            USP.append(val, tag)
            url.searchParams.append(val, tag)
            button.classList.add("tag-"+val)
        }
    }
    history.replaceState({}, '', url.href)
    setParams()
}

function siteLoaded() {
    let tags = USP.getAll("t")
    let exclude = USP.getAll("e")

    if (!exclude.includes("explicit")) {
        USP.append("e", "explicit")
        url.searchParams.append("e", "explicit")
        history.replaceState({}, '', url.href)
    }

    exclude = USP.getAll("e")
    
    for (const [key, button] of Object.entries(buttons)) {
        if (tags.includes(button.tagid)) {
            button.classList.add("tag-t")
        } else if (exclude.includes(button.tagid)) {
            button.classList.add("tag-e")
        }
    }
    setParams()
}

for (const [key, button] of Object.entries(buttons)) {
    button.onclick = function() {
        clickTagButton(button, button.tagid, "t")
    }
    button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        clickTagButton(button, button.tagid, "e");
    });
}

panelButton.onclick = function() {
    document.querySelector(".wrapper").classList.toggle("side-panel-open")
    goback.disabled = !goback.disabled
}
goback.onclick = function() {
    document.querySelector(".wrapper").classList.toggle("side-panel-open")
    goback.disabled = !goback.disabled
}

document.addEventListener('input', function (event) {

	// Only run on our select menu
	if (event.target.id !== 'sort') return;

	// Do stuff...
    console.log(event.target.value)
    if (event.target.value == "name") {
        params.sort = "name"
    } else if (event.target.value == "added") {
        params.sort = "added"
    } else if (event.target.value == "random") {
        params.sort = "random"
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

notes.onclick = function() {
    notes.classList.toggle("arrow-down")
    notesDiv.classList.toggle("notes-open")
    notesOpen = !notesOpen
}

document.addEventListener("DOMContentLoaded", (event) => {
  siteLoaded();
});

window.addEventListener('scroll', function() {
  // Check if the user has scrolled to the bottom of the page
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    // Perform the desired action, e.g., showing a popup
    console.log("faggot")
    addImgs()
  }
});