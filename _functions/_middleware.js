async function injectIntoHead(html, content) {
  return html.replace(
    /(<head>)(.*?)(<\/head>)/is,
    (match, openHead, existingContent, closeHead) => {
      return `${openHead}${existingContent}${content}${closeHead}`;
    }
  );
}

export async function onRequest({ request, next, env }) {
  let response = await next();
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();
  html = html.replace(/<meta[^>]*>/g, '');
  html = await injectIntoHead(html, '\n    <script defer data-domain="yurion.top" src="https://plausible.gaq9.com/js/script.file-downloads.outbound-links.js"></script>\n<script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>\n');

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}