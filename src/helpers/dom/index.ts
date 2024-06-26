import { GlobalStateI } from "../../customHooks/useGlobal/types";

export function getVideoSibling(
  targetElement: HTMLElement
): HTMLVideoElement | null {
  // Get the parent node of the target element
  const parent = targetElement.parentNode;

  if (!parent) {
    // If the target element doesn't have a parent, return null
    return null;
  }

  // Get all children of the parent node
  const children = parent.children;

  // Convert the children NodeList to an array for easier manipulation
  const childrenArray = Array.from(children);

  // Find the index of the target element in the array
  const targetIndex = childrenArray.indexOf(targetElement);

  // Iterate over siblings to find the <video> element

  let videoTag: HTMLVideoElement | null = null;

  for (let i = 0; i < childrenArray.length; i++) {
    // Skip the target element itself
    if (i === targetIndex) {
      continue;
    }

    const sibling = childrenArray[i];
    // Check if the sibling is a <video> element
    if (sibling instanceof HTMLVideoElement) {
      videoTag = sibling;
    }
  }

  // If no <video> sibling is found, return null
  return videoTag;
}

export function retrieveAddOnConfiguration(): GlobalStateI {
  const data = window.localStorage.getItem("configuration");

  const parsedData: GlobalStateI =
    data === null
      ? {
          showThumbnails: false,
          zipBulkDownloads: false,
          displayDownloadOnChat: true,
          initialLoad: true,
          downloadPath: "/",
          typePath: "root",
        }
      : JSON.parse(data);

  window.localStorage.setItem("configuration", JSON.stringify(parsedData));

  return parsedData;
}

export function checkIsVideDomTag(node: HTMLElement): boolean {
  let sibling = node.previousElementSibling;
  while (sibling) {
    if (sibling.classList.contains('video-time')) {
      return true
    }
    sibling = sibling.previousElementSibling;
  }
  return false;
}
