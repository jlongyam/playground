export default function page(saved) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>${saved.css.replace(/<\/style/gi, "<\\/style")}</style>
    </head>
    <body>${saved.html}</body>
  </html>
`;
}
