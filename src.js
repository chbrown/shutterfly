/*jslint browser: true */ /* globals Shr */

/**
Simple document.createElement() wrapper / helper.
*/
function h(tagName, attributes, childNodes) {
  var el = document.createElement(tagName);
  for (var key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  childNodes.forEach(function(childNode) {
    if (typeof childNode === 'string') {
      childNode = document.createTextNode(childNode);
    }
    el.appendChild(childNode);
  });
  return el;
}

/**
Construct a Shutterfly downloadpicture URL from the given parameters.
*/
function createDownloadURL(id, collectionKey, albumKey, title) {
  var params = {
    site: 'site',
    id: id,
    collectionKey: collectionKey,
    albumKey: albumKey,
    title: title,
  };
  var querystring = Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
  return 'https://cmd.shutterfly.com/commands/async/downloadpicture?' + querystring;
}

/**
Read each section in the given array of sections, and return a single list of
URLs.
*/
function readDownloadURLs(sections) {
  var sections_urls = sections.map(function(section) {
    return section.items.map(function(item) {
      return createDownloadURL(item.shutterflyId,
        section.collectionKey,
        section.albumKey,
        item.title);
    });
  });
  return Array.prototype.concat.apply([], sections_urls);
}

/**
Create the <nav>...</nav> element for user interaction.
*/
function createUserInterface() {
  return h('nav', {}, [
    h('b', {'class': 'remaining'}, ['']),
    h('span', {}, [' remaining images to download. ']),
    h('button', {'class': 'start'}, ['Start']),
    h('button', {'class': 'stop'}, ['Stop']),
    h('label', {}, [
      h('span', {}, ['Time to wait between downloads: ']),
      h('input', {type: 'number', value: 2}, []),
      h('span', {}, [' seconds']),
    ]),
  ]);
}

// none of the functions above have side effects, nor do they require anything
// besides the `document` global.

/**
Trigger a download by creating an iframe with the target url as the src= value.
*/
function downloadURL(url) {
  var iframe = h('iframe', {src: url, display: 'none'}, []);
  document.body.appendChild(iframe);
}

var style = document.head.appendChild(h('style', {}, ['']));
style.sheet.insertRule('nav { position: fixed; top: 10px; left: 10px; right: 10px; padding: 5px 10px; background-color: #EEE; border: 1px solid #222; box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.75); z-index: 1000; }', 0);
style.sheet.insertRule('button { height: auto; padding: 2px 6px 3px 6px; }', 0);
style.sheet.insertRule('nav > * { margin: 5px; }', 0);
style.sheet.insertRule('label { margin: 5px; float: right; }', 0);
style.sheet.insertRule('input { width: 40px; text-align: right; }', 0);

if (window.shutterfly_downloader) {
  window.shutterfly_downloader.parentNode.removeChild(window.shutterfly_downloader);
}
window.shutterfly_downloader = document.body.appendChild(createUserInterface());

function refreshRemaining() {
  document.querySelector('.remaining').textContent = downloads.length.toString();
}

var downloads = readDownloadURLs(Shr.P.sections);
refreshRemaining();

document.querySelector('button.start').addEventListener('click', startDownloads);
document.querySelector('button.stop').addEventListener('click', stopDownloads);

function startDownloads() {
  clearInterval(window.timer);
  // Hard lower limit of 10 milliseconds per download
  var wait = Math.max(document.querySelector('nav input').value * 1000, 10);
  window.timer = setInterval(function() {
    var url = downloads.shift();
    refreshRemaining();
    if (url) {
      downloadURL(url);
    }
    else {
      stopDownloads();
    }
  }, wait);
}

function stopDownloads() {
  clearInterval(window.timer);
}
