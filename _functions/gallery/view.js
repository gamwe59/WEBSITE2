import yuri from "/yuri.json" with { type: "json" }

export async function onRequestGet(ctx) {
	const response = await env.ASSETS.fetch(ctx.url)
    let img = yuri.find(i => i.id.toString() === ctx.url.searchParams.get("img"))
    if (img) {
        const page = 
            await response.text()
                .replaceAll("EMBED ERROR", img.name)
                .replaceAll("/images/embederror.png", img.src)
        return new Response(page, response)
    }
}