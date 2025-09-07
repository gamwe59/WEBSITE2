export async function onRequestGet(ctx) {
	const response = await env.ASSETS.fetch(ctx.url)
	const page = 
		await response.text()
			.replaceAll("some template string", "value")
	return new Response(page, response)
}