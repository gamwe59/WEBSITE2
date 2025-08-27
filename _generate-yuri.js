// _generate-yuri.js
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "yurifolder");
const files = fs.readdirSync(dir)

const output = `
<meta name="color-scheme" content="dark light">
<noscript>enable js for this experience</noscript>
<script>
    /** @type {<Type>(arr: Type[]) => Type} */
    const random = arr => arr[Math.floor(Math.random() * arr.length)]
    const pics = ${JSON.stringify(files.map(f => "/yurifolder/" + f))}
    location.replace(random(pics))
</script>
`;

fs.writeFileSync("yuri.html", output);
console.log("✅ yuri.html updated with", files.length, "images.");