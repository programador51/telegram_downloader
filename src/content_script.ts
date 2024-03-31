import browser from "webextension-polyfill";
import {
  formatButtonsDownload,
  showHiddenMediaBtns,
} from "./helpers/content_script";
import { MessageBrowserActions } from "./helpers/content_script/types";
import { CrawledImageDom } from "./typesContentScript";

showHiddenMediaBtns();
listenAddOn();
formatButtonsDownload();
observeMediaElementChanges();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function observeMediaElementChanges() {
  // Create a new instance of MutationObserver
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      // Check if any added nodes match the classes "media-photo" or "media-video"
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        Array.from(mutation.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            if (
              node.classList.contains("media-photo") ||
              node.classList.contains("media-video")
            ) {
              if (node.tagName === "VIDEO" || node.tagName === "IMG")
                createDownloadButton(node);
            }
          }
        });
      }
    });
  });

  // Configure the MutationObserver to observe changes to the subtree of the document
  const config = { childList: true, subtree: true };

  // Start observing mutations
  observer.observe(document.body, config);
}

async function downloadImage(dom: HTMLElement) {
  dom.click();

  const media = await getMediaControls();

  const downloadBtn = media.childNodes[2] as HTMLElement;

  downloadBtn.click();
  const escapeKeyEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    code: "Escape",
    keyCode: 27,
    which: 27,
  });

  setTimeout(function () {
    dom.dispatchEvent(escapeKeyEvent);
  }, 250);
}

async function getMediaControls(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const checkForControls = () => {
      const containerMedia = document.getElementsByClassName(
        "media-viewer-buttons"
      );
      console.log({ containerMedia });
      if (containerMedia.length > 0) {
        resolve(containerMedia[0] as HTMLElement);
      } else {
        // DOM element not found, wait and check again
        setTimeout(() => {
          checkForControls();
        }, 250);
      }
    };

    // Start checking for controls
    checkForControls();
  });
}

function createDownloadButton(targetElement: HTMLElement) {
  const downloadButton = document.createElement("button");
  downloadButton.classList.add("telegramGoesBrrrrrrr");
  downloadButton.textContent = "Download";
  downloadButton.addEventListener(
    "click",
    async () => await downloadImage(targetElement)
  );

  // Append the button as a sibling to the target image
  targetElement.parentNode?.insertBefore(
    downloadButton,
    targetElement.nextSibling
  );
}

function hasSiblingButtons(element: Element) {
  // Check if the previous sibling exists and is a button
  if (
    element.previousElementSibling &&
    (element.previousElementSibling.tagName === "BUTTON" ||
      element.previousElementSibling.tagName === "VIDEO")
  ) {
    return true;
  }

  if (element.previousElementSibling === null) return false;

  if (
    element.nextElementSibling &&
    (element.previousElementSibling.tagName === "BUTTON" ||
      element.previousElementSibling.tagName === "VIDEO")
  ) {
    return true;
  }
  return false;
}

function sendImages(information: MessageBrowserActions<"crawledContent">) {
  browser.runtime.sendMessage(JSON.stringify(information));
}

async function retrieveImageAsBase64(url: string | null): Promise<string> {
  if (url === null) return "";

  try {
    // Fetch the image data
    const response = await fetch(url);
    const blob = await response.blob();

    // Convert the blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64Data = reader.result;

        if (typeof base64Data === "string") resolve(base64Data);
      };
      reader.onerror = reject;
    });
  } catch (error) {
    console.error(error);
    return "";
  }
}

/**
 * Get the images of the telegram chat
 * @returns Crawled images
 */
async function getAllImages(): Promise<CrawledImageDom[]> {
  const container = document.getElementById("column-center");

  if (container === null) return [];

  // Use querySelectorAll to select all elements with class 'media-photo' inside the container
  const mediaPhotos = container.querySelectorAll(".media-photo");

  // Convert the NodeList to an array (optional)
  const mediaPhotosArray = Array.from(mediaPhotos);

  const photos = [...mediaPhotosArray].map((item) =>
    (async function () {
      if (hasSiblingButtons(item)) return null;

      const imageElement = item as HTMLImageElement;

      const base64Image = await retrieveImageAsBase64(item.getAttribute("src"));

      const crawledContent: CrawledImageDom = {
        blob: base64Image,
        height: imageElement.naturalWidth,
        width: imageElement.naturalHeight,
      };

      return crawledContent;
    })()
  );

  const photosFetched = await Promise.all(photos);

  const parsedPhotos = photosFetched.filter(
    (item) => item !== null && item.blob.length >= 1
  ) as CrawledImageDom[];

  if (parsedPhotos.length >= 1) return parsedPhotos;

  return [];
}

function listenAddOn() {
  browser.runtime.onMessage.addListener(async () => {
    const [images] = await Promise.all([getAllImages()]);

    sendImages({
      action: "crawledContent",
      message: {
        images,
        urlTab: "",
      },
    });
  });
}
