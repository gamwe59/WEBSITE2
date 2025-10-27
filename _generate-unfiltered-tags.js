// _generate-unfiltered-tags.js
const fs = require("fs");
let yuri = require("./yuri.json")
let tags = require("./tags.json")

let unsortedTags = []

for (const [key, inst] of Object.entries(yuri)) {
    for (const [something, tag] of Object.entries(inst.tags)) {
        let valid = false
        for (const [something2, validTag] of Object.entries(tags)) {
            if (something2.localeCompare(tag) == 0) {
                valid = true
            }
        }
        if (!valid) {
            if (unsortedTags.includes(tag)) {

            } else {
                unsortedTags.push(tag)
            }
        }
    }
}

let output = JSON.stringify(unsortedTags)


fs.writeFileSync("tags-unsorted.json", output);