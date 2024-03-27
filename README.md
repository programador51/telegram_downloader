# Telegram Downloader

Is an extension for Mozilla Firefox that allows download the media from channels or groups that are marked as `Protected Media`.

> `programador51` - If is on the web, is downlable.

## Features
- Displays the media controls hidden by telegram
  - Share
  - Download
  - Delete
- Display a popup with all the files fetched from the chat pagination that allows
  - Preview the picture in the browser
  - Download the media as well
  - Download all the media with one button
  - Display the media dimensions and size

---


## Requeriments
- node.js enviroment installed (any version)
- node package manager (`npm`)

## Installation

1. Unzip the code on any folder
2. Install the dependencies of the `package.json` with `npm i`
3. Generate the distribution files executing the script on the command line with `npm run create`. (These files are the extension). The script do the follow things:
   1. Bundle the react code (popup ui for the extension)
   2. Transpiles the `background` files requested by the `manifest.json`
   3. Transpiles the `content_scripts` files requested by the `manifest.json`
4. Zip and upload the `dist` folder on the addon page of firefox to debug and run the extension