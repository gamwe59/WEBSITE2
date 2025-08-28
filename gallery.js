import yuri from "/yuri.json" with { type: "json" }

let gallery = {}
let curLoadedFromGallery = 0

const validParams = {sort: "date"}
const searchParams = new URLSearchParams(validParams)

function sort() {

}

function resetFilters() {
    gallery = yuri.slice()
    gallery.splice(0,1)
    for (const [key, val] of Object.entries(gallery)) {
        console.log(val.name)
    }
    for (const [key, val] of Object.entries(yuri)) {
        console.log(val.name)
    }
}


resetFilters()