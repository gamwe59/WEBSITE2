// _generate-yuri.js
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "yurifolder");
const files = fs.readdirSync(dir)

const output = JSON.stringify(files.map(f => "/yurifolder/" + f))


fs.writeFileSync("yuriunsorted.json", output);
console.log("✅ yuri.html updated with", files.length, "images.");