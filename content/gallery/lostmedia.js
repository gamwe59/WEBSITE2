import lostmedia from "./lostmedia.json" with { type: "json" }
import lazymedia from "./lazymedia.json" with { type: "json" }

let lostmediaDiv = document.getElementById("lostmedia")
let lazymediaDiv = document.getElementById("lazymedia")


function addlostmediaImgs() {
    console.log("lost")
    let n = lostmedia.length;
    for (let i = 0; i < n; i++) {
        let obj = document.createElement("a")
        obj.href = lostmedia[i]
        let img = document.createElement("img")
        img.src = lostmedia[i]
        lostmediaDiv.append(obj)
        obj.appendChild(img)
    }
}

function addlazymediaImgs() {
    console.log("lost")
    let n = lazymedia.length;
    for (let i = 0; i < n; i++) {
        let obj = document.createElement("a")
        obj.href = lazymedia[i]
        let img = document.createElement("img")
        img.src = lazymedia[i]
        lazymediaDiv.append(obj)
        obj.appendChild(img)
    }
}

addlostmediaImgs()
addlazymediaImgs()