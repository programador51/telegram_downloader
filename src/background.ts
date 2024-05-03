import browser from "webextension-polyfill";
import { AddOnMessage} from "./typesBackgroundScript";
import { DownloadImageMessage, MessageBrowserActions } from "./helpers/content_script/types";
import { base64toBlob, decodeStreamChunks, fetchAndCombineStreams, retrieveExtension } from "./helpers/files";
import { saveAs } from "file-saver";
import { retrieveAddOnConfiguration } from "./helpers/dom";

// Listen for messages from the content script
browser.runtime.onMessage.addListener(async (message: string) => {
  const parsedMessage: AddOnMessage = JSON.parse(message);

  console.log("background", parsedMessage);

  switch (parsedMessage.action) {
    case "crawledContent": {
      receiveCrawledData(
        parsedMessage as MessageBrowserActions<"crawledContent">
      );
      break;
    }

    case "popUpOpened": {
      await requestFetchedImages();
      break;
    }

    case "chunks":{
      downloadMediaVideo(JSON.parse(message).message)
      break;
    }

    case "downloadImage":{
      const dto:MessageBrowserActions<"downloadImage"> = JSON.parse(message)
      downloadImage(dto.message);
      break;
    }

    default:
      return;
  }
});

storeVideoStreamRequests();

////////////////////////////////////////////////////////////////////////////
function downloadImage(dto:DownloadImageMessage){
  try {
    const url = URL.createObjectURL(base64toBlob(dto.base64));

    const { downloadPath } = retrieveAddOnConfiguration();

    const extension = retrieveExtension(dto.base64);

    let filename = "";

    if(downloadPath!=="/")  filename = `${downloadPath.substring(1,downloadPath.length)}/${window.crypto.randomUUID()}.${extension}`    
    
    if(downloadPath==="/"||downloadPath==="") filename = `${window.crypto.randomUUID()}.${extension}`;

    console.log({filename , downloadPath})
    
    browser.downloads.download({
      url,
      filename,
    });
  } catch (error) {
    console.log({error});
    alert(`There's has been an error to download the image, please report it on telegram group. Error code: 'f4853378-ff59-4fc6-ad26-5e2dc423eec6'`);
  }
}


function downloadMediaVideo(urls:string[]){
  fetchAndCombineStreams(urls)
  .then(combinedBlob => {
      saveAs(combinedBlob,'video.mp4')
  })
  .catch(error => {
      console.error("Error fetching and combining streams:", error);
  });

}

function storeVideoStreamRequests() {
  try {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        const chunkInformation = decodeStreamChunks(details.url);

        const information: MessageBrowserActions<"chunks"> = {
          action: "chunks",
          message: JSON.stringify(chunkInformation),
        };

        getTab().then((tab) => {
          browser.tabs.sendMessage(tab.id || 0, information);
          return
        });
      },
      {
        urls: ["https://web.telegram.org/k/stream*"],
      },
      ["blocking"]
    );
  } catch (error) {
    console.log(`Couldn't retrieve stream urls`, error);
  }
}

async function requestFetchedImages() {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const message: AddOnMessage = {
    action: "popUpOpened",
    message: "",
  };

  browser.tabs.sendMessage(tab.id || 0, JSON.stringify(message));
}

async function receiveCrawledData(
  information: MessageBrowserActions<"crawledContent">
) {
  const tab = await getTab();

  browser.runtime.sendMessage(
    JSON.stringify({
      images: information,
      urlTab: tab.url,
    })
  );
}

async function getTab() {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}
