# shutterfly downloader bookmarklet

Instructions:

1. Drag this "Shutterfly Downloader" link to your browser's "Bookmarks Bar" (Firefox calls it the "Bookmarks Toolbar", Safari calls it the "Favorites Bar"):
  * <a href='javascript:function h(tagName,attributes,childNodes){var el=document.createElement(tagName);for(var key in attributes){el.setAttribute(key,attributes[key])}childNodes.forEach(function(childNode){if(typeof childNode==="string"){childNode=document.createTextNode(childNode)}el.appendChild(childNode)});return el}function createDownloadURL(id,collectionKey,albumKey,title){var params={site:"site",id:id,collectionKey:collectionKey,albumKey:albumKey,title:title};var querystring=Object.keys(params).map(function(key){return key+"="+params[key]}).join("&");return"https://cmd.shutterfly.com/commands/async/downloadpicture?"+querystring}function readDownloadURLs(sections){var sections_urls=sections.map(function(section){return section.items.map(function(item){return createDownloadURL(item.shutterflyId,section.collectionKey,section.albumKey,item.title)})});return Array.prototype.concat.apply([],sections_urls)}function createUserInterface(){return h("nav",{},[h("b",{"class":"remaining"},[""]),h("span",{},[" remaining images to download. "]),h("button",{"class":"start"},["Start"]),h("button",{"class":"stop"},["Stop"]),h("label",{},[h("span",{},["Time to wait between downloads: "]),h("input",{type:"number",value:2},[]),h("span",{},[" seconds"])])])}function downloadURL(url){var iframe=h("iframe",{src:url,display:"none"},[]);document.body.appendChild(iframe)}var style=document.head.appendChild(h("style",{},[""]));style.sheet.insertRule("nav { position: fixed; top: 10px; left: 10px; right: 10px; padding: 5px 10px; background-color: #EEE; border: 1px solid #222; box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.75); z-index: 1000; }",0);style.sheet.insertRule("button { height: auto; padding: 2px 6px 3px 6px; }",0);style.sheet.insertRule("nav > * { margin: 5px; }",0);style.sheet.insertRule("label { margin: 5px; float: right; }",0);style.sheet.insertRule("input { width: 40px; text-align: right; }",0);if(window.shutterfly_downloader){window.shutterfly_downloader.parentNode.removeChild(window.shutterfly_downloader)}window.shutterfly_downloader=document.body.appendChild(createUserInterface());function refreshRemaining(){document.querySelector(".remaining").textContent=downloads.length.toString()}var downloads=readDownloadURLs(Shr.P.sections);refreshRemaining();document.querySelector("button.start").addEventListener("click",startDownloads);document.querySelector("button.stop").addEventListener("click",stopDownloads);function startDownloads(){clearInterval(window.timer);var wait=Math.max(document.querySelector("nav input").value*1e3,10);window.timer=setInterval(function(){var url=downloads.shift();refreshRemaining();if(url){downloadURL(url)}else{stopDownloads()}},wait)}function stopDownloads(){clearInterval(window.timer)}'>Shutterfly Downloader</a>
2. Go to the [Shutterfly](https://www.shutterfly.com/) album page you want to download (you _must_ be on the main album page, _not_ on one of the individual photos), and click the "All" link to show all images on a single page.
  * You don't _have_ to show all images, but that's the easiest way to download all the images at once.
3. "Open" the `Shutterfly Downloader` bookmark you created in Step 1. This will not open a new page, but will create a new bar at the top of the album page, which looks like this:
  ![Shutterfly Downloader Screenshot](docs/screenshot.png)
4. Click the "Start" button to download all the images in the album.
  * You can "Stop" and adjust the interval to wait between downloads, and then click "Start" to continue where you left off.
5. You may need to click "Allow" if your browser asks if you want to allow the page to download multiple files. This should happen within the first 3 or 4 downloads, and your browser _should_ remember what you chose, so this _should_ only happen once.


## License

Copyright 2014-2015 Christopher Brown. [MIT Licensed](http://opensource.org/licenses/MIT).
