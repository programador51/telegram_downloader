import browser from "webextension-polyfill";
import { AddOnMessage} from "./typesBackgroundScript";
import { MessageBrowserActions } from "./helpers/content_script/types";
import { decodeStreamChunks, fetchAndCombineStreams } from "./helpers/files";
import { saveAs } from "file-saver";

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

    default:
      return;
  }
});

storeVideoStreamRequests();

////////////////////////////////////////////////////////////////////////////

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
