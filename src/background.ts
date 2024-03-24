import browser from "webextension-polyfill";
import { AddOnMessage } from "./typesBackgroundScript";
import { MessageBrowserActions } from "./helpers/content_script/types";

// Listen for messages from the content script
browser.runtime.onMessage.addListener(async (message: string) => {
  const parsedMessage: AddOnMessage = JSON.parse(message);
  
  console.log('background',parsedMessage);

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

    default:
      return;
  }
});

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
  browser.runtime.sendMessage(JSON.stringify(information));
}
