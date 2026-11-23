export async function onRequest(context) {
  const url = new URL(context.request.url);
  const guest = (url.searchParams.get('to') || url.searchParams.get('khach') || url.searchParams.get('name') || url.searchParams.get('in') || '').trim().slice(0, 60);
  const response = await context.next();

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const ogImage = `${url.origin}/og.jpg?v=2`;
  const fullTitle = `Hân & Đang | Thiệp mời đám cưới — Kính mời: ${guest}`;
  let rw = new HTMLRewriter()
    .on('meta[property="og:image"]', {
      element(el) {
        el.setAttribute('content', ogImage);
      }
    });
  if (guest) {
    rw = rw
      .on('title', {
        element(el) {
          el.setInnerContent(fullTitle);
        }
      })
      .on('meta[property="og:title"]', {
        element(el) {
          el.setAttribute('content', fullTitle);
        }
      });
  }
  return rw.transform(response);
}
