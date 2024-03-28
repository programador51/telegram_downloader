import browser from "webextension-polyfill";
import { showHiddenMediaBtns } from "./helpers/content_script";
import { MessageBrowserActions } from "./helpers/content_script/types";
import { CrawledImageDom } from "./typesContentScript";

// TODO: Instead of sending the content, render a button to download from the DOM
// // Create a new instance of MutationObserver
// const observer = new MutationObserver(async (mutationsList) => {
//   for (const mutation of mutationsList) {
//     if (mutation.type === "attributes") {
//       const targetElement = mutation.target as HTMLImageElement;
//       if (
//         targetElement.tagName === "IMG" &&
//         targetElement.classList.contains("media-photo") &&
//         !hasSiblingButtons(targetElement)
//       ) {
//         const base64Image = await downloadImageAsBase64(targetElement.src);

//         const information: MessageBrowserActions<"crawledContent"> = {
//           action: "crawledContent",
//           message: [{
//             blob: base64Image,
//             height: targetElement.naturalWidth,
//             width: targetElement.naturalHeight,

//           }],
//         };

//         sendImages(information);
//       }
//     }
//   }
// });

// // Configure the MutationObserver to observe changes to attributes of elements with class "media-photo"
// const config = { attributes: true, attributeFilter: ["class"], subtree: true };

// // Start observing mutations
// observer.observe(document.body, config);

showHiddenMediaBtns();
listenAddOn();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  console.log(information);

  browser.runtime.sendMessage(JSON.stringify(information));
}

async function downloadImageAsBase64(url: string | null): Promise<string> {
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

      const base64Image = await downloadImageAsBase64(item.getAttribute("src"));

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
