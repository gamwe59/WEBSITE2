import yuri from "/yuri.json" with { type: "json" }
import unsorted from "/yuriunsorted.json" with { type: "json" }

let gallery = {}
let curLoadedFromGallery = 0
let loopLoaded = 0
const maxLoaded = 15;
let div = document.getElementById("gallery")
const unsortedDiv = document.getElementById("unsorted")
const loadButton = document.getElementById("load")
let USP = new URLSearchParams(document.location.search);

const validParams = {sort: "added"}
const url = window.location

let params = {sort: "added", tags: []}

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
        img.src = data.src
        img.alt = data.name
        div.append(obj)
        obj.appendChild(img)
        curLoadedFromGallery++;
        loopLoaded++;
        if (loopLoaded>=maxLoaded) {
            break;
        }
    }
    addUnsortedImgs()
}

function addUnsortedImgs() {
    let n = unsorted.length;
    for (let i = curLoadedFromGallery; i < n; i++) {
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


resetFilters()