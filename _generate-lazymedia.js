// _generate-yuri.js
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "content/lazymedia");
const files = fs.readdirSync(dir)

const output = JSON.stringify(files.map(f => "/content/lazymedia/" + f))


fs.writeFileSync("lazymedia.json", output);
console.log("✅ yuri.html updated with", files.length, "images.");