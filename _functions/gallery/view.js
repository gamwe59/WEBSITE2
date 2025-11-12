import yuri from "/yuri.json" with { type: "json" }

export async function onRequestGet(ctx) {
	const response = await env.ASSETS.fetch(ctx.url)
    let img
    for (let i = 0; i < n; i++) {
        if (yuri[i].id.toString() == USP.get("img")) {
            valid = true
            img = yuri[i]
            break;
        }
    }
    if (img) {
        const page = 
            await response.text()
                .replaceAll("EMBED ERROR", img.name)
                .replaceAll("/images/embederror.png", img.src)
        return new Response(page, response)
    }
}