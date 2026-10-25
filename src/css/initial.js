{
  function createScript(url, type, defer) {
    let el = document.createElement('script');
    el.src = url;
    if(type) el.type = type
    if(defer) el.defer = 'defer'
    document.head.appendChild(el)
  }
  if(location.protocol === 'http:') {
    createScript('./script.mjs', 'module')
  }
  else {
    createScript('./page.js');
    createScript('./content.js');
    createScript('./script.js', false, true)
  }
  document.currentScript.remove();
}
