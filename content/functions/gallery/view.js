export async function onRequest(ctx) {
    const url = new URL(ctx.request.url);
    
    if (!url.pathname.includes('/view')) {
        return ctx.env.ASSETS.fetch(ctx.request);
    }
    
    const imgId = url.searchParams.get("img");
    
    if (!imgId) {
        return ctx.env.ASSETS.fetch(ctx.request);
    }
    
    const yuriJsonResponse = await ctx.env.ASSETS.fetch(new URL('/yuri.json', url.origin));
    const yuri = await yuriJsonResponse.json();
    
    const img = yuri.find(i => i.id.toString() === imgId);
    
    if (!img) {
        return ctx.env.ASSETS.fetch(ctx.request);
    }
    
    const response = await ctx.env.ASSETS.fetch(ctx.request);
    let html = await response.text();
    
    const isVideo = img.tags && img.tags.includes("video");
    const embedImage = isVideo && img.thumbnail ? img.thumbnail : img.src;
    
    html = html
        .replace('content="EMBED ERROR"', `content="${img.name}"`)
        .replace('content="/images/embederror.png"', `content="${embedImage}"`);
    
    return new Response(html, {
        status: response.status,
        headers: {
            ...Object.fromEntries(response.headers),
            'Content-Type': 'text/html;charset=UTF-8'
        }
    });
}