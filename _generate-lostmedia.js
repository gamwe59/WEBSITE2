// _generate-yuri.js
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "content/lostyuri");
const files = fs.readdirSync(dir)

const output = JSON.stringify(files.map(f => "/content/lostyuri/" + f))


fs.writeFileSync("lostmedia.json", output);
console.log("✅ yuri.html updated with", files.length, "images.");