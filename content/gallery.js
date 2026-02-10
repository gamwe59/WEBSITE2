import yuri from "./yurigen/yuri.json" with { type: "json" }
import tagsJSON from "./yurigen/tags.json" with { type: "json" }

let gallery = {}
let curLoadedFromGallery = 0
let loopLoaded = 0
const maxLoaded = 20;
let div = document.getElementById("gallery")
const panelButton = document.getElementById("paneltoggle")
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

console.log("faggot")

function removeImgs() {
    div.innerHTML = '';
    curLoadedFromGallery = 0;
}

function waitForLoad() {
    const images = [...document.querySelectorAll("div img")];

    const proms=newImgObjs.map(im=>new Promise(res=>
    im.onload=()=>res([im.width,im.height])
    ))
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
            let nameP = document.createElement("p")
            nameP.textContent = data.name
            let artistP = document.createElement("p")
            let artist
            for (const [key, tag] of Object.entries(data.tags)) {
                let type = tagsJSON[tag]
                if (type.type == "artist") {
                    artist = type.long
                }
            }
            artistP.textContent = artist
            nameP.textContent = data.name
            nameP.classList.add("nameTop")
            artistP.classList.add("artistBottom")
            let shadowDiv = document.createElement("div")
            obj.classList.add("notransition")

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
                if (img.mini == null) {
                    display.src = img.src
                }
                img.src = "./webp/"+data.mini
                console.log(img.src)
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
            obj.appendChild(nameP)
            obj.appendChild(artistP)
            obj.appendChild(shadowDiv)
            curLoadedFromGallery++;
            loopLoaded++;
            if (loopLoaded>=maxLoaded) {
                break;
            }
        }
        if (n == 0) {
            let video = document.createElement("video")
            video.src = "./images/theresnothing.mp4"
            video.type = "video/mp4"
            video.setAttribute("class", "theresnothing")
            video.setAttribute("controls", "controls")
            div.appendChild(video)
        } else {
            setSize()
        }
        curLoadedText.innerHTML = "total images: <strong>"+(yuri.length)+"</strong><br>total images in database: <strong>"+yuri.length+"</strong><br> currently loaded: <strong>"+(curLoadedFromGallery)+"</strong>"
            
        waitForLoad()
    }
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

    if (!exclude.includes("suggestive")) {
        USP.append("e", "suggestive")
        url.searchParams.append("e", "suggestive")
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

//uhmmm um ummm im doing the uhmmm gallery grid thing here tee hee

function setSize() {
    let gap = 5

    let divWidth = div.clientWidth
    let padding =  div.style.padding.match(/\d+/g)
    divWidth -= padding[0]*2

    let fx = Math.floor(divWidth/400)+1
    fx = Math.min(fx, 8)
    fx = Math.max(fx,2)
    divWidth -= gap*(fx-1)

    let imgWidth = (divWidth/fx)

    let galleryLocations = []

    let index = 0
    let colHeights = []

    for (let i = 0; i < fx; i++) {
        colHeights[i] = 0
    }

    for (const [key, child] of Object.entries(div.childNodes)) {
        const params = new URL(child.href).searchParams
        let img = yuri.find(i => i.id.toString() === params.get("img"))

        let aspectRatio = img.size.x/img.size.y
        let imgHeight = imgWidth/aspectRatio

        child.style.width = (imgWidth)+"px"
        child.style.height = (imgHeight)+"px"

        if (index > 0) {
            if (colHeights[index-1] < colHeights[index]) {
                index--
            }
        } else {
            if (colHeights[fx-1] < colHeights[index]) {
                index = fx-1
            }
        }
        
        let pos = colHeights[index]

        child.style.transform = "translate("+( index*(imgWidth+gap) )+"px,"+( pos )+"px)"
    
        setTimeout(() => {
            child.classList.remove("notransition")
        }, 5);

        colHeights[index]+=imgHeight+gap

        index++
        if (index >= fx) {
            index = 0
        }
    }

    let furthestDown = 0
    for (let i = 0; i < colHeights.length; i++) {
        if (colHeights[i] > furthestDown) {
            furthestDown = colHeights[i];
        }
    }
    div.style.height = furthestDown+"px"
}

//detect when resize

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
    addImgs()
  }
});