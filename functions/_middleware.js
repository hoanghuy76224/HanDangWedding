export async function onRequest(context) {
  const url = new URL(context.request.url);
  const guest = (url.searchParams.get('to') || url.searchParams.get('khach') || url.searchParams.get('name') || url.searchParams.get('in') || '').trim().slice(0, 60);
  const response = await context.next();
  if (!guest) return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const fullTitle = `Hân & Đang | Thiệp mời đám cưới — Kính mời: ${guest}`;
  return new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(fullTitle);
      }
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute('content', fullTitle);
      }
    })
    .transform(response);
}
