import yuri from "/yuri.json" with { type: "json" }

function createEmbed() {
    let img
    let USP = new URLSearchParams(document.location.search);
    for (let i = 0; i < n; i++) {
        var str = yuri[i].name;
        str = str.replace(/\s+/g, '-').toLowerCase();
        if (str == USP.get("img")) {
            valid = true
            img = yuri[i]
            break;
        }
    }
    var m = document.createElement("meta")
    m.setAttribute('property', 'og:image')
    m.content = img.src  
    document.getElementById("head").appendChild(m);
}

export async function onRequestGet(ctx) {
    createEmbed()
	const response = await env.ASSETS.fetch(ctx.url)
	const page = 
		await response.text()
			.replaceAll("some template string", "value")
	return new Response(page, response)
}